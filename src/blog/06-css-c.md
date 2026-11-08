@@@
slug: fluid-typography-with-clamp
tool: css-clamp-generator
title: Fluid Typography With CSS clamp(): The Formula, the Pitfalls and Accessibility
desc: How CSS clamp() creates font sizes that scale smoothly between screen widths, how the min/preferred/max formula is calculated, and how to keep fluid type accessible under zoom.
keywords: css clamp, fluid typography, responsive font size, clamp font size, fluid type scale, vw font size
###
For years, responsive typography meant a stack of media queries: 32px headings on desktop, 28px on tablets, 24px on phones. The text jumped between sizes at each breakpoint. CSS `clamp()` replaces that with a single line that scales smoothly with the screen, while staying within limits you control.

## What clamp() does

```
font-size: clamp(1.125rem, 0.83rem + 1.26vw, 2.5rem);
```

`clamp(minimum, preferred, maximum)` returns the preferred value, but never less than the minimum or more than the maximum. The preferred value usually mixes a fixed unit (rem) with a viewport unit (vw), so it grows as the screen gets wider. On a small phone the size sits at the minimum, on large screens at the maximum, and in between it scales linearly.

`clamp()` has been supported in all major browsers since 2020.

## The formula

You want text to be `minSize` at `minViewport` and `maxSize` at `maxViewport`, scaling in a straight line in between. That’s linear interpolation:

1. **Slope** = (maxSize − minSize) ÷ (maxViewport − minViewport)
2. **Intercept** = minSize − slope × minViewport
3. **Preferred value** = intercept + slope × 100vw

Example: 18px at 375px wide, 40px at 1440px wide.

- Slope = (40 − 18) ÷ (1440 − 375) = 22 ÷ 1065 ≈ 0.02066
- Intercept = 18 − 0.02066 × 375 ≈ 10.25px
- Preferred = 10.25px + 2.066vw

Converted to rem (dividing pixels by 16): `clamp(1.125rem, 0.6406rem + 2.0657vw, 2.5rem)`. Our [CSS clamp generator](/tools/css-clamp-generator/) does this calculation and also shows the computed size at any preview width.

## Media queries versus clamp()

| Aspect | Breakpoint media queries | clamp() |
|---|---|---|
| Size changes | In jumps at breakpoints | Smoothly at every width |
| Code | Several rules per element | One declaration |
| Control at specific widths | Exact | Linear between two points |
| Readability | Clear | Needs a generator or comments |
| Works with container queries | Yes | Yes, using cqi units instead of vw |

Many teams combine both: clamp() for smooth scaling, and an occasional media query for layout changes that aren’t about size.

## Why mix rem and vw?

A font size of pure `vw`, like `font-size: 4vw`, has two serious problems:

1. **No limits.** On a 320px phone it’s 12.8px; on a 2560px monitor it’s 102px.
2. **It ignores zoom.** Browser zoom changes the viewport width in CSS pixels, so vw-based text scales differently from everything else. Text that is purely vw-based doesn’t get bigger when the user zooms, which can fail WCAG 1.4.4 (Resize Text), which requires text to be resizable to 200%.

Including a rem component in the preferred value, and using rem for the min and max, keeps the text tied to the user’s font size setting.

## The zoom pitfall, in detail

Even with rem in the mix, aggressive fluid type can still resist zooming. When a user zooms to 200%, the viewport in CSS pixels halves, so the vw part shrinks while the rem part doubles. If most of your preferred value comes from vw, the net change can be far less than 2×.

A widely cited rule of thumb from accessibility researchers: keep the **maximum font size at no more than about 2.5 times the minimum**. Within that range, fluid type generally still reaches 200% enlargement when zoomed. Test it: zoom your browser to 200% at a desktop width and check that headings and body text have roughly doubled.

## Choosing the viewport range

