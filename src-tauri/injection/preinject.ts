import { installModalApi } from "./shared/modal";
import { installSettingsApi } from "./shared/settings";
import { installStore } from "./shared/store";
import { installDefaultSettings } from "./shared/defaults";
import { installExternalLinks } from "./shared/links";
import type { YapmodScope } from "./shared/types";

const globalScope = globalThis as YapmodScope;

globalScope.__yapmod ??= {};
globalScope.__yapmod.preinject = true;
globalScope.__yapmod.config = globalScope.__YAPMOD_CONFIG__;
globalScope.__yapmod.os = globalScope.__YAPMOD_OS__;
globalScope.__yapmod.firstRun = globalScope.__YAPMOD_FIRST_RUN__ === true;
globalScope.__yapmod.version = globalScope.__YAPMOD_VERSION__;
globalScope.__yapmod.release = {
  version: globalScope.__YAPMOD_VERSION__ ?? "",
  previousVersion: globalScope.__YAPMOD_PREVIOUS_VERSION__ ?? null,
  firstRun: globalScope.__YAPMOD_FIRST_RUN__ === true,
  notes: globalScope.__YAPMOD_RELEASE_NOTES__ ?? null,
};

globalScope.__yapmod.changelog = globalScope.__YAPMOD_ALL_RELEASE_NOTES__ ?? {};

installModalApi(globalScope.__yapmod);
installStore(globalScope.__yapmod);
installSettingsApi(globalScope.__yapmod);
installDefaultSettings(globalScope.__yapmod);
installExternalLinks();
