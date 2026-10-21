import { installModalApi } from "./shared/modal";
import { installSettingsApi } from "./shared/settings";
import { installStore } from "./shared/store";
import { installDefaultSettings } from "./shared/defaults";
import { installExternalLinks } from "./shared/links";
import { getScope, getYapmod } from "./shared/scope";

const scope = getScope();
const yapmod = getYapmod();

yapmod.config = scope.__YAPMOD_CONFIG__;
yapmod.os = scope.__YAPMOD_OS__;
yapmod.release = {
  version: scope.__YAPMOD_VERSION__ ?? "",
  previousVersion: scope.__YAPMOD_PREVIOUS_VERSION__ ?? null,
  firstRun: scope.__YAPMOD_FIRST_RUN__ === true,
  notes: scope.__YAPMOD_RELEASE_NOTES__ ?? null,
};
yapmod.changelog = scope.__YAPMOD_ALL_RELEASE_NOTES__ ?? {};

installModalApi();
installStore();
installSettingsApi();
installDefaultSettings();
installExternalLinks();
