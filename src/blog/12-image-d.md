@@@
slug: combine-images-before-after-collages
tool: combine-images
title: How to Combine Images: Side-by-Side Comparisons, Collages and Stitched Screenshots
desc: Practical guide to merging images: before-and-after comparisons, app screenshot rows, simple collages and stacked screenshots, including sizing, spacing, alignment and file format tips.
keywords: combine images, merge photos, side by side images, before and after photo, photo collage, stitch screenshots
###
Putting two or more images into one file sounds trivial, but it’s one of the most common small design tasks: before-and-after shots for a portfolio, three app screens next to each other for a launch post, a product shown from several angles, or a long conversation stitched from several screenshots. Done carelessly, combined images look uneven and cramped. A few rules about sizing, spacing and alignment make them look intentional.

## Why combine images at all?

- **Comparison.** Side by side, differences are obvious: before and after a renovation, edit or redesign.
- **Platform limits.** Some places allow one image per post or message, or show multiple images awkwardly.
- **Context.** A row of app screens tells the story of a user flow better than separate files.
- **Attachments.** One file is easier to email, attach to a ticket or drop into a document than five.

## The three basic layouts

| Layout | Best for | Watch out for |
|---|---|---|
| Horizontal (side by side) | Before/after, comparisons, app screens | Very wide results become tiny on phones |
| Vertical (stacked) | Long screenshots, step-by-step instructions, mobile-friendly comparisons | Very tall images may be cropped in feeds |
| Grid | Product angles, mood boards, photo sets | Mixed aspect ratios leave uneven gaps |

Our [combine images tool](/tools/combine-images/) supports all three, with spacing and background color controls.

## Matching sizes

The most common mistake is combining images of different heights side by side, so one looks tiny and the edges don’t line up. The fix is to scale images to a common dimension:

- **Side by side:** give all images the same height.
- **Stacked:** give all images the same width.
- **Grid:** give all cells the same size and fit each image inside.

When scaling to match, it’s better to scale everything down to the *smallest* image’s height (or width) than to scale small images up, which makes them blurry. That’s what our tool does when “scale to the same height/width” is on.

## Before-and-after comparisons that convince

A comparison is only persuasive if the only difference is the thing being compared.

1. **Same framing.** Shoot from the same position, at the same zoom, if you can. Crop both images to the same area and aspect ratio before combining; see our [cropping guide](/blog/cropping-photos-composition-aspect-ratios/).
2. **Same lighting and editing.** Don’t make the “after” brighter and more saturated unless that’s the point. Viewers notice, and it undermines trust.
3. **Label clearly.** Add “Before” and “After” labels, or place them in the same order everywhere (before on the left or top is the convention in left-to-right languages).
4. **Keep a small gap** (8–20px) or a thin dividing line so the two images read as separate.

For product claims, especially cosmetics, fitness or health, advertising standards in many countries require that before-and-after images are genuine and not misleadingly edited. Keep it honest.

## Spacing and background

- **No gap** creates a seamless panorama or a continuous strip; good for images designed to connect.
- **Small gap (8–20px)** gives a clean, modern collage look.
- **Large gap with colored background** creates a framed, gallery-like presentation.

Use a background color that matches where the image will be shown (white for most documents, your brand background for social posts) so the gaps look intentional.

## App screenshots

For showing a product flow:

- Use screenshots from the same device and at the same scale.
- Remove distracting status bar details (battery warnings, notifications), or use clean device mockups.
- Three to five screens is the sweet spot; more becomes unreadable at typical viewing sizes.
- For a portrait phone screen row, a horizontal layout works on desktop, but for mobile viewers a 2-column grid may read better.

## Stitching long screenshots

Many phones can take scrolling screenshots, but when they can’t, combining several screenshots vertically works. Overlap areas need trimming so content isn’t duplicated. Crop each screenshot to remove the repeated section and the status bar before stacking them with no gap.

## File format and size

| Content | Export as | Why |
|---|---|---|
| Photos | JPEG (quality 85–90) or WebP | Small files, natural images |
| Screenshots, UI, text | PNG | Keeps text sharp |
| Mixed | PNG for quality, JPEG if size matters | Test both |

Watch the dimensions. Five 4000-pixel photos side by side make a 20,000-pixel-wide image, which is far beyond what anyone needs and too large for some apps. Browsers also limit canvas sizes, and the limits vary by browser and device; mobile Safari is especially strict about total canvas area. Our tool caps the output at 12,000 pixels on the longest side for reliability. For web use, resize the result with an [image resizer](/tools/image-resizer/).

