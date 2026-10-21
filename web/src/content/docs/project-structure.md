---
title: Repository guide
group: Project
order: 4
eyebrow: Project
description: What lives where in the yapmod repository.
---

The repository holds three things: the desktop app, the injected scripts that sit on top of Yapper, and the website you are reading now.

```text
yapmod/
├─ .github/              CI workflows and release notes
├─ assets/               the yapmod logo
├─ scripts/              build and code-generation scripts
├─ src/                  front-end toolchain (dev only)
├─ src-tauri/            the desktop app (Rust + Tauri)
│  ├─ injection/         the TypeScript added on top of Yapper
│  ├─ src/               the Rust side: window, settings, updates
│  ├─ assets/            the stylesheet and release notes
│  └─ gen/               generated bundles and TypeScript types
├─ web/                  the landing page and documentation
├─ index.html            entry point for the front-end toolchain
└─ package.json          scripts and dependencies
```

## The desktop app

`src-tauri` is the part that makes yapmod an app rather than a tab.

- `src/main.rs` creates the window, wires up the Tauri plugins and the commands, and decides how external links and device permissions are handled.
- `src/config.rs` reads, writes and migrates your settings.
- `src/update.rs` and `src/version.rs` run the update check and compare versions.
- `src/hosts.rs` is the one place that decides what counts as a yapmod link.
- `src/injection/` embeds the built scripts into the binary and serves the release notes.

## The injected layer

`src-tauri/injection` is everything yapmod adds on top of Yapper, written in TypeScript. `preinject.ts` runs before Yapper boots; `postinject.ts` runs once the page is ready. The shared modules under `injection/shared` are the small toolkit they share — the modal, the settings API, the settings store, external links, the changelog and the update notice.

The build bundles these into `src-tauri/gen/injection`, and `pnpm injection:build` regenerates them. You will not edit the `gen` output by hand.

This layer is also the foundation the planned plugin API will build on. When plugins become real, this is the area they will extend, which is why keeping the shared toolkit small and well-defined matters now. See [Plugins](plugins).

## The website

`web/` is the Astro site: the landing page at `/` and these docs under `/docs`. Documentation pages are plain Markdown in `web/src/content/docs`, one file per page. See [Contributing](contributing) for how to add one.

## Generated types

The Rust types are the source of truth for the data that crosses between the desktop app and the injected scripts. `pnpm types:generate` runs the Rust tests and writes the matching TypeScript into `src-tauri/injection/generated`. That file is generated, so change the Rust type and regenerate rather than editing it directly.
