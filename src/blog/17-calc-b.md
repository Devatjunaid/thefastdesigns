@@@
slug: line-height-and-line-length-readability
tool: line-height-calculator
title: Line Height and Line Length: The Two Settings That Make Text Readable
desc: Recommended line height for body text and headings, the 45–75 character line length rule, WCAG text spacing requirements, unitless line-height in CSS and vertical rhythm.
keywords: line height, line length, best line height for readability, characters per line, css line-height, wcag text spacing
###
Readers rarely notice good typography, but they feel it when it’s wrong. Lines packed too tightly blur together; lines that are too long make it hard to find the start of the next one. Two settings control most of this: line height (the vertical space between lines) and line length (how many characters fit on a line). Get these right and almost any font becomes comfortable to read.

## Line height basics

Line height, called leading in print (from the strips of lead typesetters placed between lines of metal type), is the distance from one line’s baseline to the next. In CSS it’s set with `line-height`, and the extra space is split equally above and below the text.

Recommended ranges:

| Text type | Typical line height |
|---|---|
| Body text (14–20px) | 1.4–1.6 |
| Long-form reading (articles, books) | 1.5–1.7 |
| Subheadings (20–32px) | 1.2–1.35 |
| Large headings (32px+) | 1.05–1.25 |
| Single-line UI labels, buttons | 1–1.25 |

Larger text needs proportionally less line height, because the absolute gap is already big. A heading at 48px with line height 1.5 has 24px of extra space, which makes multi-line headings look like separate lines rather than one block.

## The WCAG text spacing requirement

WCAG 2.1 success criterion 1.4.12 (Text Spacing, level AA) doesn’t require a specific line height in your design. It requires that content still works, with no clipped or overlapping text, when users override the spacing to at least:

- line height 1.5 times the font size,
- paragraph spacing 2 times the font size,
- letter spacing 0.12 times the font size,
- word spacing 0.16 times the font size.

In practice, using about 1.5 for body text by default and avoiding fixed-height containers for text makes compliance easy. Users with dyslexia and low vision often benefit from these increased spacings.

## Unitless line height

Always write body line height without a unit:

```
body { line-height: 1.5; }
```

A unitless value is inherited as a *ratio*, so every child element calculates its own line height from its own font size. If you write `line-height: 24px` or `1.5em`, the computed *value* is inherited instead. A 32px heading inside a body with `line-height: 24px` gets 24px line height, causing overlapping lines. Unitless avoids this.

## Line length: 45 to 75 characters

For body text, the most widely cited guideline, found in Robert Bringhurst’s *The Elements of Typographic Style*, is that lines of **45–75 characters** (including spaces) are comfortable, with **around 66 characters** often cited as ideal for single-column text.

- **Too long (90+ characters):** the eye struggles to find the next line and readers lose their place.
- **Too short (under 40):** frequent line breaks interrupt reading rhythm and create ragged, choppy text.

On the web, the simplest way to control line length is the `ch` unit, roughly the width of the “0” character:

```
.prose { max-width: 66ch; }
```

Because average characters are narrower than “0” in most fonts, `66ch` usually yields slightly more than 66 characters per line, which is still within the comfortable range.

## Line height and line length work together

Longer lines need more line height, because the eye travels further back to find the next line. Shorter lines can use a little less. A practical adjustment:

| Characters per line | Body line height |
|---|---|
| 45–55 | 1.4–1.5 |
| 55–70 | 1.5–1.6 |
| 70–80 | 1.6–1.7 |

The Golden Ratio Typography formula we discuss in the [golden ratio guide](/blog/golden-ratio-in-design-myth-and-practice/) formalises this relationship. Our [line height calculator](/tools/line-height-calculator/) suggests a ratio from your font size and line length, and previews the result.

## Font characteristics matter

Not all fonts at the same size look the same size:

- **x-height:** fonts with a tall x-height (like Verdana or Inter) look larger and often need a little more line height than fonts with a small x-height (like Garamond).
- **Ascenders and descenders:** fonts with long ascenders and descenders need more space to avoid collisions.
- **Weight:** dense, heavy text benefits from slightly more space.
- **Language:** scripts like Thai, Devanagari and Vietnamese, with stacked diacritics, need noticeably more line height than English.

## Vertical rhythm

Setting line heights to multiples of a base unit (often 4px or 8px) helps text align with the rest of the layout. With 16px text and line height 1.5, each line is 24px, a multiple of 8. Headings can use line heights of 32, 40 or 48px. Margins between paragraphs can match the line height. The result is a calm, consistent vertical rhythm, closely related to the [8pt spacing system](/blog/8pt-grid-spacing-system/).