## Accessibility

When a combined image is used on a website, describe what is being compared in the alt text, not just “before and after”. For example: “Kitchen before renovation with dark wood cabinets, and after with white cabinets and open shelving.” If the comparison is important, consider showing the images separately in HTML with captions, which also adapts better to mobile layouts.

## Summary

Combining images works best when sizes are matched, spacing is deliberate and the purpose is clear. Scale to a common height or width (down, not up), use small consistent gaps, label comparisons honestly, and export PNG for screenshots and JPEG or WebP for photos. Keep the final dimensions sensible for where the image will be viewed.

@@@
slug: how-to-safely-redact-screenshots
tool: pixelate-image
title: How to Safely Redact Screenshots: Pixelation vs Blur vs Black Boxes
desc: Which redaction methods actually hide information, why weak pixelation and blur can be reversed, what to check before sharing a screenshot, and how to remove hidden data too.
keywords: redact screenshot, blur sensitive information, pixelate image, censor screenshot, hide personal information, black box redaction
###
Screenshots are shared constantly: in bug reports, support chats, social posts and documentation. They also routinely leak information: email addresses, customer names, account numbers, browser tabs, and sometimes passwords. Hiding that information seems simple. Draw a blur over it and move on. But not all redaction methods are equally safe, and some that look secure can be partially reversed.

## What to look for before you share

Before sharing any screenshot, scan it for:

- names, email addresses and phone numbers (yours and other people’s),
- account, order, invoice, ticket and card numbers,
- API keys, tokens, passwords and one-time codes,
- internal URLs and IP addresses in the address bar,
- browser tabs, bookmarks and notification previews revealing other activity,
- faces, license plates, house numbers and street signs in photos,
- profile pictures and avatars in chat screenshots.

Corners and edges are where leaks hide: a notification in the top bar, a tab title, a name in a sidebar.

## Three ways to hide information

| Method | How it works | Can it be reversed? | Use for |
|---|---|---|---|
| Solid box (black or any color) | Replaces pixels with a single color | No; the information is gone | Passwords, keys, card numbers, ID numbers |
| Strong pixelation | Averages large blocks of pixels | Very hard, if blocks are large relative to the text | Faces, names, general content |
| Light pixelation | Averages small blocks | Sometimes, for short known-format text | Avoid for sensitive data |
| Strong blur | Smears pixels over a large radius | Very hard | Faces, backgrounds |
| Light blur | Smears pixels slightly | Sometimes partly recoverable | Avoid for sensitive data |

## Why weak pixelation and blur can fail

Pixelation replaces each block of pixels with its average color. Blur spreads each pixel’s color over its neighbours. Both destroy detail, but they do it in a predictable, deterministic way.

If an attacker knows roughly what the hidden content is, for example a number in a known font at a known size, they can render every possible candidate, pixelate or blur it the same way, and compare the results with the redacted image. For short strings like PINs, account numbers or a handful of words, this can work surprisingly well. Researchers and security professionals have demonstrated it repeatedly, and open-source tools exist that attempt to recover pixelated text this way.

Larger blocks and stronger blur make this much harder, because more information is destroyed. But the only method that removes information completely is replacing it entirely with a solid color.

## The other classic mistake: redaction that isn’t burned in

Redaction must change the actual image pixels in the exported file. Problems happen when:

- **A shape is drawn over text in a PDF or document** but the text underneath remains. Anyone can select and copy it, or remove the shape. Several high-profile legal and government documents have leaked this way.
- **An editor keeps layers.** Saving a layered file (PSD, some PDF exports) can preserve the original under the redaction.
- **Cropping tools keep the full image.** Some editors and phone apps have saved cropped images in ways that kept recoverable original data. In 2023, flaws nicknamed “aCropalypse” were found in Google Pixel’s Markup tool and the Windows Snipping Tool, where cropped screenshots could retain data from the original. Both were patched, but it shows why you should export a fresh, flat image.

Our [pixelate and blur tool](/tools/pixelate-image/) draws the effect into the canvas and exports a new flat image, so nothing remains underneath.

## Hidden data beyond the pixels

Even a perfectly redacted image can leak information through metadata:

- photos from phones often contain GPS coordinates, the date and time, and the device model,
- edited images can contain software names, author fields and sometimes thumbnails of the original.

