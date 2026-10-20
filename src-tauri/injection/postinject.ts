export {};

const STYLE_ELEMENT_ID = "yapmod-injected-styles";
const DRAG_REGION_ID = "yapmod-drag-region";

type YapmodGlobal = {
  preinject?: boolean;
  applyCss?: (css: string) => void;
};

const globalScope = globalThis as typeof globalThis & {
  __yapmod?: YapmodGlobal;
};

function applyCss(css: string): void {
  let style = document.getElementById(
    STYLE_ELEMENT_ID,
  ) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ELEMENT_ID;
    (document.head ?? document.documentElement).appendChild(style);
  }

  style.textContent = css;
}

function ensureDragRegion(): void {
  if (
    document.documentElement.dataset.yapmodOs !== "macos" ||
    document.getElementById(DRAG_REGION_ID)
  ) {
    return;
  }

  const region = document.createElement("div");
  region.id = DRAG_REGION_ID;
  region.setAttribute("data-tauri-drag-region", "");
  document.body.appendChild(region);
}

ensureDragRegion();

globalScope.__yapmod ??= {};
globalScope.__yapmod.applyCss = applyCss;
