import logoSvg from "../../assets/icon.svg";
import type { ReleaseInfo, YapmodModal, YapmodScope } from "./shared/types";
import { createReleaseSection, formatReleaseDate } from "./shared/release";
import { checkForUpdate, showUpdateAvailableModal } from "./shared/update";
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

function createReleaseContent(release: ReleaseInfo): HTMLElement {
  const content = document.createElement("div");
  content.className = "yapmod-release-body";

  const notes = release.notes ?? {};
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

function showReleaseModal(release: ReleaseInfo): YapmodModal | null {
  const yapmod = globalScope.__yapmod;

  if (!shouldShowRelease(release) || !yapmod?.showModal) {
    return null;
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

  return modal;
}

function scheduleReleaseModal(): Promise<void> {
  const release = globalScope.__yapmod?.release;

  if (!release || !globalScope.__yapmod?.showModal || !shouldShowRelease(release)) {
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
 * Looks for a newer yapmod version and shows the update modal when there is
 * one.
 *
 * yapmod never updates itself, so the modal only points the user to the
 * website. The check runs right away, but the modal waits for the release
 * notes, so the two never stack up.
 */
async function scheduleUpdateModal(releaseDone: Promise<void>): Promise<void> {
  const yapmod = globalScope.__yapmod;

  if (!yapmod?.showModal) {
    return;
  }

  if (yapmod.store?.get<boolean>("auto_update", true) === false) {
    return;
  }

  const info = await checkForUpdate();

  if (!info?.available) {
    return;
  }

  await releaseDone;

  try {
    showUpdateAvailableModal(yapmod, info);
  } catch (error) {
    console.error("[yapmod] failed to show the update modal", error);
  }
}

ensureDragRegion();

globalScope.__yapmod ??= {};
globalScope.__yapmod.applyCss = applyCss;

void scheduleUpdateModal(scheduleReleaseModal());
