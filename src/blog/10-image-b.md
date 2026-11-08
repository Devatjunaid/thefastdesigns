@@@
slug: exif-orientation-rotated-photos
tool: rotate-flip-image
title: Why Photos Appear Sideways: EXIF Orientation, Rotating and Mirroring Explained
desc: Why the same photo can look upright on your phone and sideways elsewhere, how the EXIF orientation tag works, lossless vs lossy rotation, and when flipping an image is a good idea.
keywords: photo sideways, exif orientation, rotate image, flip image, mirror image, image rotated wrong
###
You take a photo in portrait mode, it looks fine on your phone, and then it appears sideways when you upload it to a website or open it on an old computer. The image isn’t broken. It’s stored sideways on purpose, with a small note telling software how to turn it upright. Not every program reads that note.

## How cameras record rotation

A phone’s camera sensor has a fixed orientation, usually landscape. When you hold the phone upright, the sensor still captures the image sideways. Rotating millions of pixels on every shot would take time and battery, so most cameras save the pixels as captured and add an **orientation tag** to the photo’s EXIF metadata. The tag says, in effect, “rotate this 90° clockwise before showing it”.

The EXIF orientation tag has eight possible values:

| Value | Meaning |
|---|---|
| 1 | Normal, no change needed |
| 2 | Mirrored horizontally |
| 3 | Rotated 180° |
| 4 | Mirrored vertically |
| 5 | Mirrored horizontally, then rotated 270° clockwise |
| 6 | Rotated 90° clockwise |
| 7 | Mirrored horizontally, then rotated 90° clockwise |
| 8 | Rotated 270° clockwise (90° counter-clockwise) |

Values 1, 3, 6 and 8 cover almost all real photos. The mirrored values mostly come from front-facing cameras and some scanners.

## Why it looks right in one place and wrong in another

Software that reads the tag displays the photo upright. Software that ignores it shows the raw pixels, sideways. Over the years, support has improved a lot:

- Modern browsers respect EXIF orientation for images by default (the CSS `image-orientation: from-image` behaviour), which became consistent across major browsers around 2020.
- Phone galleries, macOS and Windows photo viewers handle it.
- Older software, some content management systems, image processing scripts and many email and chat tools strip the metadata or ignore it.

The worst case is when a tool **removes the metadata without rotating the pixels**. The orientation note is gone, the pixels are still sideways, and now every program shows it sideways. This is a common side effect of privacy tools and compression scripts. Our [EXIF remover](/tools/exif-remover/) detects a rotation flag and re-encodes such photos upright for exactly this reason.

## The permanent fix: rotate the pixels

The reliable solution is to rotate the actual pixels and set the orientation to “normal”. Then the image looks the same everywhere, with or without metadata. Our [rotate and flip tool](/tools/rotate-flip-image/) draws the image onto a canvas in its displayed orientation and exports it, so the result is always stored upright.

## Lossless versus lossy rotation

| File type | Rotating 90° steps | Notes |
|---|---|---|
| PNG, lossless WebP | Lossless | Pixels are moved, not recompressed lossily |
| JPEG (re-encoded) | Slight quality loss | The image is decoded, rotated and compressed again |
| JPEG (lossless transform with jpegtran or similar) | Lossless | Rotates the compressed 8×8 blocks directly; edges may need trimming if dimensions aren’t multiples of 8 or 16 |
| Any format, rotating by non-90° angles | Always resampled | Pixels must be interpolated, which softens the image slightly |

For everyday use, re-encoding a JPEG at high quality (90–95) after rotation is practically invisible. If you rotate the same JPEG back and forth many times, though, quality degrades with each save, so rotate once from the original. For a perfectly lossless result, export PNG.

## Flipping: when and why

Flipping (mirroring) is different from rotating: it reverses the image left to right or top to bottom. It has real design uses:

- **Directing attention.** People in photos draw the viewer’s eye in the direction they face. Flipping a portrait so the person looks *into* the page, toward the headline, keeps attention on your content.
- **Fixing selfies.** Front cameras often preview a mirrored image; some save it mirrored too. Flipping restores the real-world orientation, which matters if the photo contains text or a logo.
- **Layout balance.** A product shot facing left may fit a right-aligned layout better when mirrored.

When not to flip:

- **Anything with text, logos, numbers or signage**, which become obviously backwards.
- **Recognisable people or places** in documentary or news contexts, where mirroring misrepresents reality.
- **Faces in portraits that people know well.** Most faces aren’t symmetrical, and a mirrored version of someone you know looks subtly odd. (Interestingly, people often prefer the mirrored version of their *own* face, because it’s what they see in the mirror.)

