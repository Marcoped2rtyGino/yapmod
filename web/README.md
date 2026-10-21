# yapmod website

The marketing site for [yapmod](https://github.com/ilyeshdz/yapmod), built with
[Astro](https://astro.build).

## Commands

| Command           | Action                                              |
| ----------------- | --------------------------------------------------- |
| `pnpm install`    | Install dependencies                                |
| `pnpm dev`        | Start the dev server on `localhost:4321`            |
| `pnpm build`      | Build the static site to `dist/`                    |
| `pnpm preview`    | Preview the production build locally                |
| `pnpm check`      | Type-check the Astro components                     |

## Structure

```
src/
├── assets/        # Images processed by Astro's asset pipeline
├── components/    # Nav, Hero, Features, Download, Build, Community, Footer
│   └── docs/      # DocsHeader, DocsSidebar, DocsToc, PrevNext, SearchPalette
├── content/docs/  # The documentation, one Markdown file per page
├── layouts/       # BaseLayout.astro — <head>, fonts, theme bootstrap
├── lib/           # Docs helpers, the search index and the release lookup
├── pages/         # index.astro — the landing page, docs/ — the documentation
└── styles/        # global.css — the design system, docs.css — the docs page
```

`src/styles/global.css` holds the whole design system: the light/dark theme
tokens, the layout primitives, and the responsive rules. Everything else is
plain markup in the components.

## Documentation

The docs live in `src/content/docs` as Markdown. Every page has a bit of
frontmatter:

```yaml
---
title: Installation
group: Start # the sidebar section
order: 2 # the position inside that section
eyebrow: Start here
description: Grab the latest build from the Releases page.
---
```

`src/content.config.ts` defines the collection, `src/lib/docs.ts` sorts the
pages into the sidebar and builds their URLs, and
`src/pages/docs/[...slug].astro` turns each page into a route.

Search uses a small JSON index that is generated at build time
(`src/pages/docs/search-index.json.ts`) and queried in the browser. Press
`Cmd+K` (`Ctrl+K`) anywhere on a docs page to open the search palette.

## Theming

Colors live in CSS custom properties on `:root`:

- The dark theme is the default set of values.
- The light theme is applied through `prefers-color-scheme` and can be forced
  with `data-theme="light"` / `data-theme="dark"` on `<html>`.
- The toggle in the nav writes the choice to `localStorage` under
  `yapmod-theme`, and a small inline script in `<head>` applies it before first
  paint so there is no flash of the wrong theme.

## Deployment

`../.github/workflows/web.yml` builds the site and publishes it to GitHub Pages
on every push to `main` that touches `web/`.

The deployed location is set in `astro.config.mjs`:

- `site` — the origin the site is served from.
- `base` — the path prefix. It is `/yapmod` for GitHub Pages project sites.

Update both if the site is hosted elsewhere (a custom domain, Netlify, Vercel,
Cloudflare Pages, …).
