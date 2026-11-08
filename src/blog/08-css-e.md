@@@
slug: css-triangles-borders-vs-clip-path
tool: css-triangle-generator
title: CSS Triangles: The Border Trick vs clip-path, Explained With Tooltips
desc: Why a zero-size element with borders draws a triangle, how to point it in eight directions, how clip-path and SVG compare, and how to build tooltip and dropdown arrows properly.
keywords: css triangle, css arrow, tooltip arrow css, border triangle, clip-path triangle, css caret
###
Tooltips, dropdown menus, speech bubbles and breadcrumb steps all need a small pointer. For more than twenty years, the standard way to draw one has been a CSS curiosity: an element with no width and no height, made entirely of borders. It looks like a hack, and it is one, but it’s a reliable and well-understood one. Modern CSS also offers cleaner alternatives.

## Why borders make triangles

Give a box thick borders in four different colors and look closely at the corners: the borders meet at a diagonal line. That diagonal is how browsers join two borders of different colors.

Now shrink the box’s width and height to zero. With no content area left, each border becomes a triangle pointing toward the center. Make three of them transparent, and a single colored triangle remains.

```
.arrow-up {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 10px solid #141414;
}
```

This triangle points up, because the visible border is the bottom one. The left and right transparent borders set the width (8 + 8 = 16px), and the bottom border sets the height (10px).

## The eight directions

| Direction | Visible border | Transparent borders |
|---|---|---|
| Up | bottom | left and right (half width each) |
| Down | top | left and right |
| Left | right | top and bottom (half height each) |
| Right | left | top and bottom |
| Top-left | top | right (full width) |
| Top-right | top | left |
| Bottom-left | bottom | right |
| Bottom-right | bottom | left |

The corner triangles (right-angled) need only two borders. Our [CSS triangle generator](/tools/css-triangle-generator/) builds all eight and gives you the matching clip-path version too.

## The clip-path alternative

```
.arrow-up {
  width: 16px;
  height: 10px;
  background: #141414;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}
```

This reads more naturally: a 16×10 box, cut into a triangle. Because it uses a background, it can be a gradient or an image.

| Aspect | Border triangle | clip-path triangle | Inline SVG |
|---|---|---|---|
| Readability | Low, needs explanation | High | High |
| Gradient fill | No | Yes | Yes |
| Border/outline on the triangle | Needs a second triangle | Needs a second shape | Native `stroke` |
| Shadow | `filter: drop-shadow()` works | Clipped; needs a wrapper | Works |
| Browser support | Every browser ever | All modern browsers | All browsers |
| Extra markup | None (pseudo-element) | None (pseudo-element) | SVG element |

For a tiny tooltip pointer, the border method and clip-path are equally good. For anything with a gradient, use clip-path. For icons, use SVG.

## Building a tooltip arrow

The pointer belongs in a pseudo-element, so you don’t add markup:

```
.tooltip { position: relative; background: #141414; color: #fff; padding: 8px 12px; border-radius: 8px; }
.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #141414;
}
```

This creates a downward pointer centered under the tooltip. Using `border: 6px solid transparent` and then coloring only one side is a compact way to write a triangle.

### Arrows with borders

If your tooltip has a 1px border, the pointer needs one too. Stack two triangles: a slightly larger one in the border color using `::before`, and the fill-colored one on top with `::after`, offset by 1px. Alternatively, use a rotated square: a small square with the same background and border as the tooltip, rotated 45° and half-hidden behind the tooltip body. Rotated squares also take shadows nicely.

## Dropdown carets and chevrons

A select-style caret (▼) can be a small border triangle, but many designs now use a chevron (an open “V”). Draw a chevron with a square that has only two borders, rotated 45°:

```
.chevron { width: 8px; height: 8px; border-right: 2px solid; border-bottom: 2px solid; transform: rotate(45deg); }
```

Rotating it to `-135deg` when the menu opens makes a smooth open/close indicator. Using `currentColor` (the default border color) means the chevron automatically matches the text color.

## Speech bubbles and breadcrumbs

- **Speech bubbles:** a rounded box plus a triangular tail from a pseudo-element, or a single clip-path polygon that includes the tail, which our [clip-path guide](/blog/css-clip-path-shapes-guide/) covers.
- **Arrow breadcrumbs:** each step uses a right-pointing triangle on its right edge and a matching notch on its left. clip-path makes this a single polygon per step: `polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)`.

## Accessibility notes

Decorative arrows should be invisible to assistive technology. Pseudo-elements with empty `content` aren’t announced, which is ideal. If you use an element or an SVG, add `aria-hidden="true"`.

