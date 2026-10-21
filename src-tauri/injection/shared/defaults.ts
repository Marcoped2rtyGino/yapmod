import type {
  SettingsItem,
  SettingsSection,
} from "./types";
import {
  createReleaseBody,
  createReleaseHeader,
  sortReleases,
} from "./release";
import { createElement } from "./ui";
import { getYapmod } from "./scope";

const SECTION_ID = "yapmod";
const CHANGELOG_SECTION_ID = "yapmod-changelog";
const GROUP_LABEL = "Yapmod";

type ToggleItem = Extract<SettingsItem, { type: "toggle" }>;

/**
 * Builds a toggle that keeps itself in sync with the store, so a re-render
 * still shows what is actually stored.
 */
function createToggle(
  options: {
    id: string;
    label: string;
    description: string;
    fallback: boolean;
  },
): ToggleItem {
  const store = getYapmod().store;

  const item: ToggleItem = {
    type: "toggle",
    id: options.id,
    label: options.label,
    description: options.description,
    value: store?.get(options.id, options.fallback) ?? options.fallback,
    onChange: (value) => {
      item.value = value;
      store?.set(options.id, value);
    },
  };

  store?.onChange(options.id, (value) => {
    if (typeof value === "boolean") {
      item.value = value;
    }
  });

  return item;
}

/**
 * Builds the section that shows the full changelog, one entry per release.
 */
function createChangelogSection(): SettingsSection {
  const yapmod = getYapmod();
  const releases = sortReleases(yapmod.changelog ?? {});
  const installedVersion = yapmod.release?.version;

  return {
    id: CHANGELOG_SECTION_ID,
    label: "Changelog",
    group: GROUP_LABEL,
    order: 1,
    description: "Every yapmod release, newest first.",
    render: (host) => {
      if (releases.length === 0) {
        host.appendChild(
          createElement("p", {
            className: "yapmod-changelog-empty",
            text: "No releases yet.",
          }),
        );
        return;
      }

      for (const release of releases) {
        const entryChildren: Node[] = [
          createReleaseHeader(release, {
            tag: "header",
            className: "yapmod-changelog-header",
            versionClassName: "yapmod-changelog-version",
            dateClassName: "yapmod-changelog-date",
            current: release.version === installedVersion,
            currentClassName: "yapmod-changelog-current",
          }),
        ];

        const title = release.notes?.title;

        if (title) {
          entryChildren.push(
            createElement("h3", {
              className: "yapmod-changelog-title",
              text: title,
            }),
          );
        }

        entryChildren.push(createReleaseBody(release.notes));

        host.appendChild(
          createElement("article", {
            className: "yapmod-changelog-release",
            children: entryChildren,
          }),
        );
      }
    },
  };
}

/**
 * Registers the section that holds yapmod's own settings, so the desktop
 * client is configurable from inside Yapper's settings modal.
 */
export function installDefaultSettings(): void {
  const yapmod = getYapmod();

  if (!yapmod.settings || !yapmod.store) {
    return;
  }

  const items: SettingsItem[] = [];

  if (yapmod.os === "macos") {
    items.push(
      createToggle({
        id: "use_native_titlebar",
        label: "Use native titlebar",
        description:
          "Show the standard macOS titlebar instead of the overlay. Takes effect after a restart.",
        fallback: false,
      }),
    );
  }

  items.push(
    createToggle({
      id: "start_maximized",
      label: "Start maximized",
      description: "Open yapmod maximized. Takes effect after a restart.",
      fallback: false,
    }),
    createToggle({
      id: "auto_update",
      label: "Check for updates automatically",
      description:
        "Look for new yapmod versions when the app starts and show the update window.",
      fallback: true,
    }),
  );

  const section: SettingsSection = {
    id: SECTION_ID,
    label: GROUP_LABEL,
    group: GROUP_LABEL,
    description: "Options for the yapmod desktop client.",
    items,
  };

  yapmod.settings.register(section);
  yapmod.settings.register(createChangelogSection());
}
