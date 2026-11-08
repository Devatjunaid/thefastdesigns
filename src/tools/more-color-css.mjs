import { range, num, txt, color, sel, chk, code } from '../lib.mjs';

const NAMED = 'aliceblue:f0f8ff,antiquewhite:faebd7,aqua:00ffff,aquamarine:7fffd4,azure:f0ffff,beige:f5f5dc,bisque:ffe4c4,black:000000,blanchedalmond:ffebcd,blue:0000ff,blueviolet:8a2be2,brown:a52a2a,burlywood:deb887,cadetblue:5f9ea0,chartreuse:7fff00,chocolate:d2691e,coral:ff7f50,cornflowerblue:6495ed,cornsilk:fff8dc,crimson:dc143c,darkblue:00008b,darkcyan:008b8b,darkgoldenrod:b8860b,darkgray:a9a9a9,darkgreen:006400,darkkhaki:bdb76b,darkmagenta:8b008b,darkolivegreen:556b2f,darkorange:ff8c00,darkorchid:9932cc,darkred:8b0000,darksalmon:e9967a,darkseagreen:8fbc8f,darkslateblue:483d8b,darkslategray:2f4f4f,darkturquoise:00ced1,darkviolet:9400d3,deeppink:ff1493,deepskyblue:00bfff,dimgray:696969,dodgerblue:1e90ff,firebrick:b22222,floralwhite:fffaf0,forestgreen:228b22,fuchsia:ff00ff,gainsboro:dcdcdc,ghostwhite:f8f8ff,gold:ffd700,goldenrod:daa520,gray:808080,green:008000,greenyellow:adff2f,honeydew:f0fff0,hotpink:ff69b4,indianred:cd5c5c,indigo:4b0082,ivory:fffff0,khaki:f0e68c,lavender:e6e6fa,lavenderblush:fff0f5,lawngreen:7cfc00,lemonchiffon:fffacd,lightblue:add8e6,lightcoral:f08080,lightcyan:e0ffff,lightgoldenrodyellow:fafad2,lightgray:d3d3d3,lightgreen:90ee90,lightpink:ffb6c1,lightsalmon:ffa07a,lightseagreen:20b2aa,lightskyblue:87cefa,lightslategray:778899,lightsteelblue:b0c4de,lightyellow:ffffe0,lime:00ff00,limegreen:32cd32,linen:faf0e6,maroon:800000,mediumaquamarine:66cdaa,mediumblue:0000cd,mediumorchid:ba55d3,mediumpurple:9370db,mediumseagreen:3cb371,mediumslateblue:7b68ee,mediumspringgreen:00fa9a,mediumturquoise:48d1cc,mediumvioletred:c71585,midnightblue:191970,mintcream:f5fffa,mistyrose:ffe4e1,moccasin:ffe4b5,navajowhite:ffdead,navy:000080,oldlace:fdf5e6,olive:808000,olivedrab:6b8e23,orange:ffa500,orangered:ff4500,orchid:da70d6,palegoldenrod:eee8aa,palegreen:98fb98,paleturquoise:afeeee,palevioletred:db7093,papayawhip:ffefd5,peachpuff:ffdab9,peru:cd853f,pink:ffc0cb,plum:dda0dd,powderblue:b0e0e6,purple:800080,rebeccapurple:663399,red:ff0000,rosybrown:bc8f8f,royalblue:4169e1,saddlebrown:8b4513,salmon:fa8072,sandybrown:f4a460,seagreen:2e8b57,seashell:fff5ee,sienna:a0522d,silver:c0c0c0,skyblue:87ceeb,slateblue:6a5acd,slategray:708090,snow:fffafa,springgreen:00ff7f,steelblue:4682b4,tan:d2b48c,teal:008080,thistle:d8bfd8,tomato:ff6347,turquoise:40e0d0,violet:ee82ee,wheat:f5deb3,white:ffffff,whitesmoke:f5f5f5,yellow:ffff00,yellowgreen:9acd32';

