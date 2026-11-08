@@@
slug: hex-rgb-hsl-cmyk-color-codes-explained
tool: color-converter
title: HEX vs RGB vs HSL vs CMYK: Which Color Code Should You Use?
desc: A practical comparison of HEX, RGB, HSL, HSV and CMYK color codes: how each one works, where it comes from, and which to use for web, UI and print work.
keywords: hex vs rgb, hsl vs rgb, cmyk vs rgb, color codes explained, color formats
###
Open any design file and you will find the same color written three different ways. The brand guide says `#C8A97E`, the developer’s stylesheet says `rgb(200 169 126)`, and the printer wants CMYK percentages. They can all describe the same color, but they were built for different jobs. Knowing why each format exists makes it much easier to pick the right one and to avoid the classic mistake of sending screen colors to a print shop.

## RGB: how screens actually make color

Every pixel on your monitor or phone is made of three tiny light sources: red, green and blue. Mixing them at different intensities produces every color the screen can show. That is why RGB is called an *additive* model: adding all three at full power gives white, and turning them all off gives black.

On the web each channel is stored as a number from 0 to 255, which is one byte. Three bytes give 256 × 256 × 256 = 16,777,216 possible colors. In CSS you can write it as `rgb(200, 169, 126)` or, in the newer space-separated syntax, `rgb(200 169 126)`. Add a fourth value for transparency: `rgb(200 169 126 / 50%)`.

## HEX: the same numbers in a shorter form

A HEX code is not a different color model at all. It is RGB written in hexadecimal (base 16). Each pair of characters is one channel:

- `C8` = 200 (red)
- `A9` = 169 (green)
- `7E` = 126 (blue)

HEX became the default on the web because it is compact, easy to copy and has been supported since the earliest versions of HTML. Shorthand like `#FFF` expands to `#FFFFFF`, and an eight-digit HEX such as `#C8A97E80` adds an alpha channel (80 in hex is 128, about 50% opacity).

The downside is that HEX is hard to read. Looking at `#C8A97E`, very few people can tell you it is a warm, muted beige, or how to make it 10% darker.

## HSL: color the way people think about it

HSL stands for hue, saturation and lightness. It describes the same RGB colors in terms humans understand:

- **Hue** is the position on the color wheel, from 0° to 360° (0 is red, 120 is green, 240 is blue).
- **Saturation** is how intense the color is, from 0% (grey) to 100% (fully vivid).
- **Lightness** runs from 0% (black) through 50% (the pure color) to 100% (white).

Our beige becomes `hsl(35 40% 64%)`. Now it is obvious: an orange-yellow hue, low saturation, fairly light. Want a darker version for a hover state? Lower the lightness to 54%. Want a matching set of colors? Keep saturation and lightness and change only the hue. That is why many design systems define colors in HSL, and why our [color palette generator](/tools/color-palette-generator/) works in HSL internally.

HSL has one known weakness: its lightness is not *perceptual*. A yellow and a blue at 50% lightness look very different in brightness. Newer CSS color spaces like OKLCH fix this, but HSL is still the most widely understood.

## HSV / HSB: the picker in your design app

HSV (hue, saturation, value), also called HSB (brightness), is a close cousin of HSL. The difference is in the third value. In HSV, 100% value means the brightest version of the color, while 100% lightness in HSL always means white. Photoshop, Figma and most color pickers use HSV because it maps neatly onto a square picker: saturation left to right, brightness top to bottom.

You rarely type HSV into code, but it is useful when you need to recreate a color someone picked in a design app.

## CMYK: color for ink on paper

Printers do not emit light; they lay ink on white paper, and the ink absorbs (subtracts) parts of the light that hits it. CMYK uses four inks: cyan, magenta, yellow and key (black). This is a *subtractive* model. Mixing all inks gives a dark, muddy near-black, which is why a separate black ink exists for crisp text and deep shadows.

CMYK is written as four percentages, for example `cmyk(0%, 16%, 37%, 22%)`. The important thing to understand is that there is no single correct conversion from RGB to CMYK. The result depends on the paper, the press and the ink set, which is described by an ICC color profile such as FOGRA39 (common in Europe) or GRACoL (common in the US). Formula-based conversions, like the one in our [color converter](/tools/color-converter/), are a good starting point, but final print files should be converted in a design application using the profile your printer specifies.

