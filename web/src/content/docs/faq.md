---
title: FAQ
group: Using yapmod
order: 4
eyebrow: Using yapmod
description: Short answers to the questions people ask most.
---

### Is yapmod official?

No. It is an independent, community-made client and is not affiliated with Yapper.

### Do I need a Yapper account?

Yes. yapmod is a client for Yapper, so you sign in with your existing Yapper account.

### Is it free?

Yes. yapmod is open source and the whole codebase is public.

### How is it different from the official desktop app?

The official team has built a good desktop app, and yapmod does not exist to replace it. yapmod focuses on being lightweight, on supporting macOS, which the official desktop app does not currently offer, and on going further with native integration, customization and extensibility. See [What is yapmod](introduction) and [Vision and roadmap](roadmap).

### Is it just the website in a window?

No. yapmod genuinely operates as a desktop client and adds functionality a browser tab cannot — notifications, unread and mention indicators, application badges, and operating-system integration. [How yapmod works](architecture) explains the architecture.

### Why is it so small?

yapmod is built with Tauri, which uses the webview your operating system already ships instead of bundling its own browser. That keeps the package small. [Design decisions](design-decisions) has the details.

### Does it use less memory than other clients?

Not necessarily, and we do not claim it does. A smaller package does not guarantee lower memory use or better performance. See [Design decisions](design-decisions).

### Can I install plugins or custom themes yet?

Themes, yes. A theme is a folder with a manifest and a stylesheet, and you install it yourself from **Settings → Themes**. See [Themes](themes) and [Creating a theme](creating-themes).

Plugins are not there yet. The interface, extension points and security model are still being designed, and there is no public API. See [Plugins](plugins).

### Which version should I use?

The latest release. yapmod is early, and older builds do not get fixes.

### Does yapmod update itself?

No. It tells you when a newer version exists and links you to the download. Install it over the old build, and your settings are kept.

### Where can I talk to people?

Join the official Yapper server: [yapper.website/invite/develop](https://yapper.website/invite/develop).
