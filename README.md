<p align="center">
  <img src="assets/icon.svg" alt="yapmod logo" width="180" />
</p>

<h1 align="center">yapmod</h1>

<p align="center">
  An open-source, modded desktop client for <a href="https://yapper.website">Yapper</a>, built with Tauri.
</p>

<p align="center">
  <a href="https://github.com/ilyeshdz/yapmod/releases"><img src="https://img.shields.io/github/package-json/v/ilyeshdz/yapmod?label=version" alt="Version" /></a>
  <a href="https://github.com/ilyeshdz/yapmod/actions/workflows/build.yml"><img src="https://github.com/ilyeshdz/yapmod/actions/workflows/build.yml/badge.svg" alt="Build" /></a>
  <a href="https://github.com/ilyeshdz/yapmod/actions/workflows/backend.yml"><img src="https://github.com/ilyeshdz/yapmod/actions/workflows/backend.yml/badge.svg" alt="Check backend" /></a>
  <a href="https://github.com/ilyeshdz/yapmod/actions/workflows/frontend.yml"><img src="https://github.com/ilyeshdz/yapmod/actions/workflows/frontend.yml/badge.svg" alt="Check frontend" /></a>
</p>

> [!WARNING]
> **yapmod is in early development.** Expect missing features, rough edges, and breaking changes.

## Features

- Desktop client for [Yapper](https://yapper.website) with pre/post-injection scripts
- Configurable through a local config file
- Native titlebar overlay on macOS
- First-run welcome modal

> [!NOTE]
> Plugins, themes, and similar customization features are not available yet.

## Installation

Grab the latest build from the [Releases](https://github.com/ilyeshdz/yapmod/releases) page:

- **Windows**: `.msi` installer or NSIS `.exe`
- **macOS**: `.dmg` (Intel and Apple Silicon)
- **Linux**: `.deb`, `.rpm`, or `.AppImage`

Builds are currently unsigned, so Windows SmartScreen and macOS Gatekeeper may warn you on first launch.

## Development

### Requirements

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 10+
- [Rust](https://rustup.rs/) (stable)
- [Tauri system dependencies](https://tauri.app/start/prerequisites/) for your platform

### Getting started

```sh
pnpm install
pnpm injection:build
pnpm tauri dev
```

### Useful scripts

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `pnpm tauri dev`       | Run the app in development mode              |
| `pnpm tauri build`     | Build a production binary and installers     |
| `pnpm injection:build` | Bundle the pre/post-injection scripts        |
| `pnpm injection:check` | Typecheck the injection scripts              |
| `pnpm build`           | Typecheck and build the frontend with Vite   |

## Contributing

Contributions are welcome. Since the project is early in development, please open an issue to discuss larger changes before starting work, and keep pull requests focused and consistent with the existing code.