Some screen colors, especially bright greens, oranges and electric blues, simply cannot be printed with standard CMYK inks. They fall outside the printable *gamut* and will look duller on paper.

## Side-by-side comparison

| Format | Example | Model | Best for | Main drawback |
|---|---|---|---|---|
| HEX | `#C8A97E` | RGB (additive) | Brand guides, CSS, copying values | Not human-readable |
| RGB | `rgb(200 169 126)` | Additive light | CSS, transparency, image processing | Hard to adjust by eye |
| HSL | `hsl(35 40% 64%)` | Cylindrical RGB | Theming, tints and shades in CSS | Lightness isn’t perceptual |
| HSV/HSB | `hsv(35, 37%, 78%)` | Cylindrical RGB | Design app color pickers | Not used in CSS |
| CMYK | `cmyk(0, 16, 37, 22)` | Subtractive ink | Print production | Depends on paper and press |

## Which one should you use?

**For websites and apps**, store colors as HEX or RGB in your design tokens because every tool understands them. Switch to HSL when you need to generate variations: hover states, disabled states, light backgrounds. If you are building a full design system, see our guide to [building color scales](/blog/building-color-scales-for-design-systems/).

**For print**, design in your layout application’s CMYK mode from the start, or convert using the printer’s ICC profile. Ask for a printed proof whenever color accuracy matters, for example for packaging or a logo.

**For handoff between people**, include at least HEX and CMYK in the brand guide, and add a Pantone reference if the brand uses spot colors. That way a web developer, a social media manager and a sign maker can all work from the same source.

## Common mistakes to avoid

1. **Sending RGB images to a commercial printer.** Most print workflows convert automatically, but the shift can surprise you. Check bright colors in a proof.
2. **Assuming HEX and RGB look the same everywhere.** They are the same numbers, but uncalibrated monitors display them differently. A brand color can look slightly different on a phone and an office monitor.
3. **Making colors darker by lowering all RGB values equally.** This shifts the hue and saturation as well. Lowering HSL lightness, or using a [tints and shades generator](/tools/tints-and-shades-generator/), gives more predictable results.
4. **Forgetting contrast.** Whatever format you use, text colors must meet accessibility contrast ratios. Run every text and background pair through a [contrast checker](/tools/contrast-checker/).

## Quick conversion tips

To convert a HEX value to RGB by hand, split it into pairs and convert each from base 16: the first digit times 16 plus the second digit (with A=10 up to F=15). `C8` is 12 × 16 + 8 = 200. For anything beyond that, a converter saves time and avoids typos.

Color formats are just different languages for the same idea. Pick the one that matches the medium you are designing for, keep a single source of truth in your brand guide, and convert carefully when you move between screen and print.

@@@
slug: how-to-build-a-color-palette-with-color-theory
tool: color-palette-generator
title: How to Build a Color Palette With Color Theory (Not Guesswork)
desc: Learn how complementary, analogous, triadic and monochromatic palettes work, how to apply the 60-30-10 rule, and how to turn a color scheme into a usable UI palette.
keywords: color palette, color theory, complementary colors, analogous colors, triadic palette, 60-30-10 rule
###
Most palettes fail for a simple reason: they are chosen as five pretty swatches instead of as a system with jobs to do. A website needs a background, text colors, a primary action color, borders, and colors for success and error states. Color theory gives you a reliable way to choose hues that belong together, and a few practical rules turn those hues into something you can actually build with.

## The color wheel in one minute

The modern digital color wheel is based on the RGB primaries. Hue is measured in degrees: red at 0°, yellow at 60°, green at 120°, cyan at 180°, blue at 240° and magenta at 300°. Every color harmony is simply a pattern of positions on this wheel. That is why our [color palette generator](/tools/color-palette-generator/) only needs one base color: it rotates the hue to find the others.

Traditional painters use a red–yellow–blue wheel, which places complements slightly differently (red’s complement is green instead of cyan). For screens, the RGB-based wheel is the one that matches how your colors are actually displayed.

## The six classic harmonies

