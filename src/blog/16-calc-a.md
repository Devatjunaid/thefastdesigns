@@@
slug: ppi-vs-dpi-pixel-density
tool: ppi-calculator
title: PPI vs DPI: Pixel Density Explained for Screens, Phones and Designers
desc: What PPI and DPI really mean, how screen pixel density is calculated, why viewing distance matters, what “Retina” means, and how pixel density affects design and image exports.
keywords: ppi vs dpi, pixel density, ppi calculator, screen dpi, retina display ppi, pixels per inch
###
PPI and DPI are two of the most confused terms in design. People say “72 DPI for web” and “300 DPI for print”, phones advertise “460 PPI”, and design software asks for a resolution when you export. They are related ideas, but they describe different things, and mixing them up leads to blurry exports and wasted effort.

## The definitions

**PPI (pixels per inch)** describes how many pixels fit into one inch of a **screen**, or how densely an image’s pixels will be spread when printed.

**DPI (dots per inch)** describes how many dots of ink or toner a **printer** places per inch. Printers often use many tiny dots of a few ink colors to reproduce a single image pixel, so a printer’s DPI rating (often 1200–4800) is usually much higher than the PPI of the image you send it.

In everyday speech, “DPI” is often used for both, including in software dialogs. That’s fine as long as you know which one is meant: for images and screens, it’s pixels per inch.

## How screen PPI is calculated

A screen’s PPI depends on its resolution and its physical size:

1. Find the diagonal resolution in pixels: √(width² + height²)
2. Divide by the diagonal size in inches.

Example: a 27-inch 2560 × 1440 monitor.

- √(2560² + 1440²) = √(6,553,600 + 2,073,600) ≈ 2937 pixels
- 2937 ÷ 27 ≈ **108.8 PPI**

Our [PPI calculator](/tools/ppi-calculator/) does this, and also calculates the dot pitch (the distance between pixels) and the physical width and height of the display.

## Typical pixel densities

| Device | Typical resolution | Approximate PPI |
|---|---|---|
| 24″ Full HD monitor | 1920 × 1080 | 92 |
| 27″ QHD monitor | 2560 × 1440 | 109 |
| 27″ 4K monitor | 3840 × 2160 | 163 |
| 27″ 5K display | 5120 × 2880 | 218 |
| 13–14″ high-resolution laptop | ~2560 × 1600 | 220–230 |
| Modern smartphone | ~1170–1440 wide | 400–550 |
| 55″ 4K TV | 3840 × 2160 | 80 |

A 55-inch 4K TV has lower pixel density than a typical office monitor, but it looks sharp because you sit much further away.

## Viewing distance: why “Retina” is relative

Apple introduced the “Retina” label in 2010 with the iPhone 4 (326 PPI), describing a density at which individual pixels can’t be distinguished at a normal viewing distance. The key phrase is *viewing distance*. Visual acuity is commonly modelled as resolving about one arcminute (1/60 of a degree) for 20/20 vision. From that, you can calculate the distance at which a screen’s pixels blend together:

| PPI | Pixels become indistinguishable beyond roughly |
|---|---|
| 90 | 38 in (97 cm) |
| 110 | 31 in (80 cm) |
| 220 | 16 in (40 cm) |
| 326 | 10.5 in (27 cm) |
| 460 | 7.5 in (19 cm) |

This is why phones need much higher density than laptops, and laptops more than TVs. Our PPI calculator shows this “retina distance” for any screen.

## CSS pixels versus physical pixels

On the web, you design in **CSS pixels**, not physical ones. A phone with a 1179-pixel-wide panel and a device pixel ratio (DPR) of 3 reports a viewport 393 CSS pixels wide. Each CSS pixel is drawn with a 3 × 3 block of physical pixels. That keeps text and buttons a comfortable physical size across devices with very different pixel densities.

You can see your own screen’s CSS resolution and DPR with our [screen resolution checker](/tools/screen-resolution-checker/), and we explain the relationship in [screen resolution vs viewport vs DPR](/blog/screen-resolution-vs-viewport-vs-dpr/).

## What this means for designers

**Export raster images at 2x.** On a DPR 2 or 3 screen, an image exported at 1x looks soft. 2x is the practical sweet spot for photos; 3x adds file size with little visible gain for most images.

