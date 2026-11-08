@@@
slug: image-compression-lossy-vs-lossless
tool: image-compressor
title: Image Compression Explained: Lossy vs Lossless and the Best Quality Settings
desc: How lossy and lossless image compression work, what the quality slider really changes, which settings give the best size-to-quality ratio, and how to compress without visible artifacts.
keywords: image compression, lossy vs lossless, compress images, jpeg quality setting, reduce image file size, webp compression
###
Every image on the web is compressed in some way. An uncompressed 1920 × 1080 photo would be about 6 MB (1920 × 1080 pixels × 3 bytes per pixel). A well-compressed version of the same photo can be 150 KB and look identical at normal viewing size. Knowing how compression works helps you pick settings that cut file size dramatically without visible damage.

## Two kinds of compression

**Lossless compression** shrinks the file without changing a single pixel. Decompress it and you get exactly the original image back. It works by finding patterns and repetition, much like a ZIP file. PNG, GIF and lossless WebP use lossless compression.

**Lossy compression** throws away information that people are unlikely to notice, then compresses what remains. The decoded image is close to the original but not identical. JPEG, lossy WebP and AVIF are lossy formats, and they can make photos 5–20 times smaller than lossless formats.

| | Lossless | Lossy |
|---|---|---|
| Pixels after decoding | Identical | Approximation |
| Typical photo savings | Modest | Very large |
| Re-saving repeatedly | No degradation | Quality drops each time (“generation loss”) |
| Best for | Screenshots, logos, text, line art, editing masters | Photographs, complex images |
| Formats | PNG, GIF, lossless WebP, lossless AVIF | JPEG, WebP, AVIF |

## How lossy compression decides what to throw away

JPEG, the format that defined web photography since 1992, uses several tricks based on how human vision works:

1. **Color subsampling.** Our eyes are more sensitive to changes in brightness than in color. JPEG usually stores color at half resolution in each direction (4:2:0), cutting the color data by 75% with little visible effect on photos.
2. **Frequency transformation.** The image is split into 8×8 pixel blocks, and each block is described as a combination of smooth and detailed patterns (the discrete cosine transform).
3. **Quantization.** Fine detail patterns, which the eye notices least, are stored with less precision or dropped. **This is what the quality slider controls.** Lower quality means coarser quantization and more detail thrown away.
4. **Entropy coding.** The remaining data is packed efficiently, losslessly.

WebP and AVIF use more advanced techniques, including predicting blocks from their neighbours and variable block sizes, which is why they compress better at the same visible quality.

## What the quality number means

The quality setting (usually 0–100) is not a percentage of quality. It maps to the quantization tables the encoder uses, and different software maps the numbers differently: quality 80 in one program isn’t identical to quality 80 in another. Still, some patterns hold for photos:

| Quality | Typical result | Use |
|---|---|---|
| 90–100 | Visually lossless, large files | Print masters, archives (better: keep the original) |
| 75–85 | Excellent; differences hard to see at normal size | Most web photos |
| 60–75 | Good for photos with lots of texture; slight softening | Thumbnails, backgrounds |
| Below 60 | Visible blockiness, smudged edges, color bands | Rarely worth it |

The jump from quality 100 to 85 often halves the file size with no visible change. The jump from 75 to 50 saves less and starts to look bad. Our [image compressor](/tools/image-compressor/) defaults to 75% WebP, a good balance for most photos.

## Artifacts to look out for

- **Blocking:** visible 8×8 squares in smooth areas like sky.
- **Ringing (mosquito noise):** fuzzy halos around sharp edges and text.
- **Color bleeding:** colors smearing past edges, from subsampling.
- **Banding:** smooth gradients turning into visible steps.

Always check compressed images at 100% zoom, not shrunk to fit your screen, which hides artifacts.

## Why screenshots should be lossless

Screenshots, diagrams, logos and anything with text have sharp edges and large flat areas of color. Lossy compression handles these badly: edges get ringing artifacts, and text looks smudgy. Lossless PNG or lossless WebP is usually smaller *and* sharper for this kind of content. Photos are the opposite: PNG versions can be 5–10 times larger than a good JPEG.

## Resize before you compress

Compression works on the pixels you give it. A 4000-pixel-wide photo compressed hard still contains 12 million pixels. Resizing it to its display size first (for example 1600 pixels) removes most of the data before compression even starts. Our guide to [resizing images for the web](/blog/how-to-resize-images-for-the-web/) explains how to choose dimensions.

## Format matters too

At the same visual quality, typical sizes for a photo are roughly:

| Format | Relative size |
|---|---|
| JPEG (quality ~80) | 100% |
| WebP (quality ~75) | ~65–75% |
| AVIF (quality ~50–60) | ~45–60% |

These are rough figures; results vary by image. We compare the formats in detail in [JPG vs PNG vs WebP vs AVIF](/blog/jpg-vs-png-vs-webp-vs-avif/).

## Avoid generation loss

Each time you open a lossy image, edit it and save it again as lossy, it loses a bit more quality. Keep a lossless or original master, do all edits on that, and export a compressed copy only at the end.

## Metadata is part of the file size

Photos from phones and cameras carry EXIF metadata: camera model, date, settings and often GPS coordinates. It can add tens of kilobytes, and it can reveal where a photo was taken. Re-encoding through a canvas, as browser-based compressors do, drops this data. If you only want to remove metadata without re-compressing, see our [EXIF and privacy guide](/blog/photo-metadata-exif-privacy/).

## A sensible workflow

1. Keep the original file.
2. Crop and resize to the largest display size (× 2 for high-density screens).
3. Choose a format: WebP or AVIF for photos on websites, PNG or lossless WebP for screenshots and graphics.
4. Compress at around 75–80 for photos and compare against the original at 100% zoom.
5. Check the result loads quickly on a real phone connection.

## Summary

Lossless compression keeps every pixel and suits graphics and text; lossy compression discards what you’re unlikely to see and suits photos. Quality 75–85 is the sweet spot for most web photos, but resizing first and choosing a modern format often save more than the slider ever will.

@@@
slug: jpg-vs-png-vs-webp-vs-avif
tool: image-converter
title: JPG vs PNG vs WebP vs AVIF (and GIF, SVG): Which Image Format to Use
desc: A practical comparison of image formats: compression, transparency, animation, browser support and typical file sizes, with clear recommendations for photos, logos, screenshots and web.
keywords: jpg vs png, webp vs jpg, avif vs webp, best image format for web, image formats comparison, png vs webp
###
Choosing an image format used to be simple: JPEG for photos, PNG for graphics, GIF for animation. Then WebP and AVIF arrived with better compression, and SVG became the standard for icons. Each format still has a job. Here’s how they differ and which one to use.

## The quick comparison

| Format | Compression | Transparency | Animation | Best for | Browser support |
|---|---|---|---|---|---|
| JPEG / JPG | Lossy | No | No | Photos with universal compatibility | Universal |
| PNG | Lossless | Yes (full alpha) | APNG only | Screenshots, logos (raster), graphics with text | Universal |
| GIF | Lossless, 256 colors max | 1-bit (on/off) | Yes | Legacy simple animations | Universal |
| WebP | Lossy or lossless | Yes | Yes | Photos and graphics on the web | All modern browsers (Safari since 2020) |
| AVIF | Lossy or lossless | Yes | Yes | Smallest photos on the web | All modern browsers (Safari since 2022, Edge since 2024) |
| SVG | Vector (text-based) | Yes | Via CSS/SMIL | Logos, icons, illustrations | Universal |

## JPEG: the reliable veteran

JPEG was standardised in 1992 and is still the most widely compatible photo format. Every device, email client, printer and app can open it. It compresses photos very efficiently but has no transparency, and it struggles with sharp edges and text, which pick up fuzzy artifacts.

**Use it for:** photos you send to people or upload to platforms with uncertain support, print workflows that require JPEG, and email.

## PNG: lossless and transparent

PNG (1996) was created as a patent-free replacement for GIF. It is lossless and supports full alpha transparency, so edges of logos and cut-out products blend smoothly over any background. For photos, though, PNG files are huge, often 5–10 times larger than an equivalent JPEG.

**Use it for:** screenshots, UI images, diagrams, raster logos with transparency, and graphics with text when WebP isn’t an option.

## GIF: mostly retired

GIF (1987) is limited to 256 colors per frame, so photos look grainy and dithered. Its one remaining strength is universal support for animation. For animations on the web, a short MP4 or WebM video is usually 5–20 times smaller and looks far better; animated WebP and AVIF are also options.

**Use it for:** compatibility with places that only accept GIF (some chat apps and email clients).

## WebP: the practical modern default

Google released WebP in 2010. It supports lossy and lossless compression, transparency and animation in one format. Google’s own studies reported lossy WebP files about 25–34% smaller than JPEGs of comparable quality, and lossless WebP about 26% smaller than PNG. Since Safari added support in 2020, every major browser handles it.

**Use it for:** almost every image on a website. It’s a safe, efficient default for both photos and graphics.

