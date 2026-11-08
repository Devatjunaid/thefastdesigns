@@@
slug: how-to-pick-exact-colors-from-images
tool: image-color-picker
title: How to Pick Exact Colors From an Image (and Why Values Sometimes Differ)
desc: Learn how eyedropper tools read pixel colors, why JPEG compression and color profiles change values, and how to get an accurate HEX code from logos, screenshots and photos.
keywords: pick color from image, eyedropper tool, get hex from image, color picker from photo, match brand color
###
A client sends a logo as a JPEG attachment and asks you to “match the blue”. You open an eyedropper, click, and get `#1F5FA8`. A colleague clicks two pixels away and gets `#2160A9`. Neither of you is wrong. Pixel-level color picking is simple in principle, but compression, anti-aliasing and color profiles all affect the number you see. Knowing where those differences come from lets you pick the right value the first time.

## How an eyedropper works

Every digital image is a grid of pixels, and each pixel stores a color, usually as red, green and blue values from 0 to 255. An eyedropper tool reads the value of the pixel under your cursor and shows it as HEX or RGB. In a browser-based picker like our [image color picker](/tools/image-color-picker/), the image is drawn onto an HTML canvas and the canvas returns the pixel’s RGBA values. No file is uploaded, because the canvas lives on your device.

Design apps work the same way, with one useful extra: many let you sample an average of a 3×3 or 5×5 pixel area instead of a single pixel. Averaging reduces the effect of noise in photos.

## Why two clicks give two different colors

**JPEG compression.** JPEG splits an image into 8×8 pixel blocks and stores an approximation of each block. Flat areas of color come out slightly uneven, and colors near sharp edges pick up neighbouring tones. At high compression you can see this as blocky artifacts. That is why a logo color sampled from a JPEG often varies by a few values from pixel to pixel.

**Anti-aliasing.** The edges of text and shapes are smoothed by blending them with the background. A pixel on the edge of a blue letter on white is partly blue and partly white. Always sample from the middle of a solid area, never from an edge.

**Chroma subsampling.** Many JPEGs store color at half or quarter resolution compared to brightness (called 4:2:0 subsampling). Fine colored details, like thin colored text, lose color accuracy even when the shapes look sharp.

**Scaling.** When an image is resized, pixels are blended together. A screenshot of a website at 150% zoom is not the same as the original colors at 100%.

**Color profiles.** Photos from cameras and phones often carry an embedded color profile, such as Display P3 on recent iPhones. Browsers convert those colors into the screen’s color space when drawing them. Most web pages work in sRGB, so values sampled in a browser are usually sRGB values, which is what you want for CSS. A design app working in a different color space might show different numbers for the same image.

## Choosing the best source file

| Source | Color accuracy | Notes |
|---|---|---|
| SVG or vector PDF | Exact | Colors are stored as numbers, not pixels. Open the file and read the fill value. |
| PNG | Exact for flat colors | Lossless; perfect for logos and UI screenshots. |
| JPEG (high quality) | Close, ±1–5 values | Sample the center of large flat areas. |
| JPEG (low quality) or social media download | Approximate | Re-compression shifts colors and adds noise. |
| Photo of a printed item | Rough | Lighting, camera and paper all change the color. |

If you need a brand color exactly, the best source is not an image at all. Ask for the brand guidelines, or open a vector version of the logo and read the color from the file. An eyedropper is the fallback when nothing better exists.

## A reliable workflow

1. **Get the cleanest file available.** Prefer SVG, then PNG, then the largest JPEG.
2. **Zoom in** on a large flat area of the color you want.
3. **Sample several points** and compare. If they differ, the most common value or an average is usually closest to the original.
4. **Check the result in context.** Put the sampled color next to the original image. If it looks off, the original might be in a wide-gamut color space or heavily compressed.
5. **Round sensibly.** If you get `#1F5FA8`, `#2060A8` and `#1E5EA7`, the designer probably used a single value close to those. Pick one, document it, and move on.

## Sampling colors from photos

Photographs don’t have one “true” color. A red apple has dozens of reds across its surface, depending on light and shadow. When building a palette from a photo, sample deliberately:

- one point from the brightest highlight (often near white or a light tint),
- a few from the midtones, where the color is most saturated,
- one from the deepest shadow (often a dark, desaturated tone).

This gives a natural range from light to dark within the same mood. If you just want the most common colors automatically, an [image palette extractor](/tools/image-palette-extractor/) groups similar pixels and returns the dominant colors, which is faster for mood boards.