**Complementary** colors sit opposite each other, 180° apart, such as blue and orange. They create maximum contrast and energy. Use one as the main color and the other sparingly for calls to action. Using both in large amounts tends to look loud and can cause a vibrating effect where they meet.

**Analogous** colors are neighbours, typically within 30–60° of each other, like yellow, orange and red-orange. They feel natural and calm because they often occur together in nature: think of autumn leaves or a sunset. The risk is low contrast, so you will usually need a dark neutral for text.

**Split-complementary** takes the base color and the two colors on either side of its complement (for example 150° and 210° away). You get strong contrast with less tension than a pure complementary pair. It is a good choice for beginners because it is hard to get badly wrong.

**Triadic** schemes use three hues spaced 120° apart, such as red, yellow and blue. They are vibrant and balanced, popular in children’s brands and illustration. Let one hue dominate and use the others as accents.

**Tetradic (square)** schemes use four hues 90° apart. They offer the most variety and are the hardest to balance. Pick one dominant color and keep the rest small.

**Monochromatic** palettes use a single hue at different lightness and saturation levels. They are elegant and almost impossible to clash, which is why many minimal brands and dashboards use them.

## Comparing the harmonies

| Harmony | Hue positions | Contrast | Feels | Good for |
|---|---|---|---|---|
| Monochromatic | 1 hue | Low | Calm, minimal | Dashboards, luxury, editorial |
| Analogous | Within 60° | Low to medium | Natural, harmonious | Wellness, food, lifestyle |
| Complementary | 180° apart | High | Energetic, bold | Sports, CTAs, posters |
| Split-complementary | Base + 150° + 210° | Medium to high | Lively but balanced | General brands, marketing sites |
| Triadic | 120° apart | High | Playful, vibrant | Kids, games, illustration |
| Tetradic | 90° apart | Very high | Rich, busy | Complex illustration, data viz |

## The 60-30-10 rule

Interior designers have long used a simple proportion that works just as well on screens: about 60% of the space goes to a dominant color, 30% to a secondary color and 10% to an accent. On a website, the 60% is usually a neutral background (white, off-white or a very dark grey), the 30% is surfaces, headers and secondary elements, and the 10% is your brand accent on buttons, links and highlights.

This rule explains why a palette that looks great as five equal swatches can feel overwhelming on a page. Equal amounts of five strong colors compete for attention. The palette is fine; the proportions are not.

## From scheme to working UI palette

A color harmony gives you hues. A usable palette also needs roles. Here is a practical structure:

1. **Neutrals:** a background, a surface color, a border color, and two or three text greys. Tint them slightly toward your brand hue so they feel related.
2. **Primary:** your main brand or action color, used for primary buttons and links.
3. **Accent:** a second hue from your harmony, used for highlights, badges or illustrations.
4. **Semantic colors:** green for success, red for errors, amber for warnings, blue for information. These are conventions users rely on, so do not drop them just because they are not in your harmony. Instead, adjust their saturation and lightness so they feel at home.

Then create lighter and darker variants of each with a [color scale generator](/tools/color-scale-generator/). A primary color usually needs a light tint for backgrounds, the base color for buttons, and a dark shade for hover states and text.

## Checking your palette before you commit

**Contrast.** Every combination of text and background must meet WCAG requirements: 4.5:1 for normal text and 3:1 for large text and interface components. Many attractive mid-tone colors fail on white. Check them with the [contrast checker](/tools/contrast-checker/), and read our [WCAG contrast guide](/blog/wcag-color-contrast-guide/) if the numbers are new to you.

**Color blindness.** About 8% of men have some form of red–green color vision deficiency. If your palette relies on red and green to mean different things, check it with a [color blindness simulator](/tools/color-blindness-simulator/).

**Context.** A palette can look different on a phone in sunlight, a dim laptop, or printed. Test it on real devices and on the materials you will actually use.

## Where to find a starting color

If you have no brand color yet, start from meaning and audience rather than personal preference. Blues are common in finance and healthcare because they are associated with stability. Greens suggest growth and nature. Warm oranges and yellows feel friendly and energetic. These associations vary between cultures, so consider who your audience is.

You can also extract a palette from a photograph that captures the mood you want; nature photos and paintings already contain balanced colors. Our [image palette extractor](/tools/image-palette-extractor/) does this automatically. Or generate a few options with the [random color generator](/tools/random-color-generator/) and keep the ones that feel right.