## AVIF: maximum compression

AVIF is based on the AV1 video codec (2019 for the image format). It typically produces files noticeably smaller than WebP at the same visual quality, often around half the size of JPEG, and it supports HDR and wide color gamut. Trade-offs: encoding is slower and more CPU-intensive, very fine detail can look smoothed at aggressive settings, and some older devices and non-browser software still don’t open it.

**Use it for:** large photos on performance-critical websites, ideally with a WebP or JPEG fallback.

## SVG: not pixels at all

SVG describes shapes with math, so it is sharp at any size and usually tiny for logos and icons. It can be styled and animated with CSS. It is the wrong choice for photos. If you need a raster copy of an SVG for a platform that doesn’t accept vectors, convert it with an [SVG to PNG converter](/tools/svg-to-png/) and read [when to convert SVG to PNG](/blog/svg-vs-png-when-to-convert/).

## Typical file sizes for the same photo

Exact numbers depend on the image, but for a 1600 × 1067 photo at visually similar quality, expect something like:

| Format | Approximate size |
|---|---|
| PNG | 2.5–3.5 MB |
| JPEG (q80) | 250–350 KB |
| WebP (q75) | 170–250 KB |
| AVIF (q55) | 110–180 KB |

## Using modern formats with fallbacks

The `<picture>` element lets the browser choose the best format it supports:

```
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="Product on a wooden table" width="1600" height="1067">
</picture>
```

Browsers take the first source they understand. Many CDNs and image services do this automatically by checking the browser’s `Accept` header.

## Converting between formats: what to expect

- **JPEG → PNG** doesn’t restore lost quality; it just makes the file bigger.
- **PNG → JPEG** removes transparency; transparent areas need a background color.
- **PNG → WebP (lossless)** usually shrinks the file with no quality change.
- **JPEG → WebP/AVIF** is a second lossy step; start from the highest-quality source you have.
- **Animated GIF → static format** keeps only the first frame in most converters.

Our [image converter](/tools/image-converter/) converts between PNG, JPG and WebP in batches, filling transparency with a color you choose when converting to JPG.

## Recommendations by use case

| You have… | Use on the web | Use when sending to others |
|---|---|---|
| A photograph | AVIF or WebP (with JPEG fallback) | JPEG |
| A screenshot or UI image | Lossless WebP or PNG | PNG |
| A logo or icon | SVG | PNG (and SVG if they can use it) |
| A product cut-out with transparency | WebP | PNG |
| A short animation | MP4/WebM video, or animated WebP | GIF only if required |

## Summary

JPEG and PNG remain the most compatible formats, WebP is the practical default for websites, AVIF squeezes photos the most, SVG is for anything vector, and GIF is for legacy animation. Choose based on the content type and where the image will be used, and always [compress](/blog/image-compression-lossy-vs-lossless/) and resize as well.

@@@
slug: cropping-photos-composition-aspect-ratios
tool: image-cropper
title: How to Crop Photos Well: Composition Rules and Aspect Ratios That Work
desc: Practical cropping advice: rule of thirds, headroom and lead room, where not to cut people, how aspect ratios like 1:1, 4:5 and 16:9 change a photo, and cropping without losing quality.
keywords: how to crop photos, crop image, rule of thirds, aspect ratio crop, photo composition, crop for instagram
###
Cropping is the simplest edit you can make to a photo, and often the most powerful. A tighter frame removes distractions, a different aspect ratio changes the mood, and moving the subject off-center can turn a snapshot into a composed image. A few rules from photography and design make cropping decisions much easier.

## Start with what the photo is about

Before you drag a single handle, decide what the subject is. Everything in the frame should either support it or be removed. Common things to crop out:

- distracting objects at the edges (a stray elbow, a bright sign, a car bumper),
- empty space that doesn’t add mood or breathing room,
- tilted horizons and converging lines at the edges that draw the eye out of the frame.

## The rule of thirds

Imagine the frame divided into a 3×3 grid. Placing the subject on one of the lines, or where two lines cross, usually creates a more dynamic image than placing it dead center. Horizons often look better on the upper or lower third line than in the middle. Our [image cropper](/tools/image-cropper/) shows these grid lines inside the crop box.

The rule of thirds is a guideline, not a law. Symmetrical subjects (architecture, reflections, centered portraits) often look best perfectly centered. Use thirds when the image feels static or the subject feels stuck in the middle.

## Headroom and lead room

**Headroom** is the space above a person’s head. Too much makes the subject look small and sunk; too little feels cramped. In tight portraits, it is fine to crop the top of the head slightly, but keep the eyes roughly on the upper third line.

