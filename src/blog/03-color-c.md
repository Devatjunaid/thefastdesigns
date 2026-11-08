@@@
slug: why-random-colors-look-bad-and-how-to-fix-it
tool: random-color-generator
title: Why Random Colors Usually Look Bad (and How to Generate Good Ones)
desc: Pure random RGB values produce muddy, unusable colors. Learn why, how HSL constraints fix it, and how designers use random colors for inspiration, testing and generative art.
keywords: random color generator, random hex color, pastel colors, generate random colors, color inspiration
###
Ask a computer for a random color and you will usually get something like `#7A6B52`: a vaguely brownish, greyish, forgettable color. Do it twenty times and most results look similar. This surprises people, because there are over 16 million possible colors. The reason lies in how the RGB color space is shaped, and fixing it is surprisingly simple.

## The problem with picking three random numbers

The simplest random color generator picks a random value from 0 to 255 for red, green and blue. Every color in the RGB cube is equally likely. The trouble is that most of the cube is not where vivid, attractive colors live.

Saturated colors need one channel high and at least one channel low. Pure red is (255, 0, 0). But if each channel is random, it is much more likely that all three land somewhere in the middle, and when R, G and B are close to each other, the result is greyish. Pastels need all three channels high, which is also uncommon. So uniform randomness produces lots of medium-dark, low-saturation colors: browns, olives, slate blues and muddy purples.

| Method | Typical results | Usefulness |
|---|---|---|
| Random R, G, B (0–255 each) | Many muddy mid-tones | Low for design, fine for test data |
| Random hue, fixed saturation and lightness | Even rainbow at one “mood” | High |
| Random hue with S and L limited to a range | Varied but coherent sets | High |
| Random hue using the golden angle | Evenly spread, distinct colors | Great for charts and avatars |
| Random within a perceptual space (OKLCH) | Even perceived brightness | Highest consistency |

## Constraining randomness with HSL

The fix is to randomize in HSL (hue, saturation, lightness) instead of RGB, and to only randomize what you want to vary. If you pick a random hue from 0 to 360° but keep saturation between 45% and 80% and lightness between 78% and 90%, every result is a pastel. Keep saturation high and lightness around 50%, and every result is vivid.

That is how the “mood” options in our [random color generator](/tools/random-color-generator/) work:

- **Pastel:** medium saturation, high lightness.
- **Vivid:** high saturation, mid lightness.
- **Dark:** moderate saturation, low lightness.
- **Light:** low to medium saturation, very high lightness.
- **Earthy:** hues limited to the orange-to-olive range with low saturation.
- **Neutral:** almost no saturation, so you get tinted greys.

Each mood is just a box inside HSL space. Random values inside a well-chosen box always look like they belong together.

## The golden angle trick

If you need a set of colors that are all clearly different, for example for chart series or user avatars, randomness can produce two similar hues next to each other. A neat alternative is the **golden angle**: about 137.5°. Start at any hue and add 137.5° for each new color (wrapping around at 360°). Because 137.5° is related to the golden ratio, the hues never repeat and stay well spread out, no matter how many colors you generate. The same principle explains the spiral pattern of seeds in a sunflower.

## Perceptual brightness: why yellow looks lighter than blue

Even with HSL constraints, a set of “vivid” colors at 50% lightness won’t look equally bright. Yellow and cyan appear much lighter than blue and purple at the same HSL lightness. If you need colors of truly equal visual weight, for instance for a set of category tags, generate them in a perceptual color space like OKLCH, where the lightness value matches how bright colors actually look. Modern CSS supports `oklch()` directly in all major browsers.

## What random colors are good for

**Breaking creative block.** Sometimes you don’t know what you want until you see it. Generate a dozen colors, notice which ones you react to, and use that as a starting point for a proper palette with the [color palette generator](/tools/color-palette-generator/).

