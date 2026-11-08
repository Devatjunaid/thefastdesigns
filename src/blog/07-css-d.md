@@@
slug: css-background-patterns-without-images
tool: css-pattern-generator
title: CSS Background Patterns Without Images: Stripes, Dots, Grids and Checks
desc: How to draw stripes, polka dots, grid paper and checkerboards with pure CSS gradients, why hard color stops work, and how CSS patterns compare with SVG and image tiles.
keywords: css background pattern, css stripes, polka dot css, checkerboard css, grid background css, repeating-linear-gradient
###
Decorative backgrounds used to mean small tiled images: a 10×10 pixel GIF for stripes, a dot PNG for polka dots. Each one was another file to download and another asset to re-export when the color changed. CSS gradients can draw most simple geometric patterns directly, at any resolution and in any color, with one or two lines of code.

## The key trick: hard color stops

A gradient normally blends smoothly from one color to the next. But if two color stops share the same position, there is no room to blend, so the color changes instantly:

```
background: linear-gradient(90deg, #141414 50%, #e8dcc4 50%);
```

That’s a sharp split, half dark and half beige. Shrink the background to a small tile with `background-size` or use a `repeating-` gradient, and the split becomes a pattern. Modern CSS also allows a shorthand where one color has two positions: `#141414 0 10px` means “this color from 0 to 10px”.

## Five classic patterns

**Stripes**

```
background: repeating-linear-gradient(45deg, #e8dcc4 0 6px, #faf7f2 6px 24px);
```

The first color runs from 0 to 6px, the second from 6px to 24px, and the pattern repeats every 24px along the 45° direction. Change the angle to 0deg or 90deg for horizontal or vertical stripes.

**Polka dots**

```
background-color: #faf7f2;
background-image: radial-gradient(circle, #e8dcc4 6px, transparent 6.5px);
background-size: 24px 24px;
```

Each 24px tile has one circle in its center. The half-pixel difference between 6px and 6.5px adds a tiny bit of anti-aliasing, so dot edges look smooth instead of jagged.

**Grid paper**

```
background-color: #faf7f2;
background-image:
  linear-gradient(#e8dcc4 1px, transparent 1px),
  linear-gradient(90deg, #e8dcc4 1px, transparent 1px);
background-size: 24px 24px;
```

Two gradients: one draws a 1px horizontal line at the top of each tile, the other a vertical line on the left. Together they form a grid. Add a second, larger grid in a darker color for “major” lines every five squares.

**Checkerboard**

```
background-color: #faf7f2;
background-image: conic-gradient(#e8dcc4 25%, transparent 0 50%, #e8dcc4 0 75%, transparent 0);
background-size: 32px 32px;
```

A conic gradient sweeps around the tile’s center and colors two opposite quarters, which is exactly one checkerboard tile. Before conic gradients, this needed two or four linear gradients with offsets.

**Cross-hatch**

Two repeating stripe gradients at 45° and −45°, layered over a background color, create a fine hatched texture.

All of these are available with live controls in our [CSS pattern generator](/tools/css-pattern-generator/).

## CSS patterns versus other options

| Approach | File size | Resolution | Recolor | Complexity it handles |
|---|---|---|---|---|
| CSS gradients | Zero extra requests, a few bytes | Infinite | Change a value | Simple geometry |
| SVG tile (inline or data URI) | Small | Infinite | Edit the SVG or use CSS variables | Any vector shape |
| PNG tile | Small to medium | Fixed (blurry when scaled) | Re-export | Anything, including textures |
| Large background photo | Large | Fixed | Re-export | Photographic |

CSS is ideal for stripes, dots, grids and checks. For more complex motifs, such as leaves, waves or logos, an SVG tile is the better choice. For organic textures like paper or grain, a small PNG works best; our [noise texture generator](/tools/noise-texture-generator/) creates tileable grain.

## Design tips

**Keep contrast low behind content.** A pattern is decoration. If text sits on top, use two colors that are very close in lightness, so the pattern reads as texture rather than noise. Then check the text against the darker of the two colors with a [contrast checker](/tools/contrast-checker/).

