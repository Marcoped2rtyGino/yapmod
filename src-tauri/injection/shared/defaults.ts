import type {
  SettingsItem,
  SettingsSection,
  YapmodGlobal,
} from "./types";

const SECTION_ID = "yapmod";
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
}
