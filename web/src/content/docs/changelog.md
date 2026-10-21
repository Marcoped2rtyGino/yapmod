---
title: Changelog
group: Developers
order: 5
eyebrow: Developers
description: What changed in each release.
---

> Summarised from the commit history. The [commit log](https://github.com/ilyeshdz/yapmod/commits/main/) is the authoritative record.

## Unreleased

- Nothing yet.

## 0.3.0

- Added notification and mention badges, desktop notifications and notification sounds on Windows, macOS and Linux.
- Fixed microphone and camera permissions on macOS, so voice calls work.
- Added an update check with an update notice modal and an automatic-check setting.
- Added a changelog section to the settings page.
- Added a documentation site with full-text search.
- Fixed the previous settings panel staying visible when switching sections.
- Migrated legacy settings from older versions.
- Fixed the Linux app icon.

## 0.2.0

- Moved the pre-inject and post-inject code into their own modules.
- External links now open in the browser.
- Formatted the injection modules and backend code.

## 0.1.2

- Opens the login screen when you aren’t signed in.
- Ad-hoc signs the macOS app bundle to prevent the “damaged app” error.

## Initial setup

- Added GitHub Actions workflows for checks, builds and releases.
