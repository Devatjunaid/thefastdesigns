@@@
slug: placeholder-images-and-layout-shift
tool: placeholder-image-generator
title: Placeholder Images, Aspect Ratios and Layout Shift (CLS): A Practical Guide
desc: How placeholder images help in wireframes and mockups, how to reserve space so pages don’t jump, what Cumulative Layout Shift measures, and LQIP, blur-up and dominant-color techniques.
keywords: placeholder image, layout shift, cumulative layout shift, cls images, aspect ratio css, lqip blur placeholder
###
Placeholders do two jobs in web design. During design and development, they stand in for images that don’t exist yet. On live sites, they hold space for images that are still loading, so the page doesn’t jump. Both matter: one keeps projects moving, the other directly affects user experience and Google’s Core Web Vitals.

## Placeholders in design and prototyping

Real photography often arrives late. Placeholder images let you build and review layouts without waiting. Good placeholders:

- **use the correct dimensions and aspect ratio**, so the layout you approve is the layout you’ll ship,
- **are labelled with their purpose and size**, like “Team photo 4:5 – 1200 × 1500”, so whoever supplies the final images knows what to deliver,
- **are neutral in color**, so they don’t influence feedback on the color scheme.

Online placeholder services that generate images from a URL are convenient, but they make your mockups depend on a third party staying online. Generating placeholders locally avoids that. Our [placeholder image generator](/tools/placeholder-image-generator/) creates PNG, JPG, WebP or tiny SVG files at any size, offline.

## Layout shift: the real problem placeholders solve

When a browser loads a page, it starts laying out text before images have downloaded. If it doesn’t know how big an image will be, it reserves no space. When the image arrives, everything below it gets pushed down. You’ve probably experienced the result: you go to tap a link, an image loads above it, and you tap an ad instead.

Google measures this as **Cumulative Layout Shift (CLS)**, one of the three Core Web Vitals.

| CLS score | Rating |
|---|---|
| 0.1 or less | Good |
| 0.1 – 0.25 | Needs improvement |
| Over 0.25 | Poor |

The score combines how much of the viewport moved and how far. Images and embeds without reserved space are the most common cause.

## Fix 1: width and height attributes

The simplest fix is to include `width` and `height` on every `<img>`:

```
<img src="photo.webp" width="1200" height="800" alt="…" style="width:100%;height:auto">
```

Modern browsers (since around 2020) use these attributes to calculate the aspect ratio *before* the image loads, even when CSS makes the image responsive with `width: 100%; height: auto`. The browser reserves a box of the right proportions, and the image fills it.

## Fix 2: CSS aspect-ratio

For containers, background images, videos and embeds, use the `aspect-ratio` property:

```
.video { aspect-ratio: 16 / 9; width: 100%; }
.avatar { aspect-ratio: 1; }
```

Supported in all major browsers since 2021, it replaced the old “padding-top: 56.25%” hack for 16:9 boxes. If you need to work out a ratio, our [aspect ratio calculator](/tools/aspect-ratio-calculator/) simplifies any dimensions.

## Loading placeholders: what to show while waiting

Reserving space prevents shifting, but an empty box can still look broken. Several techniques fill the gap:

| Technique | What users see | Extra cost | Notes |
|---|---|---|---|
| Solid neutral color | A grey or beige box | None | Simplest; fine for small images |
| Dominant color | A box in the image’s main color | A few bytes | Feels connected to the image |
| LQIP (low-quality image placeholder) | A tiny blurred version, scaled up | ~0.5–2 KB inlined | Smooth “blur-up” when the full image loads |
| BlurHash / ThumbHash | A short string decoded into a blurred preview | ~20–30 characters | Popular in apps and APIs |
| SVG trace / silhouette | A simplified outline | 1–3 KB | Artistic; less common now |
| Skeleton screen | Grey shapes for the whole layout | Minimal | Good for cards and feeds |

Dominant color is a nice balance: extract it once with an [image palette extractor](/tools/image-palette-extractor/) and set it as the background color of the image container. For skeletons and spinners, see our [loading states guide](/blog/loading-spinners-vs-skeleton-screens/).

## Lazy loading and placeholders

`loading="lazy"` tells the browser to load off-screen images only as the user scrolls near them. It saves bandwidth, but it makes reserved space even more important, because more images load *after* the page is visible. Two rules:

1. Always include dimensions on lazy-loaded images.
2. Don’t lazy-load the main image at the top of the page (often the Largest Contentful Paint element); load it immediately, and consider `fetchpriority="high"`.

## Other common causes of layout shift

- **Web fonts** that swap in with different metrics. Use `font-display: swap` with a well-matched fallback, or size-adjust descriptors.
- **Ads and embeds** without reserved space. Give their containers a min-height.
- **Banners injected at the top** of the page after load (cookie notices, promos). Overlay them or reserve their space.
- **Dynamic content** inserted above what the user is reading.

## Placeholder checklist for developers

- Every image has width and height attributes or a container with `aspect-ratio`.
- Hero images load eagerly; everything below the fold loads lazily.
- Containers have a background color matching the image’s tone.
- Mockup placeholders match final dimensions and are labelled.
- Search the codebase for placeholder URLs before launch.

## Summary

Placeholders keep design work moving and keep live pages stable. In mockups, use correctly sized, clearly labelled, neutral images. In production, reserve space with width and height or `aspect-ratio`, fill it with a color or blurred preview while loading, and lazy-load only what’s below the fold. Your users stop mis-tapping, and your CLS score stays in the green.

@@@
slug: watermarking-photos-guide
tool: watermark-image
title: How to Watermark Photos Effectively (Without Ruining Them)
desc: Visible vs invisible watermarks, where to place a watermark so it can’t be cropped, the right opacity and size, what watermarks can and can’t protect, and copyright basics for creators.
keywords: watermark photos, add watermark, watermark placement, photo copyright, protect images online, watermark opacity
###
Every photographer and designer who shares work online eventually wonders how to stop it being copied. A watermark is the most common answer. It won’t make copying impossible, but a well-designed one discourages casual reuse, keeps your name attached to the work when it spreads, and does it without spoiling the image for honest viewers.

## What a watermark can and can’t do

| A watermark can | A watermark can’t |
|---|---|
| Show who made the image | Prevent screenshots or downloads |
| Make casual reuse awkward | Stop a determined person with editing tools or AI inpainting |
| Turn shared copies into advertising for you | Replace copyright registration or licensing |
| Mark proofs as unpaid drafts | Protect an image that is already widely shared without it |

It’s a deterrent and an attribution tool, not a lock. Keep that in mind when deciding how heavy to make it.

## Visible versus invisible watermarks

**Visible watermarks** are text or logos placed on the image. They are what most people mean by watermarking.

**Invisible watermarks** hide information in the image data itself, either in metadata or encoded into the pixels in ways the eye can’t see (digital watermarking, steganography). Metadata is easily stripped; pixel-level watermarks can survive some editing and are used by stock agencies and, increasingly, by AI image providers to label generated content. Content Credentials (the C2PA standard) attach signed provenance information to files, although many platforms still strip it.

For most creators, a visible watermark plus correct copyright metadata in the original is the practical combination.

## Placement: corner, center or tiled

| Placement | Visibility | Ease of removal | Best for |
|---|---|---|---|
| Small, in a corner | Discreet | Easy (crop it off) | Portfolio pieces, social posts where the image should shine |
| Near the subject | Noticeable | Harder (subject must be edited) | Photos likely to be reposted |
| Center, large and faint | Prominent | Hard | Client proofs, previews of paid work |
| Tiled across the image | Very prominent | Very hard | Stock previews, unpaid proofs |

A corner watermark over plain background is the easiest to crop out. Placing it slightly toward the subject, or over an area with detail, makes removal more work. For proofs you send clients before payment, a tiled watermark at low opacity is standard practice.

Our [watermark tool](/tools/watermark-image/) supports corners, center and tiled placement with rotation.

## Size and opacity

- **Opacity:** 30–60% is typical. Below 20% the mark is easy to miss; above 70% it dominates the photo.
- **Size:** for corner marks, roughly 3–6% of the image’s shorter side for the text height. Tiled marks can be smaller and rotated (often −30° to −45°).
- **Color:** white with a soft shadow is readable over both light and dark areas. A dark mark works on bright, airy photos.
- **Consistency:** use the same font, size and placement across a set so the watermark becomes part of your visual identity.

## What to write

- **Your website or handle** (e.g. `yourname.com` or `@yourname`) is the most useful, because anyone who sees a shared copy can find you.
- **The copyright symbol and name** (© 2026 Your Name) signals ownership.
- **“PROOF” or “PREVIEW”** for unpaid client drafts.

