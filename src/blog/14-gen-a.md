@@@
slug: organic-blob-shapes-in-web-design
tool: svg-blob-generator
title: Organic Blob Shapes in Web Design: How They’re Made and How to Use Them Well
desc: Why organic blob shapes became popular, how smooth blobs are generated with points and Bézier curves, SVG vs CSS border-radius blobs, animation, and design tips for backgrounds and illustrations.
keywords: blob shapes, svg blob generator, organic shapes web design, blob background, css blob, morphing blob animation
###
Soft, irregular blob shapes appear behind hero images, around team photos, as section backgrounds and in brand illustrations. They became a defining look of friendly tech and lifestyle brands from the late 2010s onward, partly as a reaction to the rigid rectangles of flat design. They are easy to generate and easy to misuse. Here’s how they work and how to keep them looking intentional.

## Why organic shapes work

Our eyes associate curves with natural, soft, safe objects, and sharp angles with man-made, precise or even threatening ones. Research on visual preference has repeatedly found that people tend to prefer curved contours over sharp-angled versions of the same objects. In interface design, curves feel approachable, which is why consumer brands, health apps and education platforms use blobs and rounded forms heavily.

Blobs also solve a practical layout problem: they add color and depth to large empty areas without the formality of rectangles or the busyness of patterns.

## How a smooth blob is generated

A typical blob generator works in three steps:

1. **Place points around a circle.** For a blob with 6 points, they are spaced every 60°.
2. **Randomise each point’s distance from the center.** With no randomness you get a circle; with a lot, you get a spiky, irregular shape.
3. **Connect the points with smooth curves.** Straight lines would make a polygon. Instead, a spline (commonly Catmull–Rom) passes through every point and is converted into cubic Bézier curves, which SVG paths draw natively.

The two controls in our [SVG blob generator](/tools/svg-blob-generator/) map to these steps: **complexity** is the number of points, and **randomness** is how far each point may move.

| Points | Randomness | Result |
|---|---|---|
| 3–5 | Low | Pebble-like, calm |
| 5–7 | Medium | Classic organic blob |
| 8–12 | Medium | Wavy, more complex |
| 8–12 | High | Spiky, splash-like |

## SVG blobs versus CSS border-radius blobs

You can also create blob-like shapes with CSS alone, using the eight-value `border-radius` syntax:

```
border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
```

| Aspect | SVG path blob | CSS border-radius blob |
|---|---|---|
| Shape variety | Unlimited | Limited to four elliptical corners |
| Smoothness | Excellent | Good |
| Contains content (text, images) | Via clip-path or as a background | Natively, it’s just a box |
| Animation | Morph between paths with the same number of points | Animate the border-radius values; very smooth |
| Gradients and strokes | Full SVG support | Backgrounds and borders |
| File size | A few hundred bytes | A single CSS line |

Use CSS border-radius blobs for simple shapes that contain content, like a photo mask. Use SVG for more complex, distinctive shapes and illustrations. Our [border radius guide](/blog/border-radius-guide-rounded-corners/) explains the slash syntax.

## Using blobs in layouts

**As backgrounds.** Place a large, soft-colored blob behind a hero image or product shot, partly overlapping the edge of the image. It creates depth and draws the eye.

**As image masks.** Clip a photo to a blob shape with `clip-path` or an SVG `<clipPath>`, for team portraits or testimonials.

**As section decoration.** Partially off-canvas blobs at the edges of sections add movement without competing with content.

**In illustrations.** Blobs make good “ground” shapes for flat illustrations and icons.

## Design tips

- **Keep colors soft.** Light tints of your brand colors, or low-saturation tones, let blobs support content rather than dominate. A [tints and shades generator](/tools/tints-and-shades-generator/) helps.
- **Vary scale.** One large blob and one or two small ones feel more natural than several of the same size.
- **Let them bleed.** Blobs cut off by the edge of the viewport or section feel more dynamic than fully visible ones floating in the middle.
- **Don’t overuse them.** One blob per section is plenty. A page covered in blobs starts to look like a template.
- **Mind text contrast.** If text overlaps a blob, check it against the blob color with a [contrast checker](/tools/contrast-checker/).
- **Blur for glow.** A blob with `filter: blur(60px)` turns into a soft color glow, a popular background effect that pairs well with [glassmorphism](/blog/glassmorphism-backdrop-filter-guide/).

## Animating blobs

Gently morphing blobs add life to hero sections. Two approaches:

1. **Path morphing:** animate between two SVG paths with the same number of points and the same command structure. Generate both with the same complexity setting.
2. **CSS border-radius animation:** animate between two eight-value border-radius declarations with keyframes. It’s smooth and cheap.

Keep animations slow (8–20 seconds per cycle), subtle and decorative, and pause or remove them for users who prefer reduced motion. Constant motion in the corner of the eye is distracting, and for some people, uncomfortable.

## Performance

A blob SVG is usually a few hundred bytes, and a CSS border-radius blob is one line. Heavy CSS blur filters on very large elements can be expensive to render, especially when animated, so prefer moderate blur sizes and test on a mid-range phone.

## Accessibility

Decorative blobs carry no information. Inline SVG blobs should have `aria-hidden="true"`, or be applied as CSS background images, so screen readers skip them.

## Summary

Blob shapes are points around a circle, nudged randomly and connected with smooth Bézier curves. They make layouts feel softer and more human. Use SVG for distinctive shapes and CSS border-radius for simple masks, keep colors soft and placement deliberate, animate slowly if at all, and limit yourself to a few per page so they stay a highlight rather than a cliché.

@@@
slug: svg-wave-section-dividers
tool: svg-wave-generator
title: SVG Wave Section Dividers: How to Add Smooth Waves Between Website Sections
desc: How SVG wave dividers are built, how preserveAspectRatio makes them stretch, placing waves at the top or bottom of sections, layered waves, CSS alternatives and responsive tips.
keywords: svg wave, wave divider, section divider svg, wavy section css, layered waves, website wave background
###
A straight horizontal line between sections is the default on almost every website. A gentle wave instead adds movement and softness, and it has become a common pattern on landing pages, SaaS sites and portfolios. The good news: a wave divider is just a small SVG with a few curves, and it can be added without images, libraries or JavaScript.

## Anatomy of a wave divider

A wave divider is an SVG shape whose top edge is a smooth curve and whose bottom is a straight line across the full width. It’s placed at the edge of a section, filled with the color of the *neighbouring* section, so it looks like one section flows into the next.

A typical wave SVG:

```
<svg viewBox="0 0 1440 320" preserveAspectRatio="none">
  <path d="M0,192 C240,128 480,256 720,224 C960,192 1200,96 1440,160 L1440,320 L0,320 Z" fill="#141414"/>
</svg>
```

- `viewBox="0 0 1440 320"` sets up a coordinate system 1440 units wide and 320 tall.
- The path starts on the left edge, curves across with cubic Bézier commands (`C`), then drops to the bottom-right (`L1440,320`), goes back to the bottom-left and closes.
- `preserveAspectRatio="none"` lets the shape stretch to any width without keeping proportions, so the wave always spans the full section.

Our [SVG wave generator](/tools/svg-wave-generator/) generates these paths with controls for number of waves, height and layers.

## How waves are generated

A wave generator places a series of points evenly across the width, varies their height randomly within a range, and connects them with smooth curves (often a spline converted to Bézier curves). More points create more, shorter waves; a larger height range creates taller waves.

| Setting | Effect |
|---|---|
| 2–4 waves | Calm, gentle |
| 5–8 waves | Lively |
| 10+ waves | Busy, choppy |
| Low height | Subtle edge |
| High height | Dramatic, takes up vertical space |

## Placing waves at the top or bottom

There are two common placements:

- **At the bottom of a section,** filled with the color of the next section, so the next section appears to rise into the current one as a wave.
- **At the top of a section,** filled with the color of the previous section and flipped vertically, so the previous section hangs down into this one.

Flipping can be done in the path itself or with `transform: scaleY(-1)` on the SVG.

Place the SVG as a block element with no gap:

```
.wave { display: block; width: 100%; height: 120px; }
```

`display: block` removes the small gap below inline SVGs caused by text baseline alignment, one of the most common reasons a thin line appears between the wave and the section.

## Layered waves

Stacking two to four waves in the same color with different opacities creates depth, like overlapping hills or ocean swells. The back layers are more transparent and slightly taller; the front layer is solid. It adds richness without introducing new colors.

## Responsive behaviour

Because the SVG stretches horizontally, waves look gentler on wide desktop screens and steeper on narrow phones. To keep proportions reasonable:

- Set a fixed or clamped height: `height: clamp(60px, 10vw, 160px)`.
- Use fewer waves for mobile-first designs; many waves compressed into a 390px width look jagged.
- Test at 320px, 768px and 1440px+.