**Use vectors for icons and logos.** SVG renders sharp at any density, so DPR doesn’t matter.

**Thin lines and small text look different by device.** A 1px hairline is crisp on a 2x screen but can look heavy or blurry on a 1x monitor. Light font weights that look elegant on a high-density laptop can look spindly on a standard office screen. Test on both.

**Physical size matters for touch targets.** Guidelines like 44pt (Apple) and 48dp (Android) are in density-independent units, which map to roughly the same physical size on every device.

## The myth of “72 DPI for web”

The “72 DPI” rule comes from the original 1984 Macintosh, whose screen displayed 72 pixels per inch so that one screen pixel matched one typographic point. Today, the DPI value stored in an image file has **no effect on how it displays on the web**. A 1200 × 800 image looks the same in a browser whether its metadata says 72 or 300 DPI. Only pixel dimensions matter for screens.

PPI only matters when you print, where it determines physical size: 3000 pixels printed at 300 PPI is 10 inches wide. Our [print resolution guide](/blog/print-resolution-dpi-guide/) covers that side.

## PPI versus DPI at a glance

| | PPI | DPI |
|---|---|---|
| Applies to | Screens and digital images | Printers and printed output |
| Measures | Pixels per inch | Ink dots per inch |
| Typical values | 90–550 (screens), 150–300 (images for print) | 300–4800 (printers) |
| Affects web display? | Screen PPI affects sharpness; file metadata does not | No |

## Summary

PPI is pixel density, for screens and images; DPI is ink dot density, for printers. Screen PPI is the diagonal resolution divided by the diagonal size, and whether it looks sharp depends on viewing distance. On the web, the DPI stored in an image file is irrelevant: pixel dimensions and the device pixel ratio are what count. Export raster images at 2x, use SVG for icons, and test light fonts on standard-density screens.

@@@
slug: print-resolution-dpi-guide
tool: print-size-calculator
title: Print Resolution Guide: How Many Pixels You Need for Sharp Prints
desc: How to calculate print size from pixels and DPI, why 300 PPI is the standard, when 150 or lower is fine, bleed and safe zones, and why changing the DPI number doesn’t add detail.
keywords: print resolution, 300 dpi, pixels for print, print size calculator, image resolution for printing, bleed and safe zone
###
An image that looks perfect on screen can print blurry and pixelated, and a client’s “high-resolution logo” sometimes turns out to be a 400-pixel thumbnail. Print resolution is simple math once you understand that only one thing really matters: how many pixels are spread across each inch of paper.

## The core formula

**Print size (inches) = pixels ÷ PPI**

**Pixels needed = print size (inches) × PPI**

A 3000 × 2400 pixel image printed at 300 PPI is 10 × 8 inches. Printed at 150 PPI, the same image is 20 × 16 inches, but with half the detail per inch.

For metric sizes, convert first: 1 inch = 2.54 cm = 25.4 mm. An A4 page is 210 × 297 mm, or 8.27 × 11.69 inches. At 300 PPI that needs **2480 × 3508 pixels**.

Our [print size calculator](/tools/print-size-calculator/) works in both directions: pixels to print size, and paper size to pixels needed.

## Why 300 PPI is the standard

At a normal reading distance of about 25–30 cm (10–12 inches), people with good vision can resolve fine detail around 300 pixels per inch. Above that, most people can’t see a difference in a printed photo. That’s why 300 PPI became the standard for magazines, books, photo prints and brochures, and why print shops ask for it.

## When less is fine

Viewing distance changes everything. A poster seen from across a room doesn’t need the same density as a business card held in your hand.

| Product | Typical viewing distance | Recommended resolution |
|---|---|---|
| Business cards, flyers, magazines, photo prints | 25–40 cm | 300 PPI |
| Posters (A2–A0) | 1–2 m | 150–200 PPI |
| Roll-up banners, trade show displays | 2–3 m | 100–150 PPI |
| Large outdoor banners | 5 m+ | 30–100 PPI |
| Billboards | 50 m+ | 10–30 PPI |

So a 3 × 2 m outdoor banner doesn’t need 35,000 pixels across; at 50 PPI it needs about 5,900. Always ask the printer what they recommend for the specific product.

## Pixels needed for common sizes at 300 PPI

