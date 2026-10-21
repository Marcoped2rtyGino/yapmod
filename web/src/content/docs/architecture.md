---
title: How yapmod works
group: How it works
order: 1
eyebrow: Under the hood
description: How the desktop window, the Yapper web app and yapmod's own additions fit together.
---

yapmod is not a rewrite of Yapper. It is a desktop shell that opens the real Yapper web app and then layers a small set of additions on top. That is the design behind everything else here: keep the app you know, and add what a desktop client needs.

You do not need any of this to use yapmod. It is for people who like to know how the thing they run actually works, and for anyone who might want to help build it.

## The three pieces

| Piece | What it is | What it does |
| --- | --- | --- |
| The shell | A native window built with [Tauri](https://tauri.app) and Rust | Creates the window, stores settings, and talks to the operating system. |
| Yapper | The real web app, loaded from yapper.website | Everything you already use: servers, channels, messages, calls. |
| The additions | A bundle of TypeScript injected into the page | Adds notifications, the settings section, the changelog, the update notice and more. |

```
┌─────────────────────────────────────────────┐
│  yapmod window  (Tauri + Rust)              │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │  Yapper web app                     │   │
│   │  + yapmod additions (injected)      │   │
│   └─────────────────────────────────────┘   │
│                                             │
│  settings · update check · release notes    │
└─────────────────────────────────────────────┘
```

The shell uses the webview your operating system already provides, rather than bundling its own browser. Tauri provides the window and the link to native functionality; Rust provides the backend where operating-system integration lives. [Design decisions](design-decisions) explains those choices and their trade-offs.

## More than a web wrapper

It would be easy to stop at “put the website in a window”. yapmod is not that. The additions and the Rust backend exist so the client can do things a plain wrapper cannot:

- **Desktop integration** that a browser tab has no access to — notifications, unread and mention indicators, and application badges.
- **Native behaviour** such as opening external links in your default browser, and granting microphone access only to Yapper itself.
- **A foundation for extensibility.** The same architecture that lets us add features is the one we want to open up, in time, to plugins and themes so that others can extend the client too.

A feature being implemented in Rust does not automatically make it faster. The point is that yapmod is being built as a desktop client in its own right, with its own native integrations, rather than pretending to be one.

## Opening the window

When you launch yapmod, the Rust side reads your saved settings and creates one webview window pointed at Yapper. It also prepares a small object with everything the additions need to know — your settings, your operating system, the current version and its release notes — and hands it to the page before Yapper starts.

A second, smaller bundle runs once the page has finished loading. It is what paints yapmod's additions onto the Yapper interface.

## The additions, in one layer

Everything yapmod adds lives in a single folder, `src-tauri/injection`, written as TypeScript and bundled into the app. The modules cover things like notifications and indicators, the settings section that holds yapmod's options and the changelog, the update notice, and the handling of external links.

Because it is one layer, the additions share the same small toolkit — a way to build elements, a store for settings, and a modal for dialogs — instead of each feature reinventing them. That shared foundation is also what a future plugin API would build on.

## When the page needs the desktop

A web page cannot save files, open a browser, or check for updates on its own. For those things the additions call back into Rust through a few commands:

- `set_settings` saves your options.
- `check_for_update` asks GitHub for the newest release.
- `get_changelog` returns the notes for every release.

Everything else stays in the page, so the boundary between Yapper and the desktop stays small and easy to follow.

## Your settings

Your preferences live in a small `config.json` in the app's config folder. yapmod reads it once when the app starts, keeps it in memory, and writes changes back in a single batch. Options you have never touched fall back to sensible defaults, and settings from older versions are folded into the current shape when the app starts.

## Links, calls and permissions

Microphone and camera access is granted only while the window is on Yapper's own domain. If the window somehow navigated elsewhere, yapmod denies the request rather than sharing your devices with an unknown page. Following a link to another site opens it in your default browser, since a desktop window has no tabs to open it in.

## Staying up to date

yapmod never updates itself. When it starts, it asks GitHub for the latest release. If that version is newer than the one you are running, you get a notice with a link to download it. The release notes ship inside the app, so the built-in changelog works even without a connection.

## Why it is built this way

Wrapping Yapper instead of forking it means you always get the latest Yapper, and yapmod only has to maintain the desktop layer. That is what keeps the app familiar, current and small enough for a community to look after — and what makes it a reasonable base for the plugins and themes we want to add later.
