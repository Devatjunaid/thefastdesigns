@@@
slug: title-case-vs-sentence-case
tool: text-case-converter
title: Title Case vs Sentence Case: Which to Use for Headlines, Buttons and UI Text
desc: The rules of title case in AP, Chicago and APA style, why many design systems switched to sentence case, all caps and readability, and naming cases like camelCase and kebab-case.
keywords: title case vs sentence case, title case rules, sentence case headlines, capitalization in ui, camelcase kebab-case, all caps readability
###
“Create Your Free Account” or “Create your free account”? It seems like a small choice, but capitalization affects how fast people read, how formal a product feels and how consistent an interface looks. Style guides disagree on the details, and many design systems have made a deliberate switch in the last decade.

## The main options

| Case | Example | Common uses |
|---|---|---|
| Title Case | The Quick Guide to Brand Colors | Book and article titles, US news headlines, some product UI |
| Sentence case | The quick guide to brand colors | UI text, many modern headlines, buttons |
| UPPERCASE | THE QUICK GUIDE | Short labels, logos, eyebrows above headings |
| lowercase | the quick guide | Stylised branding |
| Start Case (Every Word) | The Quick Guide To Brand Colors | Rarely correct; often a mistake for title case |

## Title case is not one rule

Title case means capitalizing the “main” words. Which words count as main depends on the style guide:

| Style guide | Lowercase (unless first or last word) |
|---|---|
| AP (Associated Press) | Articles, coordinating conjunctions and prepositions of three letters or fewer; capitalizes words of four letters or more, including prepositions like “With” |
| Chicago Manual of Style | Articles, coordinating conjunctions and all prepositions regardless of length (e.g. “through”, “between”) |
| APA | Words of three letters or fewer that are articles, short conjunctions or short prepositions; capitalizes words of four letters or more |

So the same title is written “A Guide through the Archives” in Chicago style but “A Guide Through the Archives” in AP and APA style, because “through” is a preposition of more than three letters. These differences are why automated title case tools sometimes disagree.

All styles agree on a few points: always capitalize the first and last word, capitalize nouns, verbs (including short ones like “Is” and “Be”), adjectives and adverbs, and keep articles (a, an, the) lowercase in the middle.

Our [text case converter](/tools/text-case-converter/) follows a widely used middle ground: short articles, conjunctions and prepositions are lowercased, the first and last words are capitalized, and words with existing internal capitals (iPhone, CSS3) are left alone.

## Why many design systems use sentence case

Google’s Material Design, Microsoft’s Fluent, GOV.UK, Atlassian, Shopify Polaris and many other design systems recommend sentence case for most UI text, including headings and buttons. Apple’s guidelines still use title case for some elements like menu items and button labels on macOS. Common reasons for sentence case:

- **It reads faster and feels more natural.** It matches how we write ordinary sentences.
- **It’s easier to apply consistently.** There are no debates about whether “With” or “Into” should be capitalized.
- **It sounds friendlier** and less formal, which suits most consumer products.
- **It makes proper nouns stand out.** When only names are capitalized, “Save to Dropbox” is clearly a product name.
- **It helps localisation.** Title case rules don’t exist in many languages (German capitalizes all nouns; French and Spanish use sentence case for titles).

## Where title case still fits

- Book, film and article titles in publications that follow AP or Chicago style.
- Formal documents and some publishing contexts.
- Products whose existing interface already uses title case, where consistency matters more than switching.

The worst choice is mixing: title case on some buttons and sentence case on others makes an interface look unpolished.

## All caps: use with care

Text in all capitals is slower to read in longer passages because words lose their distinctive shapes (ascenders and descenders). Studies of reading speed have generally found uppercase text reads more slowly than mixed case. In digital communication, all caps also reads as SHOUTING.

All caps works for:

- very short labels (“NEW”, “SALE”),
- small eyebrow text above headings,
- logos and stylised headings.