Screenshots usually carry little metadata, but photos certainly do. Check and strip it before sharing; our [EXIF and photo privacy guide](/blog/photo-metadata-exif-privacy/) explains what’s inside.

## A safe redaction workflow

1. **Crop first.** Remove everything that isn’t needed. The safest redaction is not including the information at all.
2. **Use solid boxes for secrets.** Passwords, keys, tokens, full card or account numbers.
3. **Use strong pixelation or blur for faces and names.** Make the blocks large relative to the content.
4. **Cover the whole area,** including partial characters at the edges.
5. **Export a new flat image** (PNG for screenshots).
6. **Check metadata** if the image is a photo.
7. **Rotate leaked secrets.** If a password or API key was ever visible in a shared screenshot, change it. Redacting later doesn’t un-share the original.

## Screen recordings need extra care

Redacting video is harder than redacting a single screenshot, because sensitive details can appear for just a few frames: a notification sliding in, an autocomplete suggestion, a password manager pop-up. Before recording a demo or bug report, close unrelated apps and tabs, turn on do-not-disturb, use a test account with fake data, and zoom into the relevant window. If something slips through, cover it for the entire time it is visible, including the frames where it fades in and out, and re-watch the export at full resolution before sharing.

## Pixelation as a style

Not every use of pixelation is about privacy. Pixelating a whole image with medium-sized blocks creates a retro 8-bit look, popular for game-related graphics and playful branding. For an artistic result, use larger blocks and consider reducing the number of colors.

## Summary

Solid boxes are the only redaction method that can’t be reversed, so use them for anything truly sensitive. Strong pixelation and blur work for faces and general content, while light versions can sometimes be decoded. Make sure redaction is burned into a fresh, flat image, remove metadata from photos, crop out what you don’t need, and change any secret that was ever exposed.

@@@
slug: rounded-corners-images-css-vs-baked
tool: rounded-corners-image
title: Rounded Corners on Images: CSS border-radius vs Baked-In Transparent Corners
desc: When to round image corners with CSS and when to export rounded PNGs, how transparency works for corners, circle avatars, borders, and where baked-in corners are still required.
keywords: rounded corners image, round image corners, circle crop image, border radius image, transparent corners png, rounded avatar
###
Rounded corners soften images and help them match the rounded cards and buttons of modern interfaces. There are two ways to get them: round the corners in CSS when the image is displayed, or bake the rounding into the image file itself. Each has clear advantages, and choosing the wrong one creates extra work.

## Option 1: CSS border-radius

```
img.rounded { border-radius: 16px; }
img.avatar { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; }
```

The image file stays a normal rectangle. The browser clips its corners at display time.

**Advantages:**

- The original file is reused everywhere; you can change the radius site-wide with one line.
- Works with responsive sizes; the radius stays consistent as the image scales.
- No re-exporting when the design changes.
- Combined with `object-fit: cover`, any rectangular photo becomes a neat circle avatar.

## Option 2: corners baked into the file

The image is exported with its corners already rounded, usually with transparent pixels outside the curve.

**Advantages:**

- Works anywhere, including places that don’t run your CSS: emails, presentations, documents, social media, app stores, chat apps and marketplaces.
- The look is guaranteed regardless of where the file ends up.

Our [rounded corners tool](/tools/rounded-corners-image/) creates these files, with optional borders and a circle crop.

## Comparison

| Aspect | CSS border-radius | Baked-in corners |
|---|---|---|
| Editable later | Yes, instantly | No, re-export needed |
| File format requirement | Any | PNG or WebP for transparency (JPG needs a solid corner color) |
| Works in email and documents | Unreliable in email; not applicable to documents | Yes |
| Works on social media | No | Yes (though some platforms crop images their own way) |
| Consistent radius at all sizes | Yes | No, the radius scales with the image |
| File size | Unchanged | PNG may be larger than the original JPEG |

The rule of thumb: **on your own website, use CSS. Everywhere else, bake it in.**

## Transparency and file formats

Rounded corners need something outside the curve. In formats with an alpha channel (PNG, WebP, AVIF), those pixels can be fully transparent, so the image sits cleanly on any background.

JPEG has no transparency. Corners must be filled with a solid color, which only looks right if it matches the background where the image will be placed. That’s fine for a white document or a slide with a known background color, but not for unpredictable places like social feeds that switch between light and dark mode.

