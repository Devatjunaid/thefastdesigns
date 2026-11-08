@@@
slug: photo-metadata-exif-privacy
tool: exif-remover
title: Photo Metadata and Privacy: What EXIF Data Reveals and How to Remove It
desc: What EXIF, XMP and IPTC metadata contain, how GPS coordinates end up in photos, which platforms strip metadata, and how to remove it losslessly before sharing images.
keywords: exif data, remove metadata from photo, photo gps location, exif remover, image metadata privacy, strip exif
###
Every photo you take with a phone carries more than the picture. Hidden inside the file is a block of data that can include the exact time it was taken, the phone model, the camera settings, and, if location services were on, the latitude and longitude of where you were standing, often accurate to a few metres. Most of the time this is useful. Sometimes it’s a privacy problem.

## The three main metadata standards

| Standard | Created by | Typical contents |
|---|---|---|
| EXIF (Exchangeable Image File Format) | Japanese camera industry (JEIDA), 1995 | Camera make and model, lens, exposure, ISO, date and time, orientation, GPS |
| IPTC | International Press Telecommunications Council | Caption, keywords, creator, copyright, location names |
| XMP (Extensible Metadata Platform) | Adobe, 2001 | Editing history, ratings, keywords, rights; can hold EXIF/IPTC equivalents |

EXIF is written automatically by cameras and phones. IPTC and XMP are usually added by photographers, agencies and editing software.

## What EXIF can reveal

- **GPS coordinates**, and sometimes altitude and direction the camera was facing.
- **Date and time** to the second, often with time zone.
- **Device make and model**, sometimes a camera serial number (especially on dedicated cameras).
- **Software** used to edit the image.
- **A small embedded thumbnail**, which in rare cases has shown an *unedited* version of a photo after the main image was cropped.
- **Exposure details**: shutter speed, aperture, ISO, focal length and lens.

For photographers, this is valuable information for learning and organising. For anyone sharing photos of their home, their children or their location, it can be revealing.

## How location gets into photos

Phones add GPS coordinates when the camera app has permission to use location. On iOS and Android this is a setting you can change. Recent versions of both systems also let you remove location from individual photos when sharing, through an option in the share sheet. But these controls are easy to miss, and many people don’t know their photos carry coordinates.

A well-known example: in 2012, journalists published a photo of John McAfee, who was then avoiding authorities, and the image’s EXIF data revealed his location in Guatemala. The lesson has been repeated many times since with less famous people.

## Which platforms strip metadata

| Where you share | Metadata typically kept? |
|---|---|
| Large social networks (public posts) | Usually stripped from the public file (though the platform itself may read it first) |
| Email attachments | Kept |
| Messaging apps sending compressed photos | Often stripped |
| Messaging apps sending files or “original quality” | Often kept |
| Cloud storage share links | Kept |
| Forums, marketplaces and personal websites | Varies; often kept |

Platforms change their behaviour, and stripping metadata from the public copy doesn’t mean the platform didn’t read it. If location privacy matters, remove the data yourself before uploading.

## How to check a photo

You can see a photo’s metadata in your operating system (file properties on Windows, Get Info or Preview on macOS, the info panel in phone galleries), or with a dedicated viewer. Our [EXIF viewer and remover](/tools/exif-remover/) shows the key fields, highlights GPS coordinates prominently, and runs entirely in your browser, which matters: uploading a private photo to an unknown server just to check its privacy would defeat the purpose.

## Removing metadata: lossless versus re-encoding

There are two ways to remove metadata:

| Method | How it works | Effect on image quality |
|---|---|---|
| Lossless removal | Deletes the metadata blocks from the file and copies the image data unchanged | None |
| Re-encoding | Decodes the image and saves a new file, which naturally has no metadata | Small loss for JPEG; none for PNG |

