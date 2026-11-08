@@@
slug: css-gradients-linear-radial-conic-guide
tool: css-gradient-generator
title: CSS Gradients Explained: Linear, Radial and Conic With Real Examples
desc: A complete guide to CSS linear-gradient, radial-gradient and conic-gradient: syntax, angles, color stops, hard stops, repeating gradients, color spaces and performance.
keywords: css gradient, linear-gradient, radial-gradient, conic-gradient, gradient background css, color stops
###
Gradients used to mean exporting a background image from Photoshop and hoping it didn’t look blocky. Since around 2012, every major browser has supported CSS gradients, and today they are one of the most flexible tools in CSS. They can create soft backgrounds, sharp stripes, pie charts, borders and even patterns, all without a single image request.

## Gradients are images

The first thing to understand is that CSS gradients are generated *images*. That means they go in `background-image` (or the `background` shorthand), not `background-color`. You can layer several gradients, combine them with photos, and set their size and position like any other background image.

## Linear gradients

A linear gradient blends colors along a straight line:

```
background: linear-gradient(135deg, #e8dcc4, #8a6d3b);
```

The first argument is the direction. Angles go clockwise from the top: `0deg` points up, `90deg` points right, `180deg` (the default) points down. You can also use keywords like `to right` or `to bottom left`. Keyword corners adapt to the element’s shape, so `to bottom right` always ends exactly in the corner, while `135deg` is a fixed angle that may not hit the corner on wide elements.

## Color stops

After the direction come the color stops. Each can have a position:

```
linear-gradient(90deg, #e8dcc4 0%, #8a6d3b 60%, #141414 100%)
```

If you leave positions out, the browser spaces the colors evenly. Two useful extras:

- **Hard stops:** give two colors the same position and the blend disappears: `linear-gradient(90deg, red 50%, blue 50%)` produces a sharp split. This is the basis of CSS stripes and patterns, which our [CSS pattern generator](/tools/css-pattern-generator/) uses.
- **Color hints:** a bare percentage between two colors moves the midpoint of the blend: `linear-gradient(red, 20%, blue)` makes the transition happen earlier.

## Radial gradients

Radial gradients spread outward from a center point:

```
background: radial-gradient(circle at 30% 40%, #e0a96d, #141414 70%);
```

You can choose `circle` or `ellipse` (the default) and a size keyword: `closest-side`, `closest-corner`, `farthest-side` or `farthest-corner` (the default). Changing the size keyword changes how far the gradient extends. Radial gradients are perfect for spotlights, vignettes and soft glows, and stacking several of them creates [mesh-style gradients](/blog/mesh-gradients-in-css-guide/).

## Conic gradients

Conic gradients rotate around a center point, like the hands of a clock:

```
background: conic-gradient(from 0deg, #e8dcc4 0 25%, #8a6d3b 0 60%, #141414 0);
```

With hard stops, that’s a pie chart in one line. Without hard stops, `conic-gradient(red, yellow, lime, aqua, blue, magenta, red)` draws a color wheel. Conic gradients have been supported in all major browsers since 2020.

## Comparison

| Type | Shape | Key parameters | Typical uses |
|---|---|---|---|
| `linear-gradient` | Straight bands | Angle or direction | Backgrounds, overlays on photos, stripes |
| `radial-gradient` | Circles or ellipses | Shape, size, position | Glows, spotlights, vignettes, dots |
| `conic-gradient` | Sweep around a point | Start angle, position | Pie charts, color wheels, checkerboards |
| `repeating-*` | Repeats the stop pattern | Same as above | Stripes, rings, patterns |

## Repeating gradients

Each type has a repeating version. `repeating-linear-gradient(45deg, #000 0 10px, #fff 10px 20px)` creates diagonal stripes that tile across the element. `repeating-radial-gradient` makes concentric rings.

## Gradients over images

A common pattern is darkening a photo so white text stays readable:

```
background:
  linear-gradient(rgb(0 0 0 / 0.6), rgb(0 0 0 / 0.1)),
  url(hero.jpg) center / cover;
```