Converting a photo from JPEG to PNG to get transparent corners can increase the file size several times, because PNG compresses photos poorly. Lossy WebP with transparency is the best of both worlds where it’s supported. For a deeper comparison, see [JPG vs PNG vs WebP vs AVIF](/blog/jpg-vs-png-vs-webp-vs-avif/).

## The radius scales with the image

A baked-in 24px radius on a 1200px image becomes a 6px radius when that image is displayed at 300px. If the image will be shown at a different size than you export it, choose the radius relative to the display size, or define it as a percentage of the image (our tool uses a percentage of the shorter side for this reason).

CSS radii in pixels stay the same size no matter how large the image is displayed, which keeps them consistent with buttons and cards.

## Circles and avatars

For profile pictures:

- Start with a square image, with the face centered and some space around it.
- On your site, use CSS: `border-radius: 50%` on a square element.
- For uploads to platforms, most of them already display avatars as circles, so upload a square image. Pre-cropping to a circle with transparent corners can look odd on platforms that place a circle over a square anyway.
- For documents and email signatures, a baked-in circle PNG with transparent corners looks neat.

## Borders

A thin border around a rounded image helps it stand out on a background of a similar color, for example a white screenshot on a white page. In CSS, add `border: 1px solid #e5e5e5` or an inset box-shadow. When baking it in, make sure the inner corner radius is slightly smaller than the outer radius by the border width, or the border looks uneven at the corners. This is the same nested-radius rule explained in our [border radius guide](/blog/border-radius-guide-rounded-corners/).

## Rounded screenshots for presentations

Rounded screenshots look polished in slide decks and marketing material. Tips:

- Add a subtle shadow so the screenshot lifts off the slide (most slide tools can do this).
- Use a consistent radius across all screenshots in the deck.
- Export PNG to keep text sharp.
- Match the corner background to the slide color if you export JPEG.

## Email and office documents in practice

Email is where the CSS approach most often breaks. Classic Outlook for Windows renders HTML email with Microsoft Word’s layout engine, which ignores `border-radius` entirely, so CSS-rounded images show up as plain rectangles for those readers. Many other clients support it, but email designers usually bake corners into the image to get the same result everywhere.

Word processors and slide tools are similar. They can apply rounded picture styles, but the effect depends on the application and often disappears when the file is exported or opened elsewhere. A PNG with transparent corners looks the same in Word, Google Docs, Keynote, PowerPoint and a PDF.

| Destination | Recommended approach |
|---|---|
| Your website or web app | CSS `border-radius` |
| HTML email newsletters | Baked-in corners (PNG, or JPEG on a matching background) |
| Slides and documents | Baked-in PNG with transparent corners |
| Social media posts | Usually leave square; platforms apply their own framing |
| App store screenshots | Follow the store’s guidelines; most expect full rectangles |

## Summary

On your own website, round image corners with CSS: it’s flexible, consistent and doesn’t change the files. For emails, documents, slides and platforms that don’t run your CSS, bake the corners into a PNG or WebP with transparent corners, or into a JPEG with a matching background color. Choose the radius relative to the size at which the image will be displayed.

@@@
slug: duotone-effect-guide
tool: duotone-image-generator
title: The Duotone Effect: How Two-Color Images Work and How Brands Use Them
desc: Where duotone comes from, how a gradient map converts brightness into two colors, how to choose color pairs and photos that work, and how to use duotone for brand consistency and text overlays.
keywords: duotone effect, duotone image, two color photo, gradient map, duotone photoshop, brand photography style
###
Duotone images, photos recolored with just two colors, are striking, graphic and instantly recognisable. Spotify’s campaigns around 2015 and 2016 made the look famous in digital design, but the technique is much older. It is also one of the most practical ways to make photos from many different sources look like they belong to the same brand.

## Where duotone comes from

In printing, a duotone is an image printed with two inks, typically black plus one spot color. Printers used it to add depth and richness to black-and-white photos: a second ink extends the tonal range, so shadows look deeper and midtones smoother than with black alone. Many classic photography books were printed as duotones for exactly this reason. Tritones and quadtones use three and four inks.

The digital duotone effect borrows the name but works a little differently: it maps the brightness of every pixel onto a gradient between two chosen colors.

## How the digital effect works

1. **Calculate the brightness** (luminance) of each pixel, a value from 0 (black) to 1 (white). Good conversions weight green highest and blue lowest, matching human perception: roughly 0.2126 R + 0.7152 G + 0.0722 B.
2. **Map that brightness onto a gradient** from a shadow color to a highlight color. A pixel with brightness 0.3 becomes the color 30% of the way from the shadow color to the highlight color.
3. **Optionally adjust contrast first**, to push more pixels toward the two extremes for a bolder result.

