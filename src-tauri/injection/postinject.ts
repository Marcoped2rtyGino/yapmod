import type { YapmodScope } from "./shared/types";
import { upsertStyle } from "./shared/ui";

const STYLE_ELEMENT_ID = "yapmod-injected-styles";
const DRAG_REGION_ID = "yapmod-drag-region";

const globalScope = globalThis as YapmodScope;

function applyCss(css: string): void {
  upsertStyle(STYLE_ELEMENT_ID, css);
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
