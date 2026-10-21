import { installModalApi } from "./shared/modal";
import { installSettingsApi } from "./shared/settings";
import { installStore } from "./shared/store";
import { installDefaultSettings } from "./shared/defaults";
import { installExternalLinks } from "./shared/links";
import { getChangelog } from "./shared/release";
import { getScope, getYapmod } from "./shared/scope";

const scope = getScope();
const yapmod = getYapmod();
const payload = scope.__YAPMOD__ ?? {};

yapmod.config = payload.config;
yapmod.os = payload.os;
yapmod.release = {
  version: payload.version ?? "",
  previousVersion: payload.previousVersion ?? null,
  firstRun: payload.firstRun === true,
  notes: payload.notes ?? null,
};
yapmod.changelog = getChangelog;

installModalApi();
installStore();
installSettingsApi();
installDefaultSettings();
installExternalLinks();
