import type { YapmodGlobal, YapmodModal } from "./types";
import { invokeCommand } from "./tauri";
import { openExternally } from "./links";

const WEBSITE_URL = "https://ilyeshdz.github.io/yapmod";
const UPDATE_MODAL_ID = "yapmod-update-available";
const UPDATE_MODAL_TITLE = "Update available";

/**
 * The update information reported by the backend.
 */
export type UpdateInfo = {
  current_version: string;
  latest_version: string;
  available: boolean;
  url: string;
};

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
  const row = document.createElement("div");
  row.className = `yapmod-update-version ${className}`;

  const name = document.createElement("span");
  name.className = "yapmod-update-version-label";
  name.textContent = label;

  const number = document.createElement("span");
  number.className = "yapmod-update-version-number";
  number.textContent = version ? `v${version}` : "unknown";

  row.append(name, number);

  return row;
}

/**
 * Builds the body of the update modal: just the two versions.
 */
export function createUpdateContent(info: UpdateInfo): HTMLElement {
  const content = document.createElement("div");
  content.className = "yapmod-update-content";

  content.append(
    createVersionRow(
      "Installed",
      info.current_version,
      "yapmod-update-version-installed",
    ),
  );

  content.append(
    createVersionRow(
      "Latest",
      info.latest_version,
      "yapmod-update-version-latest",
    ),
  );

  return content;
}

/**
 * Shows the "update available" modal.
 *
 * yapmod cannot update itself, so the modal only points the user to the
 * website, where the new version can be downloaded.
 */
export function showUpdateAvailableModal(
  yapmod: YapmodGlobal,
  info: UpdateInfo,
): YapmodModal | null {
  if (!yapmod.showModal) {
    return null;
  }

  return yapmod.showModal({
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
