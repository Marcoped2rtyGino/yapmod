import logoSvg from "./assets/icon.svg";
import type { ReleaseInfo, YapmodModal } from "./shared/types";
import { createReleaseBody, createReleaseHeader } from "./shared/release";
import {
  checkForUpdate,
  prepareClientUpdate,
  showClientUpdateOutcomeModal,
  showClientUpdateReadyModal,
  showUpdateAvailableModal,
} from "./shared/update";
import { upsertStyle, createElement } from "./shared/ui";
import { remountThemeStyles } from "./shared/theme/engine";
import { getYapmod } from "./shared/scope";
import { invokeCommand } from "./shared/tauri";
import type {
  ClientUpdateInfo,
  ClientUpdateLaunchStatus,
  UpdateInfo,
} from "./shared/types";

const STYLE_ELEMENT_ID = "yapmod-injected-styles";
const TOPBAR_SELECTOR = ".topbar";
const WINDOW_CONTROLS_ATTRIBUTE = "data-yapmod-window-controls";
const RELEASE_SEEN_KEY = "yapmod-release-seen";
const RELEASE_LOGO = logoSvg.replace(/fill="#F67567"/g, 'fill="currentColor"');

function applyCss(css: string): void {
  upsertStyle(STYLE_ELEMENT_ID, css);

  // The stylesheet of the theme stays behind the styles of the client, so
  // a theme can style every part of the app.
  remountThemeStyles();
}

/**
 * Mirrors the operating system on the root element, so the stylesheet can
 * tell macOS apart from the other platforms.
 */
function applyOsAttribute(): void {
  const os = getYapmod().os;

  if (os) {
    document.documentElement.dataset.yapmodOs = os;
  }
}

function markTopbarDraggable(topbar: HTMLElement): void {
  // `deep` makes the whole topbar draggable while its buttons and links still
  // receive their clicks.
  if (topbar.getAttribute("data-tauri-drag-region") !== "deep") {
    topbar.setAttribute("data-tauri-drag-region", "deep");
  }
}

type WindowAction = "minimize" | "maximize" | "close";

const WINDOW_ACTIONS: Array<{
  action: WindowAction;
  label: string;
  command: string;
  icon: string;
}> = [
  {
    action: "minimize",
    label: "Minimize window",
    command: "minimize_main_window",
    icon: '<path d="M5 12h14" />',
  },
  {
    action: "maximize",
    label: "Maximize or restore window",
    command: "toggle_main_window_maximize",
    icon: '<rect x="6.5" y="6.5" width="11" height="11" />',
  },
  {
    action: "close",
    label: "Close window",
    command: "close_main_window",
    icon: '<path d="m7 7 10 10M17 7 7 17" />',
  },
];

function createWindowControls(): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "yapmod-window-controls";
  controls.setAttribute(WINDOW_CONTROLS_ATTRIBUTE, "");
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "Window controls");

  for (const { action, label, command, icon } of WINDOW_ACTIONS) {
    const button = document.createElement("button");
    button.className = `yapmod-window-control yapmod-window-control-${action}`;
    button.type = "button";
    button.title = label;
    button.setAttribute("aria-label", label);
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icon}</svg>`;
    button.addEventListener("pointerdown", (event) => event.stopPropagation());
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      void invokeCommand<void>(command).catch((error: unknown) => {
        console.error(`[yapmod] could not ${action} the window`, error);
      });
    });
    controls.append(button);
  }

  return controls;
}

function addWindowControls(topbar: HTMLElement): void {
  if (topbar.querySelector(`[${WINDOW_CONTROLS_ATTRIBUTE}]`)) {
    return;
  }

  const controls = createWindowControls();
  if (window.getComputedStyle(topbar).position === "static") {
    topbar.style.position = "relative";
  }
  controls.classList.add("yapmod-window-controls-overlay");

  topbar.append(controls);
}

/**
 * Yapper's topbar is a drag region on macOS and hosts custom window controls
 * on Windows. It is painted after the app boots, hence the observer.
 */
function installTopbarWindowControls(): void {
  const os = getYapmod().os;
  if (os !== "macos" && os !== "windows") {
    return;
  }

  const integrateTopbars = (): void => {
    document
      .querySelectorAll<HTMLElement>(TOPBAR_SELECTOR)
      .forEach((topbar) => {
        markTopbarDraggable(topbar);
        if (os === "windows") {
          addWindowControls(topbar);
        }
      });
  };

  integrateTopbars();

  new MutationObserver(integrateTopbars).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

function createReleaseHero(release: ReleaseInfo): HTMLElement {
  return createElement("div", {
    className: "yapmod-release-hero",
    attrs: { "aria-hidden": "true" },
    children: [
      createElement("div", {
        className: "yapmod-release-logo",
        html: RELEASE_LOGO,
      }),
      createReleaseHeader(release, {
        className: "yapmod-release-hero-text",
        versionClassName: "yapmod-release-version",
        dateClassName: "yapmod-release-date",
        eyebrow: release.firstRun ? "Welcome" : "What's new",
        eyebrowClassName: "yapmod-release-eyebrow",
      }),
    ],
  });
}

function createReleaseContent(release: ReleaseInfo): HTMLElement {
  const fallback = release.firstRun
    ? "Thanks for giving yapmod a try. It's still early in development, so expect a few rough edges while it grows."
    : `yapmod has been updated to v${release.version}.`;

  return createReleaseBody(release.notes, fallback);
}

function releaseDescription(release: ReleaseInfo): string {
  if (release.firstRun) {
    return "A quick look at what's included in this release.";
  }

  if (release.previousVersion) {
    return `Updated from v${release.previousVersion} to v${release.version}.`;
  }

  return `You're now running v${release.version}.`;
}

