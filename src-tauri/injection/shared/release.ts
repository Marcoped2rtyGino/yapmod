import type { ReleaseNotes, ReleaseNotesSection } from "./types";

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

/**
 * Renders the summary and the sections of a release.
 */
export function createReleaseBody(notes: ReleaseNotes | null): HTMLElement {
  const body = document.createElement("div");
  body.className = "yapmod-release-body";

  const releaseNotes: ReleaseNotes = notes ?? {};

  if (releaseNotes.summary) {
    const summary = document.createElement("p");
    summary.className = "yapmod-release-summary";
    summary.textContent = releaseNotes.summary;
    body.appendChild(summary);
  }

  for (const section of releaseNotes.sections ?? []) {
    body.appendChild(createReleaseSection(section));
  }

  return body;
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