| Size | Dimensions | Pixels at 300 PPI |
|---|---|---|
| Business card (US) | 3.5 × 2 in | 1050 × 600 |
| Business card (EU) | 85 × 55 mm | 1004 × 650 |
| Photo 4 × 6 | 4 × 6 in | 1200 × 1800 |
| Photo 5 × 7 | 5 × 7 in | 1500 × 2100 |
| A5 | 148 × 210 mm | 1748 × 2480 |
| A4 | 210 × 297 mm | 2480 × 3508 |
| US Letter | 8.5 × 11 in | 2550 × 3300 |
| A3 | 297 × 420 mm | 3508 × 4961 |

For the full list of paper sizes, see our [paper size chart](/tools/paper-size-chart/) and the guide to [ISO and US paper sizes](/blog/paper-sizes-iso-216-vs-us-letter/).

## Changing the DPI number doesn’t add detail

Image files store a “resolution” value in their metadata, such as 72 or 300 DPI. Changing it in Photoshop without resampling just changes the intended print size. The pixels stay the same. A 600 × 400 pixel image “set to 300 DPI” is simply a 2 × 1.33 inch print.

Upscaling (adding pixels) can’t recover detail that was never captured. Traditional resampling produces a soft image; AI upscalers can invent convincing texture, which sometimes works for photos but is unreliable for logos and text. For logos, the real fix is a vector file (SVG, PDF, EPS or AI), which prints sharp at any size.

## Effective resolution after scaling

When you place an image in a layout and scale it, its effective resolution changes:

**Effective PPI = original PPI × (100 ÷ scale percentage)**

A 300 PPI image enlarged to 150% in InDesign has an effective resolution of 200 PPI. Reduced to 50%, it becomes 600 PPI (more than needed, which is fine). Layout software shows effective PPI in its links or info panel; check it before sending files.

## Bleed, trim and safe zone

Print shops trim sheets after printing, and the cut is never perfectly precise. Three zones protect your design:

| Zone | What it is | Typical size |
|---|---|---|
| Bleed | Background extended beyond the trim line, so no white edge appears if the cut drifts | 3 mm (Europe) or 0.125 in (US) on each side |
| Trim line | The final size of the product | e.g. 210 × 297 mm |
| Safe zone | Area inside the trim where text and important elements should stay | 3–5 mm inside the trim |

So an A4 flyer with bleed is designed at 216 × 303 mm, which at 300 PPI is about 2551 × 3579 pixels.

## Color for print

Screens use RGB light; printers use CMYK inks, which can’t reproduce some vivid screen colors. Convert using your printer’s ICC profile in a layout or image application, and order a proof when color is critical. Our guide to [HEX, RGB and CMYK](/blog/hex-rgb-hsl-cmyk-color-codes-explained/) explains why the same color code doesn’t translate perfectly.

## A pre-print checklist

1. Images at 300 PPI effective resolution (or the printer’s recommendation for large formats).
2. Logos and text as vectors, not raster screenshots.
3. 3 mm (0.125 in) bleed on all sides where artwork reaches the edge.
4. Important content inside the safe zone.
5. Colors converted with the printer’s profile, or RGB if the printer explicitly accepts it.
6. Fonts embedded or outlined in the PDF.
7. Export as a print PDF (often PDF/X) with crop marks if requested.

## Summary

Print resolution is pixels divided by inches. Use 300 PPI for anything viewed up close, 150 PPI for posters and less for large banners viewed from far away. Changing the DPI field doesn’t add detail, so start with enough pixels or use vectors, check effective resolution after scaling, and always add bleed and respect the safe zone.

@@@
slug: golden-ratio-in-design-myth-and-practice
tool: golden-ratio-calculator
title: The Golden Ratio in Design: Useful Tool, Common Myths and Practical Uses
desc: What the golden ratio (1.618) is, where it appears in design, which famous claims are myths, and practical ways to use it for layouts, typography and logo construction.
keywords: golden ratio, golden ratio design, phi 1.618, golden ratio typography, golden section layout, fibonacci design
###
Few numbers have as much mystique as the golden ratio. It’s been credited with the beauty of the Parthenon, the Mona Lisa, the Apple logo and the human face. Some of these claims hold up; many don’t. Stripped of myth, the golden ratio is simply a useful proportion that can bring balance to layouts, type scales and shapes, alongside other ratios that work just as well.

## What the golden ratio is