When you use it, add a little letter spacing (around 0.05–0.1em) to improve legibility, and apply it with CSS `text-transform: uppercase` rather than typing in capitals. That way the underlying text stays in normal case, which matters for screen readers (some spell out uppercase words letter by letter) and for copying and searching.

## Naming cases for code and files

Designers deal with code-style cases too, for class names, tokens, files and variables:

| Case | Example | Common use |
|---|---|---|
| camelCase | colorPrimary | JavaScript variables, design token names in JS |
| PascalCase | ButtonPrimary | Component names in React and other frameworks |
| kebab-case | color-primary | CSS classes and custom properties, URLs, file names |
| snake_case | color_primary | Python, some databases and APIs |
| CONSTANT_CASE | MAX_WIDTH | Constants in many languages |

**Use kebab-case for anything in URLs**, such as file names, image names and page slugs. Search engines treat hyphens as word separators, and URLs are case-sensitive on many servers, so lowercase with hyphens avoids broken links.

## A capitalization style guide for your product

Write down a short rule set:

1. Headings: sentence case (or title case, but choose one).
2. Buttons and links: sentence case, verb first.
3. Labels and form fields: sentence case.
4. Product and feature names: always capitalized the same way.
5. All caps: only for short labels, applied with CSS.

Then check existing copy with a converter and fix inconsistencies in one pass. For button wording itself, see our [button design guide](/blog/button-design-css-best-practices/).

## Summary

Title case capitalizes the main words, but AP, Chicago and APA disagree on which ones. Sentence case is simpler, friendlier and easier to keep consistent, which is why most modern design systems prefer it for UI text. Use all caps sparingly and through CSS, use kebab-case for URLs and file names, and write down your rules so everyone capitalizes the same way.

@@@
slug: 8pt-grid-spacing-system
tool: spacing-scale-generator
title: The 8pt Grid and Spacing Systems: How to Space Layouts Consistently
desc: Why designers use 8pt and 4pt spacing grids, how to build a spacing scale, the internal ≤ external rule, spacing tokens in CSS and Figma, and how spacing communicates grouping.
keywords: 8pt grid, spacing system, spacing scale, design tokens spacing, 4pt grid, consistent spacing ui
###
Inconsistent spacing is one of the most common reasons a layout feels slightly “off” even when the colors and fonts are fine: 13px here, 17px there, 22px somewhere else. A spacing system replaces those one-off values with a small, predictable set, and the 8-point grid is the most popular way to define one.

## What the 8pt grid is

The rule is simple: **all spacing and sizing values are multiples of 8**. Padding, margins, gaps, component heights and widths use 8, 16, 24, 32, 40, 48 and so on.

Why 8?

- **It divides evenly.** Common screen widths and breakpoints (320, 360, 768, 1024, 1280, 1440) are all divisible by 8, so layouts fit cleanly.
- **It scales cleanly.** On 1.5x and 2x screens, multiples of 8 become whole physical pixels (8 × 1.5 = 12), avoiding blurry half-pixel edges.
- **It’s easy to halve.** 8 → 4 → 2 stays whole, which a 5- or 10-based system doesn’t.
- **It limits choices.** Fewer options mean faster decisions and more consistent results.

Material Design popularised the 8dp grid, and most major design systems use 8 or 4 as their base unit.

## The 4pt half-step

Strict 8pt spacing is sometimes too coarse for small components: icon-to-label gaps, badge padding, tight list items. Most systems therefore allow **4pt steps for small values** (4, 8, 12, 16) and 8pt steps above that. Typography line heights are often set on a 4pt baseline grid too, so text aligns with the spacing rhythm.

## Building a spacing scale

A spacing scale is a fixed list of allowed values. Three common shapes:

| Progression | Example values (px) | Character |
|---|---|---|
| Linear multiples of 8 | 8, 16, 24, 32, 40, 48, 56, 64 | Even steps; many similar large values |
| Practical (fine at small sizes, coarse at large) | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 | The most common in real systems |
| Doubling | 4, 8, 16, 32, 64, 128 | Few options; big jumps |