The first layer is drawn on top. A gradient from 60% black at the top to 10% at the bottom keeps headlines readable without hiding the whole photo. Check the result with a [contrast checker](/tools/contrast-checker/) using the color behind the text.

## The grey middle and color spaces

Gradients between two saturated colors on opposite sides of the color wheel, like blue and orange, often look dull in the middle. The browser interpolates in sRGB by default, and the straight line between blue and orange passes near grey.

Modern CSS lets you choose the interpolation color space:

```
background: linear-gradient(in oklch, blue, orange);
```

OKLCH keeps saturation through the middle; OKLab gives smoother perceived steps. Support arrived in Chrome and Safari in 2023 and in Firefox in 2024. For older browsers, add a solid fallback or an extra middle color stop. Our [digital color mixing guide](/blog/digital-color-mixing-rgb-vs-paint/) explains why this happens.

## Gradient borders and text

Gradients can be used anywhere an image is allowed:

- **Gradient text:** combine a gradient background with `background-clip: text`. See our [gradient text generator](/tools/gradient-text-generator/).
- **Gradient borders:** `border-image: linear-gradient(...) 1` works but ignores border-radius. For rounded gradient borders, use two backgrounds with `background-origin: border-box` and a transparent border.

## Performance and quality

CSS gradients are rendered by the browser on demand and are very fast. They weigh nothing over the network, scale perfectly to any screen density and can be changed with one line of CSS, which makes them ideal for theming.

Two caveats:

- **Banding.** Subtle gradients over large areas can show visible steps on 8-bit screens. Adding a faint noise overlay hides this; see the [noise texture generator](/tools/noise-texture-generator/).
- **Animation.** Gradient values can’t be smoothly animated in most browsers unless you register custom properties with `@property`. A common workaround is to animate `background-position` on an oversized gradient.

## Design tips

1. Keep background gradients subtle: two close tones of the same hue usually look more refined than a rainbow.
2. Analogous colors (neighbours on the color wheel) blend most naturally.
3. Always include a solid `background-color` fallback first.
4. Use direction keywords (`to bottom right`) when the gradient must end in a corner.
5. Test gradients on both light and dark mode if your site supports both.

## Try it

The fastest way to learn gradient syntax is to change values and watch the result. Our [CSS gradient generator](/tools/css-gradient-generator/) lets you add up to eight color stops, switch between linear, radial and conic, and copy production-ready code with a fallback included.

@@@
slug: css-box-shadow-guide-realistic-shadows
tool: box-shadow-generator
title: CSS Box Shadow Guide: How to Make Realistic, Layered Shadows
desc: Understand every box-shadow value, why single shadows look fake, how layered shadows create realistic depth, and how to build an elevation system with good performance.
keywords: css box shadow, realistic shadow css, layered shadows, box-shadow examples, elevation system, drop shadow
###
Shadows are how flat screens suggest depth. A card that floats above the page, a menu that sits on top of content, a button that looks pressable: all of them depend on shadows. CSS `box-shadow` is easy to write but surprisingly easy to get wrong. The difference between a cheap-looking shadow and a convincing one usually comes down to blur, opacity and layering.

## The syntax

```
box-shadow: [inset] offset-x offset-y blur-radius spread-radius color;
```

- **offset-x / offset-y:** how far the shadow moves right and down. Negative values move it left or up.
- **blur-radius:** how soft the edge is. 0 is a hard edge. It can’t be negative.
- **spread-radius:** grows (positive) or shrinks (negative) the shadow before blurring.
- **color:** usually a semi-transparent black or tinted dark color.
- **inset:** draws the shadow inside the element, as if it were pressed in.

You can list several shadows separated by commas. The first one is drawn on top.

## Why most shadows look fake

The default shadow many people write, `box-shadow: 0 0 10px #000`, looks like a dark halo rather than a shadow. Real shadows have three properties that halo shadows lack:

