---
title: CI and releases
group: Developers
order: 3
eyebrow: Developers
description: What the GitHub Actions workflows do.
---

Automation runs on GitHub Actions. The repository has five workflows.

| Workflow | Purpose |
| --- | --- |
| Build | Builds the app for the supported platforms. |
| Check frontend | Checks the TypeScript code. |
| Check backend | Checks the Rust code. |
| Draft release | Prepares a draft GitHub release. |
| Deploy website | Publishes the project website. |

See the [Actions tab](https://github.com/ilyeshdz/yapmod/actions) for runs and logs.

## Before you open a pull request

```bash
pnpm build
pnpm injection:check
```