## Paragraph spacing

Paragraphs need visible separation, typically equal to the line height or a bit more (1–1.5em). Avoid both indenting first lines and adding paragraph spacing at the same time; that’s a print convention clash. On the web, spacing between paragraphs without indents is standard.

## Mobile considerations

On phones, line length is naturally short (around 35–45 characters at 16px across a 360–390px screen), which is fine. Don’t shrink body text below 16px to fit more characters; it hurts readability and can trigger zooming on input fields in iOS. Keep line height around 1.5 and generous side padding of at least 16px.

## A quick recipe

1. Body text 16–18px, line height 1.5–1.6 (unitless).
2. Line length capped at about 60–70ch.
3. Headings with line heights from 1.1 to 1.3, decreasing as size increases.
4. Paragraph spacing about 1–1.5em.
5. Test with real content, then check that nothing breaks with WCAG text-spacing overrides.

## Summary

Line height and line length decide whether text is comfortable to read. Use about 1.5 for body text, less for large headings, write it unitless, and keep lines between 45 and 75 characters with `max-width` in `ch`. Increase line height for longer lines and taller x-heights, align line heights to a 4px or 8px rhythm, and make sure layouts survive users increasing spacing.

@@@
slug: css-viewport-units-vw-vh-dvh
tool: viewport-unit-converter
title: CSS Viewport Units Explained: vw, vh, vmin, vmax, dvh, svh and lvh
desc: How viewport units work, converting vw and vh to pixels, the mobile 100vh problem and the dvh/svh/lvh fix, why 100vw causes horizontal scroll, and container query units.
keywords: vw to px, viewport units, 100vh mobile, dvh svh lvh, vw vh css, container query units
###
Viewport units let you size things relative to the browser window instead of a parent element: a hero that fills the screen, a heading that grows with the window, a panel that’s always half the screen tall. They’re powerful and easy to use, but they come with two well-known traps, one on mobile and one on desktop.

## The basic units

| Unit | Equals |
|---|---|
| 1vw | 1% of the viewport width |
| 1vh | 1% of the viewport height |
| 1vmin | 1% of the smaller of width and height |
| 1vmax | 1% of the larger of width and height |

On a 1440 × 900 browser window, 10vw = 144px and 10vh = 90px. On a 390 × 844 phone, 10vw = 39px. Our [viewport unit converter](/tools/viewport-unit-converter/) converts both ways for common device sizes.

There are also logical versions, `vi` and `vb` (inline and block direction), which follow the writing mode, useful for vertical languages.

## The conversion formulas

- **px = value × viewport dimension ÷ 100**
- **value = px ÷ viewport dimension × 100**

48px on a 1440px-wide screen is 48 ÷ 1440 × 100 = **3.333vw**. The same 3.333vw on a 390px phone is just 13px, which shows why viewport units need limits.

## Trap 1: 100vh on mobile

On mobile browsers, the address bar and toolbar slide in and out as you scroll. Originally, browsers defined `100vh` as the height *with toolbars hidden*, the largest possible viewport, so that layouts wouldn’t jump while scrolling. The side effect: a `height: 100vh` section is taller than the visible screen when the page first loads, and content at the bottom (like a call-to-action button) is hidden behind the browser toolbar.

### The fix: small, large and dynamic viewport units

New units, supported in all major browsers since 2022–2023, describe each case explicitly:

| Unit | Based on | Use |
|---|---|---|
| `svh` (small) | Viewport with browser UI fully shown | Content that must always be fully visible |
| `lvh` (large) | Viewport with browser UI hidden | Same as the old vh behaviour |
| `dvh` (dynamic) | Current viewport, updates as UI shows/hides | Full-screen sections that should always fit |

There are matching `svw`, `lvw`, `dvw`, `svmin` and so on.

```
.hero { min-height: 100vh; min-height: 100dvh; }
```

The first line is a fallback for older browsers. `dvh` can cause content to resize while the user scrolls, so for many layouts `svh` is the calmer choice: always fits, never jumps.

## Trap 2: 100vw causes horizontal scrolling

On desktop operating systems with classic scrollbars (Windows, Linux, and macOS with “always show scroll bars”), `100vw` includes the vertical scrollbar’s width. An element set to `width: 100vw` is therefore about 15–17px wider than the visible content area, creating a horizontal scrollbar.

Fixes:

- Use `width: 100%` for full-width elements inside the page flow.
- For “full-bleed” elements breaking out of a centered container, use techniques based on the container’s width, or CSS Grid with named full-width columns.
- `scrollbar-gutter: stable` reserves scrollbar space consistently, which reduces layout jumps but doesn’t change what 100vw means.