## Rotating in CSS versus rotating the file

On a website, `transform: rotate(90deg)` turns an element visually, and `scale(-1, 1)` mirrors it. That’s fine for interface effects, icons and animations. But it doesn’t fix the underlying file, and rotating a landscape image with CSS doesn’t change the space it occupies in the layout, which can cause overlaps. For photos, rotate the file. Our [CSS transforms guide](/blog/css-transforms-explained/) covers the CSS side.

## Straightening small tilts

Rotation in 90° steps fixes sideways photos. A slightly tilted horizon needs a small rotation, like 1.5°, followed by a crop to remove the angled corners. Small rotations always resample the image slightly, so do them once, on the original, and crop afterwards with an [image cropper](/tools/image-cropper/).

## A practical checklist

1. If a photo looks sideways somewhere, it probably relies on an EXIF orientation tag.
2. Rotate the pixels permanently and save; don’t just strip metadata.
3. Export PNG for a lossless result, or high-quality JPEG for photos you will share.
4. Flip only images without text and where mirroring doesn’t misrepresent reality.
5. Keep the original file.

## Summary

Photos appear sideways because cameras store pixels as captured and rely on an EXIF orientation tag to display them upright. When software ignores or strips that tag, the image turns. The permanent fix is to rotate the pixels themselves. Flipping is a separate, creative tool for directing attention, best avoided whenever text or real-world accuracy matters.

@@@
slug: base64-images-data-uris-when-to-use
tool: image-to-base64
title: Base64 Images and Data URIs: When Inlining Helps and When It Hurts
desc: How Base64 encoding works, why it makes files 33% larger, when data URIs speed up a page and when they slow it down, and better options for SVG, email and CSS backgrounds.
keywords: image to base64, data uri, base64 image, inline images, base64 css background, embed image html
###
A data URI lets you put an image directly inside your HTML or CSS instead of linking to a separate file. It looks like this: `data:image/png;base64,iVBORw0KGgo…`. Developers have used the technique since the late 2000s to save HTTP requests. It can genuinely help in the right place, and it can quietly slow a site down in the wrong one.

## What Base64 is

Images are binary data: sequences of bytes that can contain any value. HTML and CSS are text. Base64 is a way of writing binary data using only 64 safe text characters: A–Z, a–z, 0–9, `+` and `/` (with `=` for padding).

It works by taking every 3 bytes (24 bits) of input and writing them as 4 characters of 6 bits each. That fixed 3-to-4 ratio is why **Base64 is always about 33% larger** than the original file. A 6 KB PNG becomes about 8 KB of Base64 text.

A data URI wraps that text with a media type:

```
data:[media type][;base64],[data]
```

So `data:image/webp;base64,UklGR…` is a WebP image, inline.

## Where data URIs help

**Very small images.** For a 1–2 KB icon, the overhead of a separate HTTP request (headers, round trips, connection handling) can outweigh the 33% size penalty. Inlining saves that request.

**Self-contained documents.** A single HTML file with all images inline can be emailed, archived or opened offline without missing pictures. Many export tools produce reports this way.

**Critical above-the-fold placeholders.** A tiny blurred preview (often under 1 KB) inlined in the HTML can show instantly while the real image loads, a technique used by many image-heavy sites.

**Avoiding cross-origin issues** in some canvas and testing scenarios, where an inline image is treated as same-origin.

## Where they hurt

**Larger images.** A 100 KB photo becomes 133 KB, and that text is now part of the HTML or CSS file that must be downloaded and parsed before the page can render.

**Caching.** A separate image file can be cached once and reused across many pages. An image inlined in every HTML page is downloaded again with every page. If the image is in your CSS, any change to the CSS invalidates the whole file, image included.

**Render blocking.** CSS blocks rendering. Stuffing large images into a stylesheet delays the first paint of the entire page.

**HTTP/2 and HTTP/3.** Modern protocols multiplex many requests over one connection, which makes extra requests much cheaper than they were in the HTTP/1.1 era, when data URIs were most popular. The main argument for inlining has weakened.

## A practical comparison

| Approach | Extra request | Size overhead | Cacheable separately | Best for |
|---|---|---|---|---|
| Normal image file | Yes | None | Yes | Most images |
| Base64 data URI | No | +33% | No | Tiny icons, single-file documents |
| URL-encoded SVG data URI | No | Small (often smaller than Base64) | No | Small SVG icons in CSS |
| Inline `<svg>` in HTML | No | None | No | Icons you want to style with CSS |
| SVG sprite file | One for all icons | None | Yes | Icon sets on large sites |

