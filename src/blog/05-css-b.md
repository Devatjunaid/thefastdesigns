@@@
slug: css-text-shadow-effects-guide
tool: text-shadow-generator
title: CSS Text Shadow: From Subtle Readability Fixes to Neon and 3D Effects
desc: How CSS text-shadow works, how to stack multiple shadows for neon glow, retro 3D and outlines, when shadows improve readability over photos, and when they hurt it.
keywords: css text shadow, text-shadow examples, neon text css, 3d text css, glow effect, text outline css
###
`text-shadow` is one of the oldest decorative properties in CSS. It first appeared in the CSS2 specification in 1998, was dropped from CSS 2.1 because almost no browser supported it, and came back in CSS3. Today it works everywhere and does far more than add a drop shadow. With a few stacked values you can make text glow, pop out in 3D or get an outline, all while staying real, selectable, searchable text.

## The syntax

```
text-shadow: offset-x offset-y blur-radius color;
```

Unlike `box-shadow`, there is no spread value and no `inset`. Offsets move the shadow right and down; the blur softens it. Separate multiple shadows with commas, and the first one is drawn on top.

## Four effects, four techniques

| Effect | Technique | Example |
|---|---|---|
| Soft drop shadow | One shadow, small offset, medium blur, low opacity | `0 2px 8px rgb(0 0 0 / 0.25)` |
| Neon glow | Several shadows with zero offset and increasing blur in the same bright color | `0 0 4px #fff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff` |
| Retro 3D / extruded | Many hard shadows (no blur), each 1px further | `1px 1px 0 #c8a97e, 2px 2px 0 #c8a97e, 3px 3px 0 #c8a97e …` |
| Simple outline | Four 1px hard shadows in each diagonal direction | `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000` |

Our [text shadow generator](/tools/text-shadow-generator/) has presets for each, so you can see how the values combine before tweaking them.

### Why neon needs several layers

A single blurred shadow looks like a smudge. Real neon tubes have a bright core and a glow that fades gradually into the surrounding air. Stacking shadows with blur values that double each time (for example 5, 10, 20 and 40px) reproduces that falloff. A dark background is essential: glow is the difference between a light color and its surroundings, and on white there is nothing to glow against.

### Why 3D needs many hard shadows

One offset shadow looks like a flat duplicate behind the text. Many shadows offset one pixel at a time fill in the gap, creating a solid extruded side. Making the later shadows slightly darker adds a hint of shading. For long extrusions this gets verbose, and each shadow adds rendering work, so keep it to headings.

## text-shadow versus -webkit-text-stroke for outlines

| Approach | Pros | Cons |
|---|---|---|
| Four (or eight) 1px text shadows | Works everywhere, outline sits outside the letters | Corners can look jagged at thicker widths |
| `-webkit-text-stroke: 2px #000` | Clean, even stroke | Stroke is centered on the glyph edge, eating into thin letters; prefixed, though supported in all major browsers |
| `paint-order: stroke fill` with text-stroke | Stroke drawn behind fill for clean results | Support for HTML text is newer and less consistent |
| SVG text with stroke | Full control | Not regular HTML text |

For thin outlines on headings, shadows are reliable. For thick outlined “hollow” type, text-stroke usually looks better.

## The useful case: text over images

The most practical use of `text-shadow` is helping white text stay readable over photographs. A soft, dark shadow such as `0 1px 3px rgb(0 0 0 / 0.5)` creates a thin dark halo that separates letters from busy or bright backgrounds.

But it is not a guarantee. WCAG contrast is measured between the text color and the background behind it, and shadows aren’t part of that calculation. On a very bright sky, a white headline with a shadow can still be hard to read. More reliable options:

- a gradient overlay on the image, darker where the text sits (see our [CSS gradients guide](/blog/css-gradients-linear-radial-conic-guide/)),
- a semi-transparent panel behind the text,
- choosing or cropping the photo so text sits on a calm area.

Use the shadow as an extra layer of safety on top of one of these, and check the final result with a [contrast checker](/tools/contrast-checker/).

## When text-shadow hurts

**Body text.** Even soft shadows reduce the crispness of letter edges. At 16px, this makes text look blurry, especially on standard-density screens. Keep paragraphs shadow-free.

**Light text on light backgrounds.** A shadow can make low-contrast text look readable to the designer while still failing for users with low vision.

**Overused effects.** Neon and 3D effects lose their impact when they appear on every heading. Use them for one hero title or a logo-style headline.

**Performance on huge blur values.** Large blurs on lots of text, especially if animated, cost rendering time. Animating `text-shadow` causes repaints on every frame; animate `opacity` on a duplicate layer if you need a pulsing glow.