Also check that pointers stay visible in Windows High Contrast (forced colors) mode, which overrides colors. Border-based triangles are drawn in system colors there and usually stay visible; clip-path shapes with backgrounds may disappear because backgrounds are removed. For important direction indicators, border triangles or SVG icons are the more robust choice.

## Sizing guidelines

| Use | Typical size |
|---|---|
| Tooltip pointer | 10–14px wide, 6–8px tall |
| Dropdown caret | 8–10px wide |
| Speech bubble tail | 16–24px |
| Breadcrumb arrow | Matches the step height, about 10–14px deep |

Pointers that are too large look clumsy and draw attention away from the content they point to.

## Summary

The border triangle works because borders meet diagonally: shrink the box to zero, hide three borders, and a triangle is left. It is still a solid choice for tiny pointers with universal support. Use clip-path when you need gradients or more readable code, rotated squares when you need borders and shadows, and SVG for icons. Pick a direction and size in the [triangle generator](/tools/css-triangle-generator/) and drop the code into a pseudo-element.

@@@
slug: styling-scrollbars-with-css
tool: scrollbar-generator
title: Styling Scrollbars With CSS: scrollbar-color vs ::-webkit-scrollbar
desc: The two ways to style scrollbars in CSS, which browsers support each, the Chrome 121 change that breaks old code, overlay scrollbars on mobile, and accessibility guidelines.
keywords: custom scrollbar css, scrollbar-color, webkit scrollbar, style scrollbar, scrollbar width css, firefox scrollbar
###
Default scrollbars are often the last unstyled element on an otherwise polished page: a grey bar that clashes with a dark sidebar or a beige brand palette. CSS can restyle them, but there are two completely different systems, and browsers changed how they interact in 2024. Here’s how to write scrollbar CSS that works everywhere.

## System 1: the standard properties

The CSS Scrollbars Styling specification defines two simple properties:

```
.panel {
  scrollbar-color: #8a6d3b #f3ecdf; /* thumb, then track */
  scrollbar-width: thin;            /* auto, thin or none */
}
```

That’s all you get: colors for the thumb and track, and a choice of normal or thin width (or hidden). No custom pixel widths, no rounded corners, no hover colors.

Firefox has supported these since version 64 (2018). Chrome and Edge added support in version 121 (early 2024). Safari has historically relied on the older WebKit approach.

## System 2: the WebKit pseudo-elements

The older, non-standard approach styles the scrollbar as a set of pseudo-elements:

```
.panel::-webkit-scrollbar { width: 10px; height: 10px; }
.panel::-webkit-scrollbar-track { background: #f3ecdf; }
.panel::-webkit-scrollbar-thumb { background: #8a6d3b; border-radius: 10px; border: 2px solid #f3ecdf; }
.panel::-webkit-scrollbar-thumb:hover { background: #141414; }
```

This gives much finer control: exact width, rounded thumbs, padding (via a border in the track color), hover states and corner styling. It works in Chrome, Edge, Safari, Opera and other WebKit/Blink browsers, but not in Firefox.

## The comparison

| Feature | scrollbar-color / scrollbar-width | ::-webkit-scrollbar |
|---|---|---|
| Standard | Yes (W3C spec) | No (vendor extension) |
| Firefox | Yes | No |
| Chrome / Edge | Yes (121+) | Yes |
| Safari | Limited / recent | Yes |
| Custom pixel width | No (auto, thin, none) | Yes |
| Rounded thumb, hover, padding | No | Yes |

## The Chrome 121 catch

Here is the change that broke many sites’ custom scrollbars: in Chromium, if an element has `scrollbar-color` or `scrollbar-width` set (other than `auto`), the `::-webkit-scrollbar` styles are **ignored** for that element. So a common “cover all browsers” snippet that sets both systems on the same selector suddenly lost its rounded, custom-width scrollbars in Chrome, falling back to the simpler standard styling.

The fix is to give the standard properties only to browsers that don’t support the WebKit pseudo-elements:

```
@supports not selector(::-webkit-scrollbar) {
  .panel { scrollbar-color: #8a6d3b #f3ecdf; scrollbar-width: thin; }
}
```

Firefox gets the standard version; WebKit and Blink browsers keep the detailed pseudo-element styling. This is the pattern our [scrollbar generator](/tools/scrollbar-generator/) outputs.

Alternatively, if you are happy with the simpler standard look, use only `scrollbar-color` and `scrollbar-width` and drop the WebKit rules. That is the most future-proof option.

## Mobile and overlay scrollbars