Divide a line into two parts so that the whole line divided by the longer part equals the longer part divided by the shorter part. That ratio is the golden ratio, written φ (phi):

**φ = (1 + √5) ÷ 2 ≈ 1.6180339887**

It has neat mathematical properties. 1 ÷ φ ≈ 0.618, which is φ − 1. Ratios of consecutive Fibonacci numbers (1, 1, 2, 3, 5, 8, 13, 21, 34…) get closer and closer to φ: 21 ÷ 13 ≈ 1.615, 34 ÷ 21 ≈ 1.619.

In practice, dividing a length by φ gives the longer part (61.8%) and the remainder is the shorter part (38.2%). Our [golden ratio calculator](/tools/golden-ratio-calculator/) does this for any length.

## Where it genuinely appears

- **Mathematics:** regular pentagons and pentagrams are full of golden ratios.
- **Nature (sometimes):** the spiral arrangement of seeds in sunflower heads relates to the golden angle (about 137.5°), which packs seeds efficiently.
- **Deliberate design:** some architects and designers have consciously used it. Le Corbusier built his “Modulor” proportion system on it in the 1940s.

## Common myths

| Claim | Reality |
|---|---|
| The Parthenon was designed with the golden ratio | Measurements depend heavily on which points you choose; there’s no evidence the builders used φ deliberately |
| Leonardo used it in the Mona Lisa | No documentary evidence; golden rectangles drawn over the painting are fitted after the fact |
| The nautilus shell is a golden spiral | Nautilus spirals vary and generally don’t match the golden spiral |
| Faces with golden proportions are most attractive | Not supported by consistent research |
| People universally prefer golden rectangles | Experiments since Fechner in the 1800s have produced mixed results |
| The Apple / Twitter logo was built on golden circles | Overlays showing this were made by others after the fact; the companies haven’t documented it |

The problem with many claims is that with enough measurement points, almost any design can be fitted to almost any ratio. That doesn’t make the golden ratio useless. It just means it’s one good proportion among several, not a law of beauty.

## Practical uses in design

**Layout splits.** Dividing a content area 61.8% / 38.2% creates a main column and sidebar that feel balanced. On a 960px container, that’s roughly 593px and 367px. It’s a reasonable alternative to a 2:1 or 3:1 split.

**Type scales.** Using φ as the ratio of a modular type scale (16px, 26px, 42px, 68px…) produces very dramatic headings. It suits posters and landing-page heroes, but most interfaces need a gentler ratio like 1.25 or 1.333. Our [type scale guide](/blog/modular-type-scales-explained/) compares ratios.

**Golden Ratio Typography.** A formula popularised by designer Chris Pearson relates font size, line height and line width: wider lines need more line height. For 16px text, the “ideal” width is about (16 × 1.618)² ≈ 670px, with a line height around 1.6. The calculator includes this formula. It’s a reasonable starting point, consistent with general readability guidance about line length (see our [line height guide](/blog/line-height-and-line-length-readability/)).

**Logo and icon construction.** Designers often build curves from circles whose diameters follow Fibonacci numbers. It gives a consistent system for curves, which helps logos feel coherent. Any consistent system would help; φ is simply a popular one.

**Photo composition.** The “phi grid” places lines at 38.2% and 61.8% instead of the rule of thirds’ 33.3% and 66.7%. The difference is small; both encourage placing subjects off-center.

## Golden ratio versus other useful ratios

| Ratio | Value | Where it’s useful |
|---|---|---|
| 1:1 | 1.0 | Squares, symmetry, avatars |
| Rule of thirds | 1:2 split | Photo composition, simple layouts |
| √2 | 1.414 | ISO paper sizes (A4); halving keeps the ratio |
| 3:2 | 1.5 | Photography, balanced rectangles |
| Golden ratio | 1.618 | Layout splits, dramatic type scales, logo construction |
| 16:9 | 1.778 | Screens and video |

The √2 ratio of A-series paper is arguably more practically useful than φ: it’s why an A4 sheet folded in half is exactly A5 with the same shape.

## How to use it sensibly

1. Use φ as a starting point, then adjust to your content and your spacing grid.
2. Round to practical values; 593.28px doesn’t need to be exact.
3. Don’t force it where content needs a different structure.
4. Combine with a consistent [spacing system](/blog/8pt-grid-spacing-system/) so the whole layout feels coherent.