## Accessibility notes

Text with shadows remains real text: screen readers read it, users can select and translate it, and search engines index it. That is a big advantage over images of styled text. Just remember that `text-shadow` is invisible to anyone using Windows High Contrast (forced colors) mode, where browsers remove shadows and replace colors, so the text must work without the effect.

## Pairing with other effects

- **Gradient text** can’t use `text-shadow` directly, because the text fill is transparent and the shadow shows through. Use `filter: drop-shadow()` on the element instead. See our [gradient text generator](/tools/gradient-text-generator/).
- **Glow buttons** combine a `box-shadow` glow on the button with a smaller `text-shadow` on the label.
- **Pressed or engraved text** uses a 1px light shadow below dark text (or a dark shadow above light text) to suggest letters cut into the surface.

## Summary

`text-shadow` is a small property with a big range: one subtle shadow can rescue a headline over a photo, a stack of glows makes neon, and a stack of hard offsets makes retro 3D. Keep shadows off body text, don’t rely on them for contrast, and save the dramatic effects for the one place they matter most.

@@@
slug: css-easing-cubic-bezier-explained
tool: cubic-bezier-generator
title: CSS Easing Explained: Cubic-Bezier Curves, Durations and Natural Motion
desc: What CSS timing functions do, how cubic-bezier() control points shape motion, which easing to use for entering and exiting elements, recommended durations and reduced motion.
keywords: css easing, cubic-bezier, timing function, ease-in-out, animation easing, transition duration
###
Two animations can move an element the same distance in the same time and still feel completely different. One feels mechanical and cheap; the other feels smooth and natural. The difference is easing: how speed changes over the course of the animation. In CSS, easing is controlled by timing functions, and the most flexible of them is `cubic-bezier()`.

## Why linear motion looks wrong

Nothing in the physical world starts and stops instantly. A car accelerates, cruises, then brakes. A ball thrown upward slows as it rises. When an interface element moves at constant speed (linear timing) and then stops dead, our brains read it as artificial. Easing adds acceleration and deceleration, making motion feel like it has mass.

## Reading an easing curve

An easing curve is a graph:

- The **horizontal axis is time**, from start (0) to end (1).
- The **vertical axis is progress**, from the starting position (0) to the end position (1).

A steep part of the curve means fast movement; a flat part means slow movement. A straight diagonal line is linear. A curve that rises quickly and then flattens means a fast start and a gentle stop.

## How cubic-bezier() works

`cubic-bezier(x1, y1, x2, y2)` defines a curve that always starts at (0, 0) and ends at (1, 1). The four numbers are the coordinates of two control points that pull the curve toward them, just like the handles on a pen tool path in Figma or Illustrator.

- The x values (time) must stay between 0 and 1.
- The y values (progress) can go below 0 or above 1. That makes the element overshoot its target and come back, or pull back slightly before moving.

The best way to understand this is to drag the handles and watch the effect, which is exactly what our [cubic bezier generator](/tools/cubic-bezier-generator/) lets you do, with a live comparison against linear motion.

## The built-in keywords

| Keyword | cubic-bezier equivalent | Character |
|---|---|---|
| `linear` | `cubic-bezier(0, 0, 1, 1)` | Constant speed |
| `ease` (default) | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Quick start, long gentle stop |
| `ease-in` | `cubic-bezier(0.42, 0, 1, 1)` | Slow start, abrupt stop |
| `ease-out` | `cubic-bezier(0, 0, 0.58, 1)` | Fast start, gentle stop |
| `ease-in-out` | `cubic-bezier(0.42, 0, 0.58, 1)` | Slow start and stop |

The keywords are fine defaults but fairly mild. Custom curves with stronger acceleration, such as “expo” or “quint” style curves, feel more modern and responsive.

## Which easing for which movement

A widely used rule of thumb, found in Material Design and many other motion guidelines:

| Movement | Recommended easing | Why |
|---|---|---|
| Element enters the screen | Ease-out (decelerate) | It arrives quickly and settles, so users see it fast |
| Element leaves the screen | Ease-in (accelerate) | It gathers speed as it goes, like leaving the room |
| Element moves within the screen | Ease-in-out | It starts and stops on screen, so both ends need softness |
| Hover and color changes | Ease-out or ease, short | Immediate response with a soft finish |
| Playful confirmation (badge pop, like) | Back / overshoot curve | Slight bounce adds personality |

Ease-in on its own is rarely right for entering elements: it makes the interface feel sluggish, because the most visible part of the motion happens slowly at the start.

