---
title: Troubleshooting
group: Using yapmod
order: 2
eyebrow: Using yapmod
description: Fixes for the problems people hit most often.
---

## macOS says the app is damaged or can’t be opened

Builds are ad-hoc signed, which prevents the “damaged app” error, but they aren’t notarized. Right-click yapmod and choose **Open**, or allow it in **System Settings → Privacy & Security**. If the error persists, download the latest release again.

## The microphone doesn’t work in voice calls

On macOS, allow yapmod under **System Settings → Privacy & Security → Microphone**. macOS remembers an earlier denial, so the prompt won’t appear again on its own. If yapmod isn’t listed, quit the app, relaunch it and try joining a call again. As a last resort, reset the cached decision with `tccutil reset Microphone io.ilyeshdz.yapmod` and relaunch. On Windows, also check **Settings → Privacy & security → Microphone**.

## The AppImage won’t start

Make it executable with `chmod +x`. Some distributions also need FUSE installed to run AppImages.

## Links open inside the app

Recent builds open external links in your browser. Update to the latest release.

## I’m stuck on the login screen

Sign in with your Yapper account. If that fails on the Yapper website too, the problem is on Yapper’s side.

## Still stuck?

Open an [issue](https://github.com/ilyeshdz/yapmod/issues) with your operating system, your yapmod version and the steps to reproduce.