## A worked layout example

Take a 1200px-wide page with 24px gutters and you want a golden split between article and sidebar. The available width is 1200 − 24 = 1176px. Dividing by φ gives a main column of about 727px and a sidebar of about 449px. Rounded to a 4px grid, that becomes 728px and 448px. The main column is then a comfortable width for reading, close to 70 characters per line at 18px text, and the sidebar is wide enough for related links and a call to action.

Compare the alternatives on the same page:

| Split | Main column | Sidebar | Feel |
|---|---|---|---|
| 1:1 | 588px | 588px | Equal, no clear focus |
| 2:1 | 784px | 392px | Clear focus, narrow sidebar |
| Golden (1.618:1) | 727px | 449px | Clear focus, generous sidebar |
| 3:1 | 882px | 294px | Article dominates; long lines |

None is objectively correct. The golden split simply sits between 2:1 and 3:2, which is why it often feels balanced.

## Summary

The golden ratio, about 1.618, is a real and elegant proportion with genuine uses in layout, type scales and logo construction. Many famous claims about it are myths built on selective measurement. Treat it as one good tool among several, use it where it helps balance a design, and round to practical values.

@@@
slug: points-picas-pixels-design-units
tool: design-unit-converter
title: Points, Picas, Pixels, Inches and Millimetres: Design Units Explained
desc: Where typographic points and picas come from, how 1 inch equals 72 points and 96 CSS pixels, converting between print and screen units, and why DPI changes pixel values for print.
keywords: points to pixels, pt to px, picas, design units, mm to px, inches to pixels
###
Designers move between print and screen constantly, and each has its own measurement units. Print uses points, picas, inches and millimetres; screens use pixels, rem and em. The conversions are fixed and logical once you know where the units come from, and a few key numbers cover almost every situation.

## Points and picas: typography’s units

Typesetters measured type in **points** long before computers. Historically, point sizes varied between countries and foundries: the French Didot point, the American point (adopted in 1886) and others were all slightly different.

Desktop publishing standardised the modern **PostScript point** in the 1980s: exactly **1/72 of an inch**. That’s the point used today in InDesign, Illustrator, Word and CSS.

A **pica** is 12 points, so **6 picas = 1 inch**. Picas are still used in some publishing workflows to measure column widths and margins.

## The CSS pixel

On the web, CSS defines an absolute inch as **96 CSS pixels**. That definition dates back to Windows’ standard display assumption of 96 DPI, and it was fixed in the CSS specifications so that physical units (in, cm, mm, pt) map to pixels consistently.

That gives the key conversion:

**1 inch = 72 pt = 96 px (CSS) = 6 pc = 2.54 cm = 25.4 mm**

So:

- **1 pt = 1.333 px**, and **12 pt = 16 px**, which is the browser default text size,
- **1 px = 0.75 pt**,
- **1 mm ≈ 3.78 px** (at 96 px per inch),
- **1 cm ≈ 37.8 px**.

## Conversion table (CSS, 96 px per inch)

| Unit | In pixels | In points | In millimetres |
|---|---|---|---|
| 1 inch | 96 | 72 | 25.4 |
| 1 cm | 37.8 | 28.35 | 10 |
| 1 mm | 3.78 | 2.835 | 1 |
| 1 pica | 16 | 12 | 4.233 |
| 1 point | 1.333 | 1 | 0.353 |
| 1 px | 1 | 0.75 | 0.265 |

Our [design unit converter](/tools/design-unit-converter/) converts any value across all these units, plus em and rem.

## CSS physical units don’t measure real inches on screen

A common surprise: `width: 1in` in CSS is not one real inch on your monitor. It’s 96 CSS pixels, and how big that looks depends on the screen’s pixel density and the device pixel ratio. A CSS inch on a phone is much smaller than a real inch. Physical units in CSS are reliable for **print stylesheets**, where browsers map them to real paper sizes, but on screen they’re just fixed multiples of px.

## Pixels in print depend on DPI

Outside CSS, “how many pixels is 10 mm?” has no single answer, because it depends on the output resolution:

| 10 mm at… | Pixels |
|---|---|
| 72 DPI | 28 |
| 96 DPI | 38 |
| 150 DPI | 59 |
| 300 DPI | 118 |