- **Min viewport:** 320–375px covers nearly all phones.
- **Max viewport:** 1200–1440px is a common choice; beyond that, many layouts stop widening because of a max-width container, so text growth should stop too.

Use the same min and max viewport for every fluid value in a project, so headings, body text and spacing all scale in sync.

## Building a fluid type scale

Fluid sizing pairs beautifully with a [modular type scale](/blog/modular-type-scales-explained/). Define two scales, a smaller ratio for mobile (say 1.2) and a larger one for desktop (say 1.333), then make each step fluid between its mobile and desktop size:

| Step | Mobile (375px) | Desktop (1440px) |
|---|---|---|
| Body | 16px | 18px |
| H4 | 19px | 24px |
| H3 | 23px | 32px |
| H2 | 28px | 42px |
| H1 | 33px | 56px |

Small text barely changes; large headings change a lot, which is exactly how good responsive typography should behave. Generate the base sizes with the [type scale generator](/tools/type-scale-generator/), then create a clamp() value for each.

## Fluid spacing

clamp() isn’t just for fonts. Padding, margins and gaps can scale too:

```
section { padding-block: clamp(3rem, 1.5rem + 5vw, 7rem); }
```

Generous whitespace on desktop and compact spacing on phones, without breakpoints. Keep the values aligned with your [spacing scale](/blog/8pt-grid-spacing-system/) at the endpoints.

## Container query units

When a component can appear in a narrow sidebar or a wide main column, sizing it by the viewport doesn’t make sense. Container query units (`cqi`, `cqw`) work like vw but are relative to the nearest container with `container-type: inline-size`. Replace `vw` with `cqi` in the clamp formula and the component’s text scales with its own width.

## Common mistakes

- **Pure vw font sizes.** Always use clamp() with rem limits.
- **Too big a range.** 14px to 96px will look broken somewhere and fail zoom tests.
- **Different viewport ranges for different elements**, causing headings and body text to scale out of proportion.
- **Forgetting line height.** Large fluid headings need tighter line heights; use unitless values so they scale with the font. Our [line height guide](/blog/line-height-and-line-length-readability/) covers this.

## Summary

clamp() gives you smooth, responsive type in one line: a rem minimum, a rem-plus-vw preferred value and a rem maximum. Keep the range modest, use consistent viewport bounds, test at 200% zoom, and apply the same idea to spacing. The math is simple linear interpolation, and a generator saves you from doing it by hand.

@@@
slug: button-design-css-best-practices
tool: css-button-generator
title: Button Design Best Practices: Size, Contrast, States and Clean CSS
desc: What makes a good button: touch target sizes, contrast requirements, hover, focus and disabled states, primary vs secondary hierarchy, label writing and button vs link markup.
keywords: button design, css button, button best practices, button size, focus state, primary secondary button
###
Buttons are where users act: buy, save, send, sign up. A slightly unclear button costs real conversions and real frustration. Good button design is less about decoration and more about a handful of practical rules: size, contrast, clear states, hierarchy and honest labels.

## Size: make it easy to hit

Fitts’s law, a model of human movement published in 1954, says the time to reach a target depends on its distance and its size. Bigger targets are faster and easier to hit, especially on touchscreens and for people with motor impairments.

| Guideline | Minimum target size |
|---|---|
| WCAG 2.2 Target Size (Minimum), level AA | 24 × 24 CSS px (or enough spacing around smaller targets) |
| WCAG 2.5.5 Target Size (Enhanced), level AAA | 44 × 44 CSS px |
| Apple Human Interface Guidelines | 44 × 44 pt |
| Material Design | 48 × 48 dp |

For main actions, aim for at least 44px tall on touch devices. Padding does most of the work: 12px vertical and 20–24px horizontal padding with a 16px font gives a comfortable 40–48px button.

## Contrast: two different checks