Avoid long text and complex logos with fine detail, which become illegible when the image is shared at small sizes.

## Workflow: keep a clean master

Never watermark your only copy. Keep the full-resolution original in your archive, and export watermarked copies for sharing. Clients receive clean files after payment, and you can change your watermark design later without re-shooting or re-editing everything.

Also consider sharing smaller files online. A 1600-pixel-wide watermarked image is fine for viewing but far less useful for printing than your original, which adds another layer of protection.

## Watermarks and copyright basics

In most countries, including all members of the Berne Convention, copyright exists automatically from the moment you create a work. You don’t need a watermark or registration to own it. In the United States, registering with the Copyright Office is required before you can file an infringement lawsuit for US works, and timely registration enables statutory damages.

Under the US Digital Millennium Copyright Act, removing or altering copyright management information (which can include a visible watermark with your name) to conceal infringement can itself be a violation. That gives visible watermarks some legal value beyond deterrence. Laws vary by country, so this is general information rather than legal advice.

## Metadata: the invisible signature

Add your name and copyright notice to the image’s metadata (EXIF and IPTC fields) in your editing software. It doesn’t prevent copying, and many platforms strip it, but it travels with files sent directly, such as email attachments. Note that metadata can also contain information you *don’t* want to share, like GPS location; see our [EXIF privacy guide](/blog/photo-metadata-exif-privacy/).

## Does a watermark hurt engagement?

Large, intrusive watermarks can make images look less professional and reduce shares. On social media, many photographers use small, tasteful marks or none at all, relying on the platform’s attribution. A sensible balance:

- **Portfolio and social posts:** small corner mark or none.
- **Images likely to be reposted widely:** subtle mark near the subject.
- **Client proofs and previews of paid work:** tiled or large center mark.

## Summary

A watermark is attribution and a deterrent, not protection against a determined copier. Use small corner marks for portfolio work, larger or tiled marks for proofs, keep opacity around 30–60%, put your website in the text, and always keep a clean original. Combine it with metadata and, where it matters, copyright registration.

@@@
slug: social-media-image-sizes-guide
tool: social-media-image-resizer
title: Social Media Image Sizes: The Practical Guide for Instagram, YouTube, X and LinkedIn
desc: Recommended image sizes and aspect ratios for Instagram, Facebook, X, LinkedIn, YouTube, Pinterest and TikTok, safe zones, file format tips and why platforms crop and compress images.
keywords: social media image sizes, instagram post size, youtube thumbnail size, linkedin banner size, facebook cover size, twitter header size
###
Every social platform has its own preferred image shapes, and each crops and compresses uploads in its own way. Upload the wrong shape and faces get cut off or text disappears behind profile pictures. Upload the right size and your image looks sharp and intentional. Here are the dimensions designers rely on, plus the reasoning behind them.

## A note before the numbers

Platforms change layouts and recommendations regularly, sometimes without announcement. The sizes below are widely used recommendations at the time of writing. When something looks off, check the platform’s own help pages, and design with safe zones so small changes don’t ruin your image.

## The main sizes

| Platform | Image type | Recommended size | Aspect ratio |
|---|---|---|---|
| Instagram | Square post | 1080 × 1080 | 1:1 |
| Instagram | Portrait post | 1080 × 1350 | 4:5 |
| Instagram | Story / Reel | 1080 × 1920 | 9:16 |
| Facebook | Shared link image | 1200 × 630 | 1.91:1 |
| Facebook | Page cover | 851 × 315 (commonly cited) | about 2.7:1 |
| X (Twitter) | In-feed image | 1600 × 900 | 16:9 |
| X (Twitter) | Header | 1500 × 500 | 3:1 |
| LinkedIn | Shared link / post image | 1200 × 627 | 1.91:1 |
| LinkedIn | Personal profile banner | 1584 × 396 | 4:1 |
| YouTube | Thumbnail | 1280 × 720 | 16:9 |
| YouTube | Channel banner | 2560 × 1440 | 16:9 |
| Pinterest | Standard pin | 1000 × 1500 | 2:3 |
| TikTok | Video / cover | 1080 × 1920 | 9:16 |
| Most platforms | Profile picture | 400 × 400 or larger | 1:1 (often shown as a circle) |

Our [social media image resizer](/tools/social-media-image-resizer/) has these presets built in, with crop focus and fit options.