## Eyedropper versus palette extractor

| Task | Eyedropper | Palette extractor |
|---|---|---|
| Match one exact brand color | Best choice | Not precise enough |
| Get 5–8 colors representing a photo’s mood | Slow, manual | Best choice |
| Find the color of a specific object | Best choice | May merge it with similar colors |
| Ignore noise and texture | Needs care | Handles it automatically |

## Turning the picked color into something usable

Once you have the HEX code, you will usually need more than one version of it. Convert it to RGB, HSL or CMYK with a [color converter](/tools/color-converter/). Build lighter and darker variants with a [tints and shades generator](/tools/tints-and-shades-generator/). And if the color will be used for text, check it against its background with a [contrast checker](/tools/contrast-checker/); colors picked from logos are often too light for small text.

If you are trying to describe the color in words, for example in a design brief, a [color name finder](/tools/color-name-finder/) gives you the closest standard name.

## Privacy note

Screenshots of client work, unreleased products or internal dashboards shouldn’t be uploaded to random websites. Browser-based tools that use the canvas process the image locally; you can confirm this by disconnecting from the internet after the page loads, and the tool will still work.

Picking colors from images is one of those tasks that seems trivial until the numbers don’t match. Start with the best source file, sample flat areas, and treat compressed images as approximate. Then document the final value so nobody has to pick it again.

@@@
slug: extract-color-palette-from-photos
tool: image-palette-extractor
title: How to Extract a Color Palette From a Photo (and Make It Usable)
desc: How automatic palette extraction finds dominant colors, the difference between k-means, median cut and bucketing, and how to turn photo colors into a balanced design palette.
keywords: extract color palette from image, dominant colors, palette from photo, color quantization, mood board colors
###
Photographs are one of the best sources of color inspiration. A landscape at dusk, a market stall or a mid-century interior already contains colors that work together, because they came from the same light. Extracting a palette from a photo turns that harmony into HEX codes you can use. The extraction is automatic, but getting a *useful* palette takes a little judgement.

## What “dominant colors” means

A typical 12-megapixel photo contains millions of pixels and often hundreds of thousands of unique colors, because every slight change in light creates a new value. A palette extractor reduces those to a handful of representative colors. This process is called **color quantization**, and it is the same problem image formats like GIF solved in the 1980s, when images had to be reduced to 256 colors.

There are several common approaches:

| Method | How it works | Strengths | Weaknesses |
|---|---|---|---|
| Bucketing (histogram) | Round each pixel to a coarse grid and count how many land in each cell | Very fast, predictable | Can split one color across two buckets |
| Median cut | Repeatedly split the color space along its widest range | Balanced results, classic in GIF tools | Favors large areas |
| K-means clustering | Start with k guesses and move them to the center of nearby pixels | Accurate cluster centers | Slower, results vary with starting points |
| Octree | Build a tree of colors and merge the least-used branches | Memory efficient | More complex to implement |

Our [image palette extractor](/tools/image-palette-extractor/) uses bucketing with averaging: it downscales the image, groups pixels into color buckets, averages each bucket and then merges colors that are too similar. For mood-board purposes the differences between methods are small; all of them find the colors that cover the most area.

## The big catch: area is not importance

Automatic extraction ranks colors by how many pixels they cover. In most photos the biggest areas are backgrounds: sky, walls, floors, shadows. The color that makes the photo memorable, like a red scarf or a yellow taxi, may cover 2% of the frame and barely register.

That leads to two practical tips:

1. **Crop first.** If you love the colors of one part of an image, crop to that part before extracting. The palette will reflect what you care about.
2. **Ask for more colors than you need.** Extract eight to ten, then pick the four or five that work as a set. The less dominant colors are often the best accents.

## From photo colors to a design palette

A raw extracted palette is a set of colors with no roles. To make it usable in a layout:

**Find the neutrals.** Most photos produce at least one near-white, one near-black and a mid-grey with a tint. These are your background and text candidates. Tinted neutrals pulled from a photo look more natural than pure greys.

**Pick one hero color.** Choose the most distinctive saturated color for buttons, links or key graphics. This is your 10% accent in the 60-30-10 rule, which we explain in our guide to [building palettes with color theory](/blog/how-to-build-a-color-palette-with-color-theory/).

**Choose one or two supporting colors.** Usually a softer version of the hero or a related hue, used for secondary surfaces and illustrations.

