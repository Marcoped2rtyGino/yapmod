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

export type ElementOptions = {
  className?: string;
  text?: string;
  attrs?: Record<string, string>;
  children?: Node[];
};

/** Small DOM builder so feature code never needs a framework. */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {},
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  if (options.className) {
    node.className = options.className;
  }

  if (options.text != null) {
    node.textContent = options.text;
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      node.setAttribute(name, value);
    }
  }

  if (options.children) {
    node.append(...options.children);
  }

  return node;
}

export function whenBodyReady(callback: () => void): void {
  if (document.body) {
    callback();
    return;
  }

  document.addEventListener("DOMContentLoaded", () => callback(), {
    once: true,
  });
}