## Duration matters as much as easing

Even perfect easing feels wrong at the wrong speed. Common guidance:

- **100–200ms:** hover effects, button presses, small state changes.
- **200–300ms:** dropdowns, tooltips, small panels.
- **300–500ms:** modals, page-level transitions, large movements.
- **Over 500ms:** rarely appropriate for UI; feels slow on repeated use.

Larger elements and longer distances need slightly longer durations. Exit animations can be a bit faster than entrances, because users are already done with the element. On mobile, keep things on the shorter side.

## Overshoot and bounce

A y value above 1 produces overshoot, for example `cubic-bezier(0.34, 1.56, 0.64, 1)`, often called “ease-out-back”. The element passes its target and settles back. It adds personality to small confirmations, like adding an item to a cart. Use it sparingly: on every dropdown and modal it becomes tiring. Note that a single cubic-bezier can only overshoot once; for real multi-bounce effects you need keyframes or the newer `linear()` easing function.

## The linear() function

CSS now has a `linear()` timing function that accepts a list of points, letting you approximate any curve, including springs and bounces, with straight segments. It is supported in all major browsers since late 2023. Tools generate these long point lists from spring physics. For everyday transitions, `cubic-bezier()` remains simpler and easier to read.

## Respect reduced motion

Some people experience dizziness or nausea from motion, especially large movements, parallax and zooming. Operating systems offer a “reduce motion” setting, and CSS exposes it:

