---
title: Themes
group: Customize & extend
order: 1
eyebrow: Customize & extend
description: How themes work in yapmod, and how to install and use one.
---

A theme is a folder with a small manifest and a stylesheet. yapmod applies it to the whole app: the interface of Yapper, the settings section, the dialogs and the notifications all follow it.

Themes are yours to make. yapmod ships with none, so what you see is what you bring.

## Where themes live

Every installed theme sits in its own folder inside the themes folder of the app:

| Platform | Themes folder |
| --- | --- |
| macOS | `~/Library/Application Support/io.ilyeshdz.yapmod/themes` |
| Windows | `%APPDATA%\io.ilyeshdz.yapmod\themes` |
| Linux | `~/.config/io.ilyeshdz.yapmod/themes` |

The exact path is shown in **Settings → Themes**, and the button next to it opens the folder in your file manager.

## Installing a theme

A theme is a folder, so there are two ways to install one.

- **Import it.** Press **Import theme** in the settings and pick the folder of the theme in the file dialog. The folder is copied into the themes folder for you.
- **Put it in the themes folder.** Copy the folder of the theme into the themes folder, then press **Refresh**. The theme shows up in the gallery right away.

Themes are never fetched from the internet. A theme is a few files on your disk, and only the ones in your themes folder are used.

## Using a theme

**Settings → Themes** holds the gallery.

- **Pick one** to apply it. The change is immediate, and it is remembered.
- **Remove one** with the × on its card to delete it from your themes folder.

The card of a theme is a small picture of the app, drawn from the colours of the theme itself, so it always shows what the theme really looks like. A theme that ships a picture of its own uses that instead.

The **Import theme**, **Refresh** and **Open folder** buttons sit in the top right of the section. The **Mode** setting below the gallery decides whether a theme that supports both a light and a dark version follows the system, or is pinned to one of them.

## What a theme can change

Everything, because a theme is a stylesheet. It can recolour the app, change the fonts and the roundness of things, move things around, or hide parts of the interface.

For the common case there is a set of **tokens**: named colours that yapmod maps onto the app it wraps and onto its own interface. A theme that only sets tokens stays correct when the app changes, and looks the same everywhere.

The tokens are:

| Token | What it colours |
| --- | --- |
| `--ym-bg-rail` | The narrow strip on the far left |
| `--ym-bg-side` | The sidebar next to it |
| `--ym-bg-main` | The chat and the pages |
| `--ym-bg-elev` | Cards, panels and menus |
| `--ym-bg-hover`, `--ym-bg-active` | Hovered and selected rows |
| `--ym-bg-input` | Input fields |
| `--ym-bg-float` | Popovers and floating windows |
| `--ym-text` | The text itself |
| `--ym-text-muted`, `--ym-text-faint` | Secondary and faint text |
| `--ym-border` | Hairlines and outlines |
| `--ym-accent`, `--ym-accent-hover`, `--ym-accent-soft` | The accent colour |
| `--ym-on-accent` | Text on the accent colour |
| `--ym-danger`, `--ym-success`, `--ym-warning` | The semantic colours |
| `--ym-radius` | How round corners are |
| `--ym-shadow` | The shadow of floating elements |
| `--ym-brand`, `--ym-brand-2`, `--ym-brand-3` | The colours of the yapmod logo and the release banner |

## The new look

Yapper has a second interface, called the new look, that brings a palette of its own. A theme and the new look do not mix, so the new look is switched off while a theme is applied. Going back to Yapper's own theme brings it back.

## Writing a theme

The format is a folder, a `manifest.json` and a stylesheet. [Creating a theme](creating-themes) walks through a complete example and explains what every part does.

## Related

- [Creating a theme](creating-themes) — the format, the tokens and the rules.
- [Plugins](plugins) — the other half of extending yapmod.