**Placeholder content.** Random backgrounds for avatar initials, cards in a prototype or tiles in a mockup make interfaces look more realistic than a wall of identical grey boxes.

**Test data.** When building charts, random colors help you see whether a layout breaks with many series. (For final charts, use a deliberate palette.)

**Generative art.** Random colors with constraints are the foundation of most generative and algorithmic art. Constraining hue to a narrow band while varying lightness creates natural, painterly variation.

**Games and fun.** Daily color challenges, guessing games and color-matching exercises all rely on random colors.

## What random colors are not good for

Brand identity, accessibility-critical text, and data where colors carry meaning should never be random. A brand needs colors chosen for meaning and recognition. Text needs guaranteed contrast. Data colors need to be distinguishable and, ideally, color-blind safe; see our guide to [designing for color blindness](/blog/designing-for-color-blindness/).

## Using a random color responsibly

Once a random color catches your eye:

1. Copy the HEX code.
2. Generate a harmony around it with the palette generator.
3. Create lighter and darker variants with a [tints and shades generator](/tools/tints-and-shades-generator/).
4. Check text contrast with the [contrast checker](/tools/contrast-checker/).
5. Name it, using the [color name finder](/tools/color-name-finder/) if you want a descriptive label.

## A small coding note

If you generate random colors in your own code, avoid this common bug: `Math.floor(Math.random() * 16777215).toString(16)` can return fewer than six hex digits (for example `fa3` when the number is small). Always pad the result: `.padStart(6, '0')`. And note that multiplying by 16,777,215 instead of 16,777,216 means pure white can never be generated.

## Summary

Uniform random RGB values cluster in muddy mid-tones because of the shape of the color cube. Randomize hue freely and constrain saturation and lightness, and you get consistent, attractive sets. Use the golden angle for distinct series, a perceptual color space for equal brightness, and keep randomness for inspiration and prototypes, not for brand or meaning.

@@@
slug: css-color-names-history-and-color-matching
tool: color-name-finder
title: CSS Color Names: Where They Came From and How Color Matching Works
desc: The story behind CSS named colors like rebeccapurple and papayawhip, why darkgray is lighter than gray, and how Delta E in Lab space finds the closest name for any HEX code.
keywords: css color names, named colors, hex to color name, delta e, rebeccapurple, color matching lab
###
CSS lets you write `color: tomato` or `background: papayawhip` and the browser understands. There are 148 of these named colors, and their names range from the obvious (`red`) to the oddly specific (`lightgoldenrodyellow`). They are handy for prototypes, demos and teaching, and they make a useful shared vocabulary when you need to describe a color in words. The list also has some strange history.

## Where the names came from

The first versions of HTML and CSS defined just 16 basic colors, taken from the Windows VGA palette: black, silver, gray, white, maroon, red, purple, fuchsia, green, lime, olive, yellow, navy, blue, teal and aqua. CSS 2.1 added `orange` as the 17th.

The longer list came from the **X Window System**, the graphics system used on Unix workstations. Its color names file (rgb.txt) dates to the 1980s and was edited by many people over the years, which explains the eclectic mix: `peachpuff`, `navajowhite`, `blanchedalmond`, `cornflowerblue`. Early browsers supported these X11 names, and CSS3 eventually standardised them as “extended color keywords”.

The most recent addition is `rebeccapurple` (`#663399`), added in 2014 in memory of Rebecca Meyer, the daughter of CSS pioneer Eric Meyer, who died on her sixth birthday. Purple was her favorite color. It is the only named color added for this kind of reason, and it is a small, human piece of web history.

## The quirks

Because the X11 list and the original HTML list were merged rather than designed together, there are inconsistencies:

| Name | HEX | Quirk |
|---|---|---|
| gray | `#808080` | From the HTML/VGA list |
| darkgray | `#A9A9A9` | From X11, where gray was `#BEBEBE`, so darkgray is lighter than CSS gray |
| green | `#008000` | HTML green is dark; X11 green was pure `#00FF00`, which became `lime` |
| aqua / cyan | `#00FFFF` | Two names, same color |
| fuchsia / magenta | `#FF00FF` | Two names, same color |
| grey / gray | `#808080` | Both spellings accepted for every gray name |