So when a print designer asks for an image “10 cm wide”, the pixel width depends on the printer’s required resolution, typically 300 PPI, giving about 1181 pixels. Our [print resolution guide](/blog/print-resolution-dpi-guide/) covers this.

## em and rem

On the web, relative units sit alongside absolute ones:

- **rem** is relative to the root font size (16px by default),
- **em** is relative to the current element’s font size.

They have no fixed relationship to points or millimetres; they scale with text settings. That’s a feature for accessibility, explained in our [px vs rem vs em guide](/blog/px-vs-rem-vs-em/).

## Practical scenarios

**A print designer specifies 9pt body text for a brochure.** In print, that’s fine for dense copy. On screen, 9pt is 12px, which is too small for body text; use 16px (12pt) or larger for web body copy.

**A brand guide specifies a logo clear space of 10 mm.** For print, use 10 mm. For the website, convert to a sensible pixel value relative to the logo’s display size rather than to an absolute 38px, or define clear space as a fraction of the logo height, which works at any size.

**A Word document uses 11pt Calibri.** That’s about 14.7px. Recreating the document as a web page, 15 or 16px body text will feel equivalent.

**Figma designs in px, a print vendor wants mm.** At 96 px per inch, a 1080 × 1080 px design is 285.75 mm square, but for print you’d export at 300 PPI and get a 91.4 mm square at full quality, or scale the design to the intended physical size first.

## Typography sizes across media

| Use | Print (pt) | Web (px) |
|---|---|---|
| Captions and footnotes | 7–9 | 12–14 |
| Body text | 9–12 | 16–20 |
| Subheadings | 12–18 | 20–28 |
| Headlines | 18–48+ | 28–64+ |

Screens are usually viewed slightly further away and at lower effective resolution than print, so web text tends to be larger in equivalent units.

## Units in common design tools

Different tools default to different units, which is where many handoff mistakes begin:

| Tool | Default units | Notes |
|---|---|---|
| Figma, Sketch, Adobe XD | Pixels (1x, CSS-like) | Exports multiply by 2x/3x for assets |
| InDesign | Points/picas or mm (configurable) | Built for print layout |
| Illustrator | Points, mm or px (configurable) | Choose a print or web document profile |
| Photoshop | Pixels, with a resolution setting | Resolution defines physical print size |
| Word, Google Docs | Points for text, cm or inches for page | 12pt text is the classic default |
| CSS | px, rem, em (plus pt, mm, in for print) | 96px per inch |

When handing off, state both the unit and the resolution assumption, for example “all values in CSS px at 1x” or “artwork at 300 PPI, sizes in mm”. That one sentence prevents most conversion errors.

## Summary

The modern point is 1/72 inch, a pica is 12 points, and CSS defines 96 pixels per inch, so 12pt equals 16px. Millimetre and inch conversions to pixels depend on the target DPI outside of CSS. Use physical units for print, px or rem for screens, and convert with the right resolution in mind rather than assuming one fixed number of pixels per millimetre.

@@@
slug: layout-grids-12-column-guide
tool: layout-grid-calculator
title: Layout Grids Explained: 12-Column Grids, Gutters, Margins and Breakpoints
desc: How column grids work in web and print design, why 12 columns is the default, how to calculate column and gutter widths, responsive grids for mobile and desktop, and grids in CSS.
keywords: layout grid, 12 column grid, column width calculator, gutter width, responsive grid, grid system design
###
Grids are the invisible structure behind organised layouts. Swiss designers formalised them in print in the 1950s and 1960s; Josef Müller-Brockmann’s book *Grid Systems in Graphic Design* (1981) became a classic reference. On the web, frameworks like the 960 Grid System and Bootstrap made the 12-column grid the default. Understanding how column grids work makes layouts faster to design and easier to build.

## The parts of a column grid

| Part | What it is |
|---|---|
| Container | The total width the grid occupies |
| Margins | Space between the container edge and the first and last column |
| Columns | Equal-width vertical areas where content sits |
| Gutters | Fixed gaps between columns |

Content spans one or more columns. A card might span 4 of 12 columns, a sidebar 3, an article 8.

## Why 12 columns

12 divides evenly by 1, 2, 3, 4, 6 and 12. That allows halves, thirds, quarters and sixths without fractions:

