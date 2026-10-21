---
title: Contributing
group: Project
order: 2
eyebrow: Project
description: How to help build and improve yapmod.
---

yapmod is made by the people who use it. Whether you write code, report what breaks, fix documentation or just have a good idea, contributions are welcome.

## Ways to help

- **Report a bug.** Open an [issue](https://github.com/ilyeshdz/yapmod/issues) with what happened, your operating system and your yapmod version.
- **Suggest a feature.** Tell us what you would like yapmod to do and why. The roadmap is open — see [Vision and roadmap](roadmap) for where things stand.
- **Write code.** Fork the repository, set it up with [Run from source](run-from-source), and open a pull request.
- **Improve the docs.** These pages live in `web/src/content/docs`, one Markdown file per page. Add a file with the frontmatter it needs, and it appears in the sidebar.
- **Help shape the future.** The plugin API and the theming system are still being designed, and the early discussions are the right time to influence them.

## Working on a change

1. For anything larger than a small fix, [open an issue](https://github.com/ilyeshdz/yapmod/issues) first so the direction is agreed on.
2. Fork the repository and set it up with [Run from source](run-from-source).
3. Keep your pull request focused. One clear change is easier to review than several at once.
4. Match the style of the code around you, and run the checks from [CI and releases](ci-and-releases) before you push.

## A note on accuracy

Because yapmod makes deliberate claims about what it does and does not do, the documentation matters as much as the code. If you change how something behaves, or move a feature between “available”, “in development” and “planned”, update the relevant page and [Vision and roadmap](roadmap) along with it.

## Commit messages

The history uses conventional prefixes such as `feat`, `fix`, `refactor`, `style`, `chore` and `ci`, often with a scope:

```text
fix(injection): hide the previous settings panel when switching sections
```

## Community

Ask questions and follow along on the official Yapper server: [yapper.website/invite/develop](https://yapper.website/invite/develop).