export default [
{
  slug: 'random-color-generator', cat: 'color', name: 'Random Color Generator',
  title: 'Random Color Generator – Pastel, Vivid, Dark & Earthy Colors',
  desc: 'Generate random colors with one click. Filter by pastel, vivid, dark, light or earthy tones and copy HEX, RGB or HSL codes for design inspiration, mood boards and testing.',
  kw: ['random color generator', 'random hex color', 'pastel color generator', 'random color picker', 'color inspiration'],
  short: 'Get random colors filtered by mood: pastel, vivid, dark, light or earthy.',
  intro: 'Stuck on a color choice? Generate a batch of random colors in the mood you want and copy any code with a click. Press the space bar for a new batch.',
  html: `<div class="tool-layout"><div class="panel" id="rcP">
${sel('rcM', 'Color mood', [['any', 'Anything goes'], ['pastel', 'Pastel'], ['vivid', 'Vivid / saturated'], ['dark', 'Dark'], ['light', 'Light / airy'], ['earthy', 'Earthy / natural'], ['neutral', 'Neutral greys']], 'any')}
${range('rcN', 'How many colors', 1, 24, 12)}
${sel('rcF', 'Copy format', [['hex', 'HEX'], ['rgb', 'RGB'], ['hsl', 'HSL']], 'hex')}
<button type="button" class="btn" id="rcGo" style="width:100%">Generate colors</button>
<p class="note">Press <kbd>Space</kbd> to generate again. Click a swatch to copy it.</p>
</div><div class="panel"><div class="swatches" id="rcOut"></div></div></div>`,
  js: () => {
    const R = (a, b) => a + Math.random() * (b - a);
    const one = m => ({ any: () => hslHex(R(0, 360), R(0, 100), R(8, 92)), pastel: () => hslHex(R(0, 360), R(45, 80), R(78, 90)), vivid: () => hslHex(R(0, 360), R(80, 100), R(45, 58)), dark: () => hslHex(R(0, 360), R(25, 75), R(10, 26)), light: () => hslHex(R(0, 360), R(20, 60), R(86, 96)), earthy: () => hslHex(R(15, 75), R(18, 45), R(28, 62)), neutral: () => hslHex(R(20, 220), R(0, 10), R(10, 95)) })[m]();
    function gen() {
      const f = el('rcF').value;
      el('rcOut').innerHTML = Array.from({ length: +el('rcN').value }, () => { const x = one(el('rcM').value), c = parseColor(x), h = rgbToHsl(c.r, c.g, c.b); const v = f === 'hex' ? x.toUpperCase() : f === 'rgb' ? `rgb(${c.r}, ${c.g}, ${c.b})` : `hsl(${h.h}, ${h.s}%, ${h.l}%)`; return `<button type="button" class="sw big" style="background:${x};color:${bestText(x)}" data-copy="${v}"><span>${v}</span></button>`; }).join('');
    }
    el('rcGo').onclick = gen; el('rcP').addEventListener('change', gen); el('rcN').addEventListener('input', gen);
    document.addEventListener('keydown', e => { if (e.code === 'Space' && !/INPUT|SELECT|TEXTAREA|BUTTON/.test(document.activeElement.tagName)) { e.preventDefault(); gen(); } });
    gen();
  },
  how: ['Choose a color mood such as pastel, vivid or earthy.', 'Pick how many colors you want and the format to copy.', 'Click “Generate colors” or press the space bar.', 'Click any swatch to copy its code.'],
  about: `<p>Pure random RGB values tend to produce muddy, unusable colors because most of the RGB cube sits in the mid-saturation, mid-lightness zone. This generator works in HSL instead and limits saturation and lightness per mood, so “pastel” always means high lightness with moderate saturation and “dark” never drifts into grey.</p><p>Random colors are useful for breaking creative block, generating test data for charts, assigning avatar backgrounds or simply exploring hues you wouldn’t normally pick.</p>`,
  tips: ['Generate a pastel batch and pick one color as a background tint, then use the color palette generator to build accents around it.', 'For chart test data, use the “vivid” mood: saturated colors are easier to tell apart in small legend swatches.', 'Earthy tones are limited to warm hues (roughly orange to olive) with low saturation, which suits organic, food and outdoor brands.', 'Run any color you like through the contrast checker before using it for text.', 'Neutral greys here carry a slight hue tint, which tends to look more natural next to brand colors than pure grey.'],
  faq: [['How does the random color generator work?', 'It picks a random hue from 0–360° and a saturation and lightness within the range of the mood you chose, then converts the HSL value to HEX.'], ['Can I copy RGB instead of HEX?', 'Yes, switch the copy format to RGB or HSL before clicking a swatch.']],
},
{
  slug: 'color-name-finder', cat: 'color', name: 'Color Name Finder', pre: `const NAMED_LIST = ${JSON.stringify(NAMED)};`,
  title: 'Color Name Finder – Find the Closest CSS Color Name for Any HEX',
  desc: 'Find the name of any color. Enter a HEX or RGB value to get the closest CSS named color using perceptual Delta E matching, or type a color name to get its HEX code.',
  kw: ['color name finder', 'hex to color name', 'what color is this', 'css color names', 'name that color'],
  short: 'Match any HEX code to its closest named CSS color.',
  intro: 'Enter any color to see the nearest of the 140+ named CSS colors, ranked by perceptual difference. Handy for naming design tokens or describing a color in words.',
  html: `<div class="tool-layout"><div class="panel">${color('cnIn', 'Your color', '#5b7f95')}<p class="note">You can also type a CSS name like <code>teal</code> or an <code>rgb()</code> value.</p><div class="swatch-lg" id="cnSw" style="height:110px"></div></div>
<div class="panel"><h3>Closest named colors</h3><div id="cnOut" class="kv-list"></div><h3 style="margin-top:20px">All CSS named colors</h3><div class="swatches tight" id="cnAll" style="max-height:340px;overflow:auto"></div></div></div>`,
  js: () => {
    const list = NAMED_LIST.split(',').map(x => { const [n, h] = x.split(':'); return { n, h: '#' + h }; });
    const lab = (r, g, b) => { [r, g, b] = [r, g, b].map(v => (v /= 255) <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); let x = (r * .4124 + g * .3576 + b * .1805) / .95047, y = r * .2126 + g * .7152 + b * .0722, z = (r * .0193 + g * .1192 + b * .9505) / 1.08883; const f = t => t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; x = f(x); y = f(y); z = f(z); return [116 * y - 16, 500 * (x - y), 200 * (y - z)]; };
    list.forEach(c => { const p = hexToRgb(c.h); c.lab = lab(p.r, p.g, p.b); });
    function upd() {
      const c = parseColor(el('cnIn').value), L = lab(c.r, c.g, c.b); el('cnSw').style.background = el('cnIn').value;
      const best = list.map(x => ({ ...x, d: Math.hypot(x.lab[0] - L[0], x.lab[1] - L[1], x.lab[2] - L[2]) })).sort((a, b) => a.d - b.d).slice(0, 6);
      el('cnOut').innerHTML = best.map((x, i) => `<div class="kv"${i === 0 ? ' style="border-color:var(--ink)"' : ''}><i class="dot" style="background:${x.h}"></i><code><b>${x.n}</b> · ${x.h.toUpperCase()}</code><small class="muted">ΔE ${x.d.toFixed(1)}${x.d < 1 ? ' exact' : x.d < 5 ? ' very close' : ''}</small><button type="button" class="btn-sm" data-copy="${x.n}">Copy</button></div>`).join('');
    }
    el('cnAll').innerHTML = list.map(x => `<button type="button" class="sw" style="background:${x.h};color:${bestText(x.h)};font-size:10px" data-copy="${x.n}" title="${x.n} ${x.h}"><span>${x.n}</span></button>`).join('');
    el('cnIn').addEventListener('input', upd); upd();
  },
  how: ['Pick a color or paste a HEX, RGB or HSL value.', 'Read the closest named colors, ranked by visual difference (ΔE).', 'Copy the name to use in CSS or to label a design token.', 'Browse the full list of named CSS colors below.'],
  about: `<p>CSS defines 148 named color keywords (including duplicate spellings like gray/grey and aqua/cyan). Names such as <code>rebeccapurple</code>, <code>papayawhip</code> and <code>cornflowerblue</code> come from the X11 color list, which explains their quirky choices.</p><p>Matching uses the CIELAB color space and the Delta E (CIE76) distance instead of raw RGB distance, because Lab is designed so that equal numeric distances look roughly equally different to the human eye. A ΔE under about 2.3 is often cited as a just-noticeable difference.</p>`,
  tips: ['Use the closest name as a readable label in design tokens, for example “steelblue-ish primary”, even if you keep the exact HEX in code.', 'A ΔE above 10 means no CSS name is a good match; describe the color by hue and lightness instead.', 'Named colors are handy in quick prototypes and code demos because they are easy to read and remember.', 'Avoid relying on named colors for brand work: they are fixed values and rarely match a brand guide exactly.', 'Remember that gray, grey, darkgray and darkgrey exist, and that darkgray is actually lighter than gray.'],
  faq: [['How many named colors does CSS have?', '148 keywords, including duplicate spellings, which map to about 139 unique colors.'], ['What is Delta E?', 'A measure of the visual difference between two colors in Lab color space. Lower is closer; under about 2 is barely noticeable.']],
},
{
  slug: 'color-scale-generator', cat: 'color', name: 'Color Scale Generator',
  title: 'Color Scale Generator – Tailwind-Style 50–950 Shade Palettes',
  desc: 'Turn one brand color into a full 50–950 color scale for design systems. Export CSS variables or a Tailwind CSS config object with eleven balanced shades in seconds.',
  kw: ['color scale generator', 'tailwind color generator', 'color shades 50-900', 'design system colors', 'tailwind palette'],
  short: 'Build an 11-step 50–950 color scale from one brand color.',
  intro: 'Design systems need more than one shade per color. Enter your brand color to get eleven balanced steps from 50 to 950, ready for CSS variables or Tailwind.',
  html: `<div class="tool-layout"><div class="panel" id="csP">${color('csBase', 'Brand color', '#8a6d3b')}${txt('csName', 'Color name', 'brand')}${chk('csKeep', 'Keep my exact color in the closest step', true)}</div>
<div class="panel"><div class="swatches" id="csOut" style="grid-template-columns:repeat(auto-fill,minmax(84px,1fr))"></div>${code('csCss', 'Copy CSS')}${code('csTw', 'Copy Tailwind')}</div></div>`,
  js: () => {
    const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950], L = [97, 93, 86, 76, 64, 52, 43, 35, 27, 20, 12];
    function upd() {
      const c = parseColor(el('csBase').value), h = rgbToHsl(c.r, c.g, c.b), name = (el('csName').value || 'brand').trim().replace(/\s+/g, '-').toLowerCase();
      const out = L.map((l, i) => hslHex(h.h, clamp(h.s * (l > 85 ? .85 : l < 25 ? .9 : 1), 0, 100), l));
      if (el('csKeep').checked) { let bi = 0; L.forEach((l, i) => { if (Math.abs(l - h.l) < Math.abs(L[bi] - h.l)) bi = i; }); out[bi] = rgbToHex(c.r, c.g, c.b); }
      el('csOut').innerHTML = out.map((x, i) => swatch(x, `<small style="display:block;margin-left:auto;font-weight:600;opacity:.75">${STEPS[i]}</small>`)).join('');
      el('csCss').textContent = ':root {\n' + out.map((x, i) => `  --${name}-${STEPS[i]}: ${x};`).join('\n') + '\n}';
      el('csTw').textContent = `// tailwind.config.js → theme.extend.colors\n${name}: {\n` + out.map((x, i) => `  ${STEPS[i]}: '${x}',`).join('\n') + '\n}';
    }
    el('csP').addEventListener('input', upd); el('csP').addEventListener('change', upd); upd();
  },
  how: ['Enter your brand color.', 'Give the scale a name such as “brand” or “primary”.', 'Keep the option checked to place your exact color at the nearest step.', 'Copy the CSS variables or the Tailwind config snippet.'],
  about: `<p>Modern design systems such as Tailwind CSS, Material and Radix describe each color as a numbered scale. Low numbers are light tints for backgrounds, the middle (around 500) is the base color, and high numbers are dark shades for text and hover states. This generator keeps the hue constant and steps through fixed lightness targets, easing saturation slightly at the extremes so the lightest tints don’t look neon.</p>`,
  tips: ['Use 50–100 for page and card backgrounds, 200–300 for borders, 500–600 for buttons and 700–900 for text on light surfaces.', 'Check text contrast for each pairing you use; 600 on white often passes AA, but it depends on the hue.', 'Yellows and cyans are light by nature; you may want to shift their 500 step darker for usable buttons.', 'Generate a matching neutral scale by entering a grey with a slight tint of your brand hue.', 'Keep step names consistent across all colors so components can swap palettes easily.'],
  faq: [['What does 500 mean in a color scale?', 'It is the middle, “base” step. Lower numbers are lighter and higher numbers are darker.'], ['Can I use this with Tailwind CSS?', 'Yes. Copy the Tailwind snippet into theme.extend.colors in your tailwind.config.js, or use the CSS variables with Tailwind v4.']],
},
{
  slug: 'mesh-gradient-generator', cat: 'color', name: 'Mesh Gradient Generator',
  title: 'Mesh Gradient Generator – Soft Blurry Gradient Backgrounds (CSS & PNG)',
  desc: 'Create soft mesh gradient backgrounds with layered radial gradients. Pick colors, shuffle positions and export pure CSS or a high-resolution PNG wallpaper or hero image.',
  kw: ['mesh gradient generator', 'blurry gradient background', 'gradient wallpaper', 'aurora gradient css', 'soft gradient background'],
  short: 'Make soft, multi-color mesh gradients as CSS or PNG.',
  intro: 'Blend several colors into a smooth, organic background. Shuffle until it looks right, then copy the CSS or download a PNG up to 4K.',
  html: `<div class="tool-layout"><div class="panel" id="mgP">${color('mg0', 'Base color', '#f3ecdf')}<div class="grid2">${color('mg1', 'Color 1', '#e0a96d')}${color('mg2', 'Color 2', '#c9b28a')}${color('mg3', 'Color 3', '#8a6d3b')}${color('mg4', 'Color 4', '#f6d5b5')}</div>
${range('mgS', 'Spread', 30, 80, 55, 1, '%')}<div class="btn-row"><button type="button" class="btn" id="mgGo">Shuffle positions</button><button type="button" class="btn-alt" id="mgRc">Random colors</button></div>
${sel('mgRes', 'PNG size', [['1920x1080', '1920 × 1080'], ['3840x2160', '3840 × 2160 (4K)'], ['1080x1920', '1080 × 1920 (phone)'], ['1200x630', '1200 × 630 (social)']], '1920x1080')}<button type="button" class="btn-alt" id="mgDl" style="width:100%">Download PNG</button>
</div><div class="panel"><div class="preview" id="mgPrev" style="min-height:360px"></div>${code('mgCode', 'Copy CSS')}</div></div>`,
  js: () => {
    let pos = [];
    const shuffle = () => { pos = [1, 2, 3, 4].map(() => [Math.round(Math.random() * 100), Math.round(Math.random() * 100)]); };
    const cols = () => [1, 2, 3, 4].map(i => el('mg' + i).value);
    function css() { const s = el('mgS').value; return { bg: el('mg0').value, img: cols().map((c, i) => `radial-gradient(at ${pos[i][0]}% ${pos[i][1]}%, ${c} 0px, transparent ${s}%)`).join(',\n    ') }; }
    function upd() { const c = css(); el('mgPrev').style.backgroundColor = c.bg; el('mgPrev').style.backgroundImage = c.img; el('mgCode').textContent = `background-color: ${c.bg};\nbackground-image:\n    ${c.img};`; }
    el('mgP').addEventListener('input', upd); el('mgGo').onclick = () => { shuffle(); upd(); };
    el('mgRc').onclick = () => { const h = Math.random() * 360; setColor(el('mg0'), hslHex(h, 40, 95)); [1, 2, 3, 4].forEach(i => setColor(el('mg' + i), hslHex(h + i * (25 + Math.random() * 40), 55 + Math.random() * 30, 60 + Math.random() * 20))); upd(); };
    el('mgDl').onclick = async () => {
      const [w, h] = el('mgRes').value.split('x').map(Number), cv = makeCanvas(w, h), x = cv.getContext('2d'), s = el('mgS').value / 100;
      x.fillStyle = el('mg0').value; x.fillRect(0, 0, w, h);
      cols().forEach((c, i) => { const px = pos[i][0] / 100 * w, py = pos[i][1] / 100 * h, rx = Math.SQRT2 * Math.max(px, w - px), ry = Math.SQRT2 * Math.max(py, h - py), p = parseColor(c); x.save(); x.translate(px, py); x.scale(rx, ry); const g = x.createRadialGradient(0, 0, 0, 0, 0, s); g.addColorStop(0, c); g.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`); x.fillStyle = g; x.fillRect(-px / rx, -py / ry, w / rx, h / ry); x.restore(); });
      downloadBlob(await toBlob(cv, 'image/png'), `mesh-gradient-${w}x${h}.png`);
    };
    shuffle(); upd();
  },
  how: ['Choose a base color and four accent colors, or click “Random colors”.', 'Shuffle the positions until the blend looks right.', 'Adjust the spread to make color areas larger or smaller.', 'Copy the CSS or download a PNG in the size you need.'],
  about: `<p>True mesh gradients (like those in Illustrator) interpolate colors across a grid of points. CSS has no mesh gradient function, but stacking several radial gradients that fade to transparent over a base color produces a very similar soft, “aurora” look with no images at all.</p><p>The CSS version weighs a few hundred bytes and scales to any screen. The PNG export renders the same gradients on a canvas, which is useful for slides, social posts or desktop wallpapers.</p>`,
  tips: ['Keep accent colors close in lightness for a calm blend; mix light and dark for drama.', 'Use a near-white base with pastel accents behind dark text to keep contrast high.', 'Large gradients can band on some screens; adding a subtle noise texture on top hides banding.', 'Put text on the calmest part of the gradient, or add a semi-transparent panel behind it.', 'Reuse brand colors from your palette so the background feels on-brand rather than random.'],
  faq: [['Does CSS support mesh gradients?', 'Not directly. Layering several radial-gradient() backgrounds that fade to transparent creates a very similar effect, which is what this tool outputs.'], ['Is the CSS version heavy for performance?', 'No. It is a few hundred bytes of CSS and renders on the GPU in all modern browsers.']],
},
{
  slug: 'css-button-generator', cat: 'css', name: 'CSS Button Generator',
  title: 'CSS Button Generator – Design Buttons With Hover States & Copy Code',
  desc: 'Design custom CSS buttons visually: colors, padding, border radius, border, font and shadow plus an automatic hover state. Live preview and clean copy-paste CSS and HTML.',
  kw: ['css button generator', 'button css', 'button hover effect', 'custom button maker', 'html button style'],
  short: 'Style buttons visually, including hover state, and copy the CSS.',
  intro: 'Create a polished button in under a minute. Adjust colors, size, corners and shadow; the hover state is generated automatically.',
  html: `<div class="tool-layout"><div class="panel" id="bgP">${txt('bgT', 'Button text', 'Get started')}
<div class="grid2">${color('bgBg', 'Background', '#141414')}${color('bgFg', 'Text color', '#ffffff')}</div>
<div class="grid2">${range('bgPx', 'Padding X', 4, 48, 22, 1, 'px')}${range('bgPy', 'Padding Y', 2, 28, 12, 1, 'px')}</div>
<div class="grid2">${range('bgR', 'Radius', 0, 40, 10, 1, 'px')}${range('bgFs', 'Font size', 11, 28, 16, 1, 'px')}</div>
<div class="grid2">${sel('bgW', 'Font weight', [[400, 'Regular'], [500, 'Medium'], [600, 'Semibold'], [700, 'Bold']], 600)}${range('bgBw', 'Border', 0, 6, 0, 1, 'px')}</div>
${color('bgBc', 'Border color', '#141414')}${sel('bgH', 'Hover effect', [['darken', 'Darken'], ['lift', 'Lift with shadow'], ['outline', 'Invert to outline'], ['none', 'None']], 'darken')}${chk('bgSh', 'Drop shadow')}
</div><div class="panel"><div class="preview" style="min-height:220px"><style id="bgStyle"></style><button type="button" class="tfd-btn" id="bgEl">Get started</button></div>${code('bgCode', 'Copy CSS')}</div></div>`,
  js: () => {
    const mixHex = (a, b, p) => { const x = parseColor(a), y = parseColor(b); return rgbToHex(x.r + (y.r - x.r) * p, x.g + (y.g - x.g) * p, x.b + (y.b - x.b) * p); };
    function upd() {
      const v = id => el(id).value, bg = v('bgBg'), fg = v('bgFg'), bw = +v('bgBw'), lum = luminance(parseColor(bg)), hov = mixHex(bg, lum > .4 ? '#000' : '#fff', .14);
      const base = `.tfd-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: ${v('bgPy')}px ${v('bgPx')}px;\n  font: ${v('bgW')} ${v('bgFs')}px/1.2 system-ui, -apple-system, "Segoe UI", sans-serif;\n  color: ${fg};\n  background: ${bg};\n  border: ${bw ? `${bw}px solid ${v('bgBc')}` : 'none'};\n  border-radius: ${v('bgR')}px;\n  cursor: pointer;\n  text-decoration: none;\n  transition: background-color .15s, color .15s, transform .15s, box-shadow .15s;${el('bgSh').checked ? `\n  box-shadow: 0 2px 6px ${rgba(bg, .25)};` : ''}\n}`;
      const H = { darken: `background: ${hov};`, lift: `transform: translateY(-2px);\n  box-shadow: 0 8px 18px ${rgba(bg, .3)};`, outline: `background: transparent;\n  color: ${bg};\n  box-shadow: inset 0 0 0 2px ${bg};`, none: '' }[v('bgH')];
      const css = base + (H ? `\n.tfd-btn:hover {\n  ${H}\n}` : '') + `\n.tfd-btn:focus-visible {\n  outline: 2px solid ${bg};\n  outline-offset: 2px;\n}`;
      el('bgStyle').textContent = css; el('bgEl').textContent = v('bgT') || 'Button'; el('bgCode').textContent = css + `\n\n<!-- HTML -->\n<a class="tfd-btn" href="#">${(v('bgT') || 'Button').replace(/</g, '&lt;')}</a>`;
    }
    el('bgP').addEventListener('input', upd); el('bgP').addEventListener('change', upd); upd();
  },
  how: ['Type your button label.', 'Set background and text colors, padding, radius and font.', 'Choose a hover effect and optional border or shadow.', 'Hover over the preview to test it, then copy the CSS and HTML.'],
  about: `<p>A good button has enough padding to be an easy target, clear contrast between text and background, a visible hover state and a visible keyboard focus state. The generated CSS includes all of these, plus a short transition so state changes don’t feel abrupt.</p><p>The same class works on <code>&lt;button&gt;</code> and <code>&lt;a&gt;</code> elements. Use a button for actions (submit, open) and a link for navigation.</p>`,
  tips: ['Aim for a minimum target size of 24×24px (WCAG 2.2 AA) and ideally 44×44px for touch screens.', 'Check the label against the background with the contrast checker; 4.5:1 is the safe target for normal-size text.', 'Keep the focus-visible outline: removing it makes your site hard to use with a keyboard.', 'Use one primary button style per screen and a quieter secondary style for other actions.', 'Write labels as verbs that describe the result, like “Download invoice”, not “Click here”.'],
  faq: [['Should I use <button> or <a> for buttons?', 'Use <button> for actions on the page and <a> for links that navigate to another URL. The CSS works on both.'], ['How big should a button be?', 'At least 24×24px to meet WCAG 2.2 AA, and around 44×44px is recommended for touch devices.']],
},
{
  slug: 'css-loader-generator', cat: 'css', name: 'CSS Loader & Spinner Generator',
  title: 'CSS Loader Generator – Pure CSS Spinners & Loading Animations',
  desc: 'Generate lightweight pure CSS loading spinners: ring, dots, bars and pulse. Set color, size and speed, preview live and copy the HTML and CSS — no images or JavaScript needed.',
  kw: ['css loader generator', 'css spinner', 'loading animation css', 'pure css loader', 'loading spinner html'],
  short: 'Create pure CSS loading spinners with custom color, size and speed.',
  intro: 'Pick a loader style, match it to your brand color and copy a tiny snippet of HTML and CSS. No GIFs, no libraries.',
  html: `<div class="tool-layout"><div class="panel" id="ldP">${sel('ldT', 'Style', [['ring', 'Spinning ring'], ['dots', 'Bouncing dots'], ['bars', 'Equalizer bars'], ['pulse', 'Pulse'], ['dual', 'Dual ring']], 'ring')}
${color('ldC', 'Color', '#141414')}${range('ldS', 'Size', 16, 96, 48, 1, 'px')}${range('ldD', 'Speed (duration)', .3, 3, 1, .1, 's')}</div>
<div class="panel"><div class="preview" style="min-height:220px"><style id="ldStyle"></style><div id="ldEl"></div></div>${code('ldCode', 'Copy code')}</div></div>`,
  js: () => {
    function upd() {
      const t = el('ldT').value, c = el('ldC').value, s = +el('ldS').value, d = el('ldD').value + 's', bw = Math.max(2, Math.round(s / 8)); let css, html = '<div class="tfd-loader"></div>';
      if (t === 'ring') css = `.tfd-loader {\n  width: ${s}px;\n  height: ${s}px;\n  border: ${bw}px solid ${rgba(c, .2)};\n  border-top-color: ${c};\n  border-radius: 50%;\n  animation: tfd-spin ${d} linear infinite;\n}\n@keyframes tfd-spin { to { transform: rotate(360deg); } }`;
      if (t === 'dual') css = `.tfd-loader {\n  width: ${s}px;\n  height: ${s}px;\n  border: ${bw}px solid transparent;\n  border-top-color: ${c};\n  border-bottom-color: ${c};\n  border-radius: 50%;\n  animation: tfd-spin ${d} ease-in-out infinite;\n}\n@keyframes tfd-spin { to { transform: rotate(360deg); } }`;
      if (t === 'pulse') css = `.tfd-loader {\n  width: ${s}px;\n  height: ${s}px;\n  border-radius: 50%;\n  background: ${c};\n  animation: tfd-pulse ${d} ease-out infinite;\n}\n@keyframes tfd-pulse {\n  0% { transform: scale(.2); opacity: 1; }\n  100% { transform: scale(1); opacity: 0; }\n}`;
      if (t === 'dots') { const ds = Math.round(s / 4); html = '<div class="tfd-loader"><span></span><span></span><span></span></div>'; css = `.tfd-loader {\n  display: inline-flex;\n  gap: ${Math.round(ds / 2)}px;\n}\n.tfd-loader span {\n  width: ${ds}px;\n  height: ${ds}px;\n  border-radius: 50%;\n  background: ${c};\n  animation: tfd-bounce ${d} ease-in-out infinite;\n}\n.tfd-loader span:nth-child(2) { animation-delay: .15s; }\n.tfd-loader span:nth-child(3) { animation-delay: .3s; }\n@keyframes tfd-bounce {\n  0%, 80%, 100% { transform: scale(.4); opacity: .5; }\n  40% { transform: scale(1); opacity: 1; }\n}`; }
      if (t === 'bars') { const w = Math.max(3, Math.round(s / 7)); html = '<div class="tfd-loader"><span></span><span></span><span></span><span></span></div>'; css = `.tfd-loader {\n  display: inline-flex;\n  align-items: center;\n  gap: ${Math.round(w * .6)}px;\n  height: ${s}px;\n}\n.tfd-loader span {\n  width: ${w}px;\n  height: 100%;\n  border-radius: ${Math.round(w / 2)}px;\n  background: ${c};\n  animation: tfd-bars ${d} ease-in-out infinite;\n}\n.tfd-loader span:nth-child(2) { animation-delay: .1s; }\n.tfd-loader span:nth-child(3) { animation-delay: .2s; }\n.tfd-loader span:nth-child(4) { animation-delay: .3s; }\n@keyframes tfd-bars {\n  0%, 100% { transform: scaleY(.35); }\n  50% { transform: scaleY(1); }\n}`; }
      css += `\n@media (prefers-reduced-motion: reduce) {\n  .tfd-loader, .tfd-loader span { animation-duration: ${(parseFloat(d) * 3).toFixed(1)}s; }\n}`;
      el('ldStyle').textContent = css; el('ldEl').innerHTML = html.replace('class="tfd-loader"', 'class="tfd-loader" role="status" aria-label="Loading"');
      el('ldCode').textContent = `<!-- HTML -->\n${html.replace('class="tfd-loader"', 'class="tfd-loader" role="status" aria-label="Loading"')}\n\n/* CSS */\n${css}`;
    }
    el('ldP').addEventListener('input', upd); el('ldP').addEventListener('change', upd); upd();
  },
  how: ['Choose a loader style.', 'Set its color, size and animation speed.', 'Watch the live preview.', 'Copy the HTML and CSS into your project.'],
  about: `<p>CSS loaders animate only <code>transform</code> and <code>opacity</code>, the two properties browsers can animate on the compositor without re-layout, so they stay smooth even while the main thread is busy loading data. They also weigh a fraction of an animated GIF and stay sharp at any size.</p><p>The snippet includes <code>role="status"</code> and an <code>aria-label</code> so screen readers announce the loading state, plus a reduced-motion rule that slows the animation for users who request less motion.</p>`,
  tips: ['Only show a spinner if loading takes longer than about 300ms; flashing loaders feel slower than no loader.', 'For waits over a few seconds, prefer a progress bar or skeleton screen that shows real progress.', 'Match the loader color to your accent color, but keep enough contrast against the background.', 'Center the loader in the area that is loading, not the whole page, so users know what is pending.', 'Keep the aria-label meaningful, e.g. “Loading search results”.'],
  faq: [['Are CSS loaders better than GIFs?', 'Usually yes: they are smaller, sharp at any size, easy to recolor and animate smoothly on the GPU.'], ['Do CSS spinners work in all browsers?', 'Yes, CSS animations and transforms are supported in every modern browser.']],
},
{
  slug: 'clip-path-generator', cat: 'css', name: 'CSS Clip-Path Generator',
  title: 'CSS Clip-Path Generator – Polygon Shapes, Hexagons, Stars & Arrows',
  desc: 'Create CSS clip-path polygon shapes visually. Start from triangles, hexagons, stars, arrows and chevrons, drag points to edit, and copy the clip-path CSS code instantly.',
  kw: ['clip path generator', 'css clip-path', 'polygon css', 'css shapes', 'hexagon css'],
  short: 'Draw clip-path polygons by dragging points and copy the CSS.',
  intro: 'Cut images and elements into custom shapes. Choose a preset, drag the points to fine-tune it and copy the clip-path value.',
  html: `<div class="tool-layout"><div class="panel">${sel('cpS', 'Preset shape', [['triangle', 'Triangle'], ['trapezoid', 'Trapezoid'], ['parallelogram', 'Parallelogram'], ['rhombus', 'Rhombus'], ['pentagon', 'Pentagon'], ['hexagon', 'Hexagon'], ['octagon', 'Octagon'], ['star', 'Star'], ['arrow', 'Arrow'], ['chevron', 'Chevron'], ['message', 'Speech bubble'], ['cross', 'Cross'], ['slant', 'Slanted section']], 'hexagon')}
${chk('cpImg', 'Preview on a photo-like gradient', true)}<p class="note">Drag the round handles on the preview to move points.</p></div>
<div class="panel"><div class="preview" style="min-height:380px"><div id="cpWrap" style="position:relative;width:min(320px,80vw);aspect-ratio:1;touch-action:none"><div id="cpEl" style="position:absolute;inset:0"></div><div id="cpH" style="position:absolute;inset:0"></div></div></div>${code('cpCode', 'Copy CSS')}</div></div>`,
  js: () => {
    const P = { triangle: '50 0,100 100,0 100', trapezoid: '20 0,80 0,100 100,0 100', parallelogram: '25 0,100 0,75 100,0 100', rhombus: '50 0,100 50,50 100,0 50', pentagon: '50 0,100 38,82 100,18 100,0 38', hexagon: '25 0,75 0,100 50,75 100,25 100,0 50', octagon: '30 0,70 0,100 30,100 70,70 100,30 100,0 70,0 30', star: '50 0,61 35,98 35,68 57,79 91,50 70,21 91,32 57,2 35,39 35', arrow: '0 20,60 20,60 0,100 50,60 100,60 80,0 80', chevron: '75 0,100 50,75 100,0 100,25 50,0 0', message: '0 0,100 0,100 75,75 75,75 100,50 75,0 75', cross: '35 0,65 0,65 35,100 35,100 65,65 65,65 100,35 100,35 65,0 65,0 35,35 35', slant: '0 0,100 0,100 85,0 100' };
    let pts = [];
    const load = () => { pts = P[el('cpS').value].split(',').map(p => p.split(' ').map(Number)); draw(); };
    function draw() {
      const cp = `polygon(${pts.map(p => `${p[0]}% ${p[1]}%`).join(', ')})`, e = el('cpEl');
      e.style.clipPath = cp; e.style.background = el('cpImg').checked ? 'linear-gradient(135deg,#e0a96d,#8a6d3b 50%,#141414)' : 'var(--ink)';
      el('cpH').innerHTML = pts.map((p, i) => `<i data-i="${i}" style="position:absolute;left:${p[0]}%;top:${p[1]}%;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#fff;border:2px solid var(--ink);cursor:grab"></i>`).join('');
      el('cpCode').textContent = `clip-path: ${cp};`;
    }
    let drag = -1;
    el('cpH').addEventListener('pointerdown', e => { if (e.target.dataset.i == null) return; drag = +e.target.dataset.i; el('cpH').setPointerCapture(e.pointerId); });
    el('cpH').addEventListener('pointermove', e => { if (drag < 0) return; const r = el('cpWrap').getBoundingClientRect(); pts[drag] = [Math.round(clamp((e.clientX - r.left) / r.width * 100, 0, 100)), Math.round(clamp((e.clientY - r.top) / r.height * 100, 0, 100))]; draw(); });
    el('cpH').addEventListener('pointerup', () => drag = -1);
    el('cpS').addEventListener('change', load); el('cpImg').addEventListener('change', draw); load();
  },
  how: ['Pick a preset shape.', 'Drag any handle on the preview to reshape the polygon.', 'Toggle the gradient preview to see how it clips imagery.', 'Copy the clip-path CSS and apply it to an image or element.'],
  about: `<p><code>clip-path: polygon()</code> hides everything outside a shape defined by percentage coordinates, measured from the top-left corner of the element. Because the points are percentages, the shape scales with the element. Unlike rotated borders or masks, clip-path doesn’t change layout, and it can be animated between polygons that have the same number of points.</p>`,
  tips: ['Box shadows and outlines are clipped too; use filter: drop-shadow() on a parent wrapper if you need a shadow.', 'Clipped areas don’t receive clicks, which is useful for irregular buttons.', 'To animate between two shapes, both polygons must have the same number of points.', 'The “slanted section” preset is a neat way to angle the bottom edge of a hero section.', 'Keep important image content in the middle so the shape doesn’t crop faces or text.'],
  faq: [['Is clip-path supported in all browsers?', 'Yes, clip-path with basic shapes like polygon() works in all modern browsers without prefixes.'], ['Can I add a border to a clip-path shape?', 'Not directly. A common trick is to clip a slightly larger parent element in the border color and an inner element in the fill color.']],
},
{
  slug: 'css-pattern-generator', cat: 'css', name: 'CSS Background Pattern Generator',
  title: 'CSS Pattern Generator – Stripes, Polka Dots, Grid & Checkerboard',
  desc: 'Generate seamless CSS background patterns with no images: diagonal stripes, polka dots, grid lines, checkerboard and cross-hatch. Set colors, size and thickness and copy the CSS.',
  kw: ['css pattern generator', 'css background pattern', 'stripes css', 'polka dot css', 'checkerboard css'],
  short: 'Make stripes, dots, grids and checks with pure CSS gradients.',
  intro: 'Create lightweight repeating backgrounds using only CSS gradients. Perfect for section backgrounds, placeholders and decorative panels.',
  html: `<div class="tool-layout"><div class="panel" id="ptP">${sel('ptT', 'Pattern', [['diag', 'Diagonal stripes'], ['hor', 'Horizontal stripes'], ['ver', 'Vertical stripes'], ['dots', 'Polka dots'], ['grid', 'Grid lines'], ['check', 'Checkerboard'], ['hatch', 'Cross-hatch']], 'diag')}
<div class="grid2">${color('ptBg', 'Background', '#faf7f2')}${color('ptFg', 'Pattern color', '#e8dcc4')}</div>${range('ptS', 'Size', 6, 80, 24, 1, 'px')}${range('ptW', 'Thickness', 1, 30, 6, 1, 'px')}</div>
<div class="panel"><div class="preview" id="ptPrev" style="min-height:340px"></div>${code('ptCode', 'Copy CSS')}</div></div>`,
  js: () => {
    function upd() {
      const t = el('ptT').value, a = el('ptBg').value, b = el('ptFg').value, s = +el('ptS').value, w = Math.min(+el('ptW').value, s); let c;
      if (t === 'diag') c = `background: repeating-linear-gradient(45deg, ${b} 0 ${w}px, ${a} ${w}px ${s}px);`;
      if (t === 'hor') c = `background: repeating-linear-gradient(0deg, ${b} 0 ${w}px, ${a} ${w}px ${s}px);`;
      if (t === 'ver') c = `background: repeating-linear-gradient(90deg, ${b} 0 ${w}px, ${a} ${w}px ${s}px);`;
      if (t === 'dots') c = `background-color: ${a};\nbackground-image: radial-gradient(circle, ${b} ${Math.min(w, s / 2)}px, transparent ${Math.min(w, s / 2) + .5}px);\nbackground-size: ${s}px ${s}px;`;
      if (t === 'grid') c = `background-color: ${a};\nbackground-image:\n  linear-gradient(${b} ${Math.min(w, 4)}px, transparent ${Math.min(w, 4)}px),\n  linear-gradient(90deg, ${b} ${Math.min(w, 4)}px, transparent ${Math.min(w, 4)}px);\nbackground-size: ${s}px ${s}px;`;
      if (t === 'check') c = `background-color: ${a};\nbackground-image: conic-gradient(${b} 25%, transparent 0 50%, ${b} 0 75%, transparent 0);\nbackground-size: ${s}px ${s}px;`;
      if (t === 'hatch') c = `background-color: ${a};\nbackground-image:\n  repeating-linear-gradient(45deg, ${b} 0 ${Math.min(w, 3)}px, transparent ${Math.min(w, 3)}px ${s}px),\n  repeating-linear-gradient(-45deg, ${b} 0 ${Math.min(w, 3)}px, transparent ${Math.min(w, 3)}px ${s}px);`;
      el('ptPrev').setAttribute('style', 'min-height:340px;' + c.replace(/\n\s*/g, ' ')); el('ptCode').textContent = c;
    }
    el('ptP').addEventListener('input', upd); el('ptP').addEventListener('change', upd); upd();
  },
  how: ['Choose a pattern type.', 'Set the background and pattern colors.', 'Adjust the tile size and line or dot thickness.', 'Copy the CSS and paste it into any element.'],
  about: `<p>CSS gradients can draw hard-edged shapes when two color stops share the same position. Repeating them, or setting a small <code>background-size</code>, tiles the shape across the element. The result is a resolution-independent pattern with zero HTTP requests and only a line or two of CSS.</p><p>The checkerboard uses <code>conic-gradient()</code>, which divides a tile into four quarters with one function.</p>`,
  tips: ['Keep pattern contrast low (two close colors) behind text so it stays readable.', 'Use whole-pixel sizes to avoid blurry, uneven stripes on standard-density screens.', 'Diagonal stripes in yellow and dark grey are a widely recognised “under construction” or warning style.', 'Grid patterns make good backgrounds for design tool canvases and product mockups.', 'Combine a pattern with a gradient overlay by listing the gradient first in background-image.'],
  faq: [['Are CSS patterns better than image patterns?', 'For simple geometric patterns, yes: they are tiny, crisp at any zoom level and easy to recolor.'], ['Why do my stripes look uneven?', 'Diagonal stripes can show slight anti-aliasing differences. Try sizes that are multiples of 2 or 4 pixels.']],
},
{
  slug: 'neumorphism-generator', cat: 'css', name: 'Neumorphism Generator',
  title: 'Neumorphism CSS Generator – Soft UI Shadows (Flat, Pressed, Convex)',
  desc: 'Generate neumorphic soft UI CSS with paired light and dark shadows. Choose flat, pressed, concave or convex styles, set size, distance, blur and intensity, and copy the code.',
  kw: ['neumorphism generator', 'soft ui css', 'neumorphic design', 'neumorphism css', 'soft shadow css'],
  short: 'Create soft UI (neumorphic) elements with paired shadows.',
  intro: 'Neumorphism makes elements look extruded from or pressed into the background. Tune the light and shadow and copy the CSS.',
  html: `<div class="tool-layout"><div class="panel" id="nmP">${color('nmC', 'Base color', '#e8e2d8')}${sel('nmS', 'Shape', [['flat', 'Flat'], ['concave', 'Concave'], ['convex', 'Convex'], ['pressed', 'Pressed (inset)']], 'flat')}
${range('nmSz', 'Size', 60, 300, 180, 1, 'px')}${range('nmR', 'Radius', 0, 150, 40, 1, 'px')}${range('nmD', 'Distance', 2, 40, 16, 1, 'px')}${range('nmI', 'Intensity', 5, 40, 15, 1, '%')}${range('nmB', 'Blur', 0, 80, 32, 1, 'px')}</div>
<div class="panel"><div class="preview" id="nmPrev" style="min-height:380px"><div id="nmEl"></div></div>${code('nmCode', 'Copy CSS')}</div></div>`,
  js: () => {
    const mix = (a, b, p) => { const x = parseColor(a), y = parseColor(b); return rgbToHex(x.r + (y.r - x.r) * p, x.g + (y.g - x.g) * p, x.b + (y.b - x.b) * p); };
    function upd() {
      const c = el('nmC').value, s = el('nmS').value, d = +el('nmD').value, i = el('nmI').value / 100, b = el('nmB').value, lt = mix(c, '#fff', i * 3 > 1 ? 1 : i * 3), dk = mix(c, '#000', i);
      const bg = s === 'concave' ? `linear-gradient(145deg, ${mix(c, '#000', i / 2)}, ${mix(c, '#fff', i)})` : s === 'convex' ? `linear-gradient(145deg, ${mix(c, '#fff', i)}, ${mix(c, '#000', i / 2)})` : c;
      const sh = s === 'pressed' ? `inset ${d}px ${d}px ${b}px ${dk},\n              inset -${d}px -${d}px ${b}px ${lt}` : `${d}px ${d}px ${b}px ${dk},\n              -${d}px -${d}px ${b}px ${lt}`;
      const css = `border-radius: ${el('nmR').value}px;\nbackground: ${bg};\nbox-shadow: ${sh};`;
      el('nmPrev').style.background = c; const e = el('nmEl'); e.setAttribute('style', `width:${el('nmSz').value}px;height:${el('nmSz').value}px;` + css.replace(/\n\s*/g, ' ')); el('nmCode').textContent = css;
    }
    el('nmP').addEventListener('input', upd); el('nmP').addEventListener('change', upd); upd();
  },
  how: ['Pick a base color; the page background uses the same color.', 'Choose flat, concave, convex or pressed.', 'Adjust distance, blur and intensity of the shadows.', 'Copy the CSS.'],
  about: `<p>Neumorphism (“new skeuomorphism”) became popular around 2020. Each element uses the same color as its background and two shadows: a dark one offset away from an imagined light source in the top-left and a light one offset toward it. The pressed variant uses inset shadows to look pushed in.</p><p>The style has a well-known weakness: low contrast. Elements are separated from the background only by soft shadows, which many users with low vision can’t see.</p>`,
  tips: ['Use neumorphism for decorative surfaces and large controls, not for small text buttons.', 'Add a visible label, icon or border to interactive elements so they don’t rely on shadows alone.', 'Mid-tone backgrounds work best: on pure white the light shadow disappears.', 'Use the pressed style for the active state of toggles and segmented controls.', 'Keep intensity moderate (10–20%) for a subtle, premium look.'],
  faq: [['Is neumorphism accessible?', 'Not by default. Soft shadows give low contrast, so add clear labels, borders or color changes for interactive states.'], ['What background works best for neumorphism?', 'A light-to-mid tone that is neither pure white nor black, so both the light and the dark shadow are visible.']],
},
{
  slug: 'css-transform-generator', cat: 'css', name: 'CSS Transform Generator',
  title: 'CSS Transform Generator – Rotate, Scale, Skew, Translate & 3D',
  desc: 'Build CSS transforms visually: rotate, scale, skew and translate plus 3D rotateX/rotateY with perspective. Change transform-origin, preview live and copy the transform CSS.',
  kw: ['css transform generator', 'css rotate', 'css scale', 'skew css', 'css 3d transform', 'transform-origin'],
  short: 'Combine rotate, scale, skew, translate and 3D transforms visually.',
  intro: 'Experiment with every 2D and 3D transform function and see exactly how they combine. The dashed outline shows the original position.',
  html: `<div class="tool-layout"><div class="panel" id="trP"><div class="grid2">${range('trR', 'Rotate', -180, 180, 0, 1, '°')}${range('trS', 'Scale', .2, 2, 1, .05)}</div>
<div class="grid2">${range('trSx', 'Skew X', -60, 60, 0, 1, '°')}${range('trSy', 'Skew Y', -60, 60, 0, 1, '°')}</div><div class="grid2">${range('trX', 'Translate X', -100, 100, 0, 1, 'px')}${range('trY', 'Translate Y', -100, 100, 0, 1, 'px')}</div>
<div class="grid2">${range('trRx', 'Rotate X (3D)', -80, 80, 0, 1, '°')}${range('trRy', 'Rotate Y (3D)', -80, 80, 0, 1, '°')}</div>${range('trP3', 'Perspective', 200, 2000, 800, 50, 'px')}
${sel('trO', 'transform-origin', ['center', 'top left', 'top', 'top right', 'left', 'right', 'bottom left', 'bottom', 'bottom right'], 'center')}<button type="button" class="btn-sm" id="trReset">Reset</button></div>
<div class="panel"><div class="preview" id="trPrev" style="min-height:380px"><div style="position:relative;width:160px;height:160px"><div style="position:absolute;inset:0;border:2px dashed var(--beige-2);border-radius:12px"></div><div id="trEl" style="position:absolute;inset:0;border-radius:12px;background:var(--ink);color:var(--beige);display:grid;place-items:center;font-weight:800;font-size:28px">Aa</div></div></div>${code('trCode', 'Copy CSS')}</div></div>`,
  js: () => {
    const D = { trR: 0, trS: 1, trSx: 0, trSy: 0, trX: 0, trY: 0, trRx: 0, trRy: 0, trP3: 800 };
    function upd() {
      const v = id => +el(id).value, f = []; if (v('trX') || v('trY')) f.push(`translate(${v('trX')}px, ${v('trY')}px)`); if (v('trRx')) f.push(`rotateX(${v('trRx')}deg)`); if (v('trRy')) f.push(`rotateY(${v('trRy')}deg)`); if (v('trR')) f.push(`rotate(${v('trR')}deg)`); if (v('trS') !== 1) f.push(`scale(${v('trS')})`); if (v('trSx') || v('trSy')) f.push(`skew(${v('trSx')}deg, ${v('trSy')}deg)`);
      const has3d = v('trRx') || v('trRy'), t = (has3d ? `perspective(${v('trP3')}px) ` : '') + (f.join(' ') || 'none');
      el('trEl').style.transform = t; el('trEl').style.transformOrigin = el('trO').value; el('trCode').textContent = `transform: ${t};${el('trO').value !== 'center' ? `\ntransform-origin: ${el('trO').value};` : ''}`;
    }
    el('trP').addEventListener('input', upd); el('trP').addEventListener('change', upd);
    el('trReset').onclick = () => { Object.entries(D).forEach(([k, v]) => { el(k).value = v; syncOut(el(k)); }); el('trO').value = 'center'; upd(); }; upd();
  },
  how: ['Drag the sliders to rotate, scale, skew or move the element.', 'Add 3D rotation and adjust perspective for depth.', 'Change transform-origin to pivot around a corner or edge.', 'Copy the transform CSS.'],
  about: `<p>CSS transforms are applied right to left in the order you write them, so <code>translate() rotate()</code> and <code>rotate() translate()</code> give different results. This generator uses a fixed, predictable order: translate, 3D rotation, rotate, scale, then skew.</p><p>Transforms don’t affect layout: surrounding elements stay where they are. That’s why transforms (with opacity) are the properties to animate for smooth, 60fps motion.</p>`,
  tips: ['Use transforms instead of top/left for animations; they skip layout and paint and run on the compositor.', 'perspective() inside transform affects only that element; the perspective property on a parent affects all children.', 'Small scale changes (1.02–1.05) work well as hover effects for cards.', 'Skew distorts text; keep it for decorative shapes or backgrounds.', 'Modern CSS also has individual rotate, scale and translate properties that can be animated separately.'],
  faq: [['Does the order of CSS transforms matter?', 'Yes. Transforms are applied in sequence, so changing the order changes the result.'], ['What does transform-origin do?', 'It sets the pivot point for rotation, scaling and skewing. The default is the center of the element.']],
},
{
  slug: 'gradient-text-generator', cat: 'css', name: 'Gradient Text Generator',
  title: 'CSS Gradient Text Generator – Colorful Gradient Headings',
  desc: 'Create eye-catching gradient text with CSS background-clip. Choose two or three colors, angle, font size and weight, preview live and copy cross-browser gradient text CSS.',
  kw: ['gradient text css', 'gradient text generator', 'background-clip text', 'colorful heading css', 'text gradient'],
  short: 'Fill headings with gradients using background-clip: text.',
  intro: 'Make headlines stand out with a gradient fill. The generated CSS includes a solid color fallback for older browsers.',
  html: `<div class="tool-layout"><div class="panel" id="gtP">${txt('gtT', 'Text', 'Design faster')}<div class="grid3">${color('gt1', 'Color 1', '#8a6d3b')}${color('gt2', 'Color 2', '#e0a96d')}${color('gt3', 'Color 3', '#141414')}</div>
${chk('gt3on', 'Use third color', true)}${range('gtA', 'Angle', 0, 360, 90, 1, '°')}${range('gtS', 'Font size', 24, 120, 72, 1, 'px')}${sel('gtW', 'Weight', [[400, 'Regular'], [700, 'Bold'], [900, 'Black']], 900)}</div>
<div class="panel"><div class="preview" style="min-height:260px"><div id="gtEl" style="text-align:center;line-height:1.1;word-break:break-word"></div></div>${code('gtCode', 'Copy CSS')}</div></div>`,
  js: () => {
    function upd() {
      const cs = [el('gt1').value, el('gt2').value].concat(el('gt3on').checked ? [el('gt3').value] : []), g = `linear-gradient(${el('gtA').value}deg, ${cs.join(', ')})`;
      const css = `color: ${cs[0]}; /* fallback */\nbackground: ${g};\n-webkit-background-clip: text;\nbackground-clip: text;\n-webkit-text-fill-color: transparent;\nfont-size: ${el('gtS').value}px;\nfont-weight: ${el('gtW').value};`;
      const e = el('gtEl'); e.textContent = el('gtT').value || ' '; e.setAttribute('style', 'text-align:center;line-height:1.1;word-break:break-word;' + css.replace(/\/\*.*?\*\//, '').replace(/\n/g, ' ')); el('gtCode').textContent = css;
    }
    el('gtP').addEventListener('input', upd); el('gtP').addEventListener('change', upd); upd();
  },
  how: ['Type your heading text.', 'Pick two or three gradient colors and an angle.', 'Set font size and weight.', 'Copy the CSS and apply it to your heading.'],
  about: `<p>Gradient text works by painting a gradient as the element’s background, clipping that background to the shape of the text with <code>background-clip: text</code>, and making the text fill transparent. The <code>-webkit-</code> prefixed properties are still needed for Safari and some Chromium versions, so the generated code includes both.</p>`,
  tips: ['Use heavy weights (700–900) so there’s enough letter area to show the gradient.', 'Check contrast at both ends of the gradient against the background; the lightest color decides readability.', 'Reserve gradient text for one or two headlines per page so it keeps its impact.', 'Screen readers read the text normally, but text selection highlighting may look odd; that’s expected.', 'If the element spans multiple lines, add box-decoration-break: clone to repeat the gradient per line.'],
  faq: [['Why is my gradient text invisible?', 'Usually the browser doesn’t support the unprefixed property. Include -webkit-background-clip: text and -webkit-text-fill-color: transparent, as this generator does.'], ['Is gradient text bad for SEO?', 'No. The text is still real, selectable HTML text that search engines can read.']],
},
{
  slug: 'css-triangle-generator', cat: 'css', name: 'CSS Triangle Generator',
  title: 'CSS Triangle Generator – Arrows & Tooltip Pointers With Borders',
  desc: 'Generate CSS triangles for tooltips, dropdown arrows and speech bubbles. Choose one of eight directions, width, height and color, and copy border-based or clip-path CSS.',
  kw: ['css triangle generator', 'css arrow', 'tooltip arrow css', 'triangle border css', 'css caret'],
  short: 'Make CSS triangles for tooltips, carets and arrows.',
  intro: 'Get a pixel-perfect triangle in any of eight directions. Copy the classic border technique or the modern clip-path version.',
  html: `<div class="tool-layout"><div class="panel" id="tgP"><div class="btn-row" id="tgDir" style="margin-bottom:14px">${[['tl', '↖'], ['t', '↑'], ['tr', '↗'], ['l', '←'], ['r', '→'], ['bl', '↙'], ['b', '↓'], ['br', '↘']].map(([d, a]) => `<button type="button" class="btn-sm" data-d="${d}" style="width:44px;font-size:16px">${a}</button>`).join('')}</div>
<div class="grid2">${range('tgW', 'Width', 4, 200, 60, 1, 'px')}${range('tgH', 'Height', 4, 200, 40, 1, 'px')}</div>${color('tgC', 'Color', '#141414')}</div>
<div class="panel"><div class="preview" style="min-height:280px"><div id="tgEl"></div></div>${code('tgCode', 'Copy border CSS')}${code('tgClip', 'Copy clip-path CSS')}</div></div>`,
  js: () => {
    let d = 't';
    function upd() {
      const w = +el('tgW').value, h = +el('tgH').value, c = el('tgC').value, hw = w / 2, hh = h / 2, T = 'transparent';
      const B = { t: [`border-left: ${hw}px solid ${T};`, `border-right: ${hw}px solid ${T};`, `border-bottom: ${h}px solid ${c};`], b: [`border-left: ${hw}px solid ${T};`, `border-right: ${hw}px solid ${T};`, `border-top: ${h}px solid ${c};`], l: [`border-top: ${hh}px solid ${T};`, `border-bottom: ${hh}px solid ${T};`, `border-right: ${w}px solid ${c};`], r: [`border-top: ${hh}px solid ${T};`, `border-bottom: ${hh}px solid ${T};`, `border-left: ${w}px solid ${c};`], tl: [`border-top: ${h}px solid ${c};`, `border-right: ${w}px solid ${T};`], tr: [`border-top: ${h}px solid ${c};`, `border-left: ${w}px solid ${T};`], bl: [`border-bottom: ${h}px solid ${c};`, `border-right: ${w}px solid ${T};`], br: [`border-bottom: ${h}px solid ${c};`, `border-left: ${w}px solid ${T};`] }[d];
      const css = `width: 0;\nheight: 0;\n${B.join('\n')}`; el('tgEl').setAttribute('style', css.replace(/\n/g, ' ')); el('tgCode').textContent = css;
      const poly = { t: '50% 0, 100% 100%, 0 100%', b: '0 0, 100% 0, 50% 100%', l: '100% 0, 100% 100%, 0 50%', r: '0 0, 100% 50%, 0 100%', tl: '0 0, 100% 0, 0 100%', tr: '0 0, 100% 0, 100% 100%', bl: '0 0, 100% 100%, 0 100%', br: '100% 0, 100% 100%, 0 100%' }[d];
      el('tgClip').textContent = `width: ${w}px;\nheight: ${h}px;\nbackground: ${c};\nclip-path: polygon(${poly});`;
      document.querySelectorAll('#tgDir [data-d]').forEach(b => b.style.borderColor = b.dataset.d === d ? 'var(--ink)' : '');
    }
    el('tgDir').addEventListener('click', e => { if (e.target.dataset.d) { d = e.target.dataset.d; upd(); } }); el('tgP').addEventListener('input', upd); upd();
  },
  how: ['Click an arrow to choose the direction the triangle points.', 'Set width, height and color.', 'Copy the border-based CSS or the clip-path version.', 'Position it with absolute positioning next to your tooltip or menu.'],
  about: `<p>The classic CSS triangle uses a zero-size element with thick borders. Where two borders meet, the browser draws a diagonal join, so making three sides transparent leaves a single colored triangle. It works in every browser ever made.</p><p>The clip-path version is easier to read and supports backgrounds and gradients, but borders and box-shadows get clipped with it.</p>`,
  tips: ['For tooltip arrows, generate the triangle in a ::before or ::after pseudo-element instead of extra HTML.', 'To give an arrow a border, stack two triangles: a slightly larger one in the border color behind the fill.', 'Use the clip-path version if you need a gradient-filled triangle.', 'Keep arrows around 8–12px wide for tooltips; larger looks clumsy.', 'Use aria-hidden or pseudo-elements so decorative triangles aren’t announced by screen readers.'],
  faq: [['How does the CSS border triangle work?', 'Borders meet at diagonal angles. With zero width and height, three transparent borders and one colored border form a triangle.'], ['Which method should I use?', 'Borders for tiny tooltip arrows with maximum compatibility; clip-path when you need gradients or easier sizing.']],
},
{
  slug: 'scrollbar-generator', cat: 'css', name: 'Custom Scrollbar Generator',
  title: 'Custom Scrollbar CSS Generator – Style Scrollbars for Chrome & Firefox',
  desc: 'Style custom scrollbars with CSS for Chrome, Edge, Safari and Firefox. Set width, track and thumb colors, hover color and radius, preview live and copy cross-browser scrollbar CSS.',
  kw: ['custom scrollbar css', 'scrollbar generator', 'webkit scrollbar', 'scrollbar color css', 'style scrollbar'],
  short: 'Design custom scrollbars with cross-browser CSS.',
  intro: 'Match scrollbars to your design. The code handles both the standard properties and the older WebKit pseudo-elements correctly.',
  html: `<div class="tool-layout"><div class="panel" id="sbP">${range('sbW', 'Width', 4, 20, 10, 1, 'px')}<div class="grid2">${color('sbT', 'Track', '#f3ecdf')}${color('sbTh', 'Thumb', '#8a6d3b')}</div>${color('sbH', 'Thumb hover', '#141414')}${range('sbR', 'Thumb radius', 0, 10, 10, 1, 'px')}${range('sbB', 'Thumb padding', 0, 4, 2, 1, 'px')}</div>
<div class="panel"><style id="sbStyle"></style><div id="sbPrev" style="height:300px;overflow:auto;border:1px solid var(--line);border-radius:14px;padding:18px;background:#fff"><div style="height:900px;width:1400px;background:linear-gradient(var(--beige-3),#fff)"><p style="max-width:520px">Scroll this box to test your scrollbar. It scrolls both vertically and horizontally so you can check the thumb, track and corner.</p></div></div>${code('sbCode', 'Copy CSS')}</div></div>`,
  js: () => {
    function css(sel) {
      const w = el('sbW').value, t = el('sbT').value, th = el('sbTh').value, b = el('sbB').value;
      return `/* Firefox and modern Chromium */\n@supports not selector(::-webkit-scrollbar) {\n  ${sel} {\n    scrollbar-width: ${w <= 8 ? 'thin' : 'auto'};\n    scrollbar-color: ${th} ${t};\n  }\n}\n\n/* Chrome, Edge, Safari */\n${sel}::-webkit-scrollbar {\n  width: ${w}px;\n  height: ${w}px;\n}\n${sel}::-webkit-scrollbar-track {\n  background: ${t};\n}\n${sel}::-webkit-scrollbar-thumb {\n  background: ${th};\n  border-radius: ${el('sbR').value}px;\n  border: ${b}px solid ${t};\n}\n${sel}::-webkit-scrollbar-thumb:hover {\n  background: ${el('sbH').value};\n}\n${sel}::-webkit-scrollbar-corner {\n  background: ${t};\n}`;
    }
    function upd() { el('sbStyle').textContent = css('#sbPrev'); el('sbCode').textContent = css('html'); }
    el('sbP').addEventListener('input', upd); upd();
  },
  how: ['Set the scrollbar width.', 'Choose track, thumb and hover colors.', 'Adjust thumb radius and padding.', 'Scroll the preview to test, then copy the CSS (it targets html; change the selector for a specific element).'],
  about: `<p>There are two ways to style scrollbars. The standard properties <code>scrollbar-color</code> and <code>scrollbar-width</code> work in Firefox and in Chrome/Edge 121+. The older <code>::-webkit-scrollbar</code> pseudo-elements give more control (radius, hover, padding) and work in Chrome, Edge and Safari.</p><p>In Chromium, setting the standard properties disables the WebKit pseudo-elements. The generated code therefore wraps the standard properties in <code>@supports not selector(::-webkit-scrollbar)</code>, so Firefox gets the standard version and WebKit/Blink browsers keep the detailed styling.</p>`,
  tips: ['Keep the thumb clearly visible against the track; a 3:1 contrast ratio is a sensible minimum.', 'Don’t make scrollbars thinner than about 8px on desktop; thin bars are hard to grab with a mouse.', 'Style scrollbars on inner scroll areas (sidebars, code blocks) rather than the whole page if you want to stay subtle.', 'Mobile browsers use overlay scrollbars and mostly ignore these styles; that’s normal.', 'Use the “thumb padding” option to create a floating thumb effect with a border in the track color.'],
  faq: [['Can I style scrollbars in Firefox?', 'Partly. Firefox supports scrollbar-color and scrollbar-width, but not radius or hover styles.'], ['Why does my ::-webkit-scrollbar CSS not work in Chrome?', 'Since Chrome 121, setting scrollbar-color or scrollbar-width on the same element disables the ::-webkit-scrollbar styles. Use the @supports pattern in the generated code.']],
},
{
  slug: 'css-minifier', cat: 'css', name: 'CSS Minifier & Beautifier',
  title: 'CSS Minifier & Beautifier – Compress or Format CSS Code Online',
  desc: 'Minify CSS to reduce file size or beautify messy CSS into readable, indented code. See bytes saved, keep strings and license comments safe, and copy or download the result.',
  kw: ['css minifier', 'minify css', 'css beautifier', 'css formatter', 'compress css online'],
  short: 'Minify CSS for production or beautify it for reading.',
  intro: 'Paste your stylesheet to compress it for production or to tidy it into readable, indented code. Everything runs locally.',
  html: `<div class="tool-layout even"><div class="panel"><label class="f"><span>Input CSS</span><textarea id="cmIn" rows="14" spellcheck="false">/* Card component */
.card {
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card h3 , .card p {
  margin : 0 0 8px;
}
@media (max-width: 600px) {
  .card { padding: 16px; }
}</textarea></label>${chk('cmKeep', 'Keep /*! license */ comments', true)}<div class="btn-row"><button type="button" class="btn" id="cmMin">Minify</button><button type="button" class="btn-alt" id="cmBeau">Beautify</button></div></div>
<div class="panel"><label class="f"><span>Output</span><textarea id="cmOut" rows="14" readonly spellcheck="false"></textarea></label><div class="stat-grid"><div class="stat"><span>Before</span><b id="cmA">–</b></div><div class="stat"><span>After</span><b id="cmB">–</b></div><div class="stat"><span>Saved</span><b id="cmS">–</b></div></div>
<div class="btn-row"><button type="button" class="btn-alt" data-copy-from="cmOut">Copy</button><button type="button" class="btn-alt" id="cmDl">Download .css</button></div></div></div>`,
  js: () => {
    function protect(s) { const k = []; s = s.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, m => { k.push(m); return `\u0000${k.length - 1}\u0000`; }); return [s, x => x.replace(/\u0000(\d+)\u0000/g, (_, i) => k[i])]; }
    function minify(src) {
      let [s, back] = protect(src); const lic = [];
      s = s.replace(/\/\*[\s\S]*?\*\//g, m => { if (el('cmKeep').checked && m.startsWith('/*!')) { lic.push(m); return `\u0001${lic.length - 1}\u0001`; } return ''; });
      s = s.replace(/\s+/g, ' ').replace(/\s*([{}:;,>~])\s*/g, '$1').replace(/;}/g, '}').replace(/\s*!important/g, '!important').replace(/(^|[^.\d])0(\.\d)/g, '$1$2').trim();
      s = s.replace(/([:\s(,])(-?)0(px|em|rem|vh|vw)(?=[;,\s)}])/g, '$1$20');
      s = s.replace(/\u0001(\d+)\u0001/g, (_, i) => lic[i] + '\n');
      return back(s);
    }
    function beautify(src) {
      let [s, back] = protect(minify(src)), out = '', ind = 0; const nl = () => '\n' + '  '.repeat(ind);
      for (const c of s) {
        if (c === '{') { ind++; out += ' {' + nl(); }
        else if (c === '}') { ind = Math.max(0, ind - 1); out = out.replace(/\s*$/, ''); if (!/[;{}]$/.test(out)) out += ';'; out += nl() + '}' + (ind ? nl() : '\n\n'); }
        else if (c === ';') out += ';' + nl(); else out += c;
      }
      out = out.split('\n').map(l => /\{\s*$/.test(l) ? l.replace(/,(?=\S)/g, ', ').replace(/\(([\w-]+):/g, '($1: ') : (/^\s*\}?\s*$/.test(l) ? l : l.replace(/^(\s*[^:]+):\s*/, '$1: '))).join('\n');
      return back(out.replace(/\n{3,}/g, '\n\n').trim());
    }
    function show(o) { const a = new Blob([el('cmIn').value]).size, b = new Blob([o]).size; el('cmOut').value = o; el('cmA').textContent = fmtBytes(a); el('cmB').textContent = fmtBytes(b); el('cmS').textContent = a ? Math.round((1 - b / a) * 100) + '%' : '0%'; }
    el('cmMin').onclick = () => show(minify(el('cmIn').value)); el('cmBeau').onclick = () => show(beautify(el('cmIn').value));
    el('cmDl').onclick = () => downloadText(el('cmOut').value, 'styles.css', 'text/css'); show(minify(el('cmIn').value));
  },
  how: ['Paste your CSS into the input box.', 'Click Minify to compress it, or Beautify to format it.', 'Check the bytes saved.', 'Copy the result or download it as a .css file.'],
  about: `<p>Minification removes comments, whitespace and redundant characters such as the final semicolon in a rule and leading zeros (0.5 → .5). It doesn’t change how the CSS works. Typical stylesheets shrink by 15–30% before compression; with gzip or Brotli on top, the transfer size drops much further.</p><p>Strings (like <code>content: "…"</code> and quoted URLs) are protected during processing, and comments starting with <code>/*!</code> are kept because they usually carry license notices. For complex builds, a build tool such as Lightning CSS, cssnano or esbuild can also merge rules and rewrite values.</p>`,
  tips: ['Keep the readable source file in your project and only ship the minified version.', 'Serve CSS with Brotli or gzip compression; it usually saves more than minification alone.', 'Use Beautify to inspect minified CSS from a third-party theme before editing it.', 'Remove unused CSS first; deleting dead rules saves far more than squeezing whitespace.', 'Inline only the critical CSS for above-the-fold content and load the rest normally.'],
  faq: [['Does minifying CSS change how it works?', 'No. It only removes characters the browser doesn’t need, such as comments and whitespace.'], ['How much smaller will my CSS be?', 'Usually 15–30% before gzip or Brotli. Heavily commented files can shrink more.']],
},
];