A JPEG file is made of segments. EXIF and XMP live in “APP1” segments, IPTC in “APP13”, comments in “COM”. A lossless remover drops those segments and keeps the rest, including the compressed image data and usually the ICC color profile (in “APP2”), which keeps colors accurate. PNG files store text and EXIF in separate chunks, which can be dropped the same way.

Our tool uses lossless removal for JPEG and PNG, with one exception: photos that depend on an EXIF **orientation** tag to display upright. Removing the tag without rotating the pixels would make them appear sideways, so those photos are re-encoded upright at high quality. We explain the orientation problem in [why photos appear sideways](/blog/exif-orientation-rotated-photos/).

## What to keep and what to remove

You don’t always want to remove everything:

- **Remove:** GPS location, device serial numbers, and personal names in author fields when sharing publicly.
- **Consider keeping:** copyright and creator information on professional work, which supports attribution (see our [watermarking guide](/blog/watermarking-photos-guide/)), and the color profile.
- **Keep in your archive:** the original files with full metadata. Dates and camera settings are invaluable for organising and searching your library.

The practical approach is to keep originals intact and strip metadata from the copies you share.

## Metadata and file size

Metadata is usually small, from a few kilobytes up to tens of kilobytes, but large embedded thumbnails, XMP editing histories and maker notes can add more. For web images, removing it is a small free optimization. Browser-based compressors that re-encode images remove it automatically; see our [image compression guide](/blog/image-compression-lossy-vs-lossless/).

## A short privacy checklist

1. Turn off location tagging in your camera app if you don’t need it.
2. Use the share sheet’s “remove location” option when available.
3. Strip metadata before posting photos of your home, children or valuables.
4. Check before sending photos to strangers, such as marketplace buyers.
5. Keep original files with metadata in your private archive.

## Summary

Photos carry EXIF, IPTC and XMP metadata that can reveal when, where and with what a picture was taken. Many large platforms strip it from public posts, but email, file-sharing and many smaller sites keep it. Check photos before sharing, remove GPS and personal fields from shared copies (losslessly where possible), and keep your originals intact.

@@@
slug: svg-optimization-guide
tool: svg-optimizer
title: SVG Optimization: How to Shrink SVG Files Without Breaking Them
desc: What makes exported SVGs bloated, which optimizations are safe (metadata, precision, IDs, groups), which can break graphics, how much you can save, and how optimizing compares to gzip.
keywords: svg optimizer, optimize svg, minify svg, reduce svg size, svgo, clean svg code
###
SVG is the best format for logos, icons and simple illustrations on the web: sharp at any size and usually tiny. But SVGs exported straight from design tools are often several times larger than necessary. They’re full of editor metadata, overly precise numbers and structure that only matters inside the editor. Cleaning them up is quick and usually cuts file size by a third or more.

## What’s inside a typical exported SVG

Open an SVG from Illustrator, Inkscape, Sketch or Figma in a text editor and you’ll often find:

- an XML declaration (`<?xml version="1.0" encoding="UTF-8"?>`) and sometimes a DOCTYPE,
- a comment such as “Generator: …”,
- a `<metadata>` block, sometimes with RDF licensing information,
- editor namespaces and attributes like `inkscape:label`, `sodipodi:namedview` or `sketch:type`,
- `<title>` and `<desc>` elements with layer names,
- IDs on nearly every element (“Layer_1”, “Rectangle-Copy-3”),
- empty or redundant groups (`<g>` wrappers with no attributes),
- coordinates with six or more decimal places: `cx="60.0000032"`,
- default attribute values that don’t change anything.

Browsers ignore most of this, but they still have to download and parse it.

## Safe optimizations

| Optimization | Typical saving | Risk |
|---|---|---|
| Remove XML declaration, comments, metadata | Small to medium | None for inline/web use |
| Remove editor namespaces and attributes | Medium (large for Inkscape files) | None in browsers |
| Round coordinates to 1–3 decimals | Large on complex paths | Low at sensible precision |
| Remove unused IDs | Small to medium | Low, if references are checked |
| Collapse empty groups | Small | Low |
| Collapse whitespace | Small to medium | Low (careful with `<text>`) |