Counting duplicate spellings, CSS has 148 keywords; removing duplicates leaves about 139 distinct colors. There is also `transparent` and `currentColor`, which are keywords but not fixed colors.

## Named colors versus HEX in real projects

| Aspect | Named colors | HEX / RGB / HSL |
|---|---|---|
| Readability | Excellent | Poor (HEX) to good (HSL) |
| Precision | Fixed set of ~139 colors | Any of 16.7 million (or more) |
| Brand accuracy | Rarely matches a brand | Exact |
| Teaching and demos | Ideal | Distracting |
| Production design systems | Rarely used | Standard |

Named colors are perfect for prototypes, CSS tutorials and debugging (a quick `outline: 2px solid red` to see an element’s bounds). For brand work, use exact values stored as tokens.

## Finding the name of any color

Often you have a HEX code and want a human name: for a design token label, an alt-text description, a product listing, or just to describe a color in a meeting. Since a named color list is small, the solution is to find the *closest* named color. But “closest” is trickier than it sounds.

### Why RGB distance is misleading

You could measure the straight-line distance between two colors in RGB space. The problem is that RGB isn’t perceptually uniform: a change of 20 units in the green channel is much more visible than 20 units of blue, and changes in dark colors look different from changes in light colors. RGB distance often picks a match that looks obviously wrong.

### Lab and Delta E

The CIE developed the **L\*a\*b\*** (Lab) color space in 1976 specifically so that equal numeric distances correspond to roughly equal perceived differences. L is lightness, a runs from green to red, and b from blue to yellow. The distance between two colors in Lab is called **Delta E (ΔE)**.

| ΔE (CIE76) | What it means |
|---|---|
| Under 1 | Not perceptible to most people |
| 1–2 | Perceptible on close inspection |
| 2–10 | Noticeable at a glance |
| 11–49 | Colors are clearly different but related |
| 100 | Opposite colors |

Later formulas (CIE94, CIEDE2000) refine the calculation further, especially for blues and saturated colors, and are used in print and textile quality control. For finding a name from a list of 139 colors, CIE76 is accurate enough and very fast. Our [color name finder](/tools/color-name-finder/) converts your color and every named color to Lab, sorts by ΔE and shows the closest matches with their distances.

## Using color names well

- **In design tokens**, keep the exact value but consider a descriptive comment, like `--brand-primary: #4A6C8F; /* close to steelblue */`.
- **In writing and product descriptions**, use plain names (“dusty blue”) rather than CSS keywords, which can sound odd to customers.
- **In accessibility**, describe colors only when they matter. A product photo’s alt text might say “steel blue jacket”; a decorative background doesn’t need a description.
- **When the ΔE is large**, no CSS name fits well. Describe by hue, lightness and saturation instead: “a muted, medium-dark teal”.

If you want to explore beyond named colors, convert values between formats with the [color converter](/tools/color-converter/), or read our explanation of [HEX, RGB, HSL and CMYK](/blog/hex-rgb-hsl-cmyk-color-codes-explained/).

## Summary

CSS named colors are a historical patchwork of the VGA palette, the X11 color list and one memorial color. They are useful for prototypes and as a shared vocabulary, but quirky enough that you shouldn’t rely on them for real palettes. To name any color, match it in Lab space using Delta E, which reflects how different two colors actually look.

