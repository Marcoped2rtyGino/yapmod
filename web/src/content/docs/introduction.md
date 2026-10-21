---
title: What is yapmod
group: Start
order: 1
eyebrow: Start here
description: A free, open-source, lightweight desktop client for Yapper — built to feel native on every platform.
---

yapmod is a free, open-source desktop client for [Yapper](https://yapper.website). It gives the web app a real home on your computer — its own window, its own icon, native operating-system integration, and a growing set of ways to make it yours — without changing the Yapper you already know.

yapmod is an independent, community project. It is not made by, endorsed by, or affiliated with Yapper.

## Why yapmod exists

Yapper is a web app, and that is a perfectly good way to build one. It runs in the browser, it is consistent everywhere, and it is easy to update. Nothing about that is a problem.

The official team has since brought Yapper to the desktop as well, and they have done a good job of it. yapmod is not an attempt to replace or dismiss that work. It exists because we think the desktop experience can go further:

- **Smaller.** yapmod is built with [Tauri](https://tauri.app), which uses the webview your operating system already ships instead of bundling its own browser engine. That keeps the download and the installed footprint small.
- **Everywhere.** At the time of writing, the official desktop app does not have a macOS build. yapmod ships for Windows, macOS (Apple Silicon and Intel) and Linux from a single codebase.
- **More native.** We spend effort on what makes a desktop app feel like a desktop app: notifications, unread and mention indicators, application badges, and integration with operating-system APIs.
- **Extensible and customizable.** In the long term we want yapmod to be a platform, not just a client — a stable plugin API and a deeper theming system so you and other developers can shape how it looks and behaves.

We care about being straight with you about which of those are available today, which are being worked on, and which are still goals. [Vision and roadmap](roadmap) keeps the three apart.

## What you get today

Once yapmod is installed, that is the whole setup. From then on you have:

- **A real desktop app.** Yapper in its own native window, with its own icon and titlebar and the usual desktop shortcuts.
- **The Yapper you know.** Sign in with your existing Yapper account; your servers, channels and messages are exactly where you left them.
- **Native integration.** Desktop notifications, unread and mention indicators, and application badges — so you can keep yapmod in the background and still know when something needs you. See [Desktop integration](desktop-integration).
- **Every platform.** Windows, macOS and Linux, with the differences that matter documented.
- **A client that stays current.** Release notes, an update notice, and settings that survive updates.

## What we are building toward

yapmod should not stop at showing the Yapper website inside a window. We are building a proper desktop client, and eventually a platform others can build on. The full picture is on [Vision and roadmap](roadmap); two pieces are worth naming here:

- **Plugins.** A documented, stable API that lets developers add features, change behaviour and extend the interface, instead of every idea having to be built into the core client itself.
- **Themes.** More control over colours, typography, layout and individual components, with a clear way to create, share and apply custom themes.

Neither is finished yet. Both are central to where the project is going.

## Where to go next

- [Installing yapmod](install) — download the build for your platform.
- [Your first launch](first-launch) — sign in and find your way around.
- [What you get](features) — the experience in a little more detail.
- [How yapmod works](architecture) — what the pieces actually do.
- [Vision and roadmap](roadmap) — where the project is, and where it is heading.