On iOS, Android and macOS (with the default “show scroll bars when scrolling” setting), scrollbars are *overlay* scrollbars: thin, temporary bars that appear over content while scrolling and take up no layout space. Most custom styling has little or no effect on them, which is fine; they already stay out of the way.

On Windows and Linux desktop browsers, classic scrollbars take up space (usually around 15–17px) next to content. This has a layout consequence: `100vw` includes the scrollbar width, so a `width: 100vw` element causes horizontal scrolling. Use `width: 100%` instead, or reserve space consistently with `scrollbar-gutter: stable`, which prevents the layout from shifting when content grows long enough to need a scrollbar.

## Hiding scrollbars

Sometimes you want scrolling without a visible bar, for example in a horizontal carousel:

```
.carousel { scrollbar-width: none; }
.carousel::-webkit-scrollbar { display: none; }
```

Use this carefully. A visible scrollbar tells users that more content exists and how much. If you hide it, provide another cue: arrow buttons, partially visible next items, or dots.

## Accessibility guidelines

- **Contrast:** the thumb should be clearly visible against the track. WCAG’s 3:1 non-text contrast guideline is a sensible target for anything users need to see to operate.
- **Size:** very thin scrollbars (under about 8px) are hard to grab with a mouse, especially for people with tremors or reduced dexterity. If you go thin, make the thumb wider on hover.
- **Don’t hide scrollbars on content users need to know is scrollable.**
- **Forced colors:** in Windows High Contrast mode, browsers use system colors for scrollbars. Don’t fight this.
- **Keyboard scrolling** must still work. Scrollable regions that aren’t focusable may need `tabindex="0"` so keyboard users can scroll them, and an accessible name if they are significant regions.

## Design tips

| Context | Suggested style |
|---|---|
| Light page | Track transparent or very light tint, thumb a mid-tone neutral |
| Dark sidebar or code block | Dark track, thumb a lighter grey with hover brightening |
| Brand accent | Thumb in a muted version of your brand color, not the full saturation |
| Dense data tables | Keep standard width for easy grabbing |

Style scrollbars inside components (sidebars, chat panels, code blocks, modals) rather than the whole page if you want the effect to stay subtle. Many users are used to their system’s page scrollbar.

## Summary

There are two scrollbar styling systems: the simple standard `scrollbar-color` and `scrollbar-width`, and the detailed but non-standard `::-webkit-scrollbar` pseudo-elements. Since Chrome 121, setting the standard properties disables the WebKit ones in Chromium, so wrap the standard properties in `@supports not selector(::-webkit-scrollbar)`. Keep scrollbars visible and grabbable, and generate tested code with the [scrollbar generator](/tools/scrollbar-generator/).

@@@
slug: css-minification-explained
tool: css-minifier
title: CSS Minification Explained: What It Removes and How Much It Really Saves
desc: What CSS minifiers remove, real-world savings with and without gzip or Brotli, why removing unused CSS matters more, critical CSS, and how minify compares with beautify and build tools.
keywords: css minifier, minify css, compress css, css file size, gzip brotli css, unused css
###
Minifying CSS is one of the oldest performance tips on the web, and it is still part of every production build. But it is often misunderstood. Minification alone saves less than many people expect, and it is not the biggest lever for CSS performance. Here’s what actually happens and where the real savings come from.

## What a minifier removes

A minifier rewrites your CSS into the smallest equivalent text. Typical changes:

| Before | After | What changed |
|---|---|---|
| `/* Card styles */` | (removed) | Comments |
| `padding : 24px ;` | `padding:24px` | Spaces and the last semicolon in a rule |
| Line breaks and indentation | (removed) | Whitespace |
| `0.5em` | `.5em` | Leading zero |
| `margin: 0px` | `margin:0` | Unit on zero lengths |
| `#ffffff` | `#fff` | Color shorthand (advanced minifiers) |
| Two identical rules | One rule | Merging (advanced minifiers) |

The browser parses minified and unminified CSS identically. Minification never changes how the page looks, as long as the minifier is correct. Strings (for example `content: "  "`) and some whitespace, like the space in `calc(100% - 20px)`, must be preserved; removing the spaces around `-` there would break the calculation.

Our [CSS minifier](/tools/css-minifier/) protects strings, keeps `/*! ... */` license comments if you want, and also works in reverse as a beautifier.

## How much does it save?

For a typical hand-written, commented stylesheet, minification removes roughly **15–30%** of the bytes. Heavily commented files can shrink more.

