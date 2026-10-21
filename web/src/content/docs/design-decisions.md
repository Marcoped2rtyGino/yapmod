---
title: Design decisions
group: How it works
order: 2
eyebrow: Under the hood
description: The technical choices behind yapmod, and how we describe them honestly.
---

yapmod uses [Tauri](https://tauri.app) and Rust, but the project is not defined by its frameworks. These are the decisions behind the app, what they actually buy us, and where we are careful not to overstate them.

## Application size

The clearest, most measurable advantage of yapmod's approach is how small it is.

Tauri builds a desktop app around the **system webview** — the web engine the operating system already provides — instead of bundling a complete browser runtime with every copy of the application. That has a direct effect on the download and the installed footprint.

- yapmod builds are roughly **7 MB**, depending on the target platform and build configuration.
- For comparison, bundling a full browser runtime can push a desktop app into the **tens of megabytes**. The official Yapper desktop app is reportedly over 80 MB.
- Exact sizes vary by release and platform, so check the download on the [Releases page](https://github.com/ilyeshdz/yapmod/releases) rather than treating any number here as universal.

A smaller install means less disk used and less to download. That is a concrete benefit, and it is the one we lead with.

> **About the comparison**
> We have not verified the internal architecture of the official app, and we do not claim to know which framework it uses. Bundling a browser (as frameworks like Electron do) is a legitimate choice with real advantages — a consistent rendering engine across platforms and a mature ecosystem. yapmod simply takes a different approach, and the trade-off is that the package stays small.

## Performance and memory

A smaller package does **not** automatically mean lower memory use, faster rendering, or better overall performance, and we will not claim that it does.

Tauri uses the system webview, and that webview differs between Windows, macOS and Linux. How much memory the app uses and how smoothly it renders therefore depend on the operating system, the webview implementation, the application code and the workload. In some environments the approach may help; in others the result may be different.

The same caution applies to Rust. Tauri's native side is written in Rust, but using Rust does not by itself make the whole application faster or lighter. Those outcomes come from how the app is designed and implemented, not from the language alone.

So we treat performance claims carefully:

- **Measurable and demonstrated:** the application package size.
- **Architectural choices:** Tauri, the system webview, a Rust backend. These shape what is possible; they are not performance guarantees.
- **Objectives, not facts:** any future performance improvement we pursue, until we can point at a benchmark.

When we do have measurements, we will share them. Until then, we would rather be accurate than impressive.

## Rust's role

Rust is where yapmod's native side lives: creating and managing the window, storing settings, handling external links and device permissions, comparing versions, and checking for updates. It is the layer that can talk to the operating system, which is exactly why the desktop integrations on the roadmap belong there.

Rust is a good fit for that work — reliable, fast to run, and comfortable to maintain — but it is a means to an end, not the point of the project.

## More than a wrapper

Using a webview might sound like “a website in a window”. In practice the architecture is what lets yapmod go further: native notifications and indicators, operating-system integration, and a structure that plugins and themes can eventually extend. [How yapmod works](architecture) describes how those pieces fit together.

## Where this leaves us

The technical philosophy is straightforward: make deliberate choices that serve the user's experience, keep the application lightweight, and make future development sustainable. Explain each choice by its purpose and its trade-offs, and keep clear what is measured, what is a design choice, and what is still a goal.

The full picture of what is shipped, in progress and planned is on [Vision and roadmap](roadmap).