Our [SVG optimizer](/tools/svg-optimizer/) applies these safely by parsing the SVG structure rather than doing blind text replacement, and shows the original and optimized versions side by side so you can confirm nothing changed.

## Optimizations that can break things

- **Too little precision.** Rounding to zero decimals on a small 24×24 icon can visibly distort curves. Use 1–2 decimals for icons and 2–3 for detailed illustrations and maps.
- **Removing IDs that are referenced.** Gradients, clip paths, masks, filters and `<use>` elements refer to other elements by ID. Remove only IDs that nothing references.
- **Removing `<title>`.** For SVGs used as meaningful standalone images, the title can serve as the accessible name. Keep it, or provide `aria-label` or `alt` text in HTML.
- **Removing `viewBox`.** Some tools offer this, but without a viewBox the SVG can’t scale responsively. Keep it.
- **Merging paths and converting shapes to paths.** These can save bytes but make the file harder to edit and animate. Fine for final icons, not for files you’ll keep working on.

## How much can you save?

Results vary a lot by source:

| Source | Typical reduction |
|---|---|
| Inkscape (Inkscape SVG format) | 40–70% |
| Illustrator exports | 20–50% |
| Figma exports | 10–40% (Figma output is already fairly clean) |
| Hand-written or icon-library SVGs | 0–15% |

On a simple icon that saves a few hundred bytes; on a detailed illustration with long path data, it can save tens of kilobytes.

## Optimization versus compression

Like CSS and HTML, SVG is text, so servers usually compress it with gzip or Brotli during transfer. Compression handles repetitive markup well, so the network saving from optimization is smaller than the raw file-size saving. Optimization still helps: rounding numbers removes information compression can’t, and smaller files parse faster. It’s the same relationship we describe in our [CSS minification guide](/blog/css-minification-explained/).

## Inline SVG versus SVG files

| Method | Pros | Cons |
|---|---|---|
| Inline `<svg>` in HTML | No request; style with CSS (`currentColor`), animate parts | Repeated on every page; not cached separately |
| `<img src="icon.svg">` | Cached; simple | Can’t style internals with page CSS |
| CSS background (data URI or file) | Good for decorative icons | Not accessible content; limited styling |
| SVG sprite with `<use>` | One cached file for many icons | Slightly more setup |

Optimize before inlining: every byte of inline SVG is repeated in every HTML page that contains it.

## Making icons themeable

A simple step after optimizing: replace hard-coded colors in icon SVGs with `currentColor`:

```
<path d="…" fill="currentColor"/>
```

The icon then takes the text color of its parent, so it adapts to hover states, dark mode and different contexts without separate files.

## Accessibility reminders

- Decorative inline SVGs: add `aria-hidden="true"` so screen readers skip them.
- Meaningful SVGs used as `<img>`: provide `alt` text.
- Meaningful inline SVGs: add `role="img"` and an accessible name, for example with `<title>` or `aria-label`.

## For build pipelines

For ongoing projects, automate optimization with **SVGO**, the standard open-source SVG optimizer, which is also built into many bundlers and icon tools. It has a large set of plugins, including path merging and transform flattening, with safe defaults. Use an online optimizer for one-off files, quick checks or learning what an optimizer changes.

## Summary

Exported SVGs carry editor metadata, excess precision and unnecessary structure. Removing metadata and editor attributes, rounding coordinates sensibly, dropping unused IDs and collapsing empty groups typically saves 20–60% with no visible change. Keep the viewBox and meaningful titles, check references before deleting IDs, and compare before and after. If you need a raster version afterwards, see [SVG vs PNG](/blog/svg-vs-png-when-to-convert/).

