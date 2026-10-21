import type { ReleaseNotes, ReleaseNotesSection } from "./types";
import { createElement } from "./ui";
import { invokeCommand } from "./tauri";

let changelogCache: Record<string, ReleaseNotes> | null = null;

/**
 * Every release, keyed by version.
 *
 * The list is fetched on demand and kept around, so it is not shipped with
 * every page load.
 */
export async function getChangelog(): Promise<Record<string, ReleaseNotes>> {
  if (!changelogCache) {
    changelogCache = await invokeCommand<Record<string, ReleaseNotes>>(
      "get_changelog",
    );
  }

  return changelogCache;
}

/**
 * Formats an ISO date (YYYY-MM-DD) as a human readable date.
 */
export function formatReleaseDate(date: string | undefined): string | null {
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

/**
 * Renders one "Highlights"/"New"/"Fixed" block of a release.
 */
export function createReleaseSection(section: ReleaseNotesSection): HTMLElement {
  const items = (section.items ?? []).map((item) =>
    createElement("li", { text: item }),
  );

  const list = createElement("ul", {
    className: "yapmod-release-list",
    children: items,
  });

  const children: Node[] = [list];

  if (section.heading) {
    children.unshift(createElement("h3", { text: section.heading }));
  }

  return createElement("section", {
    className: "yapmod-release-section",
    children,
  });
}

/**
 * Renders the summary and the sections of a release.
 *
 * The summary falls back to `fallbackSummary` when the release has none.
 */
export function createReleaseBody(
  notes: ReleaseNotes | null,
  fallbackSummary?: string,
): HTMLElement {
  const releaseNotes: ReleaseNotes = notes ?? {};
  const summary = releaseNotes.summary ?? fallbackSummary;
  const children: Node[] = [];

  if (summary) {
    children.push(
      createElement("p", {
        className: "yapmod-release-summary",
        text: summary,
      }),
    );
  }

  for (const section of releaseNotes.sections ?? []) {
    children.push(createReleaseSection(section));
  }

  return createElement("div", {
    className: "yapmod-release-body",
    children,
  });
}

/**
 * How the header of a release is built.
 *
 * The changelog lays the pieces out in a row, the release modal stacks
 * them, so every class is given by the caller.
 */
export type ReleaseHeaderOptions = {
  /** The element the header is built with. */
  tag?: "div" | "header";
  /** The class of the header itself. */
  className: string;
  /** The class of the version. */
  versionClassName: string;
  /** The class of the date. */
  dateClassName: string;
  /** The label shown above the version. */
  eyebrow?: string;
  /** The class of the eyebrow. */
  eyebrowClassName?: string;
  /** Whether this is the release that is installed. */
  current?: boolean;
  /** The class of the badge shown for the installed release. */
  currentClassName?: string;
};

/**
 * Builds the header of a release: the version, the date and the badge of
 * the installed release.
 */
export function createReleaseHeader(
  release: { version: string; notes?: ReleaseNotes | null },
  options: ReleaseHeaderOptions,
): HTMLElement {
  const children: Node[] = [];

  if (options.eyebrow) {
    children.push(
      createElement("span", {
        className: options.eyebrowClassName,
        text: options.eyebrow,
      }),
    );
  }

  children.push(
    createElement("span", {
      className: options.versionClassName,
      text: `v${release.version}`,
    }),
  );

  const date = formatReleaseDate(release.notes?.date);

  if (date) {
    children.push(
      createElement("span", {
        className: options.dateClassName,
        text: date,
      }),
    );
  }

  if (options.current) {
    children.push(
      createElement("span", {
        className: options.currentClassName,
        text: "Installed",
      }),
    );
  }

  return createElement(options.tag ?? "div", {
    className: options.className,
    children,
  });
}

export function compareVersions(left: string, right: string): number {
  const parse = (version: string): number[] =>
    version
      .split(/[.-]/)
      .map((part) => Number.parseInt(part, 10))
      .map((part) => (Number.isNaN(part) ? 0 : part));

  const a = parse(left);
  const b = parse(right);

  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const diff = (a[index] ?? 0) - (b[index] ?? 0);

    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
}

/**
 * Returns every release, newest first.
 */
export function sortReleases<T>(
  releases: Record<string, T>,
): Array<{ version: string; notes: T }> {
  return Object.entries(releases)
    .sort(([left], [right]) => compareVersions(right, left))
    .map(([version, notes]) => ({ version, notes }));
}
