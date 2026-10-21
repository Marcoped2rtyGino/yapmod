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

/**
 * The DOM events an element can listen to.
 */
export type ElementEvents = {
  [E in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[E]) => void;
};

/**
 * Everything an element can be built with.
 *
 * `attrs` holds attributes, `props` holds DOM properties, so the caller
 * never has to reach for the node after it was created.
 */
export type ElementOptions<
  K extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap,
> = {
  className?: string;
  text?: string;
  html?: string;
  attrs?: Record<string, string>;
  dataset?: Record<string, string>;
  props?: Partial<NoInfer<HTMLElementTagNameMap[K]>>;
  on?: ElementEvents;
  children?: Node[];
};

/** Small DOM builder so feature code never needs a framework. */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions<K> = {},
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  if (options.className) {
    node.className = options.className;
  }

  if (options.text != null) {
    node.textContent = options.text;
  }

  if (options.html != null) {
    node.innerHTML = options.html;
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      if (value !== undefined) {
        node.setAttribute(name, value);
      }
    }
  }

  if (options.dataset) {
    for (const [name, value] of Object.entries(options.dataset)) {
      if (value !== undefined) {
        node.dataset[name] = value;
      }
    }
  }

  if (options.props) {
    const target = node as unknown as Record<string, unknown>;

    for (const [name, value] of Object.entries(options.props)) {
      if (value !== undefined) {
        target[name] = value;
      }
    }
  }

  if (options.on) {
    for (const [type, listener] of Object.entries(options.on)) {
      node.addEventListener(type, listener as EventListener);
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
