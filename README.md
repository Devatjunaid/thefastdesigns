# TheFastDesigns

69 free, fast and private design tools and 69 in-depth guides for **thefastdesigns.online**. Everything runs in the browser with plain HTML, CSS and vanilla JavaScript, so there are no frameworks, external APIs, trackers or uploads.

## Structure

```
src/
  assets/      style.css, app.js (shared helpers), icons / OG image
  lib.mjs      HTML control helpers, icons, logo SVG
  md.mjs       tiny Markdown converter for blog articles
  extra.mjs    "tips and best practices" for the original tools
  tools/       tool definitions by category
  blog/        articles in Markdown, several per file, separated by @@@
build.mjs      static site generator → writes ./public
public/        generated site (committed, ready to deploy)
wrangler.jsonc Cloudflare Workers static-assets config
```

Each tool definition contains its SEO title, meta description, keywords, UI markup, browser script, how-to steps, about text and FAQ. The build generates one page per tool at `/tools/<slug>/` with canonical URLs, Open Graph tags and JSON-LD (WebApplication, BreadcrumbList, HowTo, FAQPage). It also writes `sitemap.xml`, `robots.txt`, `_headers` and `404.html`.

## Build

```bash
node build.mjs
```

Requires Node 18+ and has no dependencies. Run it after editing anything in `src/`, then commit `public/`.

## Deploy on Cloudflare

**Workers (recommended):** connect the repo in Cloudflare → Workers & Pages → Create → Import a repository. Leave the build command empty (or use `node build.mjs`). Keep the deploy command as `npx wrangler deploy`. `wrangler.jsonc` serves `./public`.

**Pages:** build command `node build.mjs` (or empty), build output directory `public`.

Then add the custom domain `thefastdesigns.online`.

## Writing a blog article

Add a block to any file in `src/blog/`:

```
@@@
slug: my-article-slug
tool: color-converter
title: Article title
desc: Meta description
keywords: comma, separated, keywords
###
Markdown body with ## headings, tables, lists and [links](/tools/color-converter/).
```

`tool` must be an existing tool slug, because the article is linked from that tool's page. The build warns about broken internal links and about articles under 900 words.

## Adding a tool

Add an object to the right file in `src/tools/` (copy an existing one), then run `node build.mjs`. The build fails if a slug, title or description is duplicated.