**Lead room** (or looking room) is space in the direction a person is facing or an object is moving. A runner heading right needs more space on the right side of the frame. Without it, the subject seems about to leave the image.

## Where not to cut people

A long-standing guideline in portrait photography: avoid cropping at joints, such as ankles, knees, wrists, elbows or the neck. Crops there make people look amputated. Instead, crop mid-thigh, mid-upper-arm, at the waist or across the chest. Fingers and toes cut off at the frame edge also look awkward.

## Aspect ratios change the story

| Ratio | Feel | Common uses |
|---|---|---|
| 1:1 | Balanced, static, centered | Profile pictures, product grids, album covers |
| 4:5 | Portrait, intimate | Instagram feed posts, portraits |
| 3:2 | Classic photography (35mm film) | Prints, editorial images |
| 4:3 | Slightly squarer, natural | Phone cameras, presentations, tablets |
| 16:9 | Wide, cinematic | YouTube, slides, website heroes |
| 9:16 | Tall, immersive | Stories, Reels, TikTok, Shorts |
| 21:9 | Ultra-wide, dramatic | Banners, cinematic headers |

A landscape cropped to 16:9 emphasises breadth; cropped to 4:5, it emphasises a single feature. Try the same photo in two ratios and pick the one that tells the story better. Our [aspect ratio guide](/blog/aspect-ratios-explained/) explains the numbers behind these formats.

## Cropping for platforms

Each platform crops images differently in feeds, thumbnails and profile grids. Crop deliberately rather than letting the platform guess:

- Instagram feed: 4:5 portrait takes up the most screen space.
- Stories and Reels: 9:16, with important content away from the top and bottom where interface elements overlap.
- YouTube thumbnails: 16:9 at 1280 × 720.
- Link previews: 1.91:1 (1200 × 630).

For the full list, see our [social media image sizes guide](/blog/social-media-image-sizes-guide/), or use the [social media image resizer](/tools/social-media-image-resizer/) to crop and resize in one step.

## Cropping and resolution

Cropping removes pixels. A 12-megapixel photo cropped to a quarter of its area is a 3-megapixel photo. That’s still plenty for the web, but it may not be enough for a large print. Before cropping heavily, check that the result still meets the size you need; for print, our [print resolution guide](/blog/print-resolution-dpi-guide/) explains the pixel counts required.

Crop first, then resize. If you resize a photo to 1200px wide and then crop, you throw away pixels you could have kept.

## Straighten before you crop

A tilted horizon is one of the most noticeable flaws in a photo. Straighten it first (rotating the image), then crop to remove the angled edges. Even a 1–2 degree tilt is visible in landscapes and architecture.

## Cropping in code versus cropping the file

On websites, you can crop images visually with CSS: `object-fit: cover` fills a box and crops the overflow, and `object-position` decides which part stays visible. This is useful for responsive layouts where the same image appears in different shapes. But it still downloads the whole image. For performance and for sharing outside the website, crop the file itself.

## A quick cropping checklist

1. What is the subject?
2. Remove distractions at the edges.
3. Straighten horizons and verticals.
4. Choose the aspect ratio for where the image will be used.
5. Place the subject using thirds (or centered, if symmetrical).
6. Leave headroom and lead room; avoid cutting at joints.
7. Check the resulting resolution is enough.

## Summary

Good crops start with knowing the subject, then removing distractions, choosing an aspect ratio that suits both the story and the platform, and placing the subject with intention. Crop the original file at full resolution, resize afterwards, and keep the uncropped version in case you need a different shape later.

@@@
slug: photo-adjustments-brightness-contrast-saturation
tool: photo-filters
title: Brightness, Contrast, Saturation and Filters: How Photo Adjustments Really Work
desc: What each basic photo adjustment does to pixels, the difference between brightness and exposure, saturation vs vibrance, how CSS filters compare with photo editors, and natural editing tips.
keywords: photo editing basics, brightness contrast saturation, photo filters, css filter, black and white photo, sepia effect
###
Most photo edits come down to a few basic adjustments: brightness, contrast, saturation, hue, and creative effects like black and white or sepia. Apps hide them behind sliders and presets, but each one is a simple mathematical operation on pixel values. Knowing what each does makes it much easier to fix a photo instead of fighting it.

## Brightness

Brightness makes every pixel lighter or darker. In CSS, `filter: brightness(120%)` multiplies each color channel by 1.2. Pixels that were already near white get clipped at maximum and lose detail, which is why heavy brightness increases make skies and skin look flat.