## A worked example

Say your base color is a warm brown, `#8A6D3B`. A split-complementary scheme adds a muted blue and a blue-violet. Assign roles: an off-white background tinted toward the brown, a near-black text color, the brown as primary, the blue as accent for links and highlights, plus standard semantic colors. Apply the 60-30-10 rule: off-white background (60%), light beige surfaces and borders (30%), brown and blue together for interactive elements (10%). Check contrast, adjust the brown slightly darker if it fails as text, and you have a palette that is both theoretically sound and practical.

Color theory will not choose your brand for you, but it removes the guesswork from making colors work together. Start with one color you believe in, let a harmony suggest its partners, and give every color a clear job.

@@@
slug: wcag-color-contrast-guide
tool: contrast-checker
title: WCAG Color Contrast Explained: AA, AAA and How the Ratio Works
desc: A clear guide to WCAG 2.1 and 2.2 color contrast: what 4.5:1 and 3:1 mean, how the ratio is calculated, what counts as large text, and how to fix failing colors.
keywords: wcag contrast, color contrast ratio, aa vs aaa, accessible colors, contrast requirements
###
If you have ever had a design rejected because a light grey failed an accessibility audit, you have met the WCAG contrast ratio. It is one of the few design rules that is precise, measurable and, in many countries, legally relevant. The good news is that it is easy to understand once you know what the numbers mean.

## Why contrast matters

Low contrast text is hard to read for people with low vision, for older users (contrast sensitivity declines with age), for anyone on a phone in bright sunlight, and on cheap or poorly calibrated screens. The World Health Organization estimates that at least 2.2 billion people have some form of near or distance vision impairment. Good contrast helps all of them, and it costs nothing.

The Web Content Accessibility Guidelines (WCAG), published by the W3C, set measurable minimums. WCAG 2.1 and 2.2 are referenced by laws and procurement rules such as the European Accessibility Act, EN 301 549 in the EU, and Section 508 in the United States (which references WCAG 2.0 AA). In the US, courts have also cited WCAG in ADA cases.

## The numbers you need to know

| Requirement | Level | Minimum ratio | Applies to |
|---|---|---|---|
| 1.4.3 Contrast (Minimum) | AA | 4.5:1 | Normal text |
| 1.4.3 Contrast (Minimum) | AA | 3:1 | Large text |
| 1.4.6 Contrast (Enhanced) | AAA | 7:1 | Normal text |
| 1.4.6 Contrast (Enhanced) | AAA | 4.5:1 | Large text |
| 1.4.11 Non-text Contrast | AA | 3:1 | UI components and graphics |

Most organisations aim for level AA. AAA is a good target for long-form reading, such as articles and documentation, but is not usually required for an entire site.

## What counts as large text?

WCAG defines large text as at least **18 point** regular or **14 point bold**. In CSS pixels, that is about **24px** regular or **18.66px** bold. Everything smaller is normal text and needs the higher ratio. This is why a 16px grey caption can fail while the same color in a 32px heading passes.

Font weight matters: very thin weights look lighter than their color suggests, so treat light (300) and thin (100–200) fonts with extra caution even when they technically pass.

## How the ratio is calculated

The contrast ratio compares the *relative luminance* of two colors. Relative luminance is a measure of perceived brightness from 0 (black) to 1 (white). To calculate it:

1. Convert each RGB channel from 0–255 to 0–1.
2. “Linearise” each channel to undo the gamma encoding of sRGB. Small values are divided by 12.92; larger values use the formula ((v + 0.055) / 1.055)^2.4.
3. Weight the channels: L = 0.2126 R + 0.7152 G + 0.0722 B. Green has the biggest weight because our eyes are most sensitive to it.