1. **Direction.** Light usually comes from above, so shadows fall downward. Use a positive Y offset and little or no X offset.
2. **Softness proportional to distance.** An object close to a surface casts a sharp, small shadow; an object higher up casts a larger, softer, fainter one.
3. **Low opacity.** Real ambient shadows are subtle. Opacities of 5–20% look natural; 50%+ looks heavy.

## Layered shadows

A single blur can’t reproduce how real shadows fall off: dark and tight near the object, light and wide further away. Stacking several shadows with increasing offset and blur does:

```
box-shadow:
  0 1px 2px rgb(0 0 0 / 0.07),
  0 2px 4px rgb(0 0 0 / 0.07),
  0 4px 8px rgb(0 0 0 / 0.07),
  0 8px 16px rgb(0 0 0 / 0.07);
```

Each layer doubles the previous offset and blur. Together they create a smooth, realistic falloff that no single shadow can match. This is the idea behind the “layered” option in our [box shadow generator](/tools/box-shadow-generator/).

## Single versus layered shadows

| Aspect | Single shadow | Layered shadows |
|---|---|---|
| Realism | Often flat or halo-like | Natural falloff |
| Code length | One line | 3–6 lines |
| Rendering cost | Lowest | Slightly higher, still cheap for static elements |
| Best for | Small elements, subtle borders | Cards, modals, floating panels |

## Building an elevation system

Instead of inventing a new shadow for every component, define a small set of elevation levels and reuse them. Material Design popularised this idea: the higher an element is, the larger and softer its shadow.

| Level | Example components | Character |
|---|---|---|
| 0 | Page background, flat cards with borders | No shadow |
| 1 | Cards, list items on hover | Tight, very faint |
| 2 | Raised cards, sticky headers | Small and soft |
| 3 | Dropdowns, popovers | Medium spread |
| 4 | Modals, dialogs | Large, soft, a bit darker |

Store these as tokens (`--shadow-1` to `--shadow-4`) and use the same light direction for all of them. When every shadow in an interface agrees on where the light is, the result feels coherent, even if users never consciously notice it.

## Tinted shadows

Shadows in the real world pick up color from the surface and surrounding light. On a warm beige background, a pure black shadow can look grey and dirty. Use a dark version of the background hue instead:

```
box-shadow: 0 8px 24px rgb(60 40 10 / 0.15);
```

On colored buttons, a shadow tinted with the button color looks like colored light spilling onto the page, an effect used in many modern interfaces.

## Inset shadows

`inset` draws the shadow inside the box. Common uses:

- pressed states for buttons and toggles,
- inner depth for input fields,
- [neumorphic](/blog/neumorphism-soft-ui-pros-and-cons/) soft UI,
- inner borders that don’t affect layout: `box-shadow: inset 0 0 0 1px #ddd`.

That last trick is handy because shadows never change an element’s size, unlike borders.

## Shadows and accessibility

Shadows alone are not enough to show that something is interactive or separate. Users with low vision, and anyone on a low-contrast screen, may not see a faint shadow. Pair shadows with a subtle border or background difference for important boundaries. WCAG’s non-text contrast rule (3:1) applies to the visual information needed to identify a component, which a 10% shadow rarely provides.

## Performance

Static box shadows are cheap. Problems appear when you animate them: changing `box-shadow` on hover forces the browser to repaint the shadow on every frame. For smooth hover effects on many cards:

```
.card { position: relative; }
.card::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: 0 12px 32px rgb(0 0 0 / 0.18);
  opacity: 0; transition: opacity .2s;
}
.card:hover::after { opacity: 1; }
```

Animating `opacity` is handled by the compositor and stays smooth.

## box-shadow versus filter: drop-shadow()

| Feature | box-shadow | filter: drop-shadow() |
|---|---|---|
| Follows | The element’s box (and border-radius) | The actual visible shape, including transparent PNGs and clip-path |
| Spread and inset | Yes | No |
| Multiple shadows | Comma-separated | Chain several drop-shadow() functions |
| Typical use | Cards, buttons, panels | Icons, irregular shapes, clipped elements |