But browsers don’t download raw CSS; servers compress it with **gzip** or **Brotli**. Compression is very good at squeezing repetitive text, including whitespace. Once compression is applied, the extra benefit of minification is much smaller.

| Stage | Example size | Notes |
|---|---|---|
| Original stylesheet | 100 KB | With comments and indentation |
| Minified | ~75 KB | About 25% smaller |
| Original + gzip | ~20 KB | Compression does most of the work |
| Minified + gzip | ~17 KB | Minification saves a few more KB |
| Minified + Brotli | ~15 KB | Brotli typically beats gzip by 15–20% on text |

The numbers vary by file, but the pattern holds: compression delivers the big win, and minification adds a smaller, still worthwhile, improvement. Make sure your server or CDN actually compresses CSS. Cloudflare, Netlify, Vercel and most modern hosts do it automatically.

## The bigger lever: unused CSS

Large sites often ship CSS that no page uses: styles from removed features, an entire framework when only a fraction of its classes appear, or legacy themes. Tools like Chrome DevTools’ Coverage panel show what percentage of a stylesheet is unused on a page; numbers of 50–90% are common on sites built on big frameworks.

Removing dead rules saves far more than squeezing whitespace. Utility-first frameworks like Tailwind CSS address this by generating only the classes your templates actually use, which is why their production CSS is often only 10–30 KB.

## Critical CSS and render blocking

CSS is render-blocking: the browser won’t paint the page until it has downloaded and parsed the stylesheets in the `<head>`. Two techniques help:

- **Keep the stylesheet small**, so it arrives quickly.
- **Inline critical CSS:** put the styles needed for the above-the-fold content directly in the HTML and load the rest normally. This is most useful for large sites; for small, fast sites, a single small external stylesheet that the browser caches across pages is often simpler and just as quick.

## Minify versus beautify

| Task | Use |
|---|---|
| Preparing CSS for production | Minify |
| Reading CSS from a third-party theme or a live site | Beautify |
| Code review and version control | Keep the original, readable source |
| Debugging a minified file in production | Use source maps or beautify a copy |

Never edit minified files by hand. Keep your readable source in version control and regenerate the minified version.

## Build tools versus online minifiers

For one-off files, quick checks or small static sites, an online minifier is perfectly adequate. For ongoing projects, minification belongs in the build step:

| Tool | Notes |
|---|---|
| Lightning CSS | Very fast (written in Rust); also handles vendor prefixes and modern syntax lowering |
| cssnano | Popular PostCSS plugin with many optimisations |
| esbuild | Fast bundler with built-in CSS minification |
| Vite, Next.js, Astro | Minify CSS automatically in production builds |

Advanced tools also merge duplicate rules, shorten colors and remove overridden declarations, which simple whitespace minifiers don’t attempt. They do it safely because they parse CSS into a full syntax tree.

## A checklist for fast CSS

1. Remove unused CSS (check DevTools Coverage).
2. Serve with Brotli or gzip compression.
3. Minify in your build step.
4. Cache stylesheets with long cache lifetimes and versioned filenames.
5. Avoid `@import` chains inside CSS, which load files sequentially.
6. Consider inlining critical CSS on large, image-heavy pages.

## Summary

Minification strips comments, whitespace and redundant characters, saving around 15–30% of raw size, but compression does most of the heavy lifting over the network, and removing unused CSS usually saves the most of all. Minify as part of a sensible pipeline, keep your readable source, and use a beautifier when you need to read someone else’s compressed code. For related wins, see our guide to [SVG optimization](/blog/svg-optimization-guide/), which follows the same principles for vector graphics.

@@@
slug: how-to-resize-images-for-the-web
tool: image-resizer
title: How to Resize Images for the Web: Sizes, Retina, srcset and Quality
desc: Choose the right pixel dimensions for web images, understand 2x Retina assets, use srcset and sizes, avoid quality loss when resizing, and see how resizing affects page speed.
keywords: resize images for web, image size for website, retina images, srcset sizes, image dimensions, optimize images
###
The most common cause of a slow website is not code. It’s images that are far bigger than they need to be. A photo straight from a phone is typically 4000 × 3000 pixels and 3–6 MB. On a web page it might be displayed 800 pixels wide. That means the browser downloads over twenty times more pixels than it can show, then throws them away. Resizing is the first and most effective image optimization, before compression or format choice.

## Pixels are what count

File size grows roughly with the number of pixels. Halving the width and height of an image removes three quarters of its pixels:

| Dimensions | Pixels | Relative pixel count |
|---|---|---|
| 4000 × 3000 | 12,000,000 | 100% |
| 2000 × 1500 | 3,000,000 | 25% |
| 1600 × 1200 | 1,920,000 | 16% |
| 1000 × 750 | 750,000 | 6% |

