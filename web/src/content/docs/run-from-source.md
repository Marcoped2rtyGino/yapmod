---
title: Run from source
group: Project
order: 3
eyebrow: Project
description: Set up a local development environment and build yapmod yourself.
---

To work on yapmod you need a normal desktop development setup: Node.js for the injected scripts and the Rust toolchain for the desktop shell.

> **Before you start**
> yapmod is early and moves quickly. If you are planning anything larger than a small fix, [open an issue](https://github.com/ilyeshdz/yapmod/issues) first so the direction is agreed on.

## Requirements

- Node.js and [pnpm](https://pnpm.io)
- The Rust toolchain
- Tauri 2's system dependencies for your operating system (see Tauri's [prerequisites guide](https://tauri.app/start/prerequisites/))

## Set up

```bash
git clone https://github.com/ilyeshdz/yapmod
cd yapmod
pnpm install
```

## Develop

```bash
# start the app in development mode
pnpm tauri dev

# rebuild the injected scripts after editing them
pnpm injection:build
```

`pnpm tauri dev` builds the injected scripts, then opens the app window. The window loads the live Yapper site, so every edit to a script needs `pnpm injection:build` (or a restart) before you see it.

## Build

```bash
# type-check and build the placeholder front end
pnpm build

# build the installers for your platform
pnpm tauri build
```

## Command reference

| Command | What it does |
| --- | --- |
| `pnpm tauri` | Runs the Tauri CLI. |
| `pnpm injection:build` | Bundles `src-tauri/injection` into the app. |
| `pnpm injection:check` | Type-checks the injected code. |
| `pnpm types:generate` | Regenerates the TypeScript types from the Rust types. |
| `pnpm build` | Type-checks and builds the front-end toolchain. |
| `pnpm preview` | Previews the front-end build. |

## Where to look next

- [Repository guide](project-structure) — how the repository is laid out.
- [How yapmod works](architecture) — what the pieces actually do.
- [CI and releases](ci-and-releases) — the checks your change will run.
