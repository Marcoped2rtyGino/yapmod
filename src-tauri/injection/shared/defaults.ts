import type {
  SettingsItem,
  SettingsSection,
  YapmodGlobal,
} from "./types";
import {
  createReleaseBody,
  formatReleaseDate,
  sortReleases,
} from "./release";

const SECTION_ID = "yapmod";
const CHANGELOG_SECTION_ID = "yapmod-changelog";
const GROUP_LABEL = "Yapmod";

type ToggleItem = Extract<SettingsItem, { type: "toggle" }>;

/**
 * Builds a toggle that keeps itself in sync with the store, so a re-render
 * still shows what is actually stored.
 */
function createToggle(
  yapmod: YapmodGlobal,
  options: {
    id: string;
    label: string;
    description: string;
    fallback: boolean;
  },
): ToggleItem {
  const store = yapmod.store;

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
function createChangelogSection(yapmod: YapmodGlobal): SettingsSection {
  const releases = sortReleases(yapmod.changelog ?? {});

  return {
    id: CHANGELOG_SECTION_ID,
    label: "Changelog",
    group: GROUP_LABEL,
    order: 1,
    description: "Every yapmod release, newest first.",
    render: (host) => {
      if (releases.length === 0) {
        const empty = document.createElement("p");
        empty.className = "yapmod-changelog-empty";
        empty.textContent = "No releases yet.";
        host.appendChild(empty);
        return;
      }

      for (const release of releases) {
        const entry = document.createElement("article");
        entry.className = "yapmod-changelog-release";

        const header = document.createElement("header");
        header.className = "yapmod-changelog-header";

        const version = document.createElement("span");
        version.className = "yapmod-changelog-version";
        version.textContent = `v${release.version}`;
        header.appendChild(version);

        const date = formatReleaseDate(release.notes?.date);

        if (date) {
          const dateElement = document.createElement("span");
          dateElement.className = "yapmod-changelog-date";
          dateElement.textContent = date;
          header.appendChild(dateElement);
        }

        if (release.version === yapmod.version) {
          const current = document.createElement("span");
          current.className = "yapmod-changelog-current";
          current.textContent = "Installed";
          header.appendChild(current);
        }

        entry.appendChild(header);

        const title = release.notes?.title;

        if (title) {
          const titleElement = document.createElement("h3");
          titleElement.className = "yapmod-changelog-title";
          titleElement.textContent = title;
          entry.appendChild(titleElement);
        }

        entry.appendChild(createReleaseBody(release.notes));

        host.appendChild(entry);
      }
    },
  };
}

/**
 * Registers the section that holds yapmod's own settings, so the desktop
 * client is configurable from inside Yapper's settings modal.
 */
export function installDefaultSettings(yapmod: YapmodGlobal): void {
  if (!yapmod.settings || !yapmod.store) {
    return;
  }

  const items: SettingsItem[] = [];

  if (yapmod.os === "macos") {
    items.push(
      createToggle(yapmod, {
        id: "use_native_titlebar",
        label: "Use native titlebar",
        description:
          "Show the standard macOS titlebar instead of the overlay. Takes effect after a restart.",
        fallback: false,
      }),
    );
  }

  items.push(
    createToggle(yapmod, {
      id: "start_maximized",
      label: "Start maximized",
      description: "Open yapmod maximized. Takes effect after a restart.",
      fallback: false,
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
  yapmod.settings.register(createChangelogSection(yapmod));
}