Compression settings and formats matter, but nothing reduces weight as dramatically as not sending pixels nobody sees.

## Find the display size

To choose a size, find the largest width at which the image is actually displayed. Right-click the image in your browser, inspect it, and look at its rendered width in CSS pixels. A blog layout with a 760px content column displays images at up to 760px; a full-width hero on a large desktop might be 1920px or more.

## Account for high-density screens

Most phones and many laptops have a device pixel ratio (DPR) of 2 or 3, meaning each CSS pixel is drawn with 2×2 or 3×3 physical pixels. An image displayed at 760 CSS pixels needs about 1520 pixels of width to look perfectly sharp on a 2x screen.

| Display width (CSS px) | 1x asset | 2x asset | 3x asset |
|---|---|---|---|
| 360 (phone, full width) | 360 | 720 | 1080 |
| 760 (article column) | 760 | 1520 | 2280 |
| 1280 (wide hero) | 1280 | 2560 | 3840 |

For photos, 2x is usually the sweet spot. The visible gain from 3x photographs is small, and the file size cost is large. For logos and icons, use SVG instead, which is sharp at any density. You can check your own screen’s DPR with our [screen resolution checker](/tools/screen-resolution-checker/).

## Serve the right size to each device: srcset

A single 2x image is too heavy for small phones and possibly too small for large desktops. HTML’s responsive image attributes let the browser choose:

```
<img
  src="photo-1280.webp"
  srcset="photo-640.webp 640w, photo-1280.webp 1280w, photo-1920.webp 1920w"
  sizes="(max-width: 800px) 100vw, 760px"
  width="1280" height="853"
  alt="Team at work in the studio">
```

- `srcset` lists the available files and their widths.
- `sizes` tells the browser how wide the image will be displayed at different screen sizes.
- The browser combines that with the device’s DPR and picks the smallest file that looks sharp.

Three widths (for example 640, 1280 and 1920) cover most layouts well. Always include `width` and `height` attributes (or CSS `aspect-ratio`) so the browser reserves space and the page doesn’t jump as images load. We explain why in our article on [layout shift and placeholder images](/blog/placeholder-images-and-layout-shift/).

## Quality when resizing

**Downscaling** (making images smaller) keeps them sharp, as long as the software uses good resampling. Browsers’ canvas drawing with `imageSmoothingQuality = "high"` and design tools like Photoshop use resampling filters that average neighbouring pixels to avoid jagged edges and shimmering patterns.

**Upscaling** (making images larger) can’t add detail that isn’t there. A 600px image stretched to 1200px looks soft. AI upscalers can invent plausible detail, but for professional work, start with a large enough original.

A few practical rules:

- Resize from the original, not from an already-reduced copy.
- Crop before resizing, so you keep as many useful pixels as possible.
- Keep an untouched original; resizing down is destructive.

## Resizing versus compressing versus converting

| Step | What it does | Typical saving on a phone photo |
|---|---|---|
| Resize 4000px → 1600px | Removes pixels | 70–85% |
| Compress (quality 75–80) | Removes detail you can’t see | Another 30–60% |
| Convert JPEG → WebP | More efficient encoding | Another 25–35% |

Combined, a 4 MB photo often ends up at 150–250 KB with no visible difference at its display size. Resize first, then [compress](/blog/image-compression-lossy-vs-lossless/), and choose the right [format](/blog/jpg-vs-png-vs-webp-vs-avif/).

## Common target sizes

| Use | Suggested width |
|---|---|
| Full-width hero (desktop) | 1920–2560px |
| Blog or article image | 1200–1600px |
| Product image with zoom | 2000px+ |
| Thumbnail or card | 400–800px |
| Email newsletter image | 600–1200px (displayed at 600) |
| Open Graph link preview | 1200 × 630px |

For social platforms, each network has its own sizes; see our [social media image sizes guide](/blog/social-media-image-sizes-guide/).

## How resizing helps SEO

Google’s Core Web Vitals include Largest Contentful Paint (LCP), which is often an image. Smaller files load faster, improving LCP and the overall experience. Lighthouse and PageSpeed Insights flag “Properly size images” when you serve images much larger than their display size.

## Summary

Find the display size, multiply by two for high-density screens, and resize to that before you compress. Provide a few widths with `srcset` and `sizes` so every device gets an appropriate file, and always set width and height. Our [image resizer](/tools/image-resizer/) does the resizing in your browser with high-quality smoothing, without uploading your photos anywhere.
