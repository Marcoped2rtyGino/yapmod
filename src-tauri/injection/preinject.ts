import { installModalApi } from "./shared/modal";
import type { YapmodScope } from "./shared/types";

const globalScope = globalThis as YapmodScope;

globalScope.__yapmod ??= {};
globalScope.__yapmod.preinject = true;

installModalApi(globalScope.__yapmod);