**Adjust for function.** Photo colors are often mid-tones, which fail contrast checks as text. Keep the hue but darken it for text, or lighten it for backgrounds. A [color scale generator](/tools/color-scale-generator/) can produce the full range from one extracted color.

## Which photos make good palettes

- **Images with a clear light source**, like golden-hour landscapes, give warm, cohesive palettes.
- **Paintings and film stills** are excellent because their colors were chosen intentionally. Cinematographers grade films with deliberate color schemes, often complementary teal and orange.
- **Product and interior photography** gives refined, commercial palettes.
- **Flat illustrations and posters** give exact colors with very little noise.
- **Busy snapshots** under mixed lighting (for example indoor tungsten plus daylight) give muddy, inconsistent palettes.

## Extracted palette versus color theory

| Approach | Starting point | Result feels | Best for |
|---|---|---|---|
| Photo extraction | An image you like | Natural, mood-driven | Branding from photography, editorial, mood boards |
| Color harmony rules | One base color | Balanced, systematic | UI systems, quick consistent schemes |
| Random generation | Nothing | Surprising | Breaking creative block |

These approaches combine well. Extract a palette from a photo, choose your hero color, then use the [palette generator](/tools/color-palette-generator/) to check which harmony it belongs to and fill any gaps. If the extracted colors feel too similar, a complementary accent from color theory can add the contrast you need.

## Checking the result

Before committing, test the palette the same way you would any other:

- Put text colors on background colors and run them through the [contrast checker](/tools/contrast-checker/).
- Check that important distinctions survive color blindness with the [color blindness simulator](/tools/color-blindness-simulator/).
- Build a quick mock layout. Colors that look great as small swatches can be overpowering as full-width backgrounds.

## A note on copyright

Colors themselves cannot be copyrighted, so a palette extracted from any image is free to use. The image itself is another matter: use your own photos, licensed stock or public-domain artwork if you plan to display the source image alongside the palette, for example in a brand presentation.

## Summary

Automatic extraction finds the colors that cover the most area. Crop to what matters, extract more colors than you need, then assign roles and adjust them for contrast. A photo gives you the mood; your design decisions turn it into a palette that works on every screen.

@@@
slug: designing-for-color-blindness
tool: color-blindness-simulator
title: Designing for Color Blindness: Types, Statistics and Practical Fixes
desc: Understand protanopia, deuteranopia, tritanopia and achromatopsia, how common each type is, which color pairs cause problems, and how to design charts and UI that work for everyone.
keywords: color blindness design, color blind friendly palette, deuteranopia, protanopia, accessible charts, colorblind safe colors
###
Roughly one in twelve men and one in two hundred women have some form of color vision deficiency. In a room of 50 people, that is likely two or three. If your interface uses only red and green to show “error” and “success”, or your chart legend depends on telling orange from green, some of those people will miss the information completely. Designing for color blindness is not about removing color; it is about making sure color is never the only clue.

## How color vision works

The retina has three types of cone cells, each most sensitive to a different range of wavelengths: long (L, reddish), medium (M, greenish) and short (S, bluish). The brain compares their signals to perceive color. Color vision deficiency happens when one type of cone is missing or its sensitivity is shifted.

## The main types

| Type | Affected cones | Effect | Approximate prevalence |
|---|---|---|---|
| Deuteranomaly | M (green) shifted | Reds and greens look similar, weaker form | About 5% of men |
| Protanomaly | L (red) shifted | Reds look darker, red–green confusion | About 1% of men |
| Deuteranopia | M missing | Strong red–green confusion | About 1% of men |
| Protanopia | L missing | Red–green confusion, reds look very dark | About 1% of men |
| Tritanomaly / tritanopia | S affected | Blue–yellow and blue–green confusion | Rare, about 1 in 10,000 or fewer |
| Achromatopsia | No functioning cones | No color, sensitivity to light | Very rare, about 1 in 30,000 |

The red–green types are inherited through the X chromosome, which is why they are so much more common in men. Prevalence also varies by population; the figures above are typical for people of Northern European descent and lower in some other groups.

Note that “red–green” is a simplification. People with deuteranopia also confuse some blues with purples, and some browns with greens, because those colors differ mainly in their red or green component.

## What actually goes wrong in designs

**Status colors.** Green success and red error messages can look like the same muddy brown-yellow. If there is no icon or text label, the user can’t tell whether their form submitted.

**Charts and maps.** Line charts with red and green series, heat maps from green to red, and pie charts with many hues are the most common problem. Legends that rely on matching small colored squares are especially hard.

