import { mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "src-tauri", "injection");
const outdir = join(root, "src-tauri", "gen", "injection");

await mkdir(outdir, { recursive: true });

await build({
  entryPoints: [
    join(sourceDir, "preinject.ts"),
    join(sourceDir, "postinject.ts"),
  ],
  outdir,
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  minify: true,
  sourcemap: false,
  legalComments: "none",
  logLevel: "info",
});