**Use whole-pixel sizes.** Stripe widths and tile sizes that land on whole pixels look crisp. Fractional sizes can produce uneven stripes or blurry edges, especially on standard-density screens.

**Diagonal stripes can shimmer.** Thin diagonal lines may show slight inconsistencies due to anti-aliasing. Slightly wider stripes or sizes that are multiples of 2 or 4 usually look cleaner.

**Use patterns with purpose.** Diagonal yellow-and-black stripes signal caution or “under construction” almost universally. Grid paper suggests planning and precision, which is why many design tools use it as a canvas background. Polka dots feel playful and retro.

**Watch out for moiré.** Fine patterns can create shimmering interference effects when scaled, scrolled or viewed on screens with a different pixel density. If a pattern flickers while scrolling, make it larger or lower its contrast.

## Patterns and performance

Gradient patterns are rendered by the browser and are generally cheap. Very complex stacks of many gradients over huge areas can increase paint time, but typical patterns with one to three layers have no noticeable cost. Animated patterns (for example moving stripes on a progress bar) are best done by animating `background-position`, which is fine for small elements.

## Using patterns in themes

Put the colors into custom properties, and the same pattern adapts to light and dark mode automatically:

```
.pattern {
  --pattern-bg: #faf7f2;
  --pattern-fg: #e8dcc4;
  background: repeating-linear-gradient(45deg, var(--pattern-fg) 0 6px, var(--pattern-bg) 6px 24px);
}
@media (prefers-color-scheme: dark) {
  .pattern { --pattern-bg: #141414; --pattern-fg: #2a2723; }
}
```

## Accessibility

Busy patterns behind text make reading harder for everyone, and particularly for people with dyslexia or low vision. High-contrast stripes can be uncomfortable for people with visual stress or photosensitivity. Keep patterns subtle, avoid placing body text directly on them, and never use a pattern as the only way to convey information unless it is paired with a legend or label (patterns in charts are a good *addition* to color for [color-blind users](/blog/designing-for-color-blindness/)).

## Summary

Hard color stops turn gradients into patterns. With `repeating-linear-gradient`, `radial-gradient`, `conic-gradient` and `background-size`, you can draw stripes, dots, grids, checks and hatching with no image files at all. Keep contrast low, sizes whole, and use SVG or PNG tiles only for motifs CSS can’t draw. To understand the gradient functions themselves, see our [CSS gradients guide](/blog/css-gradients-linear-radial-conic-guide/).

@@@
slug: neumorphism-soft-ui-pros-and-cons
tool: neumorphism-generator
title: Neumorphism (Soft UI): How It Works, Why It Fails Accessibility, and How to Use It
desc: Where neumorphism came from, how its paired light and dark shadows are built in CSS, why it struggles with contrast and affordance, and practical ways to use soft UI responsibly.
keywords: neumorphism, soft ui, neumorphic design, neumorphism css, neumorphism accessibility, skeuomorphism
###
Around late 2019, a new visual style spread across Dribbble: buttons and cards that looked like they were pressed out of, or into, a smooth plastic surface. Designer Michal Malewicz popularised the name “neumorphism”, a blend of “new” and “skeuomorphism”. It looked fresh and tactile, and within months it was also widely criticised. Both reactions were justified, and understanding why helps you use the style well.

## From skeuomorphism to flat to soft

Early smartphone interfaces were **skeuomorphic**: they imitated real materials, like leather calendars, wooden bookshelves and glossy buttons. Microsoft’s Metro design language (introduced with Windows Phone 7 in 2010) and Apple’s iOS 7 (2013) moved the industry to **flat design**, removing textures and depth almost entirely. Material Design (2014) reintroduced depth through consistent shadows and elevation.

Neumorphism took a different path: instead of elements floating above the background, they appear to be made *of* the background, gently extruded or pressed in. It is the same color as its surroundings, separated only by light and shadow.

## How the effect is built

A neumorphic element has:

1. **The same background color as its parent.**
2. **A dark shadow** offset away from an imagined light source (typically bottom-right).
3. **A light shadow** offset toward the light source (top-left).

```
.soft {
  background: #e8e2d8;
  border-radius: 40px;
  box-shadow: 16px 16px 32px #d0cbc2, -16px -16px 32px #ffffff;
}
```

