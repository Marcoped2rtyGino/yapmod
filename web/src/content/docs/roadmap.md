---
title: Vision and roadmap
group: Project
order: 1
eyebrow: Project
description: What yapmod is today, what is in progress, and where it is heading.
---

This page keeps the project's ambition honest. It separates what is available now from what is being built and what is still only a goal. As the project moves, this is the page to check for what changed status.

## The vision

Build a lightweight, cross-platform Yapper desktop client that goes beyond wrapping the web application — one that integrates naturally with the operating system and gives users and developers the freedom to shape what the experience becomes.

Everything below serves that idea. If a page in these docs describes something ambitious, the rule is simple: it should be labelled as in development or planned unless it is on the available list.

## Available now

| Capability | Notes |
| --- | --- |
| Native desktop window | Yapper in its own window, with the yapmod name and icon. |
| Windows, macOS and Linux | Including macOS builds, which the official desktop app does not currently offer. |
| Sign-in handling | Opens the Yapper login screen when you are not signed in. |
| Desktop integration | Notifications, unread and mention indicators and application badges. See [Desktop integration](desktop-integration). |
| Voice calls | Microphone access handled by the desktop app, including the macOS prompt. |
| External links | Open in your default browser. |
| Settings | A yapmod section inside Yapper's settings, saved and migrated across updates. |
| Changelog and update notice | Release notes inside the app, and a notice when a newer version exists. |
| Themes | Install a theme from a folder and it is applied to the whole app. See [Themes](themes). |
| Small package | A lightweight download, built with Tauri. See [Design decisions](design-decisions). |

## In development

These are being actively worked on. They may exist in part, or be usable already, but they are not finished and should not be relied on as stable.

| Capability | Where it stands |
| --- | --- |
| Plugin API | The interface, extension points and security model are being designed. There is no public API yet. See [Plugins](plugins). |
| Further operating-system integration | Adding more of the native behaviour a desktop app is expected to have. |

## Planned and long-term

These are directions we want to pursue. They are not commitments, and none of them is available yet.

| Direction | What it could mean |
| --- | --- |
| A stable plugin ecosystem | A documented API developers can build substantial extensions on, with versioning and migration guidance. |
| A powerful theming system | Sharing and exporting themes, and more control over typography and layout. |
| A coherent extension foundation | Plugins and themes designed together, so visual and functional extensions complement each other. |
| More native capabilities | Continued use of desktop APIs to make the client feel at home on each platform. |

## Principles

The identity behind all of the above:

- **Lightweight.** A significantly smaller install than an app that bundles a whole browser runtime — a concrete, measurable advantage.
- **Cross-platform.** Desktop support across the relevant operating systems, including macOS, with a consistent experience wherever possible.
- **Desktop-oriented.** Designed to go beyond showing a website in a window, by implementing real desktop functionality.
- **Natively integrated.** Notifications, indicators, badges and other desktop capabilities, so the client behaves like proper desktop software.
- **Extensible.** A long-term goal of a stable plugin API, so ideas do not all have to be built into the core client.
- **Customizable.** Expanding theming so users have greater control over how the app looks and feels.
- **Fluid and reliable.** Responsive and predictable, whether you use the core features or supported extensions.
- **Technically deliberate.** Tauri, Rust and the rest are explained by their actual role, without unsupported claims about performance.

## Moving forward

The project should keep getting more capable without becoming less reliable, harder to use, or harder to explain. When something here changes status, it should change here too, and the pages that describe it should follow. The goal is a documentation set that stays accurate as the app evolves, with the vision visible from the first page to the most technical guide.