## Why these specific numbers

**1080 pixels** became Instagram’s standard width because it is the width of a full-HD phone screen in portrait. Uploading wider images doesn’t help; the platform downsizes them.

**1200 × 630** for link previews comes from the Open Graph protocol, used by Facebook, LinkedIn, Slack, Discord and many others to show a preview card when a URL is shared. Setting an `og:image` of this size on your web pages controls what appears when people share your links.

**9:16** matches a phone held upright, filling the entire screen for Stories, Reels, Shorts and TikTok.

**16:9** matches widescreen video, which is why it’s used for YouTube thumbnails and in-feed images on X.

## Safe zones: where not to put text

Full-screen vertical formats are covered by interface elements: profile names and captions at the bottom, progress bars and buttons at the top and side. Keep text and faces out of roughly the top 250 pixels and bottom 340 pixels of a 1080 × 1920 Story, and away from the right edge on Reels and TikTok, where like and share buttons sit.

Banners are the other trouble spot:

- **YouTube channel banners** are cropped differently on TVs, desktops and phones. Everything important must sit in the central **1546 × 423** safe area.
- **LinkedIn and X headers** have the profile photo overlapping the bottom-left on desktop, and are cropped more on mobile.
- **Facebook covers** display wider on desktop and are cropped at the sides on mobile.

Profile pictures are usually shown as circles, so keep logos and faces centered with some padding.

## Crop, fit or blur?

When your image’s shape doesn’t match the format, you have three options:

| Method | Result | Use when |
|---|---|---|
| Fill and crop | Edge-to-edge, some content cut | The subject is central and there’s spare background |
| Fit with background color | Whole image visible, bars on sides | Graphics, infographics, artwork you can’t crop |
| Fit with blurred background | Whole image visible, soft blurred fill | Landscape photos posted as Stories |

For careful framing, crop manually first with an [image cropper](/tools/image-cropper/); our guide to [cropping and composition](/blog/cropping-photos-composition-aspect-ratios/) explains what to keep.

## File format and quality tips

- **Photos:** export JPEG at high quality (around 85–90). Platforms re-compress uploads, and starting from a good file reduces visible artifacts.
- **Graphics with text:** export PNG. Sharp edges survive re-compression better.
- **Don’t upload huge files.** Platforms resize anything larger than their maximum, often with less care than your own export. Uploading at the recommended size gives you control.
- **Use sRGB color.** Images in wider color spaces can look dull or shifted after platform processing.
- **Respect file limits.** For example, YouTube thumbnails must be under 2 MB.

## Carousels and grids

Instagram carousels allow up to 20 images or videos per post (raised from 10 in 2024). Splitting a wide panorama across several slides creates a swipeable effect. Our guide to [Instagram carousels and grid posts](/blog/instagram-carousel-panorama-grid-guide/) covers how to cut images seamlessly.

## A reusable workflow

1. Design at the platform’s recommended size, or at 2× for crisp graphics.
2. Keep important content inside safe zones.
3. Export JPEG for photos and PNG for graphics, in sRGB.
4. Preview on a real phone before posting.
5. Save templates for each format you use regularly.

## Summary

Use 1080-pixel-wide images for Instagram (1:1, 4:5 or 9:16), 1200 × 630 for link previews, 16:9 for YouTube and X, and the banner sizes each platform specifies, keeping text in safe zones. Upload at the recommended size rather than larger, so you control the quality instead of the platform’s resizer.

@@@
slug: instagram-carousel-panorama-grid-guide
tool: image-grid-splitter
title: How to Make Seamless Instagram Carousels and Grid Posts by Splitting Images
desc: Step-by-step guide to panorama carousels and profile grid mosaics: the exact canvas sizes, how to split images into tiles, posting order, safe areas and common mistakes.
keywords: instagram carousel panorama, split image for instagram, instagram grid post, seamless carousel, image splitter, puzzle feed
###
A seamless carousel, where one wide image continues from slide to slide as you swipe, is one of the most effective ways to make an Instagram post stand out. A grid mosaic, where several posts form one big picture on your profile, makes a strong first impression for new visitors. Both rely on the same simple technique: splitting one image into equal tiles. The details are what make them look seamless.

## How a seamless carousel works