## Waves versus other dividers

| Divider | Look | Technique |
|---|---|---|
| Straight line | Clean, neutral | Nothing needed |
| Angled / slanted edge | Dynamic, geometric | `clip-path: polygon(...)` or a skewed pseudo-element |
| Wave | Soft, organic | SVG path |
| Curve (single arc) | Gentle, elegant | SVG or `border-radius` on a wide pseudo-element |
| Zigzag / torn edge | Playful, crafted | SVG or CSS gradients |

For angled edges, see our [clip-path guide](/blog/css-clip-path-shapes-guide/).

## CSS-only alternatives

The CSS `mask-image` property can apply a wave-shaped mask to the bottom of a section, using an SVG as the mask image. This lets a section with a photo or gradient background have a wavy edge, which a solid-color SVG divider can’t do. It needs `-webkit-mask-image` for some browsers, and a bit more setup, but it’s the right tool when the section background isn’t a flat color.

## Accessibility and semantics

Wave dividers are decoration. Add `aria-hidden="true"` and `focusable="false"` to inline SVGs so assistive technology ignores them. Don’t put meaningful content inside the wave area, and make sure the color change between sections still gives enough contrast for any text near the edge.

## Performance

An inline wave SVG is typically 200–600 bytes, far lighter than an image. If you use the same wave on many pages, putting it in an external SVG file or a CSS background lets the browser cache it.

## Design tips

- Match the wave fill exactly to the adjacent section’s background color; even a tiny mismatch shows as a seam.
- Use one wave style consistently across the site rather than different waves for every section.
- Combine waves with generous padding so content doesn’t sit right on the curve.
- Pair with [organic blob shapes](/blog/organic-blob-shapes-in-web-design/) sparingly; both together can feel overly bubbly.

## Summary

A wave divider is an SVG path with a curvy top edge and a flat bottom, stretched across the section with `preserveAspectRatio="none"` and filled with the neighbouring section’s color. Display it as a block, control its height responsively, layer a few semi-transparent waves for depth, and mark it as decorative. It’s one of the cheapest ways to make a page feel less boxy.

@@@
slug: qr-codes-explained-static-vs-dynamic
tool: qr-code-generator
title: QR Codes Explained: How They Work, Static vs Dynamic, and Design Rules for Print
desc: How QR codes store data, versions and error correction levels, the difference between static and dynamic QR codes, Wi-Fi QR codes, minimum print sizes, colors, logos and testing.
keywords: qr code generator, static vs dynamic qr code, how qr codes work, qr code size for print, wifi qr code, qr error correction
###
QR codes are everywhere: menus, posters, packaging, business cards, event tickets, Wi-Fi details on café walls. Most people scan them without a second thought. But designing a QR code that scans reliably, and that will keep working for years, depends on understanding a few things about how they work and what kind of code you’re creating.

## A short history

The QR (Quick Response) code was invented in 1994 by Masahiro Hara at Denso Wave, a Toyota group company, to track car parts during manufacturing. It could be read faster and hold more data than traditional barcodes. Denso Wave made the specification freely available and chose not to exercise its patent rights, which helped it spread. It became an international standard, ISO/IEC 18004. Built-in scanning in phone cameras (iOS 11 in 2017 and Android around the same period) made QR codes truly mainstream.

## How a QR code stores data

A QR code is a square grid of black and white **modules**. Several parts have fixed jobs:

- **Finder patterns:** the three large squares in the corners let the scanner locate the code and work out its orientation.
- **Alignment patterns:** smaller squares (in larger codes) help correct for distortion when the code is curved or photographed at an angle.
- **Timing patterns:** alternating modules between the finders help determine module size.
- **Format and version information:** encode the error correction level and mask pattern, and for larger codes, the version.
- **Data and error correction modules:** everything else.

**Versions** describe the size. Version 1 is 21 × 21 modules; each version adds 4 modules per side, up to version 40 at 177 × 177. Longer content needs a higher version, which means smaller modules at the same printed size.

## Error correction levels

QR codes use Reed–Solomon error correction, the same family of math used on CDs and in deep-space communication. Extra data lets a scanner reconstruct the content even if part of the code is damaged, dirty or covered.

| Level | Recovers up to | Trade-off |
|---|---|---|
| L (Low) | ~7% damage | Smallest code |
| M (Medium) | ~15% | Good default |
| Q (Quartile) | ~25% | Industrial or outdoor use |
| H (High) | ~30% | Largest code; allows a small logo overlay |

