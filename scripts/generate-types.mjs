import { spawn, spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generated = "src-tauri/injection/generated";
const check = process.argv.includes("--check");

/**
 * Regenerates the TypeScript bindings of the Rust types.
 *
 * The `ts-rs` export runs as part of the test suite, so the tests are run
 * with the export folder pointed at the injection bundle.
 */
const child = spawn(
  "cargo",
  ["test", "--manifest-path", "src-tauri/Cargo.toml"],
  {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      TS_RS_EXPORT_DIR: "injection/generated",
    },
  },
);

child.on("exit", (code) => {
  if (code !== 0) {
    process.exit(code ?? 1);
  }

  if (!check) {
    process.exit(0);
  }

  const status = spawnSync("git", ["status", "--porcelain", "--", generated], {
    cwd: root,
    encoding: "utf8",
  });

  if (status.stdout.trim()) {
    console.error(
      `The generated types are out of date, run \`pnpm types:generate\`:\n${status.stdout}`,
    );
    process.exit(1);
  }
});