## Typography with viewport units

Sizing text purely in vw is a classic mistake. It becomes tiny on phones and huge on wide monitors, and it doesn’t respond properly to browser zoom, which can fail WCAG 1.4.4 (Resize Text). Combine vw with rem inside `clamp()`:

```
h1 { font-size: clamp(2rem, 1.2rem + 3vw, 4rem); }
```

Our [fluid typography guide](/blog/fluid-typography-with-clamp/) explains the formula.

## Container query units

Viewport units are relative to the whole window, but components often live in containers of different widths: a card might appear in a narrow sidebar or a wide main column. **Container query units** solve this:

| Unit | Relative to |
|---|---|
| `cqw` / `cqh` | 1% of the query container’s width / height |
| `cqi` / `cqb` | 1% of the container’s inline / block size |
| `cqmin` / `cqmax` | Smaller / larger of cqi and cqb |

Set `container-type: inline-size` on the parent, and children can size text and spacing with `cqi` instead of `vw`. Supported in all major browsers since 2023.

## Percentages versus viewport units

| Unit | Relative to | Typical use |
|---|---|---|
| % (width) | Parent’s width | Columns, images inside containers |
| % (height) | Parent’s height, only if the parent has a defined height | Often confusing; prefer other methods |
| vw / vh | Browser viewport | Full-screen sections, fluid type with clamp() |
| dvh / svh | Viewport accounting for mobile UI | Mobile full-height layouts |
| cqi | Component’s container | Responsive components |

Percentage heights often “don’t work” because the parent has no explicit height. Viewport units sidestep this, which is why `min-height: 100vh` became the go-to way to make full-height layouts.

## Practical recipes

- **Full-screen hero on mobile:** `min-height: 100svh;` (with a `100vh` fallback).
- **Sticky footer layout:** body as a flex column with `min-height: 100dvh`, main content `flex: 1`.
- **Fluid section padding:** `padding-block: clamp(3rem, 8vh, 8rem)`.
- **Modal max height:** `max-height: 90dvh; overflow: auto;`.
- **Square that fits the screen:** `width: 80vmin; height: 80vmin;`.

## Summary

vw and vh are percentages of the browser window: handy for full-screen layouts and fluid sizing, but risky alone. Use `svh` or `dvh` instead of `100vh` for mobile full-height sections, `100%` instead of `100vw` for full-width elements, `clamp()` with rem for text, and container query units for components that live in containers of different sizes.

@@@
slug: paper-sizes-iso-216-vs-us-letter
tool: paper-size-chart
title: Paper Sizes Explained: ISO A Series vs US Letter, Legal and Tabloid
desc: Why A4 is 210 × 297 mm, how the √2 ratio makes A-series sizes scale perfectly, how A4 compares to US Letter, B and C sizes, and designing documents that print well everywhere.
keywords: paper sizes, a4 vs letter, a4 size in mm, iso 216, us letter size, paper size chart
###
Most of the world uses A4 paper; the United States and Canada mostly use Letter. They look almost identical, but they aren’t, and documents designed for one can lose margins, wrap differently or get scaled when printed on the other. Understanding where paper sizes come from also explains a lovely piece of design logic behind the A series.

## The ISO 216 A series

The A series, defined in the international standard ISO 216, is based on two simple rules:

1. **A0 has an area of one square metre.**
2. **Every sheet has a width-to-height ratio of 1 : √2** (about 1 : 1.414).

The √2 ratio has a special property: when you cut a sheet in half across its long side, both halves have exactly the same proportions as the original. A0 folded in half is A1; A1 in half is A2; and so on down to A10.

| Size | Millimetres | Inches (approx.) | Common uses |
|---|---|---|---|
| A0 | 841 × 1189 | 33.1 × 46.8 | Large posters, technical drawings |
| A1 | 594 × 841 | 23.4 × 33.1 | Posters, flip charts |
| A2 | 420 × 594 | 16.5 × 23.4 | Posters, diagrams |
| A3 | 297 × 420 | 11.7 × 16.5 | Small posters, drawings, spreads |
| A4 | 210 × 297 | 8.3 × 11.7 | Letters, documents, reports |
| A5 | 148 × 210 | 5.8 × 8.3 | Booklets, flyers, notebooks |
| A6 | 105 × 148 | 4.1 × 5.8 | Postcards |

This system was developed in Germany as DIN 476 in 1922, building on ideas proposed earlier (including by the scientist Georg Christoph Lichtenberg in 1786 and in France during the 1790s), and was adopted internationally as ISO 216 in 1975.

### Why the scaling is so useful

