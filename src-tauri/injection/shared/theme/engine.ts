import type { ResolvedMode, ThemeBundle } from "./types";
import { buildTokenLayer } from "./tokens";
import { getYapmod } from "../scope";
import { invokeCommand } from "../tauri";

const THEME_STYLE_ID = "yapmod-theme-styles";

/**
 * The keys the wrapped app keeps its own theme in.
 *
 * The app reads them while the page is still loading, so mirroring the
 * choice is what keeps the theme from flashing on the first frame.
 */
const HOST_THEME_KEY = "yapper-theme";
const HOST_NEW_LOOK_KEY = "yapper:newLook";
const HOST_NEW_LOOK_CLASS = "new-look";

export type ThemeListener = (theme: ThemeBundle | null) => void;

export type YapmodThemeApi = {
  /** The theme that is applied. */
  readonly active: ThemeBundle | null;
  apply(theme: ThemeBundle | null): void;
  list(): Promise<ThemeBundle[]>;
  pickFolder(): Promise<string | null>;
  install(source: string): Promise<ThemeBundle>;
  remove(id: string): Promise<void>;
  folder(): Promise<string>;
  openFolder(): Promise<void>;
  onChange(listener: ThemeListener): () => void;
};

let activeTheme: ThemeBundle | null = null;
const listeners = new Set<ThemeListener>();

let savedHostTheme: string | null = null;
let savedHostNewLook: string | null = null;
let hostStateSaved = false;

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable, the theme still applies for this session.
  }
}

function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing to do.
  }
}

/**
 * The mode the system asks for.
 */
function systemMode(): ResolvedMode {
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}

/**
 * The mode a theme ends up in.
 *
 * A theme that only supports one mode has the last word. A theme that
 * supports both follows the setting, which can follow the system.
 */
export function resolveMode(theme: ThemeBundle): ResolvedMode {
  if (theme.mode === "light") {
    return "light";
  }

  if (theme.mode === "dark") {
    return "dark";
  }

  const setting = getYapmod().store?.get<string>("theme_mode", "system");

  if (setting === "dark" || setting === "light") {
    return setting;
  }

  return systemMode();
}

/**
 * Remembers what the wrapped app had, so it can be put back.
 */
function saveHostState(): void {
  if (hostStateSaved) {
    return;
  }

  hostStateSaved = true;
  savedHostTheme = readStorage(HOST_THEME_KEY);
  savedHostNewLook = readStorage(HOST_NEW_LOOK_KEY);
}

/**
 * Puts the wrapped app's own theme back.
 */
function restoreHostState(): void {
  if (!hostStateSaved) {
    return;
  }

  hostStateSaved = false;

  if (savedHostTheme === null) {
    removeStorage(HOST_THEME_KEY);
  } else {
    writeStorage(HOST_THEME_KEY, savedHostTheme);
  }

  if (savedHostNewLook === null) {
    removeStorage(HOST_NEW_LOOK_KEY);
  } else {
    writeStorage(HOST_NEW_LOOK_KEY, savedHostNewLook);
  }

  const root = document.documentElement;

  if (savedHostNewLook === "off") {
    root.classList.remove(HOST_NEW_LOOK_CLASS);
  } else {
    root.classList.add(HOST_NEW_LOOK_CLASS);
  }
}

/**
 * Tells the wrapped app about the theme.
 *
 * The mode is mirrored into the app's own storage, because the app applies
 * it while it loads. The new look is switched off: it brings its own
 * palette, and a theme and the new look do not mix.
 */
function applyToHost(mode: ResolvedMode): void {
  const root = document.documentElement;

  root.dataset.theme = mode;
  writeStorage(HOST_THEME_KEY, mode);

  saveHostState();
  writeStorage(HOST_NEW_LOOK_KEY, "off");
  root.classList.remove(HOST_NEW_LOOK_CLASS);
}

/**
 * Puts the stylesheet of a theme on the page.
 *
 * The stylesheet is always the last one in the head, so a theme can style
 * the app it is applied to with plain CSS.
 */
function mount(css: string): void {
  document.getElementById(THEME_STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = THEME_STYLE_ID;
  style.textContent = css;

  const parent = document.head ?? document.documentElement;

  parent?.appendChild(style);
}

/**
 * Puts a theme on the page.
 */
function render(theme: ThemeBundle | null): void {
  const root = document.documentElement;

  if (!theme) {
    delete root.dataset.yapmodTheme;
    delete root.dataset.yapmodMode;
    mount("");
    restoreHostState();
    return;
  }

  const mode = resolveMode(theme);

  root.dataset.yapmodTheme = theme.id;
  root.dataset.yapmodMode = mode;

  mount(`${buildTokenLayer(theme.id, theme.css)}\n${theme.css}`);

  applyToHost(mode);
}

/**
 * Moves the stylesheet of the theme behind the stylesheets of the app.
 *
 * The theme is applied before the page loads, so the app never shows the
 * wrong colours. When the page is done loading, the stylesheet is put at
 * the end of the head, where it can also override plain CSS.
 */
export function remountThemeStyles(): void {
  const style = document.getElementById(THEME_STYLE_ID);

  if (!style) {
    return;
  }

  mount(style.textContent ?? "");
}

function notify(): void {
  for (const listener of [...listeners]) {
    try {
      listener(activeTheme);
    } catch (error) {
      console.error("[yapmod] theme listener failed", error);
    }
  }
}

/**
 * Watches the system, so a theme that follows it stays in step.
 */
function watchSystem(): void {
  try {
    const query = window.matchMedia("(prefers-color-scheme: light)");

    query.addEventListener("change", () => {
      const theme = activeTheme;

      if (theme) {
        render(theme);
      }
    });
  } catch {
    // The system mode stays as it is.
  }
}

/**
 * Keeps the app from taking the theme back.
 *
 * The app applies its own theme while it runs, so the mode is put back
 * whenever it changes, and the new look is removed again.
 */
function watchHost(): void {
  const observer = new MutationObserver(() => {
    const theme = activeTheme;

    if (!theme) {
      return;
    }

    const mode = resolveMode(theme);
    const root = document.documentElement;

    if (root.dataset.theme !== mode) {
      root.dataset.theme = mode;
    }

    if (root.classList.contains(HOST_NEW_LOOK_CLASS)) {
      root.classList.remove(HOST_NEW_LOOK_CLASS);
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "class"],
  });
}

export function installThemeEngine(theme: ThemeBundle | null): void {
  activeTheme = theme;

  const api: YapmodThemeApi = {
    get active(): ThemeBundle | null {
      return activeTheme;
    },

    apply(theme: ThemeBundle | null): void {
      activeTheme = theme;
      render(theme);
      notify();
    },

    list(): Promise<ThemeBundle[]> {
      return invokeCommand<ThemeBundle[]>("list_themes");
    },

    pickFolder(): Promise<string | null> {
      return invokeCommand<string | null>("pick_theme_folder");
    },

    install(source: string): Promise<ThemeBundle> {
      return invokeCommand<ThemeBundle>("install_theme", { source });
    },

    remove(id: string): Promise<void> {
      return invokeCommand<void>("remove_theme", { id });
    },

    folder(): Promise<string> {
      return invokeCommand<string>("themes_folder");
    },

    openFolder(): Promise<void> {
      return invokeCommand<void>("open_themes_folder");
    },

    onChange(listener: ThemeListener): () => void {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };

  getYapmod().theme = api;

  if (theme) {
    render(theme);
  }

  watchSystem();
  watchHost();
}