A good rule of thumb: inline images under about 5–10 KB at most, and only if they’re used in one place.

## SVG doesn’t need Base64

SVG is already text. You can put it in a data URI with URL encoding instead of Base64:

```
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E…%3C/svg%3E");
```

This is usually smaller than Base64 and stays partly readable. Even better, for icons in HTML, paste the `<svg>` element inline, where it can inherit color with `currentColor`. Optimise the SVG first; our [SVG optimization guide](/blog/svg-optimization-guide/) explains how.

## Data URIs in email

Email is where people most often try Base64 images, and where they most often fail. Support varies a lot between clients: several popular clients, including Gmail on the web, don’t display data URI images in the HTML body, and some spam filters treat large Base64 blocks with suspicion. For newsletters, host images on a server and link to them, or use attachments referenced with Content-ID (CID) headers. Always test in real clients.

## Security notes

Data URIs are just another way to deliver content, so they deserve the same caution:

- Browsers block top-level navigation to `data:` URLs (for example from a link) because they were abused for phishing.
- Content Security Policy (CSP) controls whether data URIs are allowed for images with the `img-src data:` directive.
- Never inline untrusted SVG, which can contain scripts if rendered as a document.

## Base64 in JSON and APIs

Base64 also appears outside HTML and CSS. APIs sometimes return images as Base64 strings inside JSON, and some upload forms send them that way. That works for small thumbnails, but it has the same 33% overhead, and large Base64 strings make JSON slow to parse and hard to cache. For anything beyond small images, APIs usually return a URL to the image instead, or use multipart uploads that send the binary file directly.

| Situation | Better approach |
|---|---|
| Profile thumbnail in an API response | Small Base64 is acceptable; a URL is still cleaner |
| Full-size photo upload | Multipart form upload of the binary file |
| Images stored in a database | Store files in object storage; keep URLs in the database |
| Email templates | Hosted images or CID attachments |

## Decoding Base64 back to an image

Sometimes you have a Base64 string, from an API response, a database or a stylesheet, and need the actual image. Paste it into a decoder that detects the file type from its first bytes: PNG data starts with `iVBOR`, JPEG with `/9j/`, GIF with `R0lG` and WebP with `UklG`. Our [image to Base64 converter](/tools/image-to-base64/) works in both directions, entirely in your browser.

## Summary

Base64 turns binary images into text so they can live inside HTML, CSS or JSON, at the cost of about 33% extra size and losing separate caching. Inline only tiny images used in one place, use URL-encoded or inline SVG for vector icons, avoid data URIs in email, and link to normal files for everything else.

@@@
slug: svg-vs-png-when-to-convert
tool: svg-to-png
title: SVG vs PNG: When to Use Each and How to Convert SVG to PNG Properly
desc: The real differences between SVG and PNG, where SVG isn’t accepted, how to export crisp PNGs at 2x and 3x, fonts and transparency issues, and file size comparisons.
keywords: svg vs png, svg to png, convert svg to png, export svg high resolution, vector vs raster, png from svg
###
SVG and PNG are often used for the same things, such as logos, icons and illustrations, but they work in completely different ways. SVG describes shapes; PNG stores pixels. On websites SVG is usually the better choice, but many places still require PNG. Knowing when to convert, and how to do it without blurry results, saves a lot of re-exporting.

## Vector versus raster

**SVG (Scalable Vector Graphics)** is an XML text format that describes shapes with coordinates and math: “draw a circle with radius 30 at 60,60, filled beige.” The browser draws it fresh at whatever size it’s displayed, so it’s always sharp, from a 16px favicon to a billboard.

**PNG (Portable Network Graphics)** is a raster format: a fixed grid of pixels, compressed losslessly. It looks perfect at its native size and soft or blocky when enlarged.

| Aspect | SVG | PNG |
|---|---|---|
| Type | Vector (shapes) | Raster (pixels) |
| Scaling | Infinite, always sharp | Blurry when enlarged |
| File size for logos and icons | Usually tiny (1–10 KB) | Grows with dimensions |
| File size for photos | Impractical | Large (use JPEG/WebP instead) |
| Transparency | Yes | Yes |
| Editable as text / styleable with CSS | Yes | No |
| Animation | Yes (CSS, SMIL) | No (APNG is separate) |
| Supported everywhere | No | Almost universally |

## Where SVG isn’t accepted

Despite universal browser support, many platforms still won’t take an SVG upload:

