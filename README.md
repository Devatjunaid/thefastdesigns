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
wrangler.jsonc Cloudflare Workers config (static assets + redirect Worker)
src/worker.js  301 redirects: www → apex, /path → /path/
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

## Images

Article and page illustrations are drawn as HTML/CSS scenes in `scripts/scenes.cjs` (one per article, with its alt text) and rendered to optimized files in `src/images/` by Chromium:

```bash
node build.mjs
(cd public && python3 -m http.server 8787 &)
node scripts/make-images.cjs            # all images
node scripts/make-images.cjs some-slug  # just one
```

Each scene produces a 1200px WebP (article hero), a 640px WebP (cards and thumbnails, used via `srcset`) and a JPEG for social share previews. The build copies `src/images/` to `public/images/`. The local server is only used to borrow the site's QR encoder for QR illustrations.

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

## SEO data

Titles, meta descriptions, H1s, intros and worked examples for tools, the `<title>`, description and keywords for articles, and category page copy all live in `src/seo.mjs`. The build warns when a title is over 60 characters or a description is over 160.

## Adding a tool

Add an object to the right file in `src/tools/` (copy an existing one), then run `node build.mjs`. The build fails if a slug, title or description is duplicated.