Variants change the look:

| Variant | Technique | Looks like |
|---|---|---|
| Flat | Two outer shadows | Raised from the surface |
| Pressed | Two inset shadows | Pushed into the surface |
| Concave | Outer shadows + gradient dark-to-light | A shallow dish |
| Convex | Outer shadows + gradient light-to-dark | A soft dome |

Our [neumorphism generator](/tools/neumorphism-generator/) builds all four with controls for distance, blur and intensity.

## Why it fails accessibility

The defining feature of neumorphism is also its biggest problem: elements are the same color as the background. The only thing separating them is a soft shadow.

**Low contrast boundaries.** WCAG 1.4.11 requires the visual information needed to identify a user interface component to have at least 3:1 contrast with adjacent colors. A shadow at 10–15% darker than the background is nowhere near that. People with low vision, cataracts, or simply a cheap screen in daylight may not see the button at all.

**Weak affordance.** Users recognise buttons by cues like color, borders and labels. When every element is a soft bump of the same color, it’s hard to tell what is clickable and what is decoration.

**Unclear states.** The difference between a raised (off) and pressed (on) toggle is subtle. Under WCAG, state changes that rely on low-contrast visual differences are hard to perceive.

**Screens vary.** Subtle shadows that look perfect on a calibrated designer’s monitor can disappear entirely on a dim laptop or with high-contrast or forced-colors modes, where browsers remove shadows.

## Comparison with other depth styles

| Style | How elements stand out | Contrast risk | Affordance |
|---|---|---|---|
| Flat with borders | Borders and fills | Low | Clear if styled well |
| Material elevation | Drop shadows + distinct surfaces | Low | Clear |
| [Glassmorphism](/blog/glassmorphism-backdrop-filter-guide/) | Blur and transparency | Medium | Medium |
| Neumorphism | Paired soft shadows only | High | Weak |

## How to use soft UI responsibly

Neumorphism doesn’t have to be off-limits. It works when you treat the soft shadows as decoration on top of a design that already communicates clearly.

**Add a real contrast cue to interactive elements.** A colored icon, a border with 3:1 contrast, or a colored fill for the primary action gives users something reliable to see. The soft shadow then becomes a pleasant extra.

**Use color for state.** A toggle that is pressed *and* turns your accent color is unmistakable. A pressed toggle that only changes shadow direction is not.

**Keep text high contrast.** Labels and body text should meet 4.5:1 against the background, as always. Check them with a [contrast checker](/tools/contrast-checker/).

**Choose the right background.** Neumorphism needs a mid-light tone so both the light and dark shadows are visible. On pure white the light shadow disappears; on very dark backgrounds the dark shadow does.

**Limit it to large, non-critical elements.** Dashboards widgets, music player controls, smart-home panels and decorative cards suit the style. Dense forms, tables and navigation don’t.

**Respect forced colors.** In Windows High Contrast mode, shadows are removed. Make sure components still have borders (a transparent border becomes visible in forced-colors mode) so they don’t vanish.

## Tuning the look

- **Distance and blur:** blur around twice the distance looks soft and natural. Larger distances make elements look higher.
- **Intensity:** 10–20% darker and lighter than the base is typical. More intensity adds drama but starts to look like an outline.
- **Radius:** generous radii suit the soft aesthetic; sharp corners fight it.
- **Consistency:** all elements must share the same light direction, just like in an [elevation system](/blog/css-box-shadow-guide-realistic-shadows/).

## Where the trend went

Pure neumorphism peaked as a Dribbble trend and rarely shipped in its extreme form in real products, mainly for the reasons above. But its ideas live on: soft, low-contrast surfaces combined with clear, colorful interactive elements appear in many modern smart-home, automotive and wellness interfaces. The lesson is that tactile depth is pleasant, as long as it is not the only thing carrying meaning.

## Summary

Neumorphism builds depth from paired light and dark shadows on a same-colored surface. It looks soft and modern but fails contrast and affordance by default. Use it as decoration, add real contrast cues and color-based states for anything interactive, and test on ordinary screens. Then you get the tactile charm without leaving users guessing.

