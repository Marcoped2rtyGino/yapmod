---
title: Creating a theme
group: Customize & extend
order: 2
eyebrow: Customize & extend
description: The theme format of yapmod, with a complete example.
---

A theme is a folder. Inside it there is a `manifest.json` that describes the theme, and a stylesheet that does the styling. Nothing else is required, and nothing is fetched from the internet.

```
midnight-blurple/
  manifest.json
  theme.css
```

## The manifest

```json
{
  "id": "midnight-blurple",
  "name": "Midnight Blurple",
  "version": "1.0.0",
  "author": "your name",
  "description": "Cool blues on a deep navy base.",
  "license": "MIT",
  "mode": "dark",
  "tags": ["dark", "blue"],
  "api": 1
}
```

| Field | Required | What it does |
| --- | --- | --- |
| `id` | yes | The identifier of the theme. It has to match the name of the folder. |
| `name` | yes | The name that is shown in the gallery. |
| `version` | no | The version of the theme itself. |
| `author` | no | Who made it. |
| `description` | no | A line about it. |
| `license` | no | The license of the theme. |
| `mode` | no | `dark`, `light` or `both`. A theme that says `both` follows the mode setting in the app. |
| `tags` | no | Words to search the theme by. |
| `api` | no | The theme format the theme was written against. The current version is `1`. |
| `preview` | no | The name of a preview image in the folder, such as `preview.png`. Without it, the gallery draws a small picture of the app from the tokens of the theme. |
| `css` | no | The stylesheet of the theme. Defaults to `theme.css`. |

A theme that asks for a newer `api` than the app understands is refused, instead of being applied halfway.

## The stylesheet

The stylesheet is ordinary CSS, and it is added to the app after the styles of the app itself. A theme can therefore style everything, not only the colours.

There are two attributes on the root element that a theme can use:

| Attribute | What it holds |
| --- | --- |
| `data-yapmod-theme` | The id of the theme that is applied. |
| `data-yapmod-mode` | `dark` or `light`, the mode the theme is shown in. |

### The tokens

The short way to write a theme is to set the tokens. They are set for the mode, so a theme that supports both writes them twice.

```css
:root[data-yapmod-mode="dark"] {
  --ym-bg-main: #15161c;
  --ym-bg-elev: #1c1d25;
  --ym-accent: #5865f2;
  --ym-text: #ececf1;
  --ym-radius: 12px;
}

:root[data-yapmod-mode="light"] {
  --ym-bg-main: #ffffff;
  --ym-bg-elev: #f2f3f5;
  --ym-accent: #5865f2;
  --ym-text: #1d1f23;
  --ym-radius: 12px;
}
```

A token that is not set keeps the value it has, so a theme only has to name the colours it actually changes. The full list is on the [Themes](themes) page.

The tokens are mapped onto the variables of the app, so setting `--ym-bg-main` changes the background of the chat, of the settings and of the dialogs at once.

### Plain CSS

Anything the tokens do not cover is written as regular CSS. A theme can restyle a part of the interface, change the font, or move things around.

```css
:root[data-yapmod-mode="dark"] {
  --font: "Inter", ui-sans-serif, system-ui, sans-serif;
}

.message {
  border-radius: 4px;
}
```

A few things to keep in mind:

- The stylesheet is added to the page, so relative paths in `url()` point at the web app, not at your theme folder. Use a full address or a `data:` URI for images and fonts.
- The drag region at the top of the window and the scroll lock of a dialog are functional. Leave them alone.
- A theme is plain CSS, so it can break the app. When it does, pick **Yapper's theme** in the gallery to get the usual look back.

## A complete example

```css
:root[data-yapmod-mode="dark"] {
  --ym-bg-rail: #101116;
  --ym-bg-side: #16171e;
  --ym-bg-main: #1b1c23;
  --ym-bg-elev: #22232c;
  --ym-bg-hover: #292a34;
  --ym-bg-active: #33343f;
  --ym-text: #ececf1;
  --ym-text-muted: #9c9daa;
  --ym-border: #ffffff14;
  --ym-accent: #5865f2;
  --ym-accent-soft: #5865f233;
  --ym-on-accent: #ffffff;
  --ym-radius: 10px;
}

:root[data-yapmod-mode="light"] {
  --ym-bg-rail: #e3e5e8;
  --ym-bg-side: #f2f3f5;
  --ym-bg-main: #ffffff;
  --ym-bg-elev: #ebedef;
  --ym-text: #1d1f23;
  --ym-text-muted: #5b5d66;
  --ym-border: #00000017;
  --ym-accent: #5865f2;
  --ym-on-accent: #ffffff;
  --ym-radius: 10px;
}
```

## Trying it out

1. Create a folder with a `manifest.json` and a `theme.css`.
2. Open **Settings → Themes** in yapmod.
3. Press **Import theme** and pick your folder, or press **Open folder** and copy it into the themes folder.
4. Press **Refresh**, then click your theme to use it.

## Rules

- The id in the manifest has to match the folder name.
- The manifest has to be valid JSON.
- The stylesheet has to be inside the theme folder, and cannot point outside of it.
- A theme is applied as it is. There is no sandbox, and no way to run code from a theme.

## Related

- [Themes](themes) — how themes are installed and used.
- [Plugins](plugins) — the other half of extending yapmod.