A carousel is up to 20 images shown one at a time. If you take a panorama exactly three times as wide as one slide and cut it into three equal pieces, each slide shows a third of the picture, and swiping moves smoothly from one section to the next. Elements that cross the cut, like a horizon, a line of text or an object half on each slide, create the “continuous” feeling.

## The exact canvas sizes

Carousels use the aspect ratio of the first slide for every slide, so plan the whole strip at once.

| Slide format | Single slide | 2 slides | 3 slides | 5 slides |
|---|---|---|---|---|
| Square (1:1) | 1080 × 1080 | 2160 × 1080 | 3240 × 1080 | 5400 × 1080 |
| Portrait (4:5) | 1080 × 1350 | 2160 × 1350 | 3240 × 1350 | 5400 × 1350 |

Portrait 4:5 takes up more screen height in the feed, so it’s usually the better choice for carousels.

## Step by step

1. **Create the canvas** at the full strip size, for example 3240 × 1350 for three portrait slides.
2. **Add guides** at every 1080 pixels, so you can see where the cuts will fall.
3. **Design across the cuts.** Let a photo, shape or line run across a boundary so the slides feel connected. Keep important text and faces away from the cut lines; a word split across two slides is hard to read.
4. **Export the strip** as one high-quality JPEG or PNG.
5. **Split it into equal tiles** with an [image grid splitter](/tools/image-grid-splitter/) (1 row × 3 columns for this example).
6. **Upload in order**, with the first tile first. The splitter numbers tiles left to right, so the order is clear.

## Grid mosaics on your profile

A profile grid mosaic spreads one large image across several separate posts. On the profile page, they line up to show the full picture.

**Posting order is reversed.** Instagram shows your newest post in the top-left of your grid. To build a 3×3 mosaic, post the bottom-right tile first and the top-left tile last.

**The grid shape changed.** In early 2025, Instagram switched profile grids from square thumbnails to taller 3:4 rectangles. Mosaics designed for square tiles get cropped at the top and bottom of each thumbnail. Design each tile so it still works when trimmed to 3:4 in the grid, and check your current profile before planning.

**It locks your grid.** Every new post shifts the whole grid by one position, which breaks a mosaic unless you post in groups of three (one full row). Pinned posts at the top of the profile can also interfere. Many brands therefore use mosaics for launches rather than as a permanent style.

## Carousels versus grid mosaics

| Aspect | Seamless carousel | Profile grid mosaic |
|---|---|---|
| Seen in the feed | Yes, as one swipeable post | No, each tile appears as a separate post |
| Seen on profile | As one thumbnail (first slide) | As the full picture |
| Effort to maintain | One post | Breaks when you post out of rows of three |
| Engagement | Swiping keeps people on the post longer | Strong first impression on the profile |
| Best for | Storytelling, tutorials, panoramas | Launches, rebrands, campaigns |

## Common mistakes

- **Unequal widths.** If the source isn’t an exact multiple of the slide width, tiles won’t line up. Start from an exact canvas size, or let the splitter trim a few pixels evenly.
- **Text on the cut line.** Letters split across slides are hard to read. Move text fully onto one slide.
- **Mixing ratios.** All carousel slides use the first slide’s ratio; a different-shaped tile will be cropped.
- **Low resolution.** Platforms recompress uploads. Exporting at exactly 1080 pixels per slide, at high quality, keeps details crisp.
- **Forgetting the safe zone** when a carousel is also shared to Stories, where the top and bottom are covered by interface elements.

## Ideas that work well

- **Panoramas and landscapes**, the classic use.
- **Before and after**, with a dividing line exactly on a cut.
- **Step-by-step tutorials**, where a line or path leads from one step to the next.
- **Product line-ups**, with products arranged along a continuous surface.
- **Infographics and timelines** that flow horizontally.

## Splitting for other uses

The same technique is useful outside Instagram: splitting large posters for printing on several A4 sheets, cutting sprite sheets for games, or dividing a long screenshot into pages. Our [paper size chart](/tools/paper-size-chart/) helps when you’re tiling a poster across standard sheets.

## Summary

Seamless carousels come from one wide canvas cut into equal slides, usually 1080 pixels wide each, with elements crossing the cuts and text kept clear of them. Grid mosaics are posted in reverse order and need planning around the 3:4 profile thumbnails. Design the full strip, split it precisely, and post in order. For all the other platform dimensions, see our [social media image sizes guide](/blog/social-media-image-sizes-guide/).