@@@
slug: css-transforms-explained
tool: css-transform-generator
title: CSS Transforms Explained: Rotate, Scale, Translate, Skew and 3D
desc: How CSS transform functions work, why their order matters, what transform-origin does, how 3D perspective works, and why transform is the property to animate for smooth motion.
keywords: css transform, css rotate, translate css, scale css, transform-origin, css 3d transform, transform order
###
`transform` is one of the most useful properties in CSS. It moves, rotates, scales and skews elements without affecting the layout around them, and it’s the foundation of almost every smooth animation on the web. Understanding a few rules, especially about order and origin, makes transforms predictable instead of surprising.

## The 2D functions

| Function | Example | Effect |
|---|---|---|
| `translate(x, y)` | `translate(20px, -10px)` | Moves the element |
| `rotate(angle)` | `rotate(15deg)` | Rotates clockwise (negative = counter-clockwise) |
| `scale(x, y)` | `scale(1.1)` | Grows or shrinks; one value scales both axes |
| `skew(x, y)` | `skew(10deg, 0)` | Slants the element along an axis |
| `matrix(a, b, c, d, e, f)` | — | All of the above in one matrix |

Percentages in `translate()` are relative to the element’s own size, not its parent. That’s why `translate(-50%, -50%)` became the classic way to centre an absolutely positioned element of unknown size.

## Transforms don’t affect layout

A transformed element still occupies its original space in the layout. Neighbouring elements don’t move when you scale or rotate it. That makes transforms safe for hover effects, but it also means a scaled-up element can overlap its neighbours. Use `z-index` or a little extra spacing if needed.

## Order matters

When you write several functions, they are applied from right to left in terms of the coordinate system, which means each function works in the coordinate space created by the ones before it. In practice:

```
transform: translate(100px, 0) rotate(45deg);  /* moves right, then rotates in place */
transform: rotate(45deg) translate(100px, 0);  /* rotates, then moves along the rotated axis */
```

The first moves the element 100px to the right and rotates it. The second rotates the element’s coordinate system, then moves it 100px along the *rotated* x-axis, so it ends up diagonally down-right. Neither is wrong, but they are different. Our [CSS transform generator](/tools/css-transform-generator/) uses a fixed, predictable order and shows a dashed outline of the original position so you can see exactly what each change does.

### Individual transform properties

Modern CSS also has separate `translate`, `rotate` and `scale` properties:

```
.card { translate: 0 -4px; rotate: 2deg; scale: 1.02; }
```

They are always applied in the order translate, rotate, scale, regardless of how you write them, and they can be animated independently, which is handy when a hover effect and an entrance animation both want to change different parts of the transform. They have been supported in all major browsers since 2022.

## transform-origin

Rotation, scaling and skewing happen around a pivot point, set by `transform-origin`. The default is the center (`50% 50%`).

| Origin | Rotation effect |
|---|---|
| `center` | Spins in place |
| `top left` | Swings like a door hinged at the top-left corner |
| `bottom` | Tips over from the bottom edge |
| `0 0` in SVG | SVG elements default to the top-left of the SVG canvas, a common surprise |

For example, a dropdown menu that scales in from `transform-origin: top` looks like it unfolds from its trigger, which feels more natural than growing from the center.

## 3D transforms

Add a third dimension with `rotateX`, `rotateY`, `translateZ` and their relatives. For 3D to look like 3D, you need **perspective**, which controls how strong the depth effect is:

- `transform: perspective(800px) rotateY(30deg)` applies perspective to one element.
- `perspective: 800px` on a *parent* gives all children a shared vanishing point, so a set of cards looks like they live in the same 3D space.

Smaller perspective values (200–400px) create dramatic distortion, like viewing from very close. Larger values (1000px+) are subtle. Card flips use `rotateY(180deg)` with `backface-visibility: hidden` on both faces, and `transform-style: preserve-3d` on the container so the children keep their 3D positions.

## Why transforms are the property to animate

Browsers render a page in stages: style, layout, paint and composite. Changing `width`, `top` or `margin` triggers layout, which can force the browser to recalculate positions for many elements on every frame. Changing `transform` or `opacity` can usually skip layout and paint, and be handled by the compositor, often on the GPU.