The “practical” scale works best because small spaces need fine control (the difference between 8 and 12px padding is obvious in a button) while large spaces don’t (nobody can tell 88 from 96px between sections). Our [spacing scale generator](/tools/spacing-scale-generator/) builds all of these as CSS variables or JSON tokens.

## The internal ≤ external rule

A useful principle from Gestalt psychology’s **law of proximity**: elements that are close together are perceived as a group. In layout terms, the space *inside* a group should be smaller than the space *between* groups.

| Relationship | Typical spacing |
|---|---|
| Icon and its label | 4–8px |
| Label and its input | 4–8px |
| Fields in a form group | 16–24px |
| Between form sections | 32–48px |
| Between page sections | 64–128px |

When internal spacing is larger than external spacing, users misread which items belong together. A heading should be closer to the paragraph it introduces than to the paragraph above it. Getting this right does more for clarity than any visual decoration.

## Spacing tokens

Store the scale as named tokens, so designers and developers use the same values:

```
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
}
```

Name them by step, not by value (`--space-4`, not `--space-16`). Then you can retune the scale later without renaming everything. Some teams use t-shirt sizes (xs, sm, md, lg, xl) for the same reason. In Figma, the same values can live in variables and Auto Layout gaps.

Using rem instead of px (`--space-4: 1rem`) makes spacing scale with the user’s font size setting, keeping proportions between text and space. Our [px vs rem guide](/blog/px-vs-rem-vs-em/) explains when that’s desirable.

## Component sizes on the grid

The grid applies to sizes as well as spacing:

- buttons 32, 40 or 48px tall,
- inputs 40 or 48px,
- icons 16, 20, 24 or 32px,
- avatars 24, 32, 40, 48 or 64px.

Text inside components won’t always land exactly on the grid, because font metrics vary. Aim to make the *container* sizes and the spaces between components follow the grid, rather than forcing every text baseline.

## Layout grids versus spacing grids

These are related but different:

- A **spacing grid** (8pt) defines the allowed values for padding, margins and sizes.
- A **layout grid** (for example 12 columns with 24px gutters) defines where content sits horizontally.

They work best together: gutters and margins from the spacing scale, columns calculated from the container width. Our [layout grid guide](/blog/layout-grids-12-column-guide/) covers columns.

## Responsive spacing

Spacing that looks generous on a desktop can waste space on a phone. Common approaches:

- step down one or two scale values on small screens (64px sections become 40px),
- use fluid values with `clamp()` that scale between two scale steps, as described in our [fluid typography guide](/blog/fluid-typography-with-clamp/).

## Auditing spacing in an existing product

If a product grew without a system, you can introduce one gradually:

1. **Collect the current values.** Browser DevTools and design-file inspectors make it easy to list every margin, padding and gap in use. Most products discover dozens of slightly different values.
2. **Map each value to the nearest step** of your new scale: 13px becomes 12px, 22px becomes 24px, 30px becomes 32px.
3. **Replace values with tokens** component by component, starting with the most used components (buttons, inputs, cards).
4. **Review visually.** Most changes of 1–3px are invisible individually, but together they make the interface noticeably tidier.
5. **Prevent drift.** Lint rules (for example stylelint rules that only allow spacing tokens) and design-file variables stop new one-off values creeping back in.

The goal isn’t perfection on day one; it’s a shared vocabulary that every new screen uses.

## Summary

An 8pt grid limits spacing and sizes to multiples of 8, with 4pt steps for fine details. Turn it into a small scale of named tokens, keep space inside groups smaller than space between them, put component sizes on the grid, and adjust the steps for small screens. The result is a layout that feels organised without anyone being able to say exactly why.