- **Enlarging and reducing:** going up or down one size always means scaling by √2 (141%) or 1/√2 (71%). Photocopiers have these presets for exactly that reason.
- **No wasted paper:** printers can cut many small sheets from a large one without leftovers.
- **Consistent design:** a layout designed for A4 scales to A3 or A5 without changing proportions.

## B and C series

- **B series** sizes are geometric means between adjacent A sizes (B4 sits between A3 and A4). They’re used for posters, books and some newspapers. Note that Japan uses its own JIS B sizes, which are slightly larger than ISO B sizes.
- **C series** (ISO 269) sizes are for envelopes, designed to fit A-series paper: a C4 envelope fits an unfolded A4 sheet, C5 fits A4 folded once, C6 fits A4 folded twice. The **DL** envelope (110 × 220 mm) fits A4 folded into thirds, the standard for business letters.

## US and Canadian sizes

North America uses inch-based sizes with no common ratio between them:

| Size | Inches | Millimetres | Ratio |
|---|---|---|---|
| Letter | 8.5 × 11 | 216 × 279 | 1.29 |
| Legal | 8.5 × 14 | 216 × 356 | 1.65 |
| Tabloid / Ledger | 11 × 17 | 279 × 432 | 1.55 |
| Executive | 7.25 × 10.5 | 184 × 267 | 1.45 |
| Half Letter (Statement) | 5.5 × 8.5 | 140 × 216 | 1.55 |

Folding Letter in half gives Half Letter, but the proportions change, so layouts don’t scale cleanly the way A sizes do. Our [paper size chart](/tools/paper-size-chart/) lists all of these with pixel dimensions at 72, 96, 150 and 300 DPI.

## A4 versus Letter

| | A4 | US Letter |
|---|---|---|
| Size | 210 × 297 mm | 216 × 279 mm |
| Width | 6 mm narrower | 6 mm wider |
| Height | 18 mm taller | 18 mm shorter |
| Pixels at 300 DPI | 2480 × 3508 | 2550 × 3300 |
| Used in | Most of the world | USA, Canada, parts of Latin America, the Philippines |

When a Letter document is printed on A4, the bottom of the page may be cut or the content scaled down; an A4 document printed on Letter can lose its right edge or be shrunk to fit.

## Designing for both

If a document will be printed in both regions, such as a résumé, a product sheet or a downloadable PDF, design within the area common to both: **210 × 279 mm** (the width of A4 and the height of Letter). Add comfortable margins of at least 15–20 mm, and most printers will print it well on either size with “fit to page” switched off.

## Pixels and print resolution

To design a print document in a pixel-based tool, multiply the size in inches by the target resolution. A4 at 300 DPI is 2480 × 3508 pixels; add 3 mm bleed per side for edge-to-edge printing. Our [print resolution guide](/blog/print-resolution-dpi-guide/) covers bleed, safe zones and effective resolution.

## Other common formats

- **Business cards:** 85 × 55 mm in much of Europe, 3.5 × 2 in (89 × 51 mm) in the US, 91 × 55 mm in Japan.
- **Credit card (ID-1):** 85.60 × 53.98 mm, standardised in ISO/IEC 7810; many membership cards and badges use it.
- **Photo prints:** 4 × 6 in (10 × 15 cm), 5 × 7 in and 8 × 10 in.

## Summary

ISO A sizes all share a 1 : √2 ratio, so halving or doubling a sheet keeps its shape, and A0 is exactly one square metre. A4 (210 × 297 mm) is narrower and taller than US Letter (8.5 × 11 in). For documents that must print everywhere, design within 210 × 279 mm with generous margins, and use 300 DPI pixel sizes when preparing print artwork in pixel-based tools.

@@@
slug: screen-resolution-vs-viewport-vs-dpr
tool: screen-resolution-checker
title: Screen Resolution vs Viewport Size vs Device Pixel Ratio: What Designers Need to Know
desc: The difference between physical screen resolution, CSS screen size, browser viewport and device pixel ratio, why a 4K laptop reports 1440px, and how to choose breakpoints and image sizes.
keywords: screen resolution, viewport size, device pixel ratio, css pixels, what is my screen resolution, responsive breakpoints
###
Ask “what resolution is this phone?” and you might get three different answers: the panel’s physical resolution from the spec sheet, the screen size the browser reports to websites, and the size of the browser window itself. All three are correct, and designers need to know which one matters for which decision.

## Four numbers, four meanings

