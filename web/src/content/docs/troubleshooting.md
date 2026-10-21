---
title: Troubleshooting
group: Using yapmod
order: 3
eyebrow: Using yapmod
description: Fixes for the problems people hit most often.
---

Most issues come down to the operating system getting in the way rather than yapmod itself. These are the fixes that help most often.

## macOS says the app is damaged or can't be opened

Builds are ad-hoc signed, which prevents the “damaged app” error, but they are not notarized. Right-click yapmod and choose **Open**, or allow it in **System Settings → Privacy & Security**. If the error keeps coming back, download the latest release again.

## The microphone doesn't work in voice calls

On macOS, allow yapmod under **System Settings → Privacy & Security → Microphone**. macOS remembers an earlier denial, so the prompt will not reappear on its own. If yapmod is not listed there, quit the app, relaunch it and try joining a call again. As a last resort you can reset the saved decision with `tccutil reset Microphone io.ilyeshdz.yapmod` and relaunch. On Windows, also check **Settings → Privacy & security → Microphone**.

## The AppImage won't start

Make it executable with `chmod +x`. Some distributions also need FUSE installed to run AppImages.

## Links open inside the app

Recent builds open external links in your browser. Update to the latest release if yours does not.

## I'm stuck on the login screen

Sign in with your Yapper account. If that fails on the Yapper website too, the problem is on Yapper's side, not yapmod's.

## Still stuck?

[Open an issue](https://github.com/ilyeshdz/yapmod/issues) with your operating system, your yapmod version and the steps to reproduce. That is usually enough to pin down the cause.
