---
title: Installing yapmod
group: Start
order: 2
eyebrow: Start here
description: Download the build for your platform and install it.
---

Every release is published on the [Releases page](https://github.com/ilyeshdz/yapmod/releases). Pick the format that matches your computer.

| System | Formats |
| --- | --- |
| Windows | `.msi` installer, NSIS `.exe` installer, or a portable `.zip` |
| macOS | `.dmg` for Apple Silicon and Intel |
| Linux | `.deb`, `.rpm`, `.AppImage`, or a portable `.tar.gz` |

yapmod ships for all three platforms from one codebase, and the website's download section detects your system and points you straight at the right file. The download is small — see [Design decisions](design-decisions) for why.

> **macOS availability**
> At the time of writing, the official Yapper desktop app does not have a macOS build. yapmod provides macOS builds alongside Windows and Linux, so Mac users can run Yapper as a dedicated desktop app too.

## Windows

Download the `.msi` or the NSIS `.exe`, run it, and follow the installer. Prefer not to install anything? The portable `.zip` runs yapmod straight from a folder.

## macOS

Open the `.dmg` and drag yapmod into Applications.

> **First launch on macOS**
> Builds are ad-hoc signed but not notarized. On the first launch, right-click the app and choose **Open**, or allow it in **System Settings → Privacy & Security**.

## Linux

Choose the package that matches your distribution. File names vary a little between releases, so adjust the commands if needed.

```bash
# Debian, Ubuntu
sudo dpkg -i yapmod*.deb

# Fedora, openSUSE
sudo rpm -i yapmod*.rpm

# Any distribution
chmod +x yapmod*.AppImage
./yapmod*.AppImage
```

## Updating

yapmod checks for new versions and shows a notice when one is available, with a link to download it. Install the new build over the old one; your settings are kept.

## Next

Once it is installed, head to [Your first launch](first-launch).