- most social networks (profile pictures, posts, cover images),
- app stores and many app icon pipelines,
- Microsoft Office and Google Slides in some contexts (support has improved but varies),
- many email clients,
- marketplaces, ad platforms and some CMS media libraries, often for security reasons, because SVG files can contain scripts.

In all of these cases, you need a PNG (or JPEG) export.

## Exporting at the right scale

Because SVG has no fixed resolution, you choose one when you convert. Pick the largest size the PNG will be displayed at, and multiply for high-density screens:

| Final display size | Export at 1x | 2x (most phones/laptops) | 3x (high-end phones) |
|---|---|---|---|
| 48 px icon | 48 | 96 | 144 |
| 200 px logo | 200 | 400 | 600 |
| 1200 px social image | 1200 | 2400 | 3600 |

For print, multiply the size in inches by 300. A 3-inch-wide logo needs a 900px export. Our [print resolution guide](/blog/print-resolution-dpi-guide/) explains why.

Our [SVG to PNG converter](/tools/svg-to-png/) offers 1x to 8x scaling or an exact pixel width, and keeps transparency.

## How the SVG size is determined

SVGs declare their size in two ways:

- `width` and `height` attributes, like `width="120" height="120"`,
- a `viewBox`, like `viewBox="0 0 120 120"`, which defines the coordinate system.

If width and height are missing or set to percentages (`100%`), a converter has no fixed size to start from, so it falls back to the viewBox dimensions. If both are missing, browsers default to 300 × 150. If your export comes out at an unexpected size, check these attributes.

## Common conversion problems

**Wrong or missing fonts.** SVG text references fonts by name. If the font isn’t installed on the computer doing the conversion, a fallback font is used and the text looks different. Fix: convert text to outlines (paths) in your design tool before exporting, or embed the font.

**Missing external images or styles.** An SVG that references external files (linked images, external CSS) may render without them when converted in isolation. Inline the styles and images first.

**Hairline strokes.** A 0.5px stroke looks fine on screen but can disappear or render unevenly at 1x. Export at 2x or thicken the stroke.

**Transparent versus white background.** PNG keeps transparency; JPEG doesn’t. If the image will be placed on colored backgrounds, keep it transparent. If a platform shows transparency as black (some do), add a background color.

## File size comparison

For a simple two-color logo, typical sizes might be:

| Version | Size |
|---|---|
| Optimised SVG | 1–3 KB |
| PNG at 400 × 400 | 8–20 KB |
| PNG at 1200 × 1200 | 25–60 KB |

For icons and logos on your own website, SVG wins on size and sharpness. Optimise it first to strip editor metadata; our [SVG optimization guide](/blog/svg-optimization-guide/) shows how much that saves.

## When PNG is actually better

- **Complex illustrations** with thousands of paths, gradients, filters and blurs can be larger as SVG than as PNG and slow to render. If an SVG is over a few hundred kilobytes, test a PNG or WebP.
- **Screenshots and photos** are raster by nature; SVG offers nothing.
- **Anything uploaded by users**, where accepting SVG creates security risks.

## A simple decision guide

1. Is it a photo? Use JPEG, WebP or AVIF, not SVG or PNG.
2. Is it a logo, icon or simple illustration for your own website? Use SVG.
3. Is it going to a platform that doesn’t accept SVG? Export PNG at 2x the display size.
4. Is it for print? Use the vector file (SVG, PDF or EPS) if the printer accepts it, or a PNG at 300 DPI.

## Summary

SVG is the better source format for logos, icons and simple graphics because it scales perfectly and stays small. PNG is the universal fallback for everywhere SVG isn’t accepted. Convert at the display size times two (or three for top-end phones), outline your fonts, keep transparency, and keep the SVG as your master file.

@@@
slug: favicon-sizes-guide
tool: favicon-generator
title: Favicon Sizes Explained: ICO, PNG, SVG and Apple Touch Icons in One Guide
desc: Which favicon files a modern website really needs, the purpose of favicon.ico, 32px PNG, SVG favicons, the 180px Apple touch icon and 192/512px manifest icons, plus design tips.
keywords: favicon sizes, favicon.ico, apple touch icon size, favicon generator, svg favicon, web app manifest icons
###
The favicon is the smallest piece of your brand and one of the most frequently seen: in browser tabs, bookmarks, history lists, search results on mobile, and on home screens when people save your site. Over the years, favicon advice ballooned into lists of twenty-plus files. Most of those are no longer necessary. A modern site needs a handful of files, chosen for specific reasons.