| Layout | Column spans |
|---|---|
| Full width | 12 |
| Two equal columns | 6 + 6 |
| Three equal columns | 4 + 4 + 4 |
| Four equal columns | 3 + 3 + 3 + 3 |
| Main + sidebar | 8 + 4 or 9 + 3 |
| Centered article | 8 columns, offset by 2 |

A 10-column grid can’t do thirds; a 16-column grid can’t do thirds either. That flexibility is why 12 became the web default.

## Calculating column width

The formula:

**Column width = (container − 2 × margin − gutter × (columns − 1)) ÷ columns**

Example: a 1200px container, 12 columns, 24px gutters, 24px outer margins.

- Content width: 1200 − 48 = 1152px
- Total gutters: 24 × 11 = 264px
- Column width: (1152 − 264) ÷ 12 = **74px**

A span of n columns is n × column width + (n − 1) × gutter. A 4-column card here is 4 × 74 + 3 × 24 = **368px**. Our [layout grid calculator](/tools/layout-grid-calculator/) generates every span width and the matching CSS.

## Responsive grids

One grid doesn’t fit all screens. A common setup:

| Breakpoint | Columns | Gutter | Margin |
|---|---|---|---|
| Phone (under 600px) | 4 | 16px | 16px |
| Tablet (600–1024px) | 8 | 24px | 24–32px |
| Desktop (over 1024px) | 12 | 24–32px | auto (centered container) |

Material Design uses a similar 4/8/12 column system. Content that spans 12 columns on desktop might span 8 on tablet and 4 on mobile, keeping proportions consistent as the layout simplifies.

Many sites also cap the container width (1200–1440px) so that line lengths and card sizes don’t grow endlessly on very wide monitors.

## Fluid versus fixed grids

| Type | Columns | Gutters | Behaviour |
|---|---|---|---|
| Fixed | Fixed px | Fixed px | Same layout at all widths above a breakpoint |
| Fluid | Percentage / fr | Fixed px | Columns stretch; gutters stay the same |
| Hybrid | Fluid up to a max-width | Fixed px | Most common today |

CSS Grid makes fluid grids easy: `grid-template-columns: repeat(12, 1fr)` with `column-gap: 24px` creates 12 flexible columns with fixed gutters, and the browser does the math.

## Grids in CSS

```
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.grid { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; }
.card { grid-column: span 4; }
@media (max-width: 1024px) { .grid { grid-template-columns: repeat(8, 1fr); } }
@media (max-width: 600px)  { .grid { grid-template-columns: repeat(4, 1fr); column-gap: 16px; } .card { grid-column: span 4; } }
```

You don’t always need a 12-column system in code. For a card gallery, `repeat(auto-fit, minmax(260px, 1fr))` is simpler. The 12-column grid is most useful for complex page layouts and for keeping design and code aligned. Our [CSS Grid guide](/blog/css-grid-layout-guide/) covers the techniques.

## Gutters and the spacing system

Choose gutters and margins from your spacing scale (16, 24, 32px on an 8pt grid). Then everything, from component padding to column gaps, shares one rhythm. We cover spacing scales in the [8pt grid guide](/blog/8pt-grid-spacing-system/).

## Common mistakes

- **Treating the grid as a cage.** Grids guide alignment; not every element must fill whole columns. Breaking the grid deliberately, for a full-bleed image or an overlapping element, creates emphasis.
- **Different gutters everywhere.** Inconsistent gutters destroy the visual rhythm the grid is supposed to create.
- **Ignoring the vertical rhythm.** Columns align horizontally; consistent vertical spacing and line heights complete the system.
- **Over-complex grids for simple pages.** A blog article may only need a single centered column with a comfortable line length.

## Grids in print

Print grids often add **rows** (modular grids) and a **baseline grid** to which all text aligns, so lines in neighbouring columns sit on the same baselines. Magazines and newspapers rely on these. On the web, baseline grids are harder to enforce exactly, but setting line heights and spacing to multiples of 4px gets close.

## Summary

A column grid is a container, margins, equal columns and fixed gutters. Twelve columns dominate because 12 divides into halves, thirds, quarters and sixths. Calculate column width from the container, margins and gutters, use 4, 8 and 12 columns across breakpoints, pick gutters from your spacing scale, and implement it with CSS Grid’s `fr` units.
