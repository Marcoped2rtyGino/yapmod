export {};

type YapmodGlobal = {
  preinject?: boolean;
  applyCss?: (css: string) => void;
};

const globalScope = globalThis as typeof globalThis & {
  __yapmod?: YapmodGlobal;
};

globalScope.__yapmod ??= {};
globalScope.__yapmod.preinject = true;