@@@
slug: building-color-scales-for-design-systems
tool: color-scale-generator
title: Building Color Scales for Design Systems: The 50–950 Approach Explained
desc: How design systems like Tailwind and Material structure color scales, what each step from 50 to 950 is for, and how to build balanced, accessible scales from one brand color.
keywords: color scale, design system colors, tailwind color palette, 50-900 color scale, design tokens colors, accessible color scale
###
Look inside a mature design system and you won’t find “the blue”. You will find `blue-50` through `blue-950`: eleven steps from almost white to almost black, all with the same character. This numbered scale approach, popularised by Material Design and Tailwind CSS, has become the standard way to organise interface colors. It solves real problems, and it is easy to build your own.

## Why a scale instead of a few colors

An interface uses a single hue in many roles. Take a primary blue:

- a very pale blue background for a selected row,
- a light blue border for a focused input,
- the main blue for buttons,
- a darker blue for the button’s hover state,
- a deep blue for link text that needs high contrast,
- an almost-black blue for headings in some themes.

Without a system, designers invent each variation on the spot, and you end up with dozens of slightly different blues. A scale defines these variations once, in a predictable order, so everyone picks from the same set.

## What the numbers mean

The convention is that the number roughly tracks darkness: 50 is the lightest and 950 is the darkest, with 500 as the “base” color. The numbers are labels, not percentages, but they leave room for inserting steps later.

| Step | Typical lightness | Common uses |
|---|---|---|
| 50 | ~97% | Page or section backgrounds, subtle highlights |
| 100 | ~93% | Hover backgrounds, selected rows, badge backgrounds |
| 200 | ~86% | Borders, dividers, disabled backgrounds |
| 300 | ~76% | Stronger borders, decorative elements |
| 400 | ~64% | Icons, placeholder graphics, dark-mode text accents |
| 500 | ~52% | The base color: illustrations, large UI areas |
| 600 | ~43% | Primary buttons, links on white (often first to pass 4.5:1) |
| 700 | ~35% | Hover and pressed states, text |
| 800 | ~27% | High-contrast text, dark surfaces |
| 900 | ~20% | Headings, dark mode surfaces |
| 950 | ~12% | Darkest backgrounds, dark mode base |

These lightness values are the targets our [color scale generator](/tools/color-scale-generator/) uses. Real systems tune each step by eye.

## The key rule: same number, same role

The power of a scale comes from consistency across hues. If `blue-100` is a selected-row background, then `green-100` should work as a success background, and `red-100` as an error background, with similar lightness. Components can then swap color families without redesigning: an alert component uses `{color}-50` for its background, `{color}-200` for its border and `{color}-800` for its text, and it works for info, success, warning and error alike.

This only works if each step has a similar perceived lightness across hues, which is harder than it sounds.

## The yellow problem

In HSL, all hues at 50% lightness are “equally light” on paper, but yellow at 50% lightness looks far brighter than blue at 50%. That means a naive scale gives you a yellow-600 that is still too light for text, while blue-600 is already quite dark.

Design systems handle this in a few ways:

1. **Tune per hue.** Tailwind’s default palette was adjusted by hand; its yellows are noticeably darker and more orange at the 600–900 steps.
2. **Shift hue as lightness changes.** Dark yellows shift toward orange-brown, and light blues shift slightly toward cyan, mimicking how real materials look in shadow and light.
3. **Use a perceptual color space.** In OKLCH, the L value matches perceived lightness, so the same L gives similar brightness across hues. Tailwind CSS v4 defines its default palette in OKLCH for this reason.

## Saturation at the extremes

If you keep saturation constant, very light tints can look neon and very dark shades can look oversaturated and heavy. Most good scales reduce saturation slightly at both ends. Our generator reduces it by about 10–15% at the lightest and darkest steps, which keeps tints soft and shades rich without going muddy.

## Placing your exact brand color

Your brand color won’t land exactly on one of the generated steps. Two common approaches:

| Approach | How | Pros | Cons |
|---|---|---|---|
| Snap to nearest step | Replace the closest step with the exact brand value | Brand color appears exactly | Small jump in the scale |
| Brand as a separate token | Keep the scale smooth, add `--brand` alongside | Perfectly even scale | Brand color isn’t part of the numbered set |