@@@
slug: modular-type-scales-explained
tool: type-scale-generator
title: Modular Type Scales Explained: Ratios, Font Sizes and Building a Hierarchy
desc: What a modular type scale is, how ratios like the major third and golden ratio change your hierarchy, how many sizes you need, rem vs px, and combining scales with fluid typography.
keywords: type scale, modular scale, typography scale, font size scale, major third, typographic hierarchy
###
Look at a well-designed website and the font sizes feel related: headings step down in a steady rhythm, and nothing looks randomly chosen. Often that’s because the sizes come from a modular type scale, a sequence where each size is the previous one multiplied by a fixed ratio. It’s a simple idea that removes most guesswork from typography.

## How a modular scale works

Pick a **base size**, usually your body text (16px is the default in browsers). Pick a **ratio**. Multiply up for larger sizes and divide down for smaller ones:

With a base of 16px and a ratio of 1.25:

| Step | Calculation | Size |
|---|---|---|
| −2 | 16 ÷ 1.25 ÷ 1.25 | 10.24 px |
| −1 | 16 ÷ 1.25 | 12.8 px |
| 0 (base) | 16 | 16 px |
| +1 | 16 × 1.25 | 20 px |
| +2 | 20 × 1.25 | 25 px |
| +3 | 25 × 1.25 | 31.25 px |
| +4 | 31.25 × 1.25 | 39.06 px |
| +5 | 39.06 × 1.25 | 48.83 px |

Because each step grows by the same proportion, the sizes feel harmonious. The difference between steps is also *relative*, which matches how we perceive size: going from 16 to 20px feels similar to going from 40 to 50px.

The idea was popularised for the web by Tim Brown’s “More Meaningful Typography” (2011) and his Modular Scale calculator, building on centuries of typographic practice where printers worked with traditional size sequences.

## Choosing a ratio

Many common ratios are named after musical intervals, because a musical interval is also a frequency ratio:

| Ratio | Name | Character | Good for |
|---|---|---|---|
| 1.067 | Minor second | Very subtle steps | Dense data apps |
| 1.125 | Major second | Subtle | Dashboards, admin tools |
| 1.2 | Minor third | Balanced | Product UI, documentation |
| 1.25 | Major third | Clear hierarchy | Most websites |
| 1.333 | Perfect fourth | Strong | Marketing sites, blogs |
| 1.414 | Augmented fourth | Bold | Editorial, landing pages |
| 1.5 | Perfect fifth | Dramatic | Headline-led layouts |
| 1.618 | Golden ratio | Very dramatic | Posters, hero sections |

Small ratios give you many usable sizes close together; large ratios give strong contrast but grow huge quickly. With a golden ratio scale, step 5 from 16px is already over 170px. Our [type scale generator](/tools/type-scale-generator/) previews each ratio with your own sample text.

## How many sizes do you need?

Fewer than you think. Most interfaces work well with five to seven sizes:

- a small size for captions, labels and metadata,
- body text,
- one or two subheading sizes,
- two or three heading sizes.

Every extra size makes it harder to keep the design consistent. If you find yourself needing a size between two steps, that’s often a sign the hierarchy should be expressed with weight, color or spacing instead.

## Size isn’t the only tool for hierarchy

Typographic hierarchy comes from contrast in several properties:

| Property | Example |
|---|---|
| Size | 32px heading vs 16px body |
| Weight | Bold heading, regular body |
| Color | Dark heading, mid-grey metadata |
| Case and spacing | Small uppercase labels with letter spacing |
| Space | More space above a heading than below it |

A modest ratio combined with weight and spacing often produces a cleaner hierarchy than a dramatic ratio alone.

## Mobile versus desktop

A ratio that looks great on a wide screen can make mobile headings enormous. A common solution is to use a smaller ratio on small screens (say 1.2) and a larger one on desktop (say 1.333), and interpolate between them with CSS `clamp()`. Our guide to [fluid typography with clamp()](/blog/fluid-typography-with-clamp/) shows the formula. Body text barely changes; headings scale smoothly.

