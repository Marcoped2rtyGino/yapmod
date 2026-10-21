/** A single entry of the documentation search index. */
export interface SearchItem {
  title: string;
  group: string;
  description: string;
  url: string;
  text: string;
}

let pending: Promise<SearchItem[]> | null = null;

/**
 * Loads the search index once and keeps it around for the rest of the session.
 */
export function loadIndex(): Promise<SearchItem[]> {
  if (!pending) {
    const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

    pending = fetch(`${base}/docs/search-index.json`)
      .then((response) => (response.ok ? response.json() : []))
      .catch(() => []);
  }

  return pending;
}

/** Every entry that matches the query, best guess first. */
export function searchIndex(items: SearchItem[], query: string): SearchItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const words = needle.split(/\s+/);

  return items
    .map((item) => {
      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();
      const text = item.text.toLowerCase();

      if (!words.every((word) => `${title} ${description} ${text}`.includes(word))) {
        return { item, score: -1 };
      }

      // Title matches are worth more than a mention in the body.
      let score = 0;
      if (title.includes(needle)) score += 10;
      if (title.startsWith(needle)) score += 5;
      if (description.includes(needle)) score += 3;
      if (text.includes(needle)) score += 1;

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}

/** A short excerpt of the text around the match. */
export function excerpt(text: string, query: string): string {
  const position = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (position === -1) return text.slice(0, 120);

  const start = Math.max(0, position - 40);
  return `${start > 0 ? "…" : ""}${text.slice(start, start + 140)}…`;
}