@@@
slug: aspect-ratios-explained
tool: aspect-ratio-calculator
title: Aspect Ratios Explained: 16:9, 4:3, 1:1, 9:16 and How to Calculate Them
desc: What aspect ratios mean, where common ratios like 16:9, 4:3, 3:2 and 21:9 come from, how to calculate a missing dimension or simplify a ratio, and using aspect-ratio in CSS.
keywords: aspect ratio, 16:9 aspect ratio, aspect ratio calculator, 4:3 vs 16:9, how to calculate aspect ratio, css aspect-ratio
###
Every image, video and screen has an aspect ratio: the proportional relationship between its width and height. It determines whether content fits without stretching, cropping or black bars. The numbers like 16:9 and 4:3 look abstract, but they’re easy to work with once you know a couple of simple calculations.

## What an aspect ratio is

An aspect ratio is width compared to height, written as two numbers separated by a colon. 16:9 means for every 16 units of width there are 9 units of height. It says nothing about actual size: 1280 × 720, 1920 × 1080 and 3840 × 2160 are all 16:9.

Ratios are also written as decimals: 16:9 is about 1.78:1, and wide cinema formats are usually described this way (1.85:1, 2.39:1).

## Common aspect ratios

| Ratio | Decimal | Where it comes from / where it’s used |
|---|---|---|
| 1:1 | 1.00 | Square; profile pictures, Instagram grid posts, album art |
| 5:4 | 1.25 | Older computer monitors (1280 × 1024), 8 × 10 in photo prints |
| 4:3 | 1.33 | Classic TV and early computer screens, many phone camera sensors, iPads |
| 3:2 | 1.50 | 35mm film and most DSLR sensors, 4 × 6 in prints |
| 16:10 | 1.60 | Many laptops (e.g. 1920 × 1200, 2560 × 1600) |
| 16:9 | 1.78 | HD and 4K video, YouTube, most TVs and monitors, slides |
| 1.85:1 | 1.85 | Common “flat” cinema format |
| 21:9 | ~2.33 (marketing name; actual panels are often 2.37–2.4) | Ultrawide monitors, cinematic banners |
| 2.39:1 | 2.39 | Anamorphic widescreen cinema (“scope”) |
| 4:5 | 0.80 | Portrait social posts (Instagram feed) |
| 2:3 | 0.67 | Pinterest pins, portrait photo prints |
| 9:16 | 0.56 | Vertical video: Stories, Reels, TikTok, Shorts |

16:9 was chosen for HDTV in the 1980s partly as a compromise between 4:3 television and the many wider cinema formats; it lets both be shown with relatively small black bars.

## Calculating a missing dimension

If you know the ratio and one dimension, the other is simple proportion:

- **Height = width × (ratio height ÷ ratio width)**
- **Width = height × (ratio width ÷ ratio height)**

Example: what height is a 1280px-wide 16:9 image? 1280 × 9 ÷ 16 = **720px**.

What width is a 1350px-tall 4:5 image? 1350 × 4 ÷ 5 = **1080px**.

## Finding the ratio of a size

To find the ratio of given dimensions, divide both by their **greatest common divisor (GCD)**:

- 1920 × 1080: GCD is 120 → 16:9
- 2560 × 1440: GCD is 160 → 16:9
- 1440 × 900: GCD is 180 → 8:5 (which is 16:10)
- 1366 × 768: GCD is 2 → 683:384, which is roughly 16:9 (1.779 vs 1.778)

That last example shows why some “16:9” screens don’t simplify neatly: their pixel counts were chosen for manufacturing reasons and are only approximately 16:9. Our [aspect ratio calculator](/tools/aspect-ratio-calculator/) handles both directions and shows the decimal ratio when the exact ratio is awkward.

## What happens when ratios don’t match

| Method | Result | Typical name |
|---|---|---|
| Stretch to fit | Distorted, squashed or stretched content | Avoid |
| Fit inside (contain) | Whole image visible, empty bars on two sides | Letterbox (top/bottom) or pillarbox (sides) |
| Fill and crop (cover) | No bars, some content cut off | Crop to fill |