## px versus rem

Define your scale in **rem** units: 1rem equals the root font size, 16px by default. If a user increases their browser’s default font size for readability, every rem-based size scales with it. Pixel sizes don’t respond to that setting. Our [px vs rem guide](/blog/px-vs-rem-vs-em/) explains the details.

## Rounding

Scales produce numbers like 31.25px or 39.06px. Browsers handle fractional sizes fine, so there’s no technical need to round. Rounding to whole pixels (or to multiples of 2 or 4) can make design files and handoff tidier. Both approaches are fine; consistency is what matters.

## Line height goes with size

As font size increases, line height (as a ratio) should decrease. Body text reads best around 1.5; large headings look better around 1.1–1.25, because big type already has visually large gaps between lines. Use unitless line heights so they scale with each size. Our [line height calculator](/tools/line-height-calculator/) helps choose values.

## From scale to tokens

Turn the final sizes into named tokens:

```
:root {
  --text-sm: 0.8rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.563rem;
  --text-2xl: 1.953rem;
  --text-3xl: 2.441rem;
}
```

Names like `sm`, `base` and `xl` (as used by Tailwind CSS) are easy to remember and don’t need renaming if you change the ratio later.

## Summary

A modular type scale multiplies a base size by a fixed ratio to create harmonious, predictable font sizes. Choose a smaller ratio for dense interfaces and a larger one for editorial or marketing pages, keep the number of sizes small, use rem units, pair sizes with appropriate line heights, and make headings fluid between mobile and desktop.

@@@
slug: lorem-ipsum-history-and-alternatives
tool: lorem-ipsum-generator
title: Lorem Ipsum: Where It Comes From, When to Use It and When Real Copy Is Better
desc: The real origin of lorem ipsum in Cicero’s 45 BC text, why designers use placeholder text, its pitfalls for UX and localisation, and better alternatives for realistic layouts.
keywords: lorem ipsum, lorem ipsum origin, placeholder text, dummy text, filler text, content-first design
###
“Lorem ipsum dolor sit amet, consectetur adipiscing elit…” has filled layouts, mockups and templates for decades. It looks like Latin, and it mostly is, but it doesn’t mean anything. That’s exactly why designers use it. It’s also why relying on it too long can hide real problems in a design.

## Where it comes from

Lorem ipsum is a scrambled excerpt from *De finibus bonorum et malorum* (“On the Ends of Good and Evil”), a philosophical work by Marcus Tullius Cicero written in 45 BC. The familiar passage comes from sections 1.10.32–33. The original sentence includes “…neque porro quisquam est, qui do**lorem ipsum** quia dolor sit amet, consectetur, adipisci velit…”, roughly “nor is there anyone who loves pain itself because it is pain…”.

Notice that “lorem” comes from “dolorem” (pain) with the first syllable cut off. The standard placeholder text drops, changes and rearranges words, so it no longer reads as proper Latin. The identification with Cicero was made by Richard McClintock, a Latin scholar, who traced the word “consectetur” back to the source.

## How it spread

The text is commonly said to have been used as filler by typesetters since the 1500s, though early printed examples are hard to verify. What’s well documented is its later popularity: it appeared on Letraset dry-transfer sheets in the 1960s, used by designers to mock up layouts, and then in desktop publishing software such as Aldus PageMaker in the 1980s. From there it spread into every design tool, CMS theme and web template.

## Why designers use placeholder text

- **It looks like real text.** Word lengths and letter frequency are close enough to European languages that the text has a natural texture on the page.
- **It doesn’t distract.** Readable placeholder text (“Your headline goes here”) invites people to read and comment on the words instead of the layout.
- **It’s available before the copy is.** Design and writing often happen in parallel.

## The problems with lorem ipsum

**It hides content problems.** Real headlines might be twice as long as the placeholder. Real product names might not fit on buttons. A layout that looks perfect with “Lorem ipsum dolor” can break with “Comprehensive Annual Sustainability Report”.

