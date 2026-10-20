import { installModalApi } from "./shared/modal";
import type { YapmodScope } from "./shared/types";

const globalScope = globalThis as YapmodScope;

globalScope.__yapmod ??= {};
globalScope.__yapmod.preinject = true;
globalScope.__yapmod.config = globalScope.__YAPMOD_CONFIG__;
globalScope.__yapmod.firstRun = globalScope.__YAPMOD_FIRST_RUN__ === true;
globalScope.__yapmod.version = globalScope.__YAPMOD_VERSION__;
globalScope.__yapmod.release = {
  version: globalScope.__YAPMOD_VERSION__ ?? "",
  previousVersion: globalScope.__YAPMOD_PREVIOUS_VERSION__ ?? null,
  firstRun: globalScope.__YAPMOD_FIRST_RUN__ === true,
  notes: globalScope.__YAPMOD_RELEASE_NOTES__ ?? null,
};

installModalApi(globalScope.__yapmod);