```
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

A gentler approach keeps fades and color changes but removes movement and scaling. WCAG 2.3.3 (Animation from Interactions, level AAA) recommends letting users disable non-essential motion triggered by interaction.

## Easing in transitions versus animations

- In a **transition**, the timing function applies to the whole change from one state to another.
- In a **keyframe animation**, the timing function applies to *each segment between keyframes*, not the animation as a whole. That surprises many developers: an animation with five keyframes and `ease` will slow down and speed up five times.

## Performance

Easing doesn’t affect performance; the properties you animate do. Animate `transform` and `opacity` wherever possible, because browsers can handle them on the compositor without recalculating layout. Our [CSS transforms guide](/blog/css-transforms-explained/) explains why.

## Summary

Easing gives motion weight. Use ease-out for things that appear, ease-in for things that leave, ease-in-out for things that move across the screen, and keep durations short. Experiment visually with a [cubic bezier generator](/tools/cubic-bezier-generator/), save a few curves as design tokens, and always honour reduced motion.

@@@
slug: css-grid-layout-guide
tool: css-grid-generator
title: CSS Grid Layout Guide: fr Units, minmax(), auto-fit and Grid vs Flexbox
desc: Learn CSS Grid from the ground up: grid-template-columns, the fr unit, gap, minmax(), auto-fit vs auto-fill, named areas, subgrid, and when to choose Grid over Flexbox.
keywords: css grid, grid-template-columns, css grid tutorial, auto-fit vs auto-fill, grid vs flexbox, fr unit
###
Before CSS Grid, web layouts were built with floats, tables, inline-blocks and framework class names, all workarounds for the fact that CSS had no real layout system. Grid arrived in all major browsers in 2017 and changed that. It lets you define rows and columns directly in CSS and place content into them, which makes complex layouts shorter and more predictable.

## The minimum you need

```
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```

That’s a three-column grid with 16px gaps. Every direct child becomes a grid item and flows into the next free cell, left to right, top to bottom. Rows are created automatically as needed.

## The fr unit

`fr` means “fraction of the remaining free space”. `1fr 2fr` gives the second column twice as much space as the first. Fixed sizes are taken out first: in `200px 1fr 1fr`, the first column is 200px and the other two split what is left.

One subtlety: `1fr` actually means `minmax(auto, 1fr)`, so a column won’t shrink below the width of its content. A long URL or a wide code block can push a column wider than you expect. Writing `minmax(0, 1fr)` lets the column shrink fully and fixes many “why is my grid overflowing” problems.

## Track sizing functions

| Value | Meaning | Typical use |
|---|---|---|
| `200px`, `12rem` | Fixed size | Sidebars, icons |
| `1fr` | Share of free space | Flexible columns |
| `auto` | Size to content | Labels, buttons |
| `minmax(200px, 1fr)` | At least 200px, at most one share | Responsive columns |
| `fit-content(300px)` | Size to content, up to 300px | Text columns with a cap |
| `repeat(4, 1fr)` | Repeat a pattern | Equal columns |

## Responsive grids without media queries

The most useful Grid pattern of all:

```
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
```

This creates as many columns as fit, each at least 240px wide, and stretches them to fill the row. On a phone you get one column; on a laptop, four. The tool cards on our homepage use this exact pattern.

### auto-fit versus auto-fill

| Keyword | Behaviour when there are fewer items than columns |
|---|---|
| `auto-fit` | Empty tracks collapse, and existing items stretch to fill the row |
| `auto-fill` | Empty tracks stay, so items keep their minimum size and leave space at the end |

With plenty of items, they behave the same. The difference shows with only two or three items on a wide screen: auto-fit makes them huge, auto-fill keeps them card-sized.

## gap

`gap` (formerly `grid-gap`) sets the spacing between rows and columns. Unlike margins, it never adds space on the outer edges, and it doesn’t collapse or double up. You can set rows and columns separately with `row-gap` and `column-gap`. Use values from your [spacing scale](/blog/8pt-grid-spacing-system/) for consistency.

## Placing items

Items can span multiple tracks:

```
.featured { grid-column: span 2; }
.sidebar { grid-column: 1 / 2; grid-row: 1 / 4; }
```

Line numbers start at 1 at the left edge; `-1` refers to the last line, so `grid-column: 1 / -1` spans the full width.

## Named areas

For page layouts, `grid-template-areas` is wonderfully readable:

```
.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
header { grid-area: header; }
```

Rearranging the layout for mobile is just a matter of redefining the areas in a media query.

## Subgrid

Nested grids used to be independent of their parent, so cards in a row couldn’t align their titles and buttons with each other. `grid-template-rows: subgrid` lets a child grid reuse the parent’s tracks. Subgrid has been supported in all major browsers since 2023 and is ideal for card layouts where headings, text and buttons should line up across cards.

## Grid versus Flexbox

| Question | Grid | Flexbox |
|---|---|---|
| Dimensions | Two (rows and columns together) | One (a row or a column) |
| Layout driven by | The container’s tracks | The items’ content sizes |
| Best for | Page layouts, card galleries, forms, dashboards | Navigation bars, button groups, centring, toolbars |
| Alignment across rows | Yes, items line up in columns | No, each line is independent |
| Overlapping items | Easy (place in the same cell) | Needs positioning |

They aren’t competitors. A typical page uses Grid for the overall layout and card galleries, and Flexbox inside components. If you want the details of Flexbox alignment, read our [Flexbox guide](/blog/flexbox-alignment-explained/).

## Common mistakes

- **Forgetting that only direct children are grid items.** Wrappers in between break the layout (or use `display: contents` with care, or subgrid).
- **Using `1fr` with long unbreakable content.** Switch to `minmax(0, 1fr)`.
- **Recreating 12-column frameworks unnecessarily.** Grid can express the layout directly. If you do want a classic column grid, our [layout grid calculator](/tools/layout-grid-calculator/) gives exact column widths.
- **Setting fixed heights on rows**, which cause overflow when content grows. Prefer `auto` or `minmax(100px, auto)`.

## Browser DevTools

Chrome, Firefox and Edge include Grid inspectors that overlay line numbers, track sizes and area names on the page. Firefox’s was the first and is still excellent. When a grid behaves unexpectedly, turn the overlay on before changing any code.

## Summary

Grid gives CSS a true two-dimensional layout system. Learn `fr`, `minmax()`, `repeat(auto-fit, …)`, `gap` and named areas, and you can build most layouts in a handful of lines. Try different column and gap settings in the [CSS grid generator](/tools/css-grid-generator/) and copy the code once the preview looks right.

@@@
slug: flexbox-alignment-explained
tool: flexbox-generator
title: Flexbox Alignment Explained: justify-content, align-items and the Main Axis
desc: A clear explanation of the Flexbox main and cross axes, justify-content vs align-items vs align-content, flex-grow and flex-shrink, gap, and the classic Flexbox gotchas.
keywords: flexbox, justify-content, align-items, align-content, css flexbox tutorial, center div flexbox
###
Flexbox is the layout tool most front-end developers reach for every day. It centres things, spaces navigation links, aligns icons with text and builds toolbars. Yet many people still try `justify-content` and `align-items` at random until something works. The confusion disappears once you understand one concept: the two axes.

## Main axis and cross axis

A flex container lays out its children along a line called the **main axis**. The direction of that line is set by `flex-direction`:

- `row` (the default): the main axis runs left to right (in left-to-right languages).
- `column`: the main axis runs top to bottom.
- `row-reverse` and `column-reverse` flip the direction.

The **cross axis** is always perpendicular to the main axis. Everything about Flexbox alignment depends on which axis a property controls:

| Property | Axis | Controls |
|---|---|---|
| `justify-content` | Main | Distribution of items along the line |
| `align-items` | Cross | Alignment of items within the line |
| `align-self` | Cross | Alignment of one item, overriding align-items |
| `align-content` | Cross | Spacing between lines when items wrap |

So when you switch from `row` to `column`, `justify-content` suddenly controls vertical spacing and `align-items` controls horizontal alignment. This is the number-one cause of Flexbox confusion, and it’s easy to see in action in our [flexbox generator](/tools/flexbox-generator/).

## justify-content values

| Value | Effect |
|---|---|
| `flex-start` | Pack items at the start |
| `center` | Pack items in the middle |
| `flex-end` | Pack items at the end |
| `space-between` | First and last items at the edges, equal space between |
| `space-around` | Equal space around each item (so edge gaps are half the middle gaps) |
| `space-evenly` | Exactly equal space everywhere, including edges |

## align-items values

| Value | Effect |
|---|---|
| `stretch` (default) | Items stretch to fill the line’s cross size |
| `flex-start` / `flex-end` | Align to one side of the line |
| `center` | Centre on the cross axis |
| `baseline` | Align the first line of text in each item |

`baseline` is underrated: it lines up text of different sizes perfectly, for example a large price next to a small “/month” label.

## Centring anything

The famous one-liner:

```
.parent { display: flex; justify-content: center; align-items: center; }
```

Grid offers an even shorter version, `display: grid; place-items: center;`, but the Flexbox approach is so common it is worth knowing by heart.

## Wrapping and align-content

By default, flex items stay on one line and shrink to fit. `flex-wrap: wrap` lets them flow onto new lines. Once there are multiple lines, `align-content` controls the spacing between those lines, much like `justify-content` does for items. With a single line, `align-content` does nothing, which explains why it often seems broken.

## gap

`gap` works in Flexbox in all modern browsers (Safari was last, in version 14.1, 2021). It replaces margin hacks for spacing items, and it never adds space at the outer edges. For tag lists and button groups that wrap, `display: flex; flex-wrap: wrap; gap: 8px;` is all you need.

## How items size themselves: grow, shrink, basis

Each item has three sizing properties, usually set with the `flex` shorthand:

- **flex-grow:** how much of the leftover space the item takes (0 by default).
- **flex-shrink:** how much it gives up when space runs out (1 by default).
- **flex-basis:** its starting size before growing or shrinking (`auto` by default, meaning its width or content size).

| Shorthand | Expands to | Meaning |
|---|---|---|
| `flex: 1` | `1 1 0%` | Grow and shrink equally from zero; items end up the same size |
| `flex: auto` | `1 1 auto` | Grow and shrink from content size; bigger content gets more space |
| `flex: none` | `0 0 auto` | Fixed at content size |
| `flex: 0 0 200px` | No grow, no shrink, 200px | A fixed-width sidebar |

## The margin: auto trick

Auto margins absorb free space in Flexbox. In a navigation bar, giving the last item `margin-left: auto` pushes it (and everything after it) to the far right. This is cleaner than `space-between` when you want a logo on the left, links in the middle-left and a button on the right.

## Classic gotchas

**Text overflow in flex items.** Flex items have `min-width: auto`, which means they won’t shrink below their content. A long word or URL can overflow the container. Add `min-width: 0` to the item (and `overflow-wrap: anywhere` or `text-overflow: ellipsis` to the text).

**Images stretching.** With the default `align-items: stretch`, images in a row can stretch vertically. Set `align-items: flex-start` or give images `align-self: center`.

**Order versus accessibility.** The `order` property and `row-reverse` change the visual order but not the order screen readers and keyboard navigation follow. Keep the source order logical.

**Percent heights in column layouts.** Children of a column flex container often need `flex: 1` and `min-height: 0` to scroll properly inside a fixed-height area.

## Flexbox versus Grid

Flexbox works along one axis and lets items’ content drive their size. Grid works in two dimensions and lets the container define the tracks. Use Flexbox for components (navbars, toolbars, media objects, button rows) and Grid for page layouts and galleries. We compare them in detail in our [CSS Grid guide](/blog/css-grid-layout-guide/).

## Summary

Every Flexbox alignment question becomes simple when you ask: which axis is this? `justify-content` works along the main axis, `align-items` across it, and `flex-direction` decides which is which. Add `gap` for spacing, `flex: 1` for equal sizing and `min-width: 0` for overflow, and Flexbox stops being a guessing game. Experiment with every property in the [flexbox generator](/tools/flexbox-generator/) to build intuition fast.
