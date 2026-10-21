---
title: Run from source
group: Developers
order: 1
eyebrow: Developers
description: Set up a local development environment.
---


## Requirements

- Node.js and [pnpm](https://pnpm.io)
- The Rust toolchain
- Tauri 2’s system dependencies for your OS (see Tauri’s prerequisites guide)

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

# rebuild the injection modules
pnpm injection:build
```

## Build

```bash
# type-check and build the front end
pnpm build

# build the installers for your platform
pnpm tauri build
```

## Script reference

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts the Vite dev server. |
| `pnpm build` | Runs `tsc`, then `vite build`. |
| `pnpm preview` | Previews the Vite build. |
| `pnpm tauri` | Runs the Tauri CLI. |
| `pnpm injection:build` | Runs `scripts/build-injection.mjs`. |
| `pnpm injection:check` | Type-checks the injection code with `src-tauri/injection/tsconfig.json`. |