| Animated property | Triggers | Smoothness on mobile |
|---|---|---|
| `left`, `top`, `width`, `height`, `margin` | Layout + paint + composite | Often janky |
| `background-color`, `box-shadow` | Paint + composite | Usually OK for small elements |
| `transform`, `opacity` | Composite only (typically) | Smooth |

So instead of animating `left: 0` to `left: 200px`, animate `transform: translateX(200px)`. Pair it with good easing from our [cubic-bezier guide](/blog/css-easing-cubic-bezier-explained/) and motion feels polished.

`will-change: transform` can hint to the browser to prepare a separate layer in advance, but use it sparingly; too many layers consume memory.

## Practical recipes

- **Lift on hover:** `transform: translateY(-2px)` with a slightly stronger shadow.
- **Gentle zoom on image hover:** wrap the image in an `overflow: hidden` container and apply `scale(1.05)` to the image.
- **Icon rotation:** `rotate(180deg)` on a chevron when an accordion opens.
- **Centering:** `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)`.
- **Mirror:** `scale(-1, 1)` flips an element horizontally.

## Text and skew

Skew distorts letterforms, so skewed text quickly becomes hard to read. A popular trick for slanted buttons or banners is to skew the container and then un-skew the text inside with the opposite angle, keeping the label upright.

## Accessibility

Large movements, zooms and spins can cause discomfort for people with vestibular disorders. Wrap non-essential transform animations in a `prefers-reduced-motion` check and keep them small and short. Also remember that rotated or skewed text can be difficult to read for everyone; keep body text unrotated.

## Summary

Transforms move, rotate, scale and skew without touching layout, which makes them ideal for interaction and animation. Remember that order changes the result, transform-origin sets the pivot, and perspective is needed for 3D. Animate transform and opacity rather than layout properties, and experiment visually in the [transform generator](/tools/css-transform-generator/) to build intuition.

@@@
slug: gradient-text-css-background-clip
tool: gradient-text-generator
title: Gradient Text in CSS: How background-clip: text Works (and When to Avoid It)
desc: Step-by-step explanation of gradient text in CSS, why the -webkit- prefixes are still needed, fallbacks, multi-line issues, shadows, accessibility and readability tips.
keywords: gradient text css, background-clip text, css text gradient, colorful heading, webkit-text-fill-color
###
Gradient-filled headlines are everywhere in modern product marketing: AI startups, developer tools and app landing pages love them. The effect is striking and, unlike images of text, it keeps headings as real text that search engines can index and users can select and translate. It relies on one slightly unusual CSS property and a couple of legacy prefixes.

## How it works

CSS has no `color: linear-gradient(...)`. Text color must be a single color. The trick is to paint the gradient as the element’s *background* and then cut that background down to the shape of the letters:

```
.gradient-text {
  background: linear-gradient(90deg, #8a6d3b, #e0a96d, #141414);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #8a6d3b; /* fallback */
}
```

Step by step:

1. `background` paints a gradient behind the text, filling the element’s box.
2. `background-clip: text` hides the background everywhere except where the glyphs are.
3. `-webkit-text-fill-color: transparent` makes the letters themselves transparent, so the clipped background shows through them.

Our [gradient text generator](/tools/gradient-text-generator/) writes this code with up to three colors, any angle, and a size and weight preview.

## Why the prefixes are still there

`background-clip: text` started life as a WebKit-only feature. Other browsers implemented it under the `-webkit-` name for compatibility, and the unprefixed version became widely supported only relatively recently. Including both lines costs nothing and ensures it works everywhere, including older Safari and Chromium versions.

`-webkit-text-fill-color` is used instead of `color: transparent` for a reason: if the clipping isn’t supported, `color` stays as a solid fallback, and the text is still visible. If you set `color: transparent` and clipping fails, the text vanishes.

## A safer fallback with @supports

For maximum safety, only apply the transparency when the browser supports text clipping:

```
.gradient-text { color: #8a6d3b; }
@supports (background-clip: text) or (-webkit-background-clip: text) {
  .gradient-text {
    background: linear-gradient(90deg, #8a6d3b, #e0a96d);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
```

## Gradient text compared with other approaches