**Links.** If links differ from body text only in color, some users can’t find them. WCAG requires links to be distinguishable by more than color, for example with an underline, unless the color difference itself has at least 3:1 contrast with surrounding text.

**Form validation.** A red border on an invalid field is invisible to some users if the normal border is grey or green.

**Games and data dashboards.** Team colors, map markers and status lights often rely on red versus green.

## How to test

The fastest way is simulation. Take a screenshot of your page or chart and run it through a [color blindness simulator](/tools/color-blindness-simulator/). Our tool applies transformation matrices that approximate each condition, showing the original and simulated versions side by side. Simulations are approximations, since each person’s perception differs, but they reliably reveal where information disappears.

A quick extra test: convert the screenshot to grayscale. If you can still understand everything, you are in good shape for every type of color vision.

## Practical fixes

**1. Never use color alone.** This is WCAG success criterion 1.4.1. Pair color with a second cue:

- icons (a checkmark for success, an exclamation mark for errors),
- text labels (“Saved”, “Payment failed”),
- patterns or textures in charts,
- position or shape (filled versus outlined markers).

**2. Vary lightness, not just hue.** Two colors with different lightness stay distinguishable even when their hue is confused. A dark red and a light green are much safer than a medium red and a medium green.

**3. Choose safer color pairs.** Blue and orange is one of the most robust pairs, distinguishable for all common types of color blindness. Blue and red, or purple and yellow, also work well. Avoid red/green, green/brown, blue/purple and green/grey as your only distinction.

**4. Label charts directly.** Put labels next to lines and segments instead of relying on a separate legend. Direct labels help everyone, not just color-blind users.

**5. Use established color-blind-safe palettes for data.** The Okabe–Ito palette (eight colors designed by Masataka Okabe and Kei Ito) and the Viridis family of color maps are widely used in scientific publishing because they remain distinguishable under the common deficiencies and in grayscale.

## Comparison: common status color approaches

| Approach | Works for red–green CVD? | Works in grayscale? | Notes |
|---|---|---|---|
| Red vs green text only | No | No | Avoid |
| Red vs green + icons | Yes | Yes | Simple, effective |
| Red vs blue | Mostly | Depends on lightness | Breaks the green = success convention |
| Dark red vs light green + labels | Yes | Yes | Best of both |

## It helps everyone

Clear labels and icons also help people using screens in sunlight, printing in black and white, using night modes that shift colors, or simply scanning quickly. Designs that pass a color blindness test are usually clearer for all users.

## A short checklist

- Does every colored status also have an icon or text?
- Can you tell chart series apart in grayscale?
- Are links underlined or otherwise marked?
- Do error states change more than just a border color?
- Did you check the palette with a simulator and a [contrast checker](/tools/contrast-checker/)?

Color is a powerful tool for meaning, but it should reinforce information, not carry it alone. If you are building a new palette, our guide on [color palettes and color theory](/blog/how-to-build-a-color-palette-with-color-theory/) shows how to keep this in mind from the start.

@@@
slug: digital-color-mixing-rgb-vs-paint
tool: color-mixer
title: Digital Color Mixing: Why Blue + Yellow Doesn’t Make Green on Screen
desc: How color mixing works in RGB compared to paint, why blending in sRGB can look muddy, and how to mix colors for hover states, gradients and chart scales with CSS color-mix().
keywords: color mixing, mix two colors, rgb vs paint mixing, additive vs subtractive color, css color-mix, color blending
###
In school we learn that blue and yellow make green. Try mixing `#0000FF` and `#FFFF00` in a digital color mixer, though, and you get a flat grey, `#808080`. Nothing is broken. Screens and paint mix color in completely different ways, and once you understand the difference, digital mixing becomes a precise and useful design tool.

## Additive versus subtractive mixing

**Paint and ink mix subtractively.** Pigments absorb (subtract) certain wavelengths of light and reflect the rest. Yellow paint absorbs blue light; blue paint absorbs red and some green. Mix them, and the only wavelengths both reflect are in the green range, so you see green. The more pigments you add, the darker the mix gets.

**Screens mix additively.** Pixels emit light. Red, green and blue light add together; all three at full strength make white. Yellow on screen is red light plus green light. Blue is blue light.

**A digital color mixer averages.** When software “mixes” two colors, it usually doesn’t simulate paint at all. It interpolates each RGB channel: halfway between blue (0, 0, 255) and yellow (255, 255, 0) is (128, 128, 128), which is grey. The two colors are complementary on the RGB wheel, so averaging them cancels out the hue.

