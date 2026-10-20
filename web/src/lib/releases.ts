export interface Release {
  /** Tag of the release, e.g. "v0.1.2". */
  tag: string;
  /** Version without the leading "v", e.g. "0.1.2". */
  version: string;
  assets: { name: string; url: string }[];
}

const REPO = "ilyeshdz/yapmod";
const API = `https://api.github.com/repos/${REPO}/releases/latest`;

let pending: Promise<Release | null> | null = null;

/**
 * Looks up the latest published release so every download link can point at
 * the exact file instead of the releases page. Falls back to `null` when the
 * lookup fails, the markup then keeps pointing at the releases page.
 */
export function latestRelease(): Promise<Release | null> {
  if (!pending) {
    pending = fetch(API, { headers: { Accept: "application/vnd.github+json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data || !Array.isArray(data.assets)) return null;

        const tag = typeof data.tag_name === "string" ? data.tag_name : "";
        return {
          tag,
          version: tag.replace(/^v/, ""),
          assets: data.assets
            .filter((asset: { name?: string; browser_download_url?: string }) =>
              Boolean(asset.name && asset.browser_download_url),
            )
            .map((asset: { name: string; browser_download_url: string }) => ({
              name: asset.name,
              url: asset.browser_download_url,
            })),
        } satisfies Release;
      })
      .catch(() => null);
  }

  return pending;
}

/** Direct download URL of the asset whose name ends with `suffix`. */
export function assetUrl(release: Release, suffix: string): string | undefined {
  return release.assets.find((asset) => asset.name.endsWith(suffix))?.url;
}