## Where favicons appear

| Location | Typical size shown | File used |
|---|---|---|
| Browser tab | 16 × 16 (32 × 32 on high-density screens) | favicon.ico, PNG or SVG |
| Bookmarks and history | 16–32 px | Same as tab |
| Google mobile search results | Shown small; Google asks for at least 48 × 48 and multiples of 48 | Any favicon Google can crawl |
| iOS home screen | 180 × 180 | apple-touch-icon.png |
| Android home screen / PWA | 192 × 192 and 512 × 512 | Icons in the web app manifest |
| Windows taskbar shortcuts | 32–48 px | favicon.ico |

## The minimal modern set

**1. favicon.ico (16, 32 and 48 px inside one file).** The ICO format can contain several images at different sizes. Browsers have requested `/favicon.ico` from the site root automatically since the late 1990s, even without a link tag, and some tools, crawlers and older browsers still rely on it. Keep it.

**2. A PNG favicon (32 × 32).** A crisp PNG referenced with a `<link rel="icon">` tag covers modern browsers well.

**3. An SVG favicon (optional but excellent).** Supported in Chrome, Edge, Firefox and, more recently, Safari. One file looks sharp at every size, and because it’s SVG, it can even adapt to dark mode with an embedded `@media (prefers-color-scheme: dark)` style.

**4. apple-touch-icon.png (180 × 180).** Used by iOS and iPadOS when someone adds your site to their home screen. iOS rounds the corners itself, so supply a square image. Transparent areas are typically rendered black, so give it a solid background.

**5. Manifest icons (192 × 192 and 512 × 512).** Referenced in `site.webmanifest`, used by Android and for installable web apps (PWAs), including splash screens.

Our [favicon generator](/tools/favicon-generator/) produces all of these from an image or from text and emoji, including a multi-size favicon.ico and the HTML tags.

## The HTML

```
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

The `sizes="any"` on the ICO line is a workaround that stops some browsers from preferring the ICO over the SVG. Browsers pick the best icon they support from the list.

## What you no longer need

Older favicon checklists included Microsoft tile images (`msapplication-TileImage`, `browserconfig.xml`), dozens of Apple touch icon sizes (57, 60, 72, 76, 114, 120, 144, 152 px), Android icons at 36, 48, 72, 96 and 144 px, and Safari pinned tab masks. Modern browsers and operating systems scale the larger icons down, so these extra files rarely add anything today.

| Old practice | Today |
|---|---|
| 10+ Apple touch icon sizes | One 180 × 180 is enough |
| Windows tile images and browserconfig.xml | Not needed for modern Edge |
| Many Android sizes | 192 and 512 in the manifest |
| GIF animated favicons | Poorly supported; avoid |

## Designing for 16 pixels

A favicon is shown at sizes where a full logo becomes an unreadable smudge. Design specifically for small sizes:

- **Simplify.** Use a single letter, monogram or the logo’s symbol, not the wordmark.
- **Use bold shapes.** Thin strokes disappear at 16px. Aim for strokes of at least 2px at that size.
- **Maximise the canvas.** Fill most of the square; tiny marks in a large empty square look lost in the tab bar.
- **High contrast.** Tabs can be light or dark. A shape with a solid background (rounded square or circle) works on both.
- **Test in real tabs**, in light and dark browser themes, next to other popular sites’ favicons.

## Favicons and search results

On mobile search results, Google displays a favicon next to your site name. Google’s guidelines ask for a square favicon of at least 48 × 48 pixels (or an SVG), a stable URL, and a favicon that represents your brand. It must be crawlable, so don’t block it in robots.txt. Changes can take days or weeks to appear in results.

## Caching gotcha

Browsers cache favicons aggressively, sometimes ignoring normal cache rules. If you update your favicon and still see the old one, open the favicon URL directly, hard-refresh, or add a version query string (`/favicon.ico?v=2`) to the link tags.

## Where to put the files

Put favicon.ico in the site root (`/favicon.ico`), because some clients request it there without reading your HTML. The other files can live anywhere as long as the link tags and manifest point to them correctly, but keeping them all in the root is simplest.

## Summary

A modern website needs favicon.ico (with 16, 32 and 48 px images), a 32px PNG or an SVG favicon, a 180px Apple touch icon with a solid background, and 192/512px icons in the web manifest. Design a simplified mark that works at 16 pixels, test it in real tabs, and version the URL when you change it. If your source logo is vector, read [SVG vs PNG](/blog/svg-vs-png-when-to-convert/) to export clean PNG sizes.
