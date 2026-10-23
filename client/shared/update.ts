import type {
  ClientUpdateInfo,
  UpdateInfo,
  YapmodModal,
} from "./types";
import { invokeCommand } from "./tauri";
import { openExternally } from "./links";
import { createElement } from "./ui";
import { getYapmod } from "./scope";

const WEBSITE_URL = "https://ilyeshdz.github.io/yapmod";
const UPDATE_MODAL_ID = "yapmod-update-available";
const UPDATE_MODAL_TITLE = "Update available";
const CLIENT_UPDATE_MODAL_ID = "yapmod-client-update-ready";
const CLIENT_UPDATE_REMINDER_ID = "yapmod-client-update-reminder";

export async function prepareClientUpdate(
  currentClientVersion: string,
): Promise<ClientUpdateInfo | null> {
  try {
    return await invokeCommand<ClientUpdateInfo | null>("prepare_client_update", {
      currentClientVersion,
    });
  } catch (error) {
    console.error("[yapmod] the client update check failed", error);
    return null;
  }
}

/**
 * Asks the backend for the newest published release.
 *
 * The check never fails loudly: a network problem simply means there is no
 * update to show.
 */
export async function checkForUpdate(): Promise<UpdateInfo | null> {
  try {
    return await invokeCommand<UpdateInfo>("check_for_update");
  } catch (error) {
    console.error("[yapmod] the update check failed", error);
    return null;
  }
}

function createVersionRow(
  label: string,
  version: string,
  className: string,
): HTMLElement {
  return createElement("div", {
    className: `yapmod-update-version ${className}`,
    children: [
      createElement("span", {
        className: "yapmod-update-version-label",
        text: label,
      }),
      createElement("span", {
        className: "yapmod-update-version-number",
        text: version ? `v${version}` : "unknown",
      }),
    ],
  });
}

/**
 * Builds the body of the update modal: just the two versions.
 */
export function createUpdateContent(info: UpdateInfo): HTMLElement {
  return createElement("div", {
    className: "yapmod-update-content",
    children: [
      createVersionRow(
        "Installed",
        info.current_version,
        "yapmod-update-version-installed",
      ),
      createVersionRow(
        "Latest",
        info.latest_version,
        "yapmod-update-version-latest",
      ),
    ],
  });
}

/**
 * Shows the "update available" modal.
 *
 * yapmod cannot update itself, so the modal only points the user to the
 * website, where the new version can be downloaded.
 */
export function showUpdateAvailableModal(info: UpdateInfo): YapmodModal | null {
  const modal = getYapmod().modal;

  if (!modal) {
    return null;
  }

  return modal.show({
    id: UPDATE_MODAL_ID,
    title: UPDATE_MODAL_TITLE,
    description: `yapmod v${info.latest_version} is out. Download it from the website.`,
    content: createUpdateContent(info),
    size: "sm",
    className: "yapmod-update-modal",
    buttons: [
      {
        label: "Go to website",
        variant: "native",
        className: "small",
        onClick: () => {
          openExternally(WEBSITE_URL);
        },
      },
      {
        label: "Later",
        variant: "native",
        className: "small ghost",
      },
    ],
  });
}

/** Shows the restart prompt once the signed client bundle is fully staged. */
export function showClientUpdateReadyModal(
  info: ClientUpdateInfo,
): YapmodModal | null {
  const modal = getYapmod().modal;
  if (!modal) return null;

  return modal.show({
    id: CLIENT_UPDATE_MODAL_ID,
    title: "YAPmod update ready",
    description: `Client v${info.latestVersion} is ready. Restart YAPmod to apply it; any active call will disconnect.`,
    content: createUpdateContent({
      current_version: info.currentVersion,
      latest_version: info.latestVersion,
      available: true,
    }),
    size: "sm",
    className: "yapmod-update-modal",
    onClose: () => showClientUpdateReminder(info),
    buttons: [
      {
        label: "Restart now",
        variant: "primary",
        className: "small",
        closeOnClick: false,
        onClick: async (activeModal) => {
          try {
            await invokeCommand<void>("restart_app");
          } catch (error) {
            console.error("[yapmod] could not restart for the client update", error);
            activeModal.setDescription(
              "YAPmod could not restart. Quit it from the menu bar or system tray, then open it again to apply the update.",
            );
            return false;
          }
        },
      },
      {
        label: "Later",
        variant: "native",
        className: "small ghost",
      },
    ],
  });
}

/** Keeps a deferred update visible without blocking the app. */
export function showClientUpdateReminder(info: ClientUpdateInfo): void {
  const existing = document.getElementById(CLIENT_UPDATE_REMINDER_ID);
  if (existing) return;

  const message = createElement("span", {
    text: `YAPmod client v${info.latestVersion} is ready to apply.`,
  });
  const reminder = createElement("aside", {
    className: "yapmod-client-update-reminder",
    attrs: { id: CLIENT_UPDATE_REMINDER_ID, role: "status" },
    children: [
      message,
      createElement("button", {
        className: "yapmod-client-update-restart",
        text: "Restart",
        attrs: { type: "button" },
        on: {
          click: () => {
            void invokeCommand<void>("restart_app").catch((error: unknown) => {
              console.error("[yapmod] could not restart for the client update", error);
              message.textContent =
                "Could not restart YAPmod. Quit it from the menu bar or system tray to apply the update.";
            });
          },
        },
      }),
      createElement("button", {
        className: "yapmod-client-update-dismiss",
        text: "×",
        attrs: { type: "button", "aria-label": "Dismiss update reminder" },
        on: { click: () => reminder.remove() },
      }),
    ],
  });

  document.body.appendChild(reminder);
}

export function showClientUpdateOutcomeModal(
  version: string,
  rolledBack: boolean,
): YapmodModal | null {
  const modal = getYapmod().modal;
  if (!modal) return null;

  return modal.show({
    id: "yapmod-client-update-outcome",
    title: rolledBack ? "Update restored" : "YAPmod updated",
    description: rolledBack
      ? "The new client update did not start correctly, so YAPmod restored the previous version. You can keep using the app."
      : `YAPmod client v${version} is now running.`,
    size: "sm",
    buttons: [
      {
        label: "Done",
        variant: "secondary",
        className: "small",
      },
    ],
  });
}
