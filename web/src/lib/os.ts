export type OsKey = "win" | "mac" | "linux";
export type Arch = "arm" | "x86";

export const osNames: Record<OsKey, string> = {
  win: "Windows",
  mac: "macOS",
  linux: "Linux",
};

/** Filled glyphs, drawn on a 24×24 grid. */
export const osIcons: Record<OsKey, string> = {
  win: `<path d="M3 5.5l7.5-1v7H3zm8.5-1.2L21 3v8.5h-9.5zM3 12.5h7.5v7L3 18.5zm8.5 0H21V21l-9.5-1.3z"></path>`,
  mac: `<path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.8.8 3.1.8c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.5-1-2.7-4.2zM14.1 5.6c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z"></path>`,
  linux: `<path d="M12 2c-2.6 0-3.6 2.2-3.6 4.6 0 1.3-.4 2.2-1.2 3.3C6 11.5 5 13.6 5 16c0 1.2.4 2 1.2 2.6-.5.9-1.7 1.5-2.7 2 .8.8 2.2 1 3.3.9.8-.1 1.5-.5 2-1 1.1.4 2.1.5 3.2.5s2.1-.1 3.2-.5c.5.5 1.2.9 2 1 1.1.1 2.5-.1 3.3-.9-1-.5-2.2-1.1-2.7-2 .8-.6 1.2-1.4 1.2-2.6 0-2.4-1-4.5-2.2-6.1-.8-1.1-1.2-2-1.2-3.3C15.6 4.2 14.6 2 12 2z"></path>`,
};

/** A neutral glyph for visitors we cannot place on a specific platform. */
export const genericIcon = `<path d="M3 5.5A1.5 1.5 0 014.5 4h15A1.5 1.5 0 0121 5.5v9a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 14.5v-9zM2 18h20v1.5A1.5 1.5 0 0120.5 21h-17A1.5 1.5 0 012 19.5V18z"></path>`;

export function detectOs(): OsKey | null {
  const platform = navigator.userAgentData?.platform || navigator.platform || "";
  const agent = navigator.userAgent || "";

  if (/win/i.test(platform)) return "win";
  if (/mac/i.test(platform)) return "mac";
  if (/linux|x11/i.test(platform + agent) && !/android/i.test(agent)) return "linux";
  return null;
}

/**
 * CPU architecture, only needed to pick between the Intel and Apple Silicon
 * macOS builds. Browsers do not always tell us, in which case we let the
 * visitor pick.
 */
export async function detectArch(): Promise<Arch | null> {
  if (!navigator.userAgentData) return null;

  try {
    const values = await navigator.userAgentData.getHighEntropyValues(["architecture"]);
    const architecture = values.architecture;

    if (architecture === "arm" || architecture === "arm64") return "arm";
    if (architecture === "x86" || architecture === "x86_64") return "x86";
  } catch {
    // Not available on this browser, fall through to the manual choice.
  }

  return null;
}
