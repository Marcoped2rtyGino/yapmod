import type { ReleaseNotes, ReleaseNotesSection } from "./types";
import { createElement } from "./ui";

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
 */
export function createReleaseBody(notes: ReleaseNotes | null): HTMLElement {
  const releaseNotes: ReleaseNotes = notes ?? {};
  const children: Node[] = [];

  if (releaseNotes.summary) {
    children.push(
      createElement("p", {
        className: "yapmod-release-summary",
        text: releaseNotes.summary,
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