| Approach | Real text | Scales | Searchable | Effort |
|---|---|---|---|---|
| CSS background-clip | Yes | Yes | Yes | Low |
| SVG text with a gradient fill | Yes (inside SVG) | Yes | Mostly | Medium |
| Image of text | No | No (fixed resolution) | Only via alt text | Low, but bad practice |
| Gradient mask over text | Yes | Yes | Yes | Medium |

CSS is the right default. Images of text should be avoided: they can’t be resized cleanly, translated or reflowed, and WCAG 1.4.5 asks you to use real text where possible.

## Multi-line headings

By default, the background covers the element’s whole box, so a two-line heading shows the gradient stretched across both lines as one shape. Often that’s what you want. If you’d rather each line have its own full gradient, set the element to `display: inline` and add `box-decoration-break: clone` (with `-webkit-box-decoration-break: clone` for Safari), which repeats the background for each line fragment.

## Shadows don’t work the normal way

Because the text fill is transparent, a `text-shadow` shows *through* the letters and muddies the gradient. To add depth, use `filter: drop-shadow(0 2px 4px rgb(0 0 0 / 0.25))` on the element, which shadows the visible shape. Our [text shadow guide](/blog/css-text-shadow-effects-guide/) covers other shadow techniques.

## Readability and accessibility

**Contrast varies along the gradient.** WCAG contrast is measured between the text color and the background, but gradient text has many colors. The safe approach is to check the *lightest* (or least contrasting) color in the gradient against the page background with a [contrast checker](/tools/contrast-checker/). If any part of the text falls below 3:1 (for large headings), some letters will be hard to read.

**Keep it for large text.** Gradients need area to be visible. Thin or small text shows so little gradient that it just looks like slightly inconsistent color. Use bold weights (700+) at large sizes.

**Forced colors mode.** In Windows High Contrast (forced colors) mode, backgrounds are replaced, which can make clipped text invisible. Adding `@media (forced-colors: active) { .gradient-text { -webkit-text-fill-color: CanvasText; background: none; } }` restores normal text.

**Selection highlighting** can look odd on gradient text in some browsers; that’s cosmetic, but test it.

## Design tips

- **Analogous colors** (neighbours on the color wheel) give smooth, premium-looking gradients. Complementary colors can produce a muddy middle; see our [gradient guide](/blog/css-gradients-linear-radial-conic-guide/) for why.
- **Use one gradient headline per page.** Its effect depends on rarity.
- **Match your brand.** A gradient from your primary color to a lighter tint keeps the effect on-brand.
- **Consider dark mode.** A gradient designed for a light background may need lighter colors on dark.
- **Animate carefully.** Animating `background-position` on an oversized gradient creates a shimmering effect; keep it slow and honour reduced-motion preferences.

## Theming with custom properties

Hard-coding gradient colors makes them painful to change across a site. Store the stops in custom properties instead:

```
:root { --grad-a: #8a6d3b; --grad-b: #e0a96d; }
.gradient-text { background: linear-gradient(90deg, var(--grad-a), var(--grad-b)); }
@media (prefers-color-scheme: dark) { :root { --grad-a: #e0a96d; --grad-b: #f6d5b5; } }
```

Now dark mode, seasonal campaigns or per-product accent colors only need two new values. The same variables can feed buttons, borders and illustrations so the gradient feels like part of the system rather than a one-off effect.

## Where gradient text works best

| Context | Good fit? | Why |
|---|---|---|
| Hero headline on a landing page | Yes | Large, bold, seen once |
| Logo-style wordmark in a header | Yes | Short and distinctive |
| Section headings throughout an article | Rarely | Repetition dilutes the effect and slows scanning |
| Navigation links and buttons | No | Interactive text needs clear, predictable color |
| Body text and captions | No | Too small for the gradient to read, and harder to read |

A useful test: if you removed the gradient and used the darkest stop as a solid color, would the page lose anything important? If the answer is no for most headings, keep the gradient for just the one that matters most.

## Summary

Gradient text paints a gradient background, clips it to the glyphs and makes the text fill transparent. Include the `-webkit-` prefixes, keep a solid color fallback, use `drop-shadow()` instead of `text-shadow`, and check the least contrasting part of the gradient. Used on one bold headline, it adds personality while staying real, accessible text.
