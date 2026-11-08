# TheFastDesigns

39 free, fast and private design tools for **thefastdesigns.online**. Everything runs in the browser with plain HTML, CSS and vanilla JavaScript, so there are no frameworks, external APIs, trackers or uploads.

## Structure

```
src/
  assets/      style.css, app.js (shared helpers), icons / OG image
  lib.mjs      HTML control helpers, icons, logo SVG
  tools/       tool definitions by category (color, css, image, gen, calc)
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

## Adding a tool

Add an object to the right file in `src/tools/` (copy an existing one), then run `node build.mjs`. The build fails if a slug, title or description is duplicated.
