import logoSvg from "../../assets/icon.svg";
import type {
  ReleaseInfo,
  ReleaseNotes,
  ReleaseNotesSection,
  YapmodScope,
} from "./shared/types";
import { upsertStyle } from "./shared/ui";

const STYLE_ELEMENT_ID = "yapmod-injected-styles";
const DRAG_REGION_ID = "yapmod-drag-region";
const RELEASE_SEEN_KEY = "yapmod-release-seen";
const RELEASE_LOGO = logoSvg.replace(/fill="#F67567"/g, 'fill="currentColor"');

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

function formatReleaseDate(date: string | undefined): string | null {
  if (!date) {
    return null;
  }

  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function createReleaseHero(release: ReleaseInfo): HTMLElement {
  const hero = document.createElement("div");
  hero.className = "yapmod-release-hero";
  hero.setAttribute("aria-hidden", "true");

  const logo = document.createElement("div");
  logo.className = "yapmod-release-logo";
  logo.innerHTML = RELEASE_LOGO;

  const text = document.createElement("div");
  text.className = "yapmod-release-hero-text";

  const eyebrow = document.createElement("span");
  eyebrow.className = "yapmod-release-eyebrow";
  eyebrow.textContent = release.firstRun ? "Welcome" : "What's new";

  const version = document.createElement("span");
  version.className = "yapmod-release-version";
  version.textContent = `v${release.version}`;

  text.append(eyebrow, version);

  const date = formatReleaseDate(release.notes?.date);
  if (date) {
    const dateElement = document.createElement("span");
    dateElement.className = "yapmod-release-date";
    dateElement.textContent = date;
    text.appendChild(dateElement);
  }

  hero.append(logo, text);

  return hero;
}

function createReleaseSection(section: ReleaseNotesSection): HTMLElement {
  const container = document.createElement("section");
  container.className = "yapmod-release-section";

  if (section.heading) {
    const heading = document.createElement("h3");
    heading.textContent = section.heading;
    container.appendChild(heading);
  }

  const list = document.createElement("ul");
  list.className = "yapmod-release-list";

  for (const item of section.items ?? []) {
    const entry = document.createElement("li");
    entry.textContent = item;
    list.appendChild(entry);
  }

  container.appendChild(list);

  return container;
}

function createReleaseContent(release: ReleaseInfo): HTMLElement {
  const content = document.createElement("div");
  content.className = "yapmod-release-body";

  const notes: ReleaseNotes = release.notes ?? {};
  const summary =
    notes.summary ??
    (release.firstRun
      ? "Thanks for giving yapmod a try. It's still early in development, so expect a few rough edges while it grows."
      : `yapmod has been updated to v${release.version}.`);

  const summaryElement = document.createElement("p");
  summaryElement.className = "yapmod-release-summary";
  summaryElement.textContent = summary;
  content.appendChild(summaryElement);

  for (const section of notes.sections ?? []) {
    content.appendChild(createReleaseSection(section));
  }

  return content;
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

function showReleaseModal(release: ReleaseInfo): void {
  const yapmod = globalScope.__yapmod;

  if (!shouldShowRelease(release) || !yapmod?.showModal) {
    return;
  }

  const modal = yapmod.showModal({
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
}

function scheduleReleaseModal(): void {
  const release = globalScope.__yapmod?.release;

  if (!release || !globalScope.__yapmod?.showModal || !shouldShowRelease(release)) {
    return;
  }

  const appMounted = (): boolean =>
    document.querySelector(".app, .auth-wrap, main") !== null;

  const show = (): void => {
    try {
      showReleaseModal(release);
    } catch (error) {
      console.error("[yapmod] failed to show the release notes modal", error);
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
scheduleReleaseModal();