1. **Label versus button background:** the text must meet 4.5:1 for normal-size text (3:1 if the label is large or bold enough to count as large text).
2. **Button versus page background:** under WCAG 1.4.11, the visual boundary needed to identify the button should have 3:1 contrast with its surroundings. A pale grey button on white may need a border.

Many brand colors fail the first check with white text. A common fix is to use a darker shade of the brand color for buttons than for illustrations. Our [WCAG contrast guide](/blog/wcag-color-contrast-guide/) explains the numbers.

## The five states every button needs

| State | Purpose | Typical treatment |
|---|---|---|
| Default | Shows it’s clickable | Solid fill or clear border |
| Hover | Confirms the pointer is on it (desktop) | Slightly darker or lighter, maybe a subtle lift |
| Focus (keyboard) | Shows where keyboard focus is | Visible outline with an offset, never removed |
| Active / pressed | Feedback at the moment of clicking | Darker still, or pressed-in look |
| Disabled | Shows the action isn’t available | Reduced contrast, `cursor: not-allowed`, plus an explanation nearby |

Use `:focus-visible` rather than `:focus` for the focus ring. It shows the ring for keyboard users but not after a mouse click, which removes the main reason designers used to hide focus outlines. WCAG 2.4.7 requires a visible focus indicator, and WCAG 2.2 adds rules about it not being hidden.

A note on disabled buttons: they are often confusing because users can’t tell *why* they can’t proceed. Many teams now keep the button enabled and show validation messages when it’s clicked instead.

Our [CSS button generator](/tools/css-button-generator/) produces the default, hover and focus-visible states together, with a short transition.

## Hierarchy: primary, secondary, tertiary

A screen with five equally loud buttons has no clear next step. Use visual weight to show importance:

| Level | Style | Use |
|---|---|---|
| Primary | Solid fill in the brand or action color | The main action on the screen. Usually one per view |
| Secondary | Outline or light fill | Alternatives: Cancel, Back, Save draft |
| Tertiary / text | Text only, underline on hover | Low-priority actions: Learn more, Skip |
| Destructive | Red fill or red outline | Delete, Remove; pair with confirmation |

In dialogs, platforms differ on button order (Windows traditionally puts the primary action on the left, macOS on the right). On the web, be consistent within your product.

## Labels: say what will happen

The label is the most important part of a button. Good labels:

- start with a verb: “Download invoice”, “Create account”, “Send message”,
- describe the result, not the mechanism: “Save changes” rather than “Submit”,
- are short, usually one to three words,
- match the heading or question: a dialog asking “Delete this file?” should have a “Delete” button, not “OK”.

Avoid “Click here” and “Submit” where possible. They are vague for everyone and meaningless out of context for screen reader users who navigate by a list of buttons.

Sentence case (“Create account”) is generally easier to read than title case or all caps. If your brand uses uppercase buttons, apply it with CSS `text-transform` so screen readers don’t spell words out. Our [title case vs sentence case guide](/blog/title-case-vs-sentence-case/) goes deeper.

## Button or link?

| Element | Use when | Keyboard behaviour |
|---|---|---|
| `<button>` | It performs an action on the page: submit, open a menu, toggle | Activates with Enter and Space |
| `<a href>` | It navigates to another page or URL | Activates with Enter; can open in a new tab |

Styling a link to look like a button is fine. Making a `<div>` behave like a button is not: you lose keyboard support and screen reader semantics unless you rebuild them by hand.

## Icons in buttons

Icons speed up recognition when paired with text. Icon-only buttons need an accessible name, such as `aria-label="Close"`, and a tooltip helps sighted users too. Keep icons and text vertically aligned with `display: inline-flex; align-items: center; gap: 8px`.

## Loading states

When an action takes time, change the button to show progress: disable repeat clicks, swap the label to “Saving…” or add a small spinner, and keep the button’s width fixed so the layout doesn’t jump. See our article on [loading spinners versus skeleton screens](/blog/loading-spinners-vs-skeleton-screens/) for when to use which indicator.