**It encourages design-first thinking.** Content strategists have long argued that design should serve content, not the other way round. If the layout is approved before anyone knows what it needs to say, the copy ends up squeezed into boxes.

**It doesn’t test real languages.** German words are often long, Finnish compounds even longer, and right-to-left scripts like Arabic and Hebrew need mirrored layouts. CJK languages have very different line-breaking behaviour. Latin-like placeholder text doesn’t reveal any of this.

**It sometimes ships.** Lorem ipsum has appeared on live websites, printed menus and official documents because someone forgot to replace it.

## Placeholder text options compared

| Option | Realistic length | Reveals tone issues | Risk of distraction | Best for |
|---|---|---|---|---|
| Lorem ipsum | Approximate | No | Low | Early layout exploration |
| Readable dummy copy (“Headline about the product”) | Approximate | Somewhat | Medium | Wireframes for stakeholders |
| Real draft copy | Exact | Yes | Medium | Mid-stage design reviews |
| Final copy | Exact | Yes | n/a | Final design and testing |
| Target-language text | Exact for that language | Yes | Varies | Localisation testing |

## Using lorem ipsum well

- **Use realistic lengths.** If headlines will typically be 8–12 words, test with 8–12 words, not three. Our [lorem ipsum generator](/tools/lorem-ipsum-generator/) lets you generate exact word, sentence or paragraph counts.
- **Test extremes.** Try the longest and shortest plausible content for every component: one-word titles, very long names, empty states.
- **Replace early.** Swap in real or draft copy as soon as it exists, ideally before design reviews with stakeholders.
- **Mark placeholders clearly** in design files and code, and search for “lorem” before launch.
- **Use real data for data-heavy UI.** Tables, dashboards and lists need realistic numbers, dates and names to reveal alignment and overflow problems.

## Content-first alternatives

**Proto-content.** Write rough but real copy early, even if it will be edited. It reveals the actual structure: how many points a section needs, whether a headline needs a subheading.

**Content priority guides.** Before designing, list the content each page needs in order of importance, with approximate lengths. Designers then lay out real priorities instead of filling boxes.

**Real samples.** For blogs and product listings, use real existing entries in mockups rather than invented ones.

## Typographic testing

Lorem ipsum remains useful for one thing in particular: judging typography, such as the texture of a typeface, line length and line height, without the distraction of meaning. If you’re fine-tuning body text settings, it’s a good neutral sample. Pair it with our [line height calculator](/tools/line-height-calculator/) and [type scale generator](/tools/type-scale-generator/).

## Placeholder content beyond text

The same thinking applies to everything else in a mockup. Placeholder images should match the final aspect ratio and tone (see our guide to [placeholder images and layout shift](/blog/placeholder-images-and-layout-shift/)). Placeholder names should include long ones, like “Maximiliane Oberhauser-Kowalczyk”, and short ones like “Al”. Prices should include large values with separators and currencies, dates should cover different formats, and lists should be tested with zero items, one item and a hundred items.

| Element | Placeholder trap | Better test data |
|---|---|---|
| Names | “John Doe” only | Very long, very short, accented and non-Latin names |
| Prices | “$9.99” | “$12,499.00”, “€1.234,50”, “Free” |
| Lists | Three tidy items | Empty, one, and many items |
| Images | Perfect stock photos | Real, imperfect photos at mixed ratios |
| Headlines | Three words | The longest realistic headline |

Treating placeholder content as a test suite, rather than decoration, catches most layout bugs before real users do.

## Summary

Lorem ipsum is scrambled Cicero from 45 BC, spread through Letraset sheets and desktop publishing into every design tool. It’s useful for early layout work and typography testing because it looks like text without being readable. But it hides real content problems, so use realistic lengths, test extremes and other languages, and replace it with real copy as early as you can.