This is called a **gradient map**, and it’s exactly what Photoshop’s Gradient Map adjustment does with a two-color gradient. Our [duotone generator](/tools/duotone-image-generator/) does the same in your browser, with presets and contrast and brightness controls.

## Choosing color pairs

The key is contrast in **lightness** between the two colors, not just a difference in hue.

| Pair type | Example | Result |
|---|---|---|
| Dark + light, different hues | Navy + gold, indigo + coral | Bold and graphic; the classic duotone look |
| Dark + light, same hue family | Forest green + mint | Calm, monochrome feel |
| Black + one color | Black + yellow | High impact, poster-like |
| Two mid-tones | Medium red + medium blue | Flat and muddy; avoid |

If both colors have similar lightness, the image loses its shapes, because everything maps to similar-looking colors. Check the lightness difference by comparing the two colors in a [contrast checker](/tools/contrast-checker/); a ratio of 4:1 or more between them usually gives a clear image.

## Photos that work well

- **Strong lighting** with clear highlights and shadows.
- **Simple backgrounds**, so the subject reads clearly in two colors.
- **Portraits and silhouettes**, where shapes are distinctive.
- **Architecture and objects** with bold geometry.

Photos that are flat, low-contrast or very busy tend to turn into indistinct blobs. Increasing contrast helps, as does cropping tightly around the subject. For basic tonal adjustments before applying the effect, see our guide to [brightness, contrast and saturation](/blog/photo-adjustments-brightness-contrast-saturation/).

## Why brands love duotone

**Consistency from inconsistent sources.** Stock photos, user-submitted images and event photography rarely share the same lighting or color grading. Applying the same duotone to all of them creates a unified visual series.

**Built-in brand colors.** Using your brand’s dark and light colors puts your identity into every photo, even when the logo isn’t visible.

**Text over images.** A duotone with a dark shadow color creates a predictable, darker image that white headlines can sit on safely. With full-color photos, contrast varies wildly.

**Distinctiveness.** Two-color imagery stands out in feeds full of full-color photography.

## Duotone versus other stylistic treatments

| Treatment | Colors | Best for |
|---|---|---|
| Duotone | Two, mapped by brightness | Brand consistency, posters, text overlays |
| Monochrome tint | One hue at different lightness | Subtle, elegant consistency |
| Black and white | None | Timeless, documentary feel |
| Color overlay (multiply blend) | Original colors + a tint | Softer brand flavour, keeps some original color |
| Full-color photo | Natural | Product accuracy, food, fashion |

Don’t use duotone where accurate color matters, such as product photos of clothing or cosmetics, food photography or real estate. Customers need to see the real colors.

## Doing duotone in CSS

On websites you can approximate duotone without editing images, for example by combining `filter: grayscale(1)` with blend modes over a colored background, or using an SVG `feColorMatrix` / `feComponentTransfer` filter, which can apply a true gradient map. These are useful for hover effects and themes, but exported images are more predictable across browsers and work in email and social media.

## Accessibility notes

Duotone changes how images look but not what they mean, so alt text should still describe the content, not the effect. If text sits on a duotone image, check contrast against the lightest color in the area behind the text.

## A quick workflow for a campaign

1. **Pick the pair once.** Choose a dark shadow color and a light highlight color from your brand palette, and write them down as part of the campaign style.
2. **Select suitable photos.** Favour strong lighting and simple backgrounds; reject flat, busy images early rather than fighting them later.
3. **Crop before recoloring,** so the subject fills the frame and the two-color shapes read clearly at small sizes.
4. **Apply the same contrast setting** to every image. Small per-image tweaks are fine, but large differences break the series.
5. **Test with your actual headline and logo** on top, in the sizes you will publish.
6. **Export at the target size** for each channel, using JPEG for photos and PNG if crisp text is baked into the image.

Keeping these decisions fixed is what turns a filter into a recognisable visual system: people start to identify your posts before they read the name.

## Summary

Duotone maps each pixel’s brightness onto a gradient between a shadow color and a highlight color. Choose two colors with a big difference in lightness, use photos with strong light and simple backgrounds, and apply the same pair across a campaign for instant brand consistency. Keep full color for anything where accurate color matters to the viewer.
