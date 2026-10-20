export function upsertStyle(
  id: string,
  css: string,
): HTMLStyleElement | null {
  const parent = document.head ?? document.documentElement;

  if (!parent) {
    return null;
  }

  let style = document.getElementById(id) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement("style");
    style.id = id;
    parent.appendChild(style);
  }

  style.textContent = css;

  return style;
}

export function ensureStyle(id: string, css: string): void {
  if (!document.getElementById(id)) {
    upsertStyle(id, css);
  }
}
