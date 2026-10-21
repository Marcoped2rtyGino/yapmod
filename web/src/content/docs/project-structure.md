---
title: Project structure
group: Developers
order: 2
eyebrow: Developers
description: How the repository is laid out.
---

```text
yapmod/
├─ .github/workflows/   CI, builds, releases
├─ .vscode/             editor settings
├─ assets/              icon and artwork
├─ scripts/             build-injection.mjs
├─ src/                 TypeScript front end (Vite)
├─ src-tauri/           Tauri app (Rust)
│  └─ injection/        TypeScript modules added on top of Yapper
├─ index.html
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
└─ vite.config.ts
```

## Dependencies

| Package | Role |
| --- | --- |
| `@tauri-apps/api` | Talks to the Tauri backend from TypeScript. |
| `@tauri-apps/plugin-opener` | Opens links and files with the system defaults. |
| `@tauri-apps/cli` | Develops and bundles the app. |
| `vite`, `typescript` | Front-end tooling. |
| `esbuild` | Build tooling for the injection modules. |

## The injection layer

Everything yapmod adds on top of Yapper lives in `src-tauri/injection`. The modules are TypeScript, bundled by `scripts/build-injection.mjs` and injected into the Yapper web view when the app starts. `preinject.ts` runs before Yapper boots, `postinject.ts` once the app is ready.