## Summary

A good button is big enough to hit, high enough in contrast to see, clear about what it does and honest about its state. Build all five states, make one primary action per screen, write verb-first labels and use the right HTML element. Design the styles in the [button generator](/tools/css-button-generator/), then save them as reusable components so every button in your product behaves the same way.

@@@
slug: loading-spinners-vs-skeleton-screens
tool: css-loader-generator
title: Loading Spinners vs Skeleton Screens vs Progress Bars: Which to Use When
desc: How long users will wait, when to show a spinner, a skeleton screen or a progress bar, how to build lightweight CSS loaders, and how to make loading states accessible.
keywords: loading spinner, skeleton screen, progress bar, css loader, loading animation, perceived performance
###
Every interface waits sometimes: for a server response, a file upload, a page of search results. What you show during that wait changes how long it *feels*. The right loading indicator makes an app feel fast and trustworthy; the wrong one makes a two-second wait feel like ten. There are three main patterns, and each fits a different situation.

## How long people will wait

Usability researcher Jakob Nielsen summarised three time limits in 1993, based on earlier work by Robert Miller, and they still hold up:

| Duration | How it feels | What to show |
|---|---|---|
| Under 0.1 s | Instant | Nothing; just show the result |
| 0.1 – 1 s | Noticeable delay, flow of thought stays intact | Usually nothing, or a subtle state change |
| 1 – 10 s | User’s attention starts to wander | A loading indicator |
| Over 10 s | Users want to do something else | A progress bar with an estimate, and the option to cancel or continue later |

A common mistake is showing a spinner for waits under about 300 milliseconds. The spinner flashes on and off, which draws attention to the delay and makes the interface feel slower than showing nothing. A short delay before showing the indicator avoids the flash.

## Pattern 1: spinners

A spinner (or any looping animation) says “something is happening” without saying how long it will take.

**Use it for:** short, unpredictable waits of roughly 1–4 seconds, like submitting a form, loading a small panel or refreshing a list.

**Avoid it for:** long waits, where an endless spinner makes users wonder if the app has frozen, and for loading entire pages of content, where a skeleton works better.

Pure CSS spinners are tiny, sharp at any size and easy to recolor. They animate only `transform` and `opacity`, which browsers can run on the compositor, so they keep spinning smoothly even when the main thread is busy. Our [CSS loader generator](/tools/css-loader-generator/) creates ring, dots, bars and pulse loaders with a few lines of HTML and CSS.

## Pattern 2: skeleton screens

A skeleton screen shows a grey outline of the layout that is about to load: blocks where images will be, bars where text will be. Facebook, LinkedIn and YouTube popularised the pattern in the mid-2010s.

**Use it for:** loading content into a known layout, such as feeds, cards, profiles, article pages and dashboards.

**Why it works:** users see the structure immediately, so the page feels like it’s already arriving. It also reduces layout shift, because content fills the space reserved by the skeleton instead of pushing things around.

**Caveats:** skeletons should match the real layout closely, or the jump when content arrives is jarring. They are not useful for actions like “saving”, where there is no layout to preview. A subtle shimmer animation can indicate activity, but keep it gentle and respect reduced-motion preferences.

## Pattern 3: progress bars

A progress bar shows how much is done and, ideally, how much is left.

**Use it for:** long tasks where progress can be measured: file uploads, exports, installations, multi-step processing.

**Determinate versus indeterminate:** a determinate bar fills based on real progress; an indeterminate bar animates without a percentage. Use determinate whenever you can measure progress. Research on progress indicators has found that users prefer bars that speed up toward the end rather than slow down, so if you estimate, err toward finishing fast rather than getting stuck at 99%.

## Comparison

