---
title: Desktop integration
group: Using yapmod
order: 2
eyebrow: Using yapmod
description: How yapmod behaves like a real desktop app — notifications, unread indicators, mentions and badges.
---

A desktop application is not defined only by having its own window. It is defined by how well it works with the rest of your computer. yapmod focuses on the integrations people expect from desktop software, so you can leave it running in the background and still know when something needs you.

## Desktop notifications

When a message or mention arrives, yapmod can show a notification through your operating system, wherever you are on your computer.

- **Why it matters.** You should not have to keep yapmod in the foreground to follow a conversation. Close the window or switch to another app and notifications still reach you.
- **Sound.** Notifications can play a sound, so you can notice them without watching the screen.
- **Platforms.** Windows, macOS and Linux.
- **Control.** You can adjust how yapmod notifies you from its settings section.

## Unread indicators

Unread messages are marked inside the app, on the servers and channels where they arrived, so you can see at a glance where the activity is.

- **Why it matters.** It turns a wall of channels into a quick scan: you immediately see what is new and what you have already read.
- **Platforms.** All supported platforms.

## Mention indicators

When someone mentions you, the activity is called out separately from ordinary unread messages.

- **Why it matters.** Mentions usually need a reply. Marking them apart from everything else means you can find the messages that are actually directed at you.
- **Platforms.** All supported platforms.

## Application badges

Where your operating system supports it, yapmod can show an unread or activity indicator on its icon — on the taskbar, the Dock or the panel — so you can see that something is waiting without opening the app.

- **Why it matters.** It is the quietest possible signal: a glance at your taskbar or Dock tells you whether you need to come back.
- **Platforms.** Depends on operating-system support. Where a badge is not available, yapmod uses the closest equivalent it can.

## Native integration

Beyond notifications and badges, we want yapmod to use the desktop APIs that a browser tab cannot — the ones that make an app feel like it belongs on your machine. Some of these are already in place; others are on the roadmap.

> **A note on platform differences**
> Some integrations depend on operating-system APIs that behave differently on Windows, macOS and Linux. Where a feature cannot behave identically everywhere, we implement the best available alternative and say so here rather than pretending the platforms are the same.

## What is not here yet

The list above is what yapmod does today. The larger vision — plugins, a deeper theming system and further operating-system integration — is tracked on [Vision and roadmap](roadmap), clearly separated from what is shipped.
