---
title: Installation
group: Start
order: 2
eyebrow: Start here
description: Grab the latest build from the Releases page.
---

[github.com/ilyeshdz/yapmod/releases](https://github.com/ilyeshdz/yapmod/releases).

| System | Formats |
| --- | --- |
| Windows | `.msi` installer or NSIS `.exe` |
| macOS | `.dmg` for Intel and Apple Silicon |
| Linux | `.deb`, `.rpm` or `.AppImage` |

## Windows

Download the `.msi` or the NSIS `.exe`, run it and follow the installer.

## macOS

Open the `.dmg` and drag yapmod to Applications.

> **Not notarized**
> macOS builds are ad-hoc signed but not notarized. On first launch, right-click the app and choose **Open**, or allow it in **System Settings → Privacy & Security**.

## Linux

Pick the package that matches your distribution. File names vary by release, so adjust the commands.

```bash
# Debian, Ubuntu
sudo dpkg -i yapmod*.deb

# Fedora, openSUSE
sudo rpm -i yapmod*.rpm

# Any distribution
chmod +x yapmod*.AppImage
./yapmod*.AppImage
```
