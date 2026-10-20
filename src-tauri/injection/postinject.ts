import logoSvg from "../../assets/icon.svg";
import type { YapmodScope } from "./shared/types";
import { upsertStyle } from "./shared/ui";

const STYLE_ELEMENT_ID = "yapmod-injected-styles";
const DRAG_REGION_ID = "yapmod-drag-region";
const WELCOME_SEEN_KEY = "yapmod-welcome-shown";
const WELCOME_LOGO = logoSvg.replace(/fill="#F67567"/g, 'fill="currentColor"');

const globalScope = globalThis as YapmodScope;

function applyCss(css: string): void {
  upsertStyle(STYLE_ELEMENT_ID, css);
}

function ensureDragRegion(): void {
  if (
    document.documentElement.dataset.yapmodOs !== "macos" ||
    document.getElementById(DRAG_REGION_ID)
  ) {
    return;
  }

  const region = document.createElement("div");
  region.id = DRAG_REGION_ID;
  region.setAttribute("data-tauri-drag-region", "");
  document.body.appendChild(region);
}

function createWelcomeHero(): HTMLElement {
  const hero = document.createElement("div");
  hero.className = "yapmod-welcome-hero";
  hero.setAttribute("aria-hidden", "true");

  const logo = document.createElement("div");
  logo.className = "yapmod-welcome-logo";
  logo.innerHTML = WELCOME_LOGO;
  hero.appendChild(logo);

  return hero;
}

function createWelcomeContent(): HTMLElement {
  const content = document.createElement("div");
  content.className = "yapmod-welcome-body";
  content.innerHTML = `
    <p class="yapmod-welcome-lead">
      Thanks for giving <strong>yapmod</strong> a try. It's still early in
      development, so expect a few rough edges while it grows.
    </p>
  `;

  return content;
}

function showWelcomeModal(): void {
  const yapmod = globalScope.__yapmod;

  if (!yapmod?.firstRun || !yapmod.showModal) {
    return;
  }

  if (sessionStorage.getItem(WELCOME_SEEN_KEY) === "1") {
    return;
  }

  const modal = yapmod.showModal({
    id: "yapmod-welcome",
    title: "Welcome to yapmod",
    content: createWelcomeContent(),
    size: "md",
    className: "yapmod-welcome-modal",
    buttons: [
      {
        label: "Got it",
        variant: "secondary",
        className: "small",
        autofocus: true,
      },
    ],
  });

  modal.dialog.insertBefore(createWelcomeHero(), modal.dialog.firstChild);

  try {
    sessionStorage.setItem(WELCOME_SEEN_KEY, "1");
  } catch {}
}

function scheduleWelcomeModal(): void {
  const yapmod = globalScope.__yapmod;

  if (!yapmod?.firstRun || !yapmod.showModal) {
    return;
  }

  try {
    if (sessionStorage.getItem(WELCOME_SEEN_KEY) === "1") {
      return;
    }
  } catch {}

  const appMounted = (): boolean =>
    document.querySelector(".app, .auth-wrap, main") !== null;

  const show = (): void => {
    try {
      showWelcomeModal();
    } catch (error) {
      console.error("[yapmod] failed to show the welcome modal", error);
    }
  };

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
}

ensureDragRegion();

globalScope.__yapmod ??= {};
globalScope.__yapmod.applyCss = applyCss;
scheduleWelcomeModal();