| Term | What it is | Example (a typical modern phone) |
|---|---|---|
| Physical resolution | Actual pixels on the panel | 1179 × 2556 |
| Device pixel ratio (DPR) | Physical pixels per CSS pixel | 3 |
| Screen size (CSS pixels) | Physical resolution ÷ DPR | 393 × 852 |
| Viewport | The area the web page renders in | About 393 × 660–750, depending on browser bars |

Websites work in **CSS pixels**. Media queries, layouts and font sizes all use them. That’s why a phone with nearly 1200 physical pixels across behaves like a 393px-wide screen for your design, and why text and buttons end up a comfortable physical size.

## Device pixel ratio

DPR is the bridge between physical and CSS pixels. On a DPR 2 display, each CSS pixel is drawn with a 2 × 2 block of physical pixels; on DPR 3, a 3 × 3 block.

| Device type | Common DPR |
|---|---|
| Standard office monitor | 1 |
| Windows laptop with 125–150% scaling | 1.25–1.5 |
| MacBook, high-end Windows laptop | 2 |
| Most modern phones | 2–3 (some Android phones around 2.6–3.5) |

DPR is also affected by **operating system scaling** and **browser zoom**. Zooming a page to 200% on a DPR 1 monitor makes the browser report DPR 2 and halves the viewport width in CSS pixels. That’s how zoom triggers responsive layouts.

You can see all of these values for your current device with our [screen resolution checker](/tools/screen-resolution-checker/).

## Why a 4K laptop reports a small screen

A 14-inch laptop with a 2880 × 1800 panel, running at the default 200% scaling, reports a screen of 1440 × 900 CSS pixels. Websites lay out for 1440px, but every element is rendered with four times as many physical pixels, so text and images look very sharp. If the user changes scaling to “more space”, the CSS width grows and everything gets physically smaller.

## Screen versus viewport

The **screen** is the whole display. The **viewport** is the part of the browser window where the page renders, excluding browser toolbars, tabs, and on desktop, often the scrollbar. On desktop, users resize windows constantly, and many work with the browser at half-screen width. Media queries respond to the viewport, not the screen, which is exactly right: a 1440px screen with a 700px-wide window should get a tablet-like layout.

On mobile, the viewport height also changes as browser toolbars appear and disappear, which affects `100vh`. Our [viewport units guide](/blog/css-viewport-units-vw-vh-dvh/) covers the `dvh` and `svh` fixes.

## Choosing breakpoints

Because viewport widths vary continuously, the best breakpoints are where *your content* starts to look wrong, not specific device widths. That said, it helps to test at widely used viewport widths:

| Viewport width (CSS px) | Typical devices |
|---|---|
| 360–412 | Most Android and iPhone models in portrait |
| 768–834 | Tablets in portrait |
| 1024–1180 | Tablets in landscape, small laptops |
| 1280–1366 | Many laptops |
| 1440–1536 | Larger laptops, scaled high-resolution displays |
| 1920+ | Desktop monitors at 100% scaling |

Common breakpoint choices are around 600, 900 and 1200px, adjusted to your layout. Design mobile first, then add breakpoints when the layout has room to change.

## Choosing image sizes

DPR decides how many pixels an image needs:

- **Display width × DPR = pixels needed for full sharpness.**
- A 400px-wide card image needs 800px for DPR 2 screens and 1200px for DPR 3.

Use `srcset` and `sizes` so the browser picks the right file for each device, and export photos at 1x and 2x (3x adds weight with little visible benefit for photos). Use SVG for icons and logos. Our guide to [resizing images for the web](/blog/how-to-resize-images-for-the-web/) shows the HTML.

## Designing at 1x

Design tools like Figma work in “points” or CSS pixels at 1x. A 390 × 844 frame represents a phone’s CSS screen, not its physical pixels. Export assets at 2x and 3x from those designs. Don’t design at physical resolution (1179 × 2556), or every font size and spacing value will be three times too large when implemented.

## Testing and bug reports

Many layout bugs only happen at a specific viewport width, DPR or zoom level. When reporting or investigating a bug, record:

- viewport size in CSS pixels,
- device pixel ratio,
- browser and version,
- zoom level and OS scaling.

The screen resolution checker’s “Copy report” button collects these details for a ticket. Browser DevTools also let you simulate specific viewport sizes and DPR values, which is the quickest way to reproduce a reported issue.

## Summary

Physical resolution is what the panel has; CSS screen size is physical resolution divided by the device pixel ratio; the viewport is the browser area your page actually gets. Design and code in CSS pixels, choose breakpoints based on content and common viewport widths, export images at display size × DPR (usually 2x), and include viewport and DPR details in every layout bug report. For the related print-and-screen density question, see [PPI vs DPI](/blog/ppi-vs-dpi-pixel-density/).