Never stretch. For photos, crop deliberately to the target ratio (see our [cropping guide](/blog/cropping-photos-composition-aspect-ratios/)). For graphics that can’t be cropped, fit them inside and fill the bars with a background color or a blurred copy of the image.

## Aspect ratio in CSS

The `aspect-ratio` property, supported in all major browsers since 2021, locks an element’s proportions:

```
.video { width: 100%; aspect-ratio: 16 / 9; }
.avatar { width: 64px; aspect-ratio: 1; }
```

Combined with `object-fit: cover` on images, it creates consistent card thumbnails from photos of any shape. It also reserves space before images load, preventing layout shift, as explained in our [placeholder images guide](/blog/placeholder-images-and-layout-shift/).

## Choosing a ratio for your content

- **Video for YouTube and presentations:** 16:9.
- **Video for phones first:** 9:16.
- **Social feed images:** 4:5 for portrait reach, 1:1 for grids.
- **Website hero images:** often 16:9 on desktop, cropped closer to 4:3 or 1:1 on mobile using `<picture>` with different crops.
- **Product photos:** 1:1 or 4:5 for consistency in grids.
- **Print:** match the paper; A-series paper is 1:√2 (about 1:1.414), which our [paper sizes guide](/blog/paper-sizes-iso-216-vs-us-letter/) explains.

## Video, safe areas and cropping between ratios

Video adds a twist: the same footage is often published in several ratios. A 16:9 video for YouTube might be reframed to 9:16 for Shorts and 1:1 or 4:5 for social feeds. Cutting a 9:16 frame out of a 16:9 shot keeps only about a third of the original width, so anything important at the sides is lost.

Plan for this when filming or designing:

| Master format | Reframe to | Area kept |
|---|---|---|
| 16:9 | 1:1 | 56% of the width |
| 16:9 | 4:5 | 45% of the width |
| 16:9 | 9:16 | 32% of the width |
| 4:3 | 1:1 | 75% of the width |

Keep the subject near the center of the frame, leave titles and logos inside a central “safe area”, and check each crop before exporting. Broadcast and streaming platforms also define title-safe areas, a margin of a few percent inside the frame where text is guaranteed not to be cut off by TVs or player controls.

## Summary

An aspect ratio describes shape, not size. Calculate missing dimensions with simple proportion, simplify any size by dividing by the greatest common divisor, crop or fit rather than stretch, and use CSS `aspect-ratio` to keep layouts stable. Knowing the common ratios and where they come from makes it easy to prepare images and video for any screen or platform.

@@@
slug: px-vs-rem-vs-em
tool: px-to-rem-converter
title: PX vs REM vs EM: Which CSS Unit to Use for Font Sizes, Spacing and Media Queries
desc: How px, rem and em differ, why rem respects user font settings, when em is useful, the 62.5% trick and its downsides, and practical rules for typography, spacing, borders and breakpoints.
keywords: px vs rem, rem vs em, px to rem, css units, rem font size, em media queries
###
CSS offers several length units, and three come up constantly in everyday styling: px, rem and em. They can all produce the same size on screen, but they behave very differently when users change their browser settings or when elements are nested. Choosing the right one makes layouts more accessible and easier to maintain.

## The three units

**px (pixels)** is an absolute CSS unit. One CSS pixel is defined as 1/96 of an inch at a typical viewing distance; on high-density screens, one CSS pixel covers several physical pixels.

**rem (root em)** is relative to the font size of the root element (`html`). By default, browsers set that to 16px, so 1rem = 16px, 1.5rem = 24px.

**em** is relative to the font size of the current element (or, for the `font-size` property itself, the parent’s font size). It compounds when nested.

