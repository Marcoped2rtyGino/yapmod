import { readFileSync, writeFileSync } from "node:fs";

const version = process.env.APP_VERSION ?? process.argv[2];
const msiVersion = process.env.MSI_VERSION;

if (
  !version ||
  !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)
) {
  throw new Error("Set APP_VERSION or pass a valid semantic version as the first argument.");
}

let tauriConfig;
if (msiVersion) {
  const parts = msiVersion.split(".").map(Number);
  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0) ||
    parts[0] > 255 ||
    parts[1] > 255 ||
    parts[2] > 65535 ||
    parts[3] > 65535
  ) {
    throw new Error("MSI_VERSION must be a numeric major.minor.patch.build version within MSI limits.");
  }

  const configPath = "src-tauri/tauri.conf.json";
  tauriConfig = JSON.parse(readFileSync(configPath, "utf8"));
  tauriConfig.bundle ??= {};
  tauriConfig.bundle.windows ??= {};
  tauriConfig.bundle.windows.wix ??= {};
  tauriConfig.bundle.windows.wix.version = msiVersion;
}

const manifestPath = "src-tauri/Cargo.toml";
const lockPath = "src-tauri/Cargo.lock";
const manifest = readFileSync(manifestPath, "utf8");
const packageStart = manifest.indexOf("[package]");
const nextSection = manifest.indexOf("\n[", packageStart + "[package]".length);

if (packageStart === -1) {
  throw new Error(`Could not find [package] in ${manifestPath}.`);
}

const packageEnd = nextSection === -1 ? manifest.length : nextSection;
const packageSection = manifest.slice(packageStart, packageEnd);
const versionLine = /^version\s*=\s*"[^"]+"(\r?)$/m;

if (!versionLine.test(packageSection)) {
  throw new Error(`Could not find package version in ${manifestPath}.`);
}

const updatedManifest =
  manifest.slice(0, packageStart) +
  packageSection.replace(versionLine, `version = "${version}"$1`) +
  manifest.slice(packageEnd);

const lock = readFileSync(lockPath, "utf8");
const packageBlocks = lock.split(/(?=^\[\[package\]\]\r?$)/m);
let lockMatches = 0;
const updatedLock = packageBlocks
  .map((block) => {
    if (!/^name = "yapmod"\r?$/m.test(block)) return block;
    lockMatches += 1;
    if (!/^version = "[^"]+"\r?$/m.test(block)) {
      throw new Error(`Could not find yapmod package version in ${lockPath}.`);
    }
    return block.replace(
      /^version = "[^"]+"(\r?)$/m,
      `version = "${version}"$1`,
    );
  })
  .join("");

if (lockMatches !== 1) {
  throw new Error(`Expected one yapmod package entry in ${lockPath}, found ${lockMatches}.`);
}

writeFileSync(manifestPath, updatedManifest);
writeFileSync(lockPath, updatedLock);
if (tauriConfig) {
  writeFileSync("src-tauri/tauri.conf.json", `${JSON.stringify(tauriConfig, null, 2)}\n`);
}