| Indicator | Best wait length | Shows how long? | Shows what’s coming? | Typical use |
|---|---|---|---|---|
| None | Under ~0.3 s | n/a | n/a | Fast interactions |
| Inline state change (“Saving…”) | 0.3 – 2 s | No | No | Buttons, toggles |
| Spinner | 1 – 4 s | No | No | Small panels, form submits |
| Skeleton screen | 0.5 – 5 s | No | Yes, the layout | Feeds, cards, page content |
| Progress bar | Over 4 s | Yes | No | Uploads, exports, processing |

## Perceived performance tricks

- **Optimistic UI:** show the result immediately (a sent message, a liked post) and roll back only if the server reports an error.
- **Load progressively:** show text first, then images. Use placeholders with the right aspect ratio so images don’t shift the layout; see our guide on [placeholder images and layout shift](/blog/placeholder-images-and-layout-shift/).
- **Keep users busy:** for long processes, let them keep working and notify them when the task is done.
- **Don’t block the whole page** for one slow component; put the loader where the loading is.

## Accessibility of loading states

Visual loaders mean nothing to screen reader users unless announced:

- Give the loader `role="status"` (a polite live region) and an accessible name like `aria-label="Loading search results"`.
- When loading finishes, move focus or announce the result if the user triggered the action.
- For regions that are updating, `aria-busy="true"` signals that content is in flux.
- Respect `prefers-reduced-motion`: slow down or replace spinning animations with a static indicator or a gentle opacity pulse. WCAG 2.2.2 (Pause, Stop, Hide) also requires that moving content lasting more than five seconds can be paused, which matters for decorative looping animations.

## Building a good CSS spinner

A few details separate a polished spinner from a distracting one:

- Use your accent color for the moving part and a faint version of it for the track.
- Keep it proportional: 16–24px inside buttons, 32–48px for panels.
- Use a moderate speed, around 0.8–1.2 seconds per rotation. Fast spinners feel anxious.
- Center it in the area that is loading, not in the middle of the whole screen.

## Summary

Show nothing for very short waits, a spinner or inline state for short unpredictable ones, a skeleton when loading content into a known layout, and a progress bar for long measurable tasks. Make every loading state announce itself to assistive technology and respect reduced motion. A tiny CSS loader from the [loader generator](/tools/css-loader-generator/) covers the spinner case without any images or libraries.

@@@
slug: css-clip-path-shapes-guide
tool: clip-path-generator
title: CSS clip-path Guide: Polygons, Circles, Animations and Practical Uses
desc: How CSS clip-path works with polygon(), circle(), ellipse() and inset(), how coordinates are calculated, how to animate shapes, and clip-path compared with masks and SVG.
keywords: css clip-path, clip-path polygon, css shapes, clip-path animation, hexagon css, clip path vs mask
###
Rectangles are the natural shape of the web, because every element is a box. `clip-path` lets you break out of the box: cut an image into a hexagon, angle the bottom of a hero section, reveal content with a circular wipe. It’s purely visual, it doesn’t affect layout, and it is supported in every modern browser.

## How clipping works

`clip-path` defines a region. Everything inside the region is visible; everything outside is hidden, including backgrounds, borders, shadows and children. The element still takes up its full rectangular space in the layout.

## The basic shape functions

| Function | Example | Draws |
|---|---|---|
| `inset()` | `inset(10% 5% round 16px)` | A rectangle inset from each edge, optionally rounded |
| `circle()` | `circle(40% at 50% 50%)` | A circle with a radius and center |
| `ellipse()` | `ellipse(50% 30% at center)` | An ellipse with two radii |
| `polygon()` | `polygon(50% 0, 100% 100%, 0 100%)` | Any shape with straight edges |
| `path()` | `path('M0 0 L100 0 …')` | An SVG path (in pixels, not responsive) |
| `url(#id)` | `url(#myClip)` | An SVG `<clipPath>` element |

Newer additions such as `shape()` bring responsive curves to clip-path, but support is still arriving across browsers. For now, polygon covers most needs.

## Polygon coordinates