**Brightness vs exposure:** in photo editors like Lightroom, exposure behaves more like changing the amount of light captured, adjusting the image in a way that resembles what a camera would record, often protecting highlights better. Simple brightness is a straight multiplication. For quick edits the difference is small; for careful editing, exposure is gentler.

## Contrast

Contrast stretches or squeezes the distance between dark and light tones around a midpoint. More contrast makes shadows darker and highlights brighter; less contrast makes everything greyer and flatter.

The CSS formula is roughly: new value = (old value − 0.5) × contrast + 0.5. Increasing contrast slightly (105–120%) adds punch to flat phone photos. Too much crushes shadows to pure black and highlights to pure white.

Photo editors also offer **curves** and **levels**, which give much finer control, for example adding contrast to midtones while protecting highlights. A basic contrast slider is a quick approximation.

## Saturation

Saturation controls color intensity. 0% gives a black-and-white image, 100% is unchanged, and higher values intensify colors.

**Saturation vs vibrance:** saturation boosts all colors equally. Vibrance, found in most photo editors, boosts muted colors more than already-saturated ones and usually protects skin tones. That’s why vibrance looks more natural for portraits. CSS has no vibrance filter.

## Hue rotation

Hue rotation shifts every color around the color wheel by the same angle. A 180° rotation turns blues orange and greens magenta. It’s a creative effect, rarely a correction, although small shifts (5–15°) can warm or cool an image.

## Grayscale, sepia and invert

- **Grayscale** converts colors to luminance using weights similar to those in contrast calculations: green contributes most to perceived brightness, blue the least. That’s why a simple average of R, G and B looks wrong compared to proper grayscale conversion.
- **Sepia** maps the image to warm brown tones, imitating the look of chemically toned 19th- and early 20th-century prints. The name comes from the brown pigment made from cuttlefish ink, not from the toning chemistry itself.
- **Invert** flips every channel (255 minus the value), creating a negative.

## Blur

Blur averages each pixel with its neighbours. Gaussian blur, the most common type, weights nearby pixels more than distant ones. Light blur can soften backgrounds; heavy blur is useful for hiding information, although for redacting text a solid box is safer, as our [screenshot redaction guide](/blog/how-to-safely-redact-screenshots/) explains.

## Order matters

Filters are applied in sequence, and each one works on the result of the previous one. Brightness then contrast gives a different result from contrast then brightness. Most editors apply basic adjustments in a fixed, sensible order; CSS applies them in the order you write them.

## CSS filters versus editing the file

| Approach | Changes the file? | Can change later? | Works outside the website? | Typical use |
|---|---|---|---|---|
| CSS `filter` | No | Yes, instantly | No | Hover effects, themes, consistent looks across many images |
| Browser-based editor (export) | Yes | Only from the original | Yes | Quick edits for sharing and uploading |
| Desktop editor (Lightroom, Photoshop) | Yes, or non-destructive catalogue | Yes | Yes | Professional correction and grading |

Our [photo filters tool](/tools/photo-filters/) does both: it previews with CSS filters, lets you copy the CSS, and exports a full-resolution edited file.

## Presets and consistency

A preset is just a saved combination of adjustments. Applying the same preset to a set of images makes them look like a series, which is why brands and Instagram accounts use them. The key is consistency, not intensity. For a strong, uniform brand look, a two-color [duotone effect](/blog/duotone-effect-guide/) goes even further.

## Natural editing tips

1. **Fix exposure and contrast first,** then color.
2. **Use small amounts.** Changes of 5–15% usually look natural; 50% looks like a filter.
3. **Watch skin tones.** Over-saturation turns skin orange; hue shifts make it sickly.
4. **Check highlights and shadows.** If clouds have turned into flat white blobs or shadows into black holes, you have gone too far.
5. **Compare with the original** often. Our eyes adapt quickly to edits.
6. **Edit on a decent screen.** A very dim or very blue screen leads to edits that look wrong elsewhere.

## Black-and-white conversion tips

Not every photo works in black and white. Images with strong light and shadow, interesting textures or clear shapes do best. After converting, add some contrast; grayscale conversion alone often looks flat. If your editor allows it, adjusting how bright each original color becomes (for example darkening blue skies) gives far more control than a basic grayscale filter.

## Summary

Brightness multiplies pixel values, contrast stretches them around the middle, saturation scales color intensity and hue rotation shifts colors around the wheel. Apply small, deliberate adjustments in a sensible order, keep the original, and use CSS filters when you want effects on a website without editing files.