function shouldShowRelease(release: ReleaseInfo): boolean {
  if (!release.version) {
    return false;
  }

  if (!release.firstRun && release.previousVersion === release.version) {
    return false;
  }

  try {
    if (
      sessionStorage.getItem(`${RELEASE_SEEN_KEY}:${release.version}`) === "1"
    ) {
      return false;
    }
  } catch {}

  return true;
}

function showReleaseModal(release: ReleaseInfo): YapmodModal | null {
  const modalApi = getYapmod().modal;

  if (!shouldShowRelease(release) || !modalApi) {
    return null;
  }

  const modal = modalApi.show({
    id: "yapmod-release-notes",
    title: release.firstRun ? "Welcome to yapmod" : "What's new",
    description: releaseDescription(release),
    content: createReleaseContent(release),
    size: "md",
    className: "yapmod-release-modal",
    buttons: [
      {
        label: release.firstRun ? "Let's go" : "Got it",
        variant: "secondary",
        className: "small",
        autofocus: true,
      },
    ],
  });

  modal.dialog.insertBefore(createReleaseHero(release), modal.dialog.firstChild);

  try {
    sessionStorage.setItem(`${RELEASE_SEEN_KEY}:${release.version}`, "1");
  } catch {}

  return modal;
}

function scheduleReleaseModal(): Promise<void> {
  const yapmod = getYapmod();
  const release = yapmod.release;

  if (!release || !yapmod.modal || !shouldShowRelease(release)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const show = (): void => {
      let modal: YapmodModal | null = null;

      try {
        modal = showReleaseModal(release);
      } catch (error) {
        console.error("[yapmod] failed to show the release notes modal", error);
      }

      if (!modal) {
        resolve();
        return;
      }

      void modal.closed.then(
        () => resolve(),
        () => resolve(),
      );
    };

    const appMounted = (): boolean =>
      document.querySelector(".app, .auth-wrap, main") !== null;

    if (appMounted()) {
      window.setTimeout(show, 200);
      return;
    }

    const observer = new MutationObserver(() => {
      if (!appMounted()) {
        return;
      }

      observer.disconnect();
      window.setTimeout(show, 200);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    window.setTimeout(() => {
      observer.disconnect();
      show();
    }, 8000);
  });
}

/**
 * Checks both update channels while the app is open. Client updates are staged
 * in the background and can be applied with one real process restart. Prompts
 * wait for release notes and for each other so they never stack.
 */
async function scheduleUpdatePrompts(releaseDone: Promise<void>): Promise<void> {
  const yapmod = getYapmod();
  let launchStatus: ClientUpdateLaunchStatus | null = null;
  let clientOutcome: { version: string; rolledBack: boolean } | null = null;

  try {
    launchStatus = await invokeCommand<ClientUpdateLaunchStatus>(
      "get_client_update_launch_status",
    );
  } catch (error) {
    console.error("[yapmod] could not read the client update launch status", error);
  }

  if (launchStatus?.trial) {
    try {
      await invokeCommand<void>("confirm_client_update");
      clientOutcome = {
        version: yapmod.clientVersion ?? "unknown",
        rolledBack: false,
      };
    } catch (error) {
      console.error("[yapmod] client update confirmation failed", error);
    }
  } else if (launchStatus?.rolledBack) {
    clientOutcome = {
      version: yapmod.clientVersion ?? "unknown",
      rolledBack: true,
    };
  }

  const autoUpdate = yapmod.store?.get<boolean>("auto_update", true) !== false;
  let desktopUpdate: UpdateInfo | null = null;
  let clientUpdate: ClientUpdateInfo | null = null;

  if (autoUpdate) {
    const desktopCheck = checkForUpdate();
    const clientCheck =
      launchStatus && !launchStatus.trial && !launchStatus.rolledBack
        ? prepareClientUpdate(yapmod.clientVersion ?? "unknown")
        : Promise.resolve(null);
    const [desktopResult, clientResult] = await Promise.all([
      desktopCheck,
      clientCheck,
    ]);
    desktopUpdate = desktopResult;
    clientUpdate = clientResult;
  }

  await releaseDone;

  if (!yapmod.modal) {
    return;
  }

  if (clientOutcome) {
    const key = `yapmod-client-update-outcome:${clientOutcome.rolledBack ? "rollback" : "applied"}:${clientOutcome.version}`;
    let seen = false;
    try {
      seen = sessionStorage.getItem(key) === "1";
      sessionStorage.setItem(key, "1");
    } catch {}

    if (!seen) {
      const modal = showClientUpdateOutcomeModal(
        clientOutcome.version,
        clientOutcome.rolledBack,
      );
      if (modal) await modal.closed;
    }
  }

  if (clientUpdate) {
    try {
      const modal = showClientUpdateReadyModal(clientUpdate);
      if (modal) await modal.closed;
    } catch (error) {
      console.error("[yapmod] failed to show the client update prompt", error);
    }
  }

  if (!desktopUpdate?.available) {
    return;
  }

  try {
    const modal = showUpdateAvailableModal(desktopUpdate);
    if (modal) await modal.closed;
  } catch (error) {
    console.error("[yapmod] failed to show the update modal", error);
  }
}

try {
  applyOsAttribute();
} catch (error) {
  console.error("[yapmod] failed to apply OS attribute", error);
}

try {
  installTopbarWindowControls();
} catch (error) {
  console.error("[yapmod] failed to install titlebar controls", error);
}

// The stylesheet of the theme is moved behind the stylesheets of the app,
// so a theme can style the app with plain CSS.
try {
  remountThemeStyles();
} catch (error) {
  console.error("[yapmod] failed to remount theme styles", error);
}

getYapmod().applyCss = applyCss;

void scheduleUpdatePrompts(scheduleReleaseModal());