Each point in `polygon()` is an x and y coordinate measured from the element’s top-left corner. Percentages are relative to the element’s width (x) and height (y), so the shape scales with the element.

- `0 0` is the top-left corner,
- `100% 0` is the top-right,
- `100% 100%` is the bottom-right,
- `50% 50%` is the center.

A hexagon is six points: `polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)`. Drawing these by hand is fiddly, which is why visual editors exist. Our [clip-path generator](/tools/clip-path-generator/) starts from presets like triangles, stars, arrows and chevrons and lets you drag each point.

## Practical uses

**Angled section edges.** `clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%)` slants the bottom of a hero section. It’s a common alternative to [SVG wave dividers](/blog/svg-wave-section-dividers/) for a sharper, more geometric look.

**Image shapes.** Hexagonal team photos, diamond thumbnails and circular avatars (although `border-radius: 50%` is simpler for circles).

**Reveal animations.** Animating `clip-path: circle(0% at 50% 50%)` to `circle(150% at 50% 50%)` creates a circular wipe that reveals an element, popular in page transitions.

**Irregular buttons and tabs.** Arrow-shaped breadcrumb steps and chevron tabs. Clicks outside the clipped area don’t register, so the clickable area matches the visible shape.

**Speech bubbles and badges**, using a polygon with a pointer.

## Animating clip-path

You can transition between two shapes smoothly, with one rule: both must use the same function and, for polygons, the **same number of points**. To morph a triangle into a square, give the triangle four points with two of them at the same position. Clip-path animations are generally smooth, but large clipped areas that change every frame can be costly on low-end devices, so test on a phone.

## What gets clipped (and what doesn’t)

| Thing | Clipped? | Workaround |
|---|---|---|
| Background and border | Yes | — |
| Children and text | Yes | — |
| box-shadow | Yes | Use `filter: drop-shadow()` on a parent wrapper |
| outline (focus ring) | Yes | Put the focus style on a parent or use an inner element |
| Pointer events outside the shape | Disabled | This is usually desirable |
| Layout size | Not affected | The element still occupies its full box |

The focus ring issue matters for accessibility: if you clip an interactive element, make sure its keyboard focus indicator is still visible.

## clip-path versus mask versus SVG

| Technique | Edges | Soft fades | Best for |
|---|---|---|---|
| `clip-path` | Hard, geometric | No | Shapes, section edges, reveals |
| `mask-image` | Any, from an image or gradient | Yes | Fading edges, complex shapes from PNG/SVG |
| `border-radius` | Rounded rectangles and ellipses | No | Circles, pills, rounded cards |
| Inline SVG | Anything | Yes | Illustrations, icons, complex vector art |

If you need a soft fade, such as an image that fades out at the bottom, use `mask-image: linear-gradient(black, transparent)`. If you need a crisp geometric cut, clip-path is simpler and faster.

## Shapes for text flow

`clip-path` only affects visibility. If you want text to wrap around a shape, combine it with `shape-outside` on a floated element: `shape-outside: circle(50%)` makes text flow around a circular image, magazine style.

## Common pitfalls

- **Forgetting about content at the edges.** Clipping a card into a shape can cut off text near corners. Add padding or keep text in the middle.
- **Using path() for responsive shapes.** `path()` uses pixel coordinates, so it doesn’t scale. Use polygon with percentages or an SVG `clipPath` with `clipPathUnits="objectBoundingBox"`.
- **Shadows disappearing.** Move the shadow to a wrapper with `filter: drop-shadow()`, as covered in our [box shadow guide](/blog/css-box-shadow-guide-realistic-shadows/).

## Summary

clip-path turns any element into a custom shape with a single line, scales with the element when you use percentages, and animates when shapes have matching points. Remember that shadows and focus rings get clipped too, use masks for soft edges, and design shapes visually in the [clip-path generator](/tools/clip-path-generator/) rather than counting coordinates by hand.
