---
title: CI and releases
group: Project
order: 5
eyebrow: Project
description: How changes are checked, built and shipped.
---

Every change runs through GitHub Actions before it lands, and every release is assembled from the same pipeline. You can watch runs and read logs in the [Actions tab](https://github.com/ilyeshdz/yapmod/actions).

## The workflows

| Workflow | What it does |
| --- | --- |
| Check frontend | Type-checks the injected scripts and the front-end toolchain, then builds the bundles. |
| Check backend | Runs `cargo fmt` and `cargo clippy` across Windows, Linux and macOS, and verifies the generated types are up to date. |
| Build | Builds the installers for every supported target: Windows, both Mac architectures and Linux. |
| Draft release | Collects the latest successful builds, renames them, attaches the release notes, and opens a draft GitHub release. |
| Deploy website | Builds `web/` and publishes it to GitHub Pages. |

## Before you open a pull request

Run the same checks locally so CI has nothing to tell you:

```bash
pnpm build
pnpm injection:check
cargo fmt --manifest-path src-tauri/Cargo.toml --all
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
```

If you changed a Rust type that the injected scripts use, regenerate the bindings and commit them:

```bash
pnpm types:generate
```

## How a release is cut

1. Bump the version in `package.json`, `src-tauri/Cargo.toml` and `src-tauri/tauri.conf.json`.
2. Add the release notes under `.github/release-notes/` and to `src-tauri/assets/release-notes.json`, so they show up in the app and in the built-in changelog.
3. Run the **Draft release** workflow with the new version number.
4. Review the draft release on GitHub and publish it.

The downloads on the website and the update check both read from the published release, so nothing new is announced until you publish.
