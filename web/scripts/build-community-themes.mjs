import {
  copyFileSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd(), "..");
const source = join(root, "community-themes");
const rules = JSON.parse(readFileSync(join(source, "rules.json"), "utf8"));
const outputDir = process.argv.includes("--dev") ? "public" : "dist";
const output = resolve(process.cwd(), `${outputDir}/community-themes`);
const validId = /^(?!\.)[A-Za-z0-9_.-]+$/;
const validFile = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
const previewExtensions = new Set(rules.previewExtensions);

function fail(message) {
  throw new Error(`[community themes] ${message}`);
}

function requireFile(folder, name, limit, label) {
  if (typeof name !== "string" || !validFile.test(name) || name.includes("..")) {
    fail(`${folder}: ${label} must be a simple file name`);
  }

  const path = join(source, folder, name);
  const details = lstatSync(path, { throwIfNoEntry: false });

  if (!details?.isFile() || details.isSymbolicLink()) {
    fail(`${folder}: ${label} file ${name} is missing or is not a regular file`);
  }

  if (details.size > limit) {
    fail(`${folder}: ${label} exceeds the ${limit} byte limit`);
  }

  return path;
}

const entries = readdirSync(source, { withFileTypes: true })
  .filter((entry) => !entry.name.startsWith(".") && (entry.isDirectory() || entry.isSymbolicLink()))
  .sort((left, right) => left.name.localeCompare(right.name));
const themes = [];
const files = [];

for (const entry of entries) {
  if (!entry.isDirectory() || entry.isSymbolicLink() || !validId.test(entry.name)) {
    fail(`${entry.name}: expected a theme folder with a valid id`);
  }

  const folder = entry.name;
  const manifestPath = requireFile(folder, "manifest.json", rules.maxManifestBytes, "manifest");
  let manifest;

  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (error) {
    fail(`${folder}: manifest.json is not valid JSON (${error})`);
  }

  if (
    !manifest ||
    manifest.id !== folder ||
    typeof manifest.name !== "string" ||
    !manifest.name.trim() ||
    Array.from(manifest.name).length > rules.maxNameLength
  ) {
    fail(`${folder}: manifest id must match the folder and name must be set`);
  }

  if (
    manifest.api != null &&
    (!Number.isInteger(manifest.api) || manifest.api < 0 || manifest.api > rules.themeApi)
  ) {
    fail(`${folder}: theme API must be an integer no newer than ${rules.themeApi}`);
  }

  const cssName = manifest.css ?? "theme.css";
  const previewName = manifest.preview;
  const cssPath = requireFile(folder, cssName, rules.maxCssBytes, "stylesheet");

  if (
    typeof previewName !== "string" ||
    !previewExtensions.has(previewName.split(".").at(-1)?.toLowerCase())
  ) {
    fail(`${folder}: a PNG, JPEG, WebP, GIF or SVG preview is required`);
  }

  const previewPath = requireFile(folder, previewName, rules.maxPreviewBytes, "preview");
  const mode = ["dark", "light", "both"].includes(manifest.mode) ? manifest.mode : "dark";
  const tags = Array.isArray(manifest.tags)
    ? manifest.tags.filter((tag) => typeof tag === "string").slice(0, rules.maxTags)
    : [];

  themes.push({
    id: folder,
    name: manifest.name.trim(),
    version: typeof manifest.version === "string" ? manifest.version : null,
    author: typeof manifest.author === "string" ? manifest.author : null,
    description: typeof manifest.description === "string" ? manifest.description : null,
    license: typeof manifest.license === "string" ? manifest.license : null,
    mode,
    tags,
    api: manifest.api ?? rules.themeApi,
    preview: previewName,
  });

  files.push({ folder, manifestPath, cssPath, cssName, previewPath, previewName });
}

if (themes.length > rules.maxThemes) {
  fail(`catalog has ${themes.length} themes; the limit is ${rules.maxThemes}`);
}

const catalog = `${JSON.stringify({ api: rules.themeApi, themes }, null, 2)}\n`;
if (Buffer.byteLength(catalog, "utf8") > rules.maxCatalogBytes) {
  fail(`generated catalog exceeds the ${rules.maxCatalogBytes} byte limit`);
}

rmSync(output, { recursive: true, force: true });
mkdirSync(join(output, "themes"), { recursive: true });

for (const filesForTheme of files) {
  const themeOutput = join(output, "themes", filesForTheme.folder);
  mkdirSync(themeOutput, { recursive: true });
  copyFileSync(filesForTheme.manifestPath, join(themeOutput, "manifest.json"));
  copyFileSync(filesForTheme.previewPath, join(themeOutput, filesForTheme.previewName));
  copyFileSync(filesForTheme.cssPath, join(themeOutput, filesForTheme.cssName));
}

writeFileSync(join(output, "index.json"), catalog);

console.log(`[community themes] published ${themes.length} theme(s)`);