| Mixing type | Example | Blue + Yellow gives | Used in |
|---|---|---|---|
| Subtractive (pigment) | Paint, ink | Green | Art, printing |
| Additive (light) | Stage lights, displays | White (if both lights shine together) | Hardware, lighting |
| Interpolation (averaging) | Design software, CSS | Grey | Gradients, tints, UI states |

Some painting apps simulate pigment behaviour with specialised models, but standard design tools, CSS and image editors interpolate.

## Why interpolation is useful

Averaging sounds less magical than paint, but it is exactly what interface design needs:

- **Hover states.** Mix a button color 12% toward black for a predictable, slightly darker hover.
- **Tinted backgrounds.** Mix 10% of a brand color into white for a subtle branded surface.
- **Fake transparency.** Mixing a color with the background color gives the same visual result as transparency, without layering problems.
- **Gradient steps.** Five evenly spaced mixes between two colors give a smooth sequential scale for charts and maps.
- **Finding a midpoint.** The halfway color between two brand colors often makes a harmonious third color.

Our [color mixer](/tools/color-mixer/) does this with a slider for the ratio and shows a row of steps between the two colors.

## The muddy middle problem

Mixing two saturated colors that are far apart on the color wheel produces desaturated, greyish midpoints. This is why some CSS gradients look dull in the middle, for example a gradient from blue to orange.

The cause is that interpolation in sRGB takes a straight line through the color cube, and that line passes close to the grey axis. There are two common fixes:

1. **Add a middle color stop** that keeps saturation high, for example blue → purple → orange.
2. **Interpolate in a different color space.** Modern CSS lets you choose: `linear-gradient(in oklch, blue, orange)` or `color-mix(in oklch, blue, orange)`. OKLCH interpolates hue around the wheel, keeping saturation, so the midpoint becomes a vivid color rather than grey.

| Color space | Blue → orange midpoint | Notes |
|---|---|---|
| sRGB | Greyish | Default for older CSS, Sass mix() |
| Linear sRGB | Lighter grey-pink | Physically accurate light mixing |
| OKLab | Smooth, slightly muted | Perceptually even |
| OKLCH | Vivid magenta or green, depending on hue direction | Keeps chroma, can produce unexpected hues |

There is no single “correct” space. sRGB is predictable and matches most design tools. OKLab gives the smoothest perceptual steps. OKLCH keeps colors vivid. Try a few and pick the result you like.

## Mixing in CSS today

The `color-mix()` function is supported in all current major browsers:

```
.button:hover { background: color-mix(in srgb, var(--brand) 88%, black); }
.card { background: color-mix(in srgb, var(--brand) 8%, white); }
```

The percentage is the amount of the first color. This makes it easy to build complete themes from one or two variables, and to let users pick a custom accent color without recalculating dozens of tokens.

For design systems you hand to other teams, fixed tokens (exact HEX values) are still easier to document and audit for contrast. A good compromise is to use `color-mix()` while exploring, then bake the results into tokens with a [tints and shades generator](/tools/tints-and-shades-generator/) or [color scale generator](/tools/color-scale-generator/).

## Practical mixing recipes

- **Hover on dark buttons:** mix 10–15% toward white.
- **Hover on light buttons:** mix 5–10% toward black.
- **Disabled state:** mix 50–60% toward the background color.
- **Subtle branded surface:** 5–10% brand color into white (light mode) or into near-black (dark mode).
- **Chart scale:** five to seven steps from a light neutral to your brand color.
- **Tinted neutrals:** mix 3–8% of your brand hue into each grey.

## Checking contrast after mixing

Mixed colors change lightness, so recheck text contrast. A hover state that darkens a button increases contrast with white text, which is fine. A disabled state that fades toward the background will lower contrast; that is allowed for disabled controls under WCAG, but don’t use the same faded color for active text. Our [contrast checker](/tools/contrast-checker/) makes this a ten-second job.

## Summary

On screen, mixing means averaging, not combining pigments. That’s why complementary colors blend to grey, and why gradients between distant hues can look dull. Use interpolation for what it is great at: predictable hover states, tints, gradients and scales. When you need vivid midpoints, add a stop or interpolate in OKLCH. If you want to understand how screen colors are stored in the first place, read our guide to [HEX, RGB, HSL and CMYK](/blog/hex-rgb-hsl-cmyk-color-codes-explained/).