If you use [clip-path](/tools/clip-path-generator/) to cut a shape, `box-shadow` gets clipped too; apply `drop-shadow()` to a wrapper element instead.

## Quick recipes

- **Subtle card:** `0 1px 3px rgb(0 0 0 / 0.08), 0 4px 12px rgb(0 0 0 / 0.05)`
- **Floating modal:** `0 24px 48px -12px rgb(0 0 0 / 0.25)`
- **Focus ring:** `0 0 0 3px rgb(138 109 59 / 0.45)`
- **Pressed button:** `inset 0 2px 4px rgb(0 0 0 / 0.15)`

## Summary

Good shadows are directional, soft, faint and consistent. Layer several shadows for realistic depth, define a small elevation scale, tint shadows to match your background, and avoid animating `box-shadow` directly. Experiment with values visually in the [box shadow generator](/tools/box-shadow-generator/) until the depth feels right.

@@@
slug: border-radius-guide-rounded-corners
tool: border-radius-generator
title: Border Radius in CSS: Rounded Corners, Pills, Circles and Blob Shapes
desc: Everything about CSS border-radius: shorthand order, px vs percentages, elliptical corners with the slash syntax, nested radius math, and how corner style shapes your brand.
keywords: border radius css, rounded corners, css circle, pill button css, border-radius percentage, nested border radius
###
Rounded corners are one of the most visible design decisions in an interface. Sharp corners feel precise and formal; soft corners feel friendly; fully rounded pills feel playful. In CSS it all comes down to one property, `border-radius`, which is more capable than most people realise.

## The basics

```
border-radius: 12px;
```

This rounds all four corners with a 12px radius: imagine a circle with a 12px radius tucked into each corner. The shorthand accepts up to four values, in clockwise order starting top-left:

```
border-radius: top-left top-right bottom-right bottom-left;
```

With two values, the first applies to top-left and bottom-right, the second to top-right and bottom-left. With three, the middle value covers top-right and bottom-left. You can also set corners individually with properties like `border-top-left-radius`.

## Pixels versus percentages

| Unit | Behaviour | Best for |
|---|---|---|
| px or rem | Same corner size regardless of element size | Buttons, cards, inputs, consistent UI |
| % | Relative to the element’s width (horizontal radius) and height (vertical radius) | Circles, ellipses, organic shapes |
| Very large px (e.g. 999px) | Clamped to make a perfect pill | Pill buttons and tags |

Percentages are relative to each dimension separately. On a square, `border-radius: 50%` makes a circle. On a rectangle, 50% makes an ellipse, because the horizontal radius is half the width and the vertical radius is half the height.

## Pills: why 999px works

When the radii of adjacent corners add up to more than the side length, the browser scales all radii down proportionally until they fit. So `border-radius: 999px` on a 40px-tall button becomes a 20px radius: a perfect pill, at any width. This is more reliable than 50%, which would create an ellipse on a wide button.

## Elliptical corners: the slash syntax

Each corner can have different horizontal and vertical radii. Write horizontal values, a slash, then vertical values:

```
border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
```

This produces organic, blob-like shapes using only CSS. Designers sometimes call this “fancy border radius”. It is lighter than an SVG for simple decorative shapes, though for more complex organic shapes an [SVG blob generator](/tools/svg-blob-generator/) gives smoother and more controllable results.

## The nested radius rule

When a rounded element sits inside another rounded element with padding, using the same radius for both looks wrong: the inner corners appear too round and the gap between them looks uneven. The fix is simple math:

**inner radius = outer radius − padding**

A card with a 24px radius and 8px padding should contain an image with a 16px radius. If the padding is larger than the outer radius, the inner element should have a radius of 0 or a small value. Apple’s rounded app icons and many hardware designs follow this rule, which is why their nested shapes look so clean.

## Clipping content

