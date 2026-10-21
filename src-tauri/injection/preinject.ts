import { installModalApi } from "./shared/modal";
import { installSettingsApi } from "./shared/settings";
import { installStore } from "./shared/store";
import { installDefaultSettings } from "./shared/defaults";
import { installDesktopBridge } from "./shared/desktop";
import { installNotificationApi } from "./shared/notify";
import { installExternalLinks } from "./shared/links";
import { getChangelog } from "./shared/release";
import { getScope, getYapmod } from "./shared/scope";

const scope = getScope();
const yapmod = getYapmod();
const payload = scope.__YAPMOD__ ?? {};

yapmod.config = payload.config;
yapmod.os = payload.os;
yapmod.internalHost = payload.internalHost;
yapmod.release = payload.release;
yapmod.changelog = getChangelog;

installModalApi();
installStore();
installSettingsApi();
installDefaultSettings();
installDesktopBridge();
installNotificationApi();
installExternalLinks();