Our generator snaps by default (you can turn it off). For most teams, having the exact brand color in the scale is worth the tiny unevenness.

## Accessibility built in

A well-built scale makes accessible choices easy to remember. Document which pairs pass:

- text on white: usually 600 or darker for normal text,
- white text on a filled button: usually 600 or 700 and darker,
- text on 50/100 backgrounds: 700 or darker.

Verify each with a [contrast checker](/tools/contrast-checker/), because exact results depend on the hue. Record the passing pairs in your documentation so nobody needs to check again. Our [WCAG contrast guide](/blog/wcag-color-contrast-guide/) explains the thresholds.

## Neutral scales

Every system also needs a grey scale, and the best ones aren’t pure grey. Adding a tiny amount of your brand hue (saturation around 3–10%) to neutrals makes the whole interface feel cohesive. Tailwind ships several neutral families (slate, gray, zinc, neutral, stone) precisely because tinted greys change the feel of an interface so much: slate is cool and blue-ish, stone is warm.

## Exporting the scale

Scales usually live in three places:

- **CSS custom properties** for the website: `--brand-500: #8a6d3b;`
- **Tailwind config** (or CSS theme variables in Tailwind v4) for utility classes.
- **Design tool variables** in Figma, so designers and developers use the same names.

Keep one source of truth, ideally a JSON or token file, and generate the others from it.

## Summary

A 50–950 scale turns one color into a reusable system. Keep step numbers consistent across hues, correct for the fact that hues differ in perceived lightness, ease saturation at the extremes, and document which steps pass contrast. If you are starting from scratch, pick your hues with [color theory](/blog/how-to-build-a-color-palette-with-color-theory/) first, then build a scale for each.

@@@
slug: mesh-gradients-in-css-guide
tool: mesh-gradient-generator
title: Mesh Gradients in CSS: How to Create Soft, Blurry Gradient Backgrounds
desc: What mesh gradients are, how they differ from linear and radial gradients, how to fake them in CSS with layered radial-gradients, and how to avoid banding and contrast problems.
keywords: mesh gradient, mesh gradient css, blurry gradient background, aurora gradient, soft gradient, gradient wallpaper
###
Soft, multi-colored backgrounds that look like light shining through colored glass have become a signature of modern product design. Operating system wallpapers, app landing pages and conference branding all use them. They are usually called mesh gradients, and while CSS has no mesh gradient function, you can create a convincing version with a few lines of code and no images at all.

## What a mesh gradient is

A regular **linear gradient** blends colors along one straight line. A **radial gradient** blends outward from a point. Both are one-dimensional in a sense: color only changes along one direction.

A true **mesh gradient**, as found in Adobe Illustrator, CorelDRAW and some newer design tools, is two-dimensional. The designer places a grid of points over a shape, assigns a color to each point, and the software blends smoothly between all of them. Because the grid can be bent, the colors can flow along curves. It is the technique illustrators use to paint realistic objects with vector shapes.

On the web, the word is used more loosely for any soft background where several colors blend in different directions.

| Gradient type | Color changes along | Typical look | Native CSS? |
|---|---|---|---|
| Linear | One straight line | Sunset bands, stripes | Yes |
| Radial | Outward from a point | Spotlights, vignettes | Yes |
| Conic | Around a center point | Color wheels, pie charts | Yes |
| Mesh (true) | A deformable 2D grid of points | Organic, painterly | No |
| Layered radial (“CSS mesh”) | Several overlapping blobs | Soft aurora, glassy light | Yes, by stacking |

## How to build one in CSS

The trick is to stack several radial gradients, each starting with a color at a chosen position and fading to transparent, on top of a base background color:

```
background-color: #f3ecdf;
background-image:
  radial-gradient(at 18% 22%, #e0a96d 0px, transparent 55%),
  radial-gradient(at 82% 30%, #c9b28a 0px, transparent 55%),
  radial-gradient(at 30% 85%, #8a6d3b 0px, transparent 55%),
  radial-gradient(at 75% 80%, #f6d5b5 0px, transparent 55%);
```