`border-radius` rounds the element’s background and border, but child elements can still stick out of the corners. Add `overflow: hidden` (or `overflow: clip`) to the container to clip images and other children to the rounded shape. This is the standard way to round the top corners of an image inside a card.

## Corner radius and brand personality

| Radius | Feel | Examples of where it fits |
|---|---|---|
| 0–2px | Precise, serious, technical | Finance, enterprise tools, editorial |
| 4–8px | Neutral, modern default | Most web apps and SaaS products |
| 12–20px | Friendly, approachable | Consumer apps, mobile-first products |
| Pill / full | Playful, soft | Tags, chips, buttons in casual brands |

Consistency matters more than the exact value. Pick two or three radius tokens, for example small (inputs and tags), medium (buttons) and large (cards and modals), and use them everywhere.

## Squircles and smooth corners

A standard CSS rounded corner is a circular arc that meets the straight edge abruptly. Apple’s icons and some hardware use “continuous” or superellipse corners, where the curvature changes gradually, so the corner looks smoother. CSS is gaining a `corner-shape` property that can draw squircles, but browser support is still limited. Until it is widespread, an SVG mask or clip-path is the most reliable way to get a true squircle.

## Images with rounded corners

There are two ways to show a rounded image:

1. **CSS:** apply `border-radius` to the `<img>`. Easy to change later, no file editing, and the original stays usable elsewhere.
2. **Baked into the file:** export the image with transparent corners using a tool like our [rounded corners tool](/tools/rounded-corners-image/). Needed for places that don’t support CSS, like email clients, presentations, documents and social media.

We compare both approaches in [rounded corners: CSS versus baked-in images](/blog/rounded-corners-images-css-vs-baked/).

## Accessibility and usability notes

Rounded corners don’t affect accessibility directly, but heavily rounded buttons with low-contrast backgrounds can look like tags or labels rather than actions. Make sure interactive elements still look interactive, and check focus outlines: `outline` follows `border-radius` in all current browsers, so focus rings look neat on rounded buttons.

## Quick reference

- Circle: equal width and height, `border-radius: 50%`
- Pill: `border-radius: 999px`
- Rounded top only: `border-radius: 12px 12px 0 0`
- Leaf: `border-radius: 0 50%`
- Nested: inner = outer − padding

Experiment with every corner and unit in the [border radius generator](/tools/border-radius-generator/), then save your final values as tokens so the whole interface shares one corner style.

@@@
slug: glassmorphism-backdrop-filter-guide
tool: glassmorphism-generator
title: Glassmorphism With CSS backdrop-filter: How It Works and When to Use It
desc: How the frosted-glass effect is built with backdrop-filter, transparency and borders, how it compares to blur on images, its performance cost, and how to keep glass UI readable.
keywords: glassmorphism, backdrop-filter, frosted glass css, glass effect css, blur background css, glassmorphism accessibility
###
Frosted glass panels, where the background shows through blurred and softened, have been a staple of operating system design since Apple introduced translucency in iOS 7 (2013) and Microsoft followed with its Acrylic material in Fluent Design (2017). In 2020 the style got a name on the web, “glassmorphism”, and Apple pushed translucent materials further again with its “Liquid Glass” design in 2025. The good news is that the core effect takes only a few lines of CSS.

## The ingredients

A convincing glass panel has four parts:

1. **A semi-transparent background**, so the content behind is visible.
2. **A background blur**, which frosts whatever is behind the panel.
3. **A subtle light border**, which mimics light catching the edge of glass.
4. **A soft shadow**, which lifts the panel off the background.

```
.glass {
  background: rgb(255 255 255 / 0.22);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border: 1px solid rgb(255 255 255 / 0.35);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgb(20 20 20 / 0.12);
}
```

## backdrop-filter versus filter

These two properties are easy to confuse:

| Property | What it affects | Example result |
|---|---|---|
| `filter: blur(10px)` | The element itself and its children | The panel and its text become blurry |
| `backdrop-filter: blur(10px)` | Whatever is *behind* the element | The panel stays sharp; the background seen through it is blurred |