| Unit | Relative to | Changes with user’s default font size? | Compounds when nested? |
|---|---|---|---|
| px | Nothing (absolute) | No | No |
| rem | Root font size | Yes | No |
| em | Current/parent font size | Yes | Yes |

## Why rem matters for accessibility

Browsers let users set a default font size (in Chrome: Settings → Appearance → Font size). People with low vision often increase it from the default “Medium” (16px) to 20px or more. If your font sizes are in rem, they scale with that setting. If they’re in px, they ignore it.

This is different from **zoom**, which scales everything, including px values. Zoom works with any unit. The default font size setting only affects relative units. Respecting both is part of good accessibility practice, and WCAG 1.4.4 requires that text can be resized to 200% without loss of content or function.

## The em compounding problem

Because em is relative to the parent, nested elements multiply:

```
.list { font-size: 1.2em; }
```

A list inside a list is 1.2 × 1.2 = 1.44 times the base size; three levels deep, 1.73 times. That’s rarely intended, and it’s why rem became the default for font sizes.

## When em is the right choice

em’s relativity is useful when something should scale with the element’s own text:

- **Padding on buttons:** `padding: 0.5em 1em` means a larger button text automatically gets proportionally larger padding.
- **Icon sizes next to text:** `width: 1em; height: 1em` makes an icon match the text it sits beside.
- **Letter spacing:** `letter-spacing: 0.05em` scales with font size.
- **Media queries:** browsers evaluate em and rem in media queries against the initial font size, and em/rem breakpoints respond consistently when users change their default font size.

## Practical rules

| What you’re styling | Recommended unit | Why |
|---|---|---|
| Font sizes | rem | Respects user settings, no compounding |
| Spacing (margins, padding, gaps) | rem (or px on a strict 8pt grid) | Keeps proportion with text |
| Component-internal padding | em | Scales with the component’s text size |
| Borders and hairlines | px | A 1px border should stay 1px |
| Box shadows | px | Visual effects don’t need to scale |
| Media query breakpoints | em or rem | Responds to font size settings |
| Line height | Unitless (1.5) | Scales with each element’s font size |
| Max-width for text | ch or rem | Ties line length to text size |

## The 62.5% trick and why to avoid it

A popular old technique sets `html { font-size: 62.5%; }` so that 1rem equals 10px, making conversions easy (1.6rem = 16px). It has downsides:

- Every component must set its own font size, or text renders at 10px by default.
- Third-party components that assume 1rem = 16px end up too small.
- It confuses anyone joining the project.

Converting px to rem is just division by 16. A [px to rem converter](/tools/px-to-rem-converter/) or a CSS preprocessor function handles it, so the trick isn’t necessary.

## Converting px to rem

**rem = px ÷ root font size**

| px | rem (base 16) |
|---|---|
| 12 | 0.75 |
| 14 | 0.875 |
| 16 | 1 |
| 18 | 1.125 |
| 20 | 1.25 |
| 24 | 1.5 |
| 32 | 2 |
| 48 | 3 |

Designers usually work in px in Figma; developers convert to rem when implementing. Keeping the design scale on round numbers (multiples of 4 or 8) gives clean rem values.

## Other units worth knowing

- **%** is relative to the parent (for widths) or the parent’s font size (for font-size).
- **vw / vh** are relative to the viewport; use them inside `clamp()` for fluid sizes, never alone for text. See our [viewport units guide](/blog/css-viewport-units-vw-vh-dvh/).
- **ch** is the width of the “0” character; `max-width: 65ch` is a quick way to limit line length.
- **pt** (points) belongs to print. 12pt = 16px at the CSS standard of 96 pixels per inch; our [design units guide](/blog/points-picas-pixels-design-units/) covers print units.

## Summary

Use rem for font sizes and most spacing so text respects user settings, em for things that should scale with their own text (button padding, icons, letter spacing) and for breakpoints, px for borders and shadows, and unitless numbers for line height. Avoid the 62.5% trick; dividing by 16 is simple enough.