Each `radial-gradient(at x y, …)` places a soft blob of color. Where blobs overlap, the browser composites them, creating the blended mesh look. Our [mesh gradient generator](/tools/mesh-gradient-generator/) builds exactly this code, lets you shuffle positions, and can export the result as a PNG for slides or wallpapers.

### Why “transparent” matters

Older advice warned that fading to the keyword `transparent` could produce a greyish fringe, because `transparent` is black at zero opacity. Modern browsers interpolate gradients in premultiplied alpha, which avoids that problem, so `transparent` is safe in current browsers. In canvas drawing and some older tools, it is still better to fade to the same color at zero alpha.

## Size and performance

A CSS mesh gradient is a few hundred bytes. A comparable 1920×1080 PNG wallpaper is often 200 KB to over 1 MB, because smooth gradients don’t compress well in PNG, and JPEG versions can show blocky artifacts. CSS gradients are also resolution-independent, so they stay smooth on 4K and Retina screens.

Browsers render gradients on the GPU, so a static gradient background is cheap. Animating the positions of several large radial gradients forces repainting on every frame, which can drain battery on phones; if you animate, keep it slow and subtle, or animate a pre-rendered layer with `transform` instead.

## The banding problem

Very soft gradients across large areas can show **banding**: visible stripes where the color steps from one value to the next. It happens because standard displays and images use 8 bits per channel, only 256 levels, and a gentle gradient across 1,000 pixels has to repeat each level over several pixels. Dark, low-saturation gradients are the worst affected.

Fixes:

1. **Add noise.** A subtle grain overlay breaks up the steps so the eye sees a smooth blend. Our [noise texture generator](/tools/noise-texture-generator/) creates a tileable grain you can layer on top. We explain why this works in [grain textures and gradient banding](/blog/grain-noise-textures-and-gradient-banding/).
2. **Increase color difference.** Banding is most visible when the two colors are very close.
3. **Avoid exporting smooth gradients to JPEG at low quality**, which adds block artifacts on top of the banding.

## Designing with mesh gradients

**Pick related colors.** Mesh gradients look most natural with analogous colors (neighbours on the color wheel) or several tints of one hue plus a single accent. A palette from the [color palette generator](/tools/color-palette-generator/) in analogous mode is a good start.

**Control lightness.** If text will sit on the gradient, keep the whole area either light (for dark text) or dark (for white text). A gradient that goes from very light to very dark makes text contrast impossible everywhere.

**Give text a calm zone.** Place the strongest color blobs away from where headlines sit, or add a semi-transparent panel behind text. A [glassmorphism](/tools/glassmorphism-generator/) card works well on mesh backgrounds.

**Check contrast at the worst point.** Use the [contrast checker](/tools/contrast-checker/) with the color directly behind the lightest or darkest letters.

## CSS mesh versus image mesh

| Aspect | CSS layered radial | Exported PNG/JPEG |
|---|---|---|
| File size | Under 1 KB | 100 KB – 1 MB+ |
| Sharpness at any size | Perfect | Fixed resolution |
| Editable later | Change one value | Re-export |
| Works in email, slides, social | No | Yes |
| True curved mesh control | No | Yes, if made in a vector tool |

Use CSS for websites and apps, and export images for everything that can’t render CSS: presentations, social posts, email headers and desktop wallpapers.

## Summary

CSS has no mesh gradient function, but stacking radial gradients that fade to transparent over a base color produces the same soft, multi-directional look for a fraction of an image’s weight. Choose related colors, keep text areas calm, add a little noise if banding shows up, and export to PNG only where CSS can’t go. For the fundamentals of linear, radial and conic gradients, read our [CSS gradients guide](/blog/css-gradients-linear-radial-conic-guide/).