The ratio is then (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter color. The 0.05 accounts for ambient light reflecting off the screen. The result ranges from 1:1 (identical colors) to 21:1 (black on white).

You do not need to do this by hand. Our [contrast checker](/tools/contrast-checker/) calculates it instantly and shows the pass or fail result for each level.

## Surprising results

Because of the green weighting, colors of the same HSL lightness can have very different contrast. Pure yellow (`#FFFF00`) on white has a ratio of about 1.07:1, nearly invisible, while pure blue (`#0000FF`) on white reaches about 8.6:1. Mid-tone oranges and greens are the colors that most often fail on white backgrounds.

Another surprise: white text on a medium blue or orange button often fails AA for normal-sized text. Many brand colors were picked for logos, not for button labels.

## Non-text contrast (1.4.11)

Since WCAG 2.1, interface components need 3:1 contrast too. This includes the borders of text inputs, checkboxes and radio buttons, focus indicators, and meaningful icons or chart lines. A pale grey input border on white (a popular look) usually fails. Disabled controls are exempt, as are logos and purely decorative graphics.

## How to fix failing colors

**Darken or lighten one color.** Usually you adjust the text color and keep the background. Changing only the HSL lightness preserves the hue, so the color still feels on-brand. The “Fix text for AA” button in our checker does exactly this, searching for the closest lightness that passes.

**Use different shades for different jobs.** Keep your bright brand color for large surfaces and illustrations, and create a darker shade specifically for text and small buttons. A [color scale generator](/tools/color-scale-generator/) gives you those shades systematically.

**Increase size or weight.** If a color must stay as it is, making text large enough to qualify as “large text” lowers the requirement to 3:1.

**Add an outline or overlay.** For text on photos, add a semi-transparent dark overlay or a solid panel behind the text so contrast is guaranteed no matter what the photo shows.

## What contrast checks don’t cover

The WCAG ratio is a useful minimum, not a guarantee of readability. It doesn’t account for font size beyond the large/normal split, for very thin fonts, or for colors that pass but still vibrate, like saturated red text on blue. It also can’t tell you whether meaning is conveyed by color alone, which is a separate requirement (1.4.1 Use of Color). For that, test with a [color blindness simulator](/tools/color-blindness-simulator/) and add icons or labels where needed.

A newer method called APCA (Advanced Perceptual Contrast Algorithm) has been developed as a candidate for future guidelines. It accounts for font size and weight and for the fact that light text on dark backgrounds behaves differently. It is not part of WCAG 2.x, so for compliance today, use the classic ratio.

## A practical workflow

1. Define text and background pairs early in your design system, not page by page.
2. Check every pair once and document the ratio next to the tokens.
3. Use the darker shade of each brand color for text and links.
4. Check UI borders and focus rings for 3:1.
5. Re-check whenever the palette changes.

Contrast is one of the easiest accessibility wins available. A few minutes with a checker can make your design readable for millions more people, and it usually makes the design look sharper for everyone else too.

@@@
slug: tints-shades-and-tones-explained
tool: tints-and-shades-generator
title: Tints, Shades and Tones: How to Make Lighter and Darker Colors Properly
desc: What tints, shades and tones are, how they differ in RGB and HSL, why mixing with black can make colors look dull, and how to use them for UI states and design tokens.
keywords: tints and shades, tint vs shade, color tones, lighten color css, darken color, color variations
###
A single brand color is rarely enough. Buttons need hover and pressed states, alerts need pale backgrounds, and text needs a darker version that passes contrast. The traditional names for these variations are tints, shades and tones. They come from painting, but they translate directly to digital design.

## The three definitions

- A **tint** is a color mixed with white. It is lighter and softer than the original.
- A **shade** is a color mixed with black. It is darker and deeper.
- A **tone** is a color mixed with grey. It is less saturated and more muted, while staying at a similar lightness.

Pastels are tints. Burgundy is a shade of red. Dusty rose and sage green are tones. In everyday speech people use “shade” for any variation of a color, but in design it is useful to be precise, because each operation affects the color differently.

## How mixing works on screen

Digitally, mixing two colors usually means linear interpolation of the RGB channels. A 20% tint of `#8A6D3B` moves each channel 20% of the way toward 255:

- Red: 138 + (255 − 138) × 0.2 = 161
- Green: 109 + (255 − 109) × 0.2 = 138
- Blue: 59 + (255 − 59) × 0.2 = 98

The result is `#A18A62`. A shade does the same thing toward 0. This is exactly how Sass’s `mix()` function works, and how the CSS `color-mix()` function works in the sRGB space. Our [tints and shades generator](/tools/tints-and-shades-generator/) uses this method, so its output matches what developers get in code.

## Mixing versus adjusting lightness

There is another way to make a color lighter: increase its HSL lightness. The results are similar but not identical.

| Method | What changes | Result |
|---|---|---|
| Mix with white (tint) | All channels move toward 255 | Lighter and less saturated, can look washed out |
| Mix with black (shade) | All channels move toward 0 | Darker, can look dull or muddy |
| Increase HSL lightness | Lightness only | Lighter, keeps saturation, can look neon at high values |
| Decrease HSL lightness | Lightness only | Darker, keeps saturation, can look rich |
| Mix with grey (tone) | Channels move toward mid-grey | Muted and sophisticated |

Neither method is wrong. Mixing with white gives soft, natural-looking pastels, which is why it is great for backgrounds. Adjusting lightness keeps colors vivid, which can be better for dark shades meant for buttons. Professional design systems often combine both: they adjust lightness and then slightly reduce saturation at the very light end, which is what our [color scale generator](/tools/color-scale-generator/) does.

## Why shades can look dirty

Mixing a color with pure black reduces its lightness and its perceived saturation at the same time. Dark shades of yellow are a famous example: they turn olive-brown rather than “dark yellow”. Painters have long avoided mixing black into colors for this reason, instead darkening with a deeper related hue (for example, darkening yellow with a little red-brown).

On screen you can do the same. Instead of mixing a yellow with black, shift its hue slightly toward orange while lowering lightness. The result looks like a natural shadow on a yellow object.

## Practical uses in interface design

**Hover and active states.** Mix the button color 10–15% toward black for hover and 20–25% for pressed. On dark buttons, mix toward white instead so the change is visible.

**Backgrounds for alerts and badges.** A 85–92% tint of the status color makes a soft background, with a 40–60% shade of the same hue as the text. Same family, guaranteed harmony, and usually good contrast. Check the pair with a [contrast checker](/tools/contrast-checker/) to be sure.

**Borders and dividers.** Light tints (70–80%) of a neutral make subtle borders that don’t compete with content.

**Charts.** Sequential data, like population density on a map, is clearer when shown as a range of tints and shades of one hue rather than different hues.

**Dark mode.** You can’t simply invert a palette. Dark themes usually use darker shades for surfaces and lighter tints for text and accents, often with reduced saturation to avoid glowing colors on dark backgrounds.

## Naming your variations

Name tokens so anyone on the team understands where they came from. Two common systems:

- **Percentage names:** `--brand-tint-20`, `--brand-shade-40`. Clear about how they were made.
- **Numbered scales:** `--brand-100` through `--brand-900`, popularised by Tailwind CSS and Material Design, where 500 is the base. Clear about lightness order and easy to extend across colors.

Numbered scales are easier to use across a whole palette because `blue-200` and `red-200` have a similar role. Percentage names are better for one-off variations in smaller projects.

## Doing it in CSS today

Modern CSS can generate tints and shades without any preprocessing:

```
background: color-mix(in srgb, var(--brand) 20%, white);
border-color: color-mix(in srgb, var(--brand) 70%, black);
```

`color-mix()` is supported in all major browsers since 2023. It is great for prototypes and for themes where a user can choose a color. For production design systems, though, fixed tokens are still easier to document, audit for contrast and share with designers who work in Figma.

## Tones: the forgotten variation

Tones, made by mixing with grey, deserve more use. Muted colors feel calm, premium and natural, and they are easier to combine than fully saturated colors. If your palette feels loud, try replacing one or two colors with tones of the same hue. In the [color mixer](/tools/color-mixer/), blend your color with a mid-grey at 20–40% to see the effect. Brands in fashion, interiors and wellness use tones heavily for exactly this reason.

## A simple recipe

1. Choose your base color.
2. Generate tints and shades in 10% steps.
3. Pick a very light tint (around 90%) for backgrounds, a light tint (around 70%) for borders, the base color for primary elements, and a 30–50% shade for hover states and text.
4. Check contrast for every text pair.
5. Save them as named tokens.

Tints, shades and tones are the difference between a palette that looks good in a swatch and one that works across hundreds of interface states. Generate them systematically once, and every new component becomes easier to design.