Higher error correction means more modules for the same content. For clean digital or print use, M is a sensible default.

## Static versus dynamic QR codes

This is the most important decision, and many people don’t realise they’re making it.

| Aspect | Static QR code | Dynamic QR code |
|---|---|---|
| What it contains | Your actual URL or data | A short redirect URL owned by a QR service |
| Change destination later | No | Yes |
| Scan analytics | No | Yes |
| Depends on a third party | No | Yes; if the service ends or the subscription lapses, the code can stop working |
| Cost | Free | Usually a subscription |
| Privacy | No tracking | Scans pass through the provider |

Many “free QR generators” create dynamic codes that redirect through their servers, then stop working after a trial period unless you pay. That’s why printed menus and posters sometimes lead to error pages. If you print a code, know which type it is.

Our [QR code generator](/tools/qr-code-generator/) creates **static** codes entirely in your browser. They contain your data directly and never expire. If you need to change the destination later without reprinting, point the code at a URL on your own website (for example `yourdomain.com/menu`) and update what that page shows or redirects to. You get the flexibility of a dynamic code without depending on a QR company.

## Wi-Fi QR codes

A Wi-Fi QR code contains a specially formatted text string, such as `WIFI:T:WPA;S:NetworkName;P:password;;`. Phone cameras recognise it and offer to join the network. Special characters in the network name or password (such as `;`, `,`, `:` and `\`) must be escaped with a backslash, which a good generator does automatically. Note that anyone who can see the code can join the network, so it’s best for guest networks.

## Design rules for reliable scanning

**Quiet zone.** Keep a clear margin of at least 4 modules around the code. Text, borders or images too close to the code stop scanners from finding its edges.

**Contrast.** Dark modules on a light background. Strong contrast matters more than the actual colors; a dark navy on cream works, while pastel on white often doesn’t. Inverted (light-on-dark) codes are part of the standard, but some older scanners don’t read them.

**Minimum size.** A common rule of thumb is that the code’s width should be at least one tenth of the scanning distance. For something scanned at arm’s length, around 2 cm (0.8 in) is a practical minimum; a poster read from 3 metres away needs about 30 cm. Longer content (higher versions) needs to be printed larger.

**Keep content short.** Shorter URLs create simpler codes with bigger modules that scan faster. Use a clean, short link on your own domain.

**Logos.** A small logo in the center works with error correction level H, as long as it covers well under 30% of the code and doesn’t touch the finder patterns. Test carefully.

**Use vector for print.** Export SVG so the code stays perfectly sharp at any size. PNG is fine for screens.

## Testing

Before printing hundreds of copies:

1. Scan with at least two different phones (iOS and Android).
2. Test at the actual printed size, in the actual lighting, from the intended distance.
3. Check that the destination loads well on mobile.
4. Make sure the URL is something you control long-term.

## Summary

QR codes store data in a grid of modules protected by Reed–Solomon error correction. Static codes contain your data directly and never expire; dynamic codes redirect through a service that you depend on. For print, use a static code pointing to a URL on your own domain, keep high contrast and a quiet zone, size it for the scanning distance, export SVG and test on real phones.

@@@
slug: grain-noise-textures-and-gradient-banding
tool: noise-texture-generator
title: Grain and Noise Textures: Why They Fix Gradient Banding and Add Depth to Flat Design
desc: Why smooth gradients show banding on 8-bit screens, how adding noise (dithering) hides it, how to create tileable grain textures, and how to use noise in CSS without hurting performance.
keywords: noise texture, grain texture, gradient banding, dithering, film grain overlay, noise background css
###
Flat colors and smooth gradients can look sterile on screen, and large, subtle gradients often show ugly stripes called banding. A very light layer of noise, or grain, fixes both problems. It’s a technique borrowed from film photography and print, and it has become a signature of modern editorial and product design.

## What causes gradient banding

Most screens and image formats use **8 bits per color channel**, which means 256 possible levels for each of red, green and blue. That sounds like a lot, but consider a subtle gradient from `#1a1a2e` to `#16213e` across a 1920-pixel-wide hero section. The red channel only changes by 4 levels across the whole width. Each level has to cover about 480 pixels, so instead of a smooth blend you see four distinct vertical bands.

Banding is most visible in:

- dark gradients (our eyes are sensitive to small differences in dark tones),
- low-saturation gradients between similar colors,
- large areas such as full-screen backgrounds,
- images compressed with JPEG or video codecs, which add their own blockiness.

## How noise fixes it: dithering

**Dithering** adds small random variations to each pixel. Instead of a hard edge where one level changes to the next, pixels near the boundary randomly take one value or the other. Our eyes average these tiny variations over an area and perceive a smooth transition between levels.

It’s the same principle used by newspapers printing photos with dots, by GIF images simulating more than 256 colors, and by audio engineers adding dither when reducing bit depth. In design, a faint grain layer over a gradient is a simple form of dithering.

## Grain as an aesthetic

Beyond fixing banding, grain adds texture:

- **Analogue warmth.** It recalls film photography and printed paper, which feels more tactile than perfectly clean pixels.
- **Depth.** A slightly textured surface reads as a material rather than a flat color.
- **Cohesion.** Applying the same grain over photos, gradients and illustrations makes mixed visual elements feel like one set.

Many brands use subtle grain over gradient backgrounds and illustrations for exactly this reason.

## Types of noise

| Type | Look | Typical use |
|---|---|---|
| Monochrome noise | Grey speckles of varying brightness | General grain, film look |
| Color noise | Random colored speckles | Retro, vibrant textures (use sparingly) |
| Light-only specks | Bright dots | Grain on dark backgrounds |
| Dark-only specks | Dark dots | Grain on light backgrounds, paper texture |
| Larger grain size | Coarser, visible texture | Stylised, print-like look |

Random per-pixel noise has no structure, so a square tile of it repeats seamlessly. Our [noise texture generator](/tools/noise-texture-generator/) creates these tiles with adjustable opacity, grain size and density, and exports a transparent PNG.

## Using noise in CSS

Layer the noise tile over your background with multiple backgrounds:

```
.hero {
  background:
    url("noise.png"),
    linear-gradient(135deg, #1a1a2e, #16213e);
}
```

The first image is drawn on top. Because the noise PNG is semi-transparent, the gradient shows through with a fine grain.

For richer results, put the noise on a pseudo-element with a blend mode:

```
.hero { position: relative; }
.hero::after {
  content: ""; position: absolute; inset: 0;
  background: url("noise.png");
  mix-blend-mode: overlay;
  opacity: 0.4;
  pointer-events: none;
}
```

`overlay` lightens light areas and darkens dark ones, so grain looks natural across the whole tonal range.

## SVG noise filters

SVG has a built-in noise generator, `feTurbulence`, which can create grain without any image file. It’s flexible and tiny, but it’s computed by the browser, and large full-screen filters can be slow to render, especially on phones. A pre-rendered PNG tile is usually faster and more predictable.

## PNG tile versus SVG filter

| Aspect | PNG tile | SVG feTurbulence |
|---|---|---|
| File size | 30–150 KB (cached once) | Under 1 KB |
| Rendering cost | Low | Can be high on large areas |
| Consistency across browsers | Identical | Slight differences |
| Adjust without re-exporting | No | Yes |

## Keep it subtle

The most common mistake is too much grain. Guidelines:

- Opacity of **5–20%** for backgrounds; text areas should be at the low end.
- Fine grain (1px) for screens; coarser grain only for a deliberate stylised look.
- Don’t place noise directly behind small body text; it reduces legibility.
- Check text contrast against the background without relying on the grain.

## File size and compression

Noise is, by definition, random, which makes it hard to compress. A 256 × 256 PNG tile of semi-transparent noise is often 50–150 KB, depending on opacity and density. Use one small tile across the whole site so it is downloaded once and cached. Avoid exporting large noisy images as JPEG; JPEG compression struggles with noise and creates blocky artifacts, which defeats the purpose.

## Noise in images versus noise in CSS

If you add grain directly to a photo or gradient image and then compress it, the file size grows significantly. Adding noise as a separate CSS layer keeps the main image small and smooth while still showing grain on screen. For exported assets like social images and wallpapers, bake the grain in and export PNG, or a high-quality JPEG with minimal compression.

## Summary

Banding happens because 8-bit color has only 256 levels per channel, and subtle gradients run out of steps. A faint layer of noise dithers the transitions so they look smooth, and adds a tactile, analogue texture. Use a small tileable PNG at low opacity, blend it over gradients with CSS, keep it away from body text, and reuse one tile across the site. It pairs especially well with [mesh gradients](/blog/mesh-gradients-in-css-guide/).