`backdrop-filter` is what makes glass possible. It accepts the same functions as `filter`: blur, saturate, brightness, contrast and more. Adding `saturate(150–180%)` is a small detail that makes colors behind the glass look richer, closer to how real frosted glass glows.

Safari needs the `-webkit-backdrop-filter` prefix (unprefixed support arrived only in recent versions), so keep both lines. Chrome, Edge and Firefox support the unprefixed property; Firefox enabled it by default in version 103 (2022).

## It needs something behind it

The most common glassmorphism mistake is putting a glass panel on a plain white or flat grey background. With nothing colorful behind it, the blur has nothing to blur, and the panel just looks like a slightly grey box. Glass works over:

- vivid gradients or [mesh gradients](/tools/mesh-gradient-generator/),
- photos,
- colorful shapes or [blobs](/tools/svg-blob-generator/) placed behind the panel,
- moving content, like a video or a scrolling page under a sticky header.

## Readability: the big risk

Because the background changes depending on what is behind the panel, the contrast between text and its surroundings is unpredictable. A white glass panel with dark text might pass contrast over a dark area of the background and fail over a bright yellow area.

Ways to keep it readable:

- **Increase background opacity** where text sits. 30–60% white is much safer than 10–20%.
- **Use stronger blur.** More blur averages the background into a smoother color, so contrast becomes more predictable.
- **Test the worst case.** Check text against the lightest and darkest colors that could appear behind it using a [contrast checker](/tools/contrast-checker/).
- **Respect user preferences.** Some systems offer a “reduce transparency” setting. CSS has a `prefers-reduced-transparency` media query, but browser support is still incomplete, so make your default glass readable on its own.

## Performance

`backdrop-filter` is one of the more expensive CSS effects. For every frame, the browser has to read the pixels behind the element and blur them, and the cost grows with the blur radius and the panel’s size. On modern desktops this is rarely an issue. On low-end phones, several large blurred panels, especially over animated or scrolling content, can cause dropped frames.

| Usage | Risk |
|---|---|
| One sticky header with blur | Low, very common pattern |
| A few small glass cards on a static background | Low |
| Full-screen glass overlays on scrolling content | Medium |
| Many stacked, large, heavily blurred layers with animation | High on mobile |

Keep blur radii moderate (8–20px), limit the number of glass layers on screen, and test on a mid-range phone.

## Fallbacks

Always define a background that works without the blur, then enhance:

```
.glass { background: rgb(255 255 255 / 0.85); }
@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .glass { background: rgb(255 255 255 / 0.22); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
}
```

Browsers without support get a solid, readable panel instead of a transparent one.

## Glass, neumorphism and flat design compared

| Style | Separation from background | Accessibility risk | Performance cost | Best for |
|---|---|---|---|---|
| Flat with borders | Borders and color | Low | Lowest | Most interfaces |
| Material elevation | Shadows | Low | Low | Apps, dashboards |
| Glassmorphism | Blur and transparency | Medium (variable contrast) | Medium | Overlays, headers, hero sections |
| Neumorphism | Soft paired shadows | High (low contrast) | Low | Decorative elements |

We look at the soft-shadow alternative in our [neumorphism guide](/blog/neumorphism-soft-ui-pros-and-cons/).

## Where glass works well

- **Sticky navigation bars**, where content scrolls underneath and stays faintly visible.
- **Modal and sheet overlays**, which keep users oriented by showing the page behind.
- **Media players and image overlays**, where controls sit on top of video or photos.
- **Hero sections** with a single glass card on a vivid background.

Where it works less well: dense data tables, long-form reading, and forms, where clarity matters more than atmosphere.

## Summary

Glassmorphism is transparency plus `backdrop-filter: blur()`, a light border and a soft shadow. It needs a colorful background to shine, a solid fallback for unsupported browsers, and careful attention to text contrast. Tune blur, transparency and saturation visually in the [glassmorphism generator](/tools/glassmorphism-generator/), then test on a real phone before you ship.
