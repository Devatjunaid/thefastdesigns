import { range, num, txt, color, sel, chk, drop, code } from '../lib.mjs';

export default [
{
  slug: 'color-converter', cat: 'color', name: 'Color Converter',
  title: 'HEX to RGB Color Converter – HEX, RGB, HSL, CMYK Online',
  desc: 'Free color code converter. Instantly convert HEX to RGB, RGB to HEX, HSL, HSV and CMYK. Paste any CSS color or color name and copy every format in one click.',
  kw: ['hex to rgb', 'rgb to hex', 'color converter', 'hsl to hex', 'cmyk converter', 'color code converter'],
  short: 'Convert any color between HEX, RGB, RGBA, HSL, HSV and CMYK instantly.',
  intro: 'Paste a HEX code, RGB value, HSL value or even a CSS color name and get every other format instantly, ready to copy into your CSS, Figma or print files.',
  html: `<div class="tool-layout"><div class="panel">
${txt('cIn', 'Enter any color (HEX, RGB, HSL or name)', '#C8A97E')}
<label class="f"><span>Or pick a color</span><input type="color" id="cPick" value="#c8a97e" style="width:100%;height:56px"></label>
<p class="note">Examples: <code>#1a73e8</code>, <code>rgb(20 20 20)</code>, <code>hsl(36 40% 64%)</code>, <code>tomato</code></p>
</div><div class="panel"><div class="swatch-lg checker" id="cSw"></div><div id="cOut" class="kv-list"></div></div></div>`,
  js: () => {
    const t = el('cIn'), p = el('cPick'), sw = el('cSw'), out = el('cOut');
    function render(s, fromPick) {
      const c = parseColor(s); if (!c) { t.classList.add('bad'); return; } t.classList.remove('bad');
      const { r, g, b, a } = c, hex = rgbToHex(r, g, b), h = rgbToHsl(r, g, b), v = rgbToHsv(r, g, b), k = rgbToCmyk(r, g, b);
      if (!fromPick) p.value = hex;
      sw.style.boxShadow = `inset 0 0 0 999px rgba(${r},${g},${b},${a})`;
      const rows = [['HEX', hex.toUpperCase()], ['RGB', `rgb(${r}, ${g}, ${b})`], ['RGBA', `rgba(${r}, ${g}, ${b}, ${+a.toFixed(2)})`], ['HSL', `hsl(${h.h}, ${h.s}%, ${h.l}%)`], ['HSV / HSB', `hsv(${v.h}, ${v.s}%, ${v.v}%)`], ['CMYK', `cmyk(${k.c}%, ${k.m}%, ${k.y}%, ${k.k}%)`]];
      if (a < 1) rows.splice(1, 0, ['HEX8', hex.toUpperCase() + Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase()]);
      out.innerHTML = rows.map(([l, x]) => `<div class="kv"><span>${l}</span><code>${x}</code><button type="button" class="btn-sm" data-copy="${x}">Copy</button></div>`).join('');
    }
    t.addEventListener('input', () => render(t.value));
    p.addEventListener('input', () => { t.value = p.value; render(p.value, 1); });
    render(t.value);
  },
  how: ['Type or paste a color value into the input — HEX, RGB, HSL or a named CSS color all work.', 'Or use the color picker to choose a color visually.', 'Every format updates instantly on the right.', 'Click “Copy” next to the format you need and paste it into your project.'],
  about: `<p>Designers and developers constantly switch between color formats: brand guidelines list HEX, CSS often uses RGB or HSL, and print shops ask for CMYK. This color converter removes the guesswork by translating a single color into all common notations at once.</p><p>HSL (hue, saturation, lightness) is great for building consistent themes in CSS, while HSV/HSB matches the color pickers in Photoshop and Figma. CMYK values are a mathematical conversion — for critical print work always confirm with your printer’s color profile.</p>`,
  faq: [['How do I convert HEX to RGB?', 'Paste the HEX code (for example #C8A97E) into the input. The RGB value appears instantly — rgb(200, 169, 126) — and you can copy it with one click.'], ['Does it support transparency?', 'Yes. Enter an 8-digit HEX or an rgba()/hsla() value and the tool shows the alpha channel in RGBA and HEX8 formats.'], ['Are CMYK values print-accurate?', 'They are a standard formula-based conversion. Real print output depends on paper and ICC profiles, so use them as a starting point.']],
},
{
  slug: 'color-palette-generator', cat: 'color', name: 'Color Palette Generator',
  title: 'Color Palette Generator – Complementary, Analogous & Triadic Schemes',
  desc: 'Generate beautiful color palettes from any base color using color theory: complementary, analogous, triadic, tetradic, split-complementary and monochromatic. Copy HEX or CSS.',
  kw: ['color palette generator', 'color scheme generator', 'complementary colors', 'analogous colors', 'triadic color scheme', 'color harmony'],
  short: 'Build harmonious color schemes with color theory or random inspiration.',
  intro: 'Pick a base color and a color harmony rule to generate a balanced five-color palette. Hit “Random” or press the space bar for fresh inspiration.',
  html: `<div class="tool-layout"><div class="panel">
${color('pBase', 'Base color', '#c8a97e')}
${sel('pMode', 'Color harmony', [['analogous', 'Analogous'], ['complementary', 'Complementary'], ['split', 'Split complementary'], ['triadic', 'Triadic'], ['tetradic', 'Tetradic (square)'], ['mono', 'Monochromatic'], ['shades', 'Neutral + accent']], 'analogous')}
<div class="btn-row"><button type="button" class="btn" id="pRand">Random palette</button></div>
<p class="note">Tip: press <kbd>Space</kbd> to generate a random palette. Click any swatch to copy it.</p>
</div><div class="panel"><div class="swatches five" id="pOut"></div>${code('pCss', 'Copy CSS')}</div></div>`,
  js: () => {
    const base = el('pBase'), mode = el('pMode'), out = el('pOut'), css = el('pCss');
    const H = (h, s, l) => hslHex(h, clamp(s, 5, 100), clamp(l, 8, 95));
    function gen() {
      const c = parseColor(base.value), { h, s, l } = rgbToHsl(c.r, c.g, c.b);
      const m = {
        analogous: [H(h - 40, s, l), H(h - 20, s, l), H(h, s, l), H(h + 20, s, l), H(h + 40, s, l)],
        complementary: [H(h, s, l - 22), H(h, s, l), H(h, s - 25, l + 28), H(h + 180, s, l), H(h + 180, s, l - 22)],
        split: [H(h, s, l), H(h, s, l + 25), H(h + 150, s, l), H(h + 210, s, l), H(h + 210, s, l - 20)],
        triadic: [H(h, s, l), H(h + 120, s, l), H(h + 240, s, l), H(h, s, l + 25), H(h + 120, s, l - 22)],
        tetradic: [H(h, s, l), H(h + 90, s, l), H(h + 180, s, l), H(h + 270, s, l), H(h, s - 20, l + 28)],
        mono: [H(h, s, 18), H(h, s, 34), H(h, s, l), H(h, s, 70), H(h, s, 88)],
        shades: [H(h, 8, 10), H(h, 10, 30), H(h, 12, 92), H(h, 20, 97), H(h, s, l)],
      }[mode.value];
      out.innerHTML = m.map(x => swatch(x).replace('class="sw"', 'class="sw big"')).join('');
      css.textContent = ':root {\n' + m.map((x, i) => `  --color-${i + 1}: ${x};`).join('\n') + '\n}\n\n/* ' + m.join(', ') + ' */';
    }
    function rnd() { setColor(base, hslHex(Math.random() * 360, 45 + Math.random() * 40, 38 + Math.random() * 25)); const o = [...mode.options]; if (Math.random() < .5) mode.value = o[Math.floor(Math.random() * 5)].value; gen(); }
    base.addEventListener('input', gen); mode.addEventListener('change', gen); el('pRand').onclick = rnd;
    document.addEventListener('keydown', e => { if (e.code === 'Space' && !/INPUT|SELECT|TEXTAREA|BUTTON/.test(document.activeElement.tagName)) { e.preventDefault(); rnd(); } });
    gen();
  },
  how: ['Choose a base color with the picker or type a HEX value.', 'Select a color harmony such as analogous, complementary or triadic.', 'Review the five generated swatches — click any swatch to copy its HEX code.', 'Copy the ready-made CSS custom properties into your stylesheet.'],
  about: `<p>Color harmonies are proven combinations based on positions on the color wheel. <strong>Analogous</strong> palettes use neighbouring hues for calm, cohesive designs. <strong>Complementary</strong> palettes pair opposite hues for strong contrast, while <strong>triadic</strong> and <strong>tetradic</strong> schemes spread hues evenly for vibrant, balanced layouts.</p><p>Use the monochromatic option for minimal brand systems and the neutral + accent option to get a practical UI palette with dark text, light backgrounds and one highlight color.</p>`,
  faq: [['What is a complementary color palette?', 'It combines a color with the hue directly opposite on the color wheel (180° apart). The result is high contrast and works well for call-to-action buttons.'], ['Can I use these palettes commercially?', 'Yes. Colors cannot be copyrighted and every palette you generate is yours to use for free.'], ['How do I export a palette?', 'Click “Copy CSS” to copy CSS variables, or click individual swatches to copy single HEX codes.']],
},
{
  slug: 'contrast-checker', cat: 'color', name: 'Color Contrast Checker',
  title: 'WCAG Color Contrast Checker – Test Text Accessibility (AA & AAA)',
  desc: 'Check the contrast ratio between text and background colors against WCAG 2.1 AA and AAA. Get pass/fail results and auto-fix colors for accessible, readable designs.',
  kw: ['contrast checker', 'wcag contrast checker', 'color contrast ratio', 'accessibility color checker', 'aa aaa contrast', 'text contrast'],
  short: 'Test text and background colors against WCAG AA and AAA accessibility rules.',
  intro: 'Make sure your text is readable for everyone. Enter a text color and a background color to see the contrast ratio and WCAG 2.1 compliance instantly.',
  html: `<div class="tool-layout"><div class="panel">
${color('ccFg', 'Text color', '#6b6358')}
${color('ccBg', 'Background color', '#faf7f2')}
<div class="btn-row"><button type="button" class="btn-alt" id="ccSwap">Swap colors</button><button type="button" class="btn" id="ccFix">Fix text for AA</button></div>
<p class="note">“Fix text for AA” finds the closest text color with at least a 4.5:1 ratio.</p>
</div><div class="panel"><div class="result-big" id="ccRatio">–</div><div class="badges" id="ccRes"></div>
<div id="ccPrev" style="margin-top:16px;border-radius:14px;padding:22px;border:1px solid var(--line)"><div style="font-size:24px;font-weight:700;margin-bottom:6px">Large heading text</div><p style="margin:0">Normal body text looks like this. The quick brown fox jumps over the lazy dog.</p></div></div></div>`,
  js: () => {
    const f = el('ccFg'), b = el('ccBg'), r = el('ccRatio'), res = el('ccRes'), pv = el('ccPrev');
    function upd() {
      const a = parseColor(f.value), c = parseColor(b.value); const ratio = contrastRatio(a, c);
      r.innerHTML = ratio.toFixed(2) + ':1 <small>' + (ratio >= 7 ? 'Excellent' : ratio >= 4.5 ? 'Good' : ratio >= 3 ? 'Large text only' : 'Poor') + '</small>';
      pv.style.color = f.value; pv.style.background = b.value;
      res.innerHTML = [['AA normal text', 4.5], ['AA large text', 3], ['AAA normal text', 7], ['AAA large text', 4.5], ['AA UI components', 3]].map(([n, t]) => `<div class="badge ${ratio >= t ? 'pass' : 'fail'}"><b>${ratio >= t ? '✓ Pass' : '✗ Fail'}</b>${n}<small>${t}:1</small></div>`).join('');
    }
    f.addEventListener('input', upd); b.addEventListener('input', upd);
    el('ccSwap').onclick = () => { const x = f.value; setColor(f, b.value); setColor(b, x); upd(); };
    el('ccFix').onclick = () => {
      const a = parseColor(f.value), c = parseColor(b.value), hs = rgbToHsl(a.r, a.g, a.b); let best = null;
      for (let d = 0; d <= 100 && !best; d++) for (const s of [-1, 1]) { const l = hs.l + d * s; if (l < 0 || l > 100) continue; const x = hslToRgb(hs.h, hs.s, l); if (contrastRatio(x, c) >= 4.51) { best = x; break; } }
      if (best) { setColor(f, rgbToHex(best.r, best.g, best.b)); upd(); toast('Text color adjusted to pass AA'); }
    };
    upd();
  },
  how: ['Enter your text (foreground) color.', 'Enter your background color.', 'Read the contrast ratio and the AA/AAA pass or fail badges.', 'If it fails, click “Fix text for AA” to get the nearest accessible color.'],
  about: `<p>The Web Content Accessibility Guidelines (WCAG 2.1) require a contrast ratio of at least <strong>4.5:1</strong> for normal text and <strong>3:1</strong> for large text (24px, or 18.66px bold) to meet level AA. Level AAA raises this to 7:1 and 4.5:1. UI components such as input borders and icons need at least 3:1.</p><p>Good contrast helps people with low vision, color blindness and anyone reading on a phone in bright sunlight. It is also a legal requirement for many public and commercial websites.</p>`,
  faq: [['What contrast ratio is required for WCAG AA?', '4.5:1 for normal-size text and 3:1 for large text and user-interface components.'], ['How is the contrast ratio calculated?', 'It uses the relative luminance of both colors: (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter color. Ratios range from 1:1 to 21:1.'], ['Does the checker support transparent colors?', 'Use solid colors for accurate results. If your text is semi-transparent, enter the blended color you see on screen.']],
},
{
  slug: 'tints-and-shades-generator', cat: 'color', name: 'Tints & Shades Generator',
  title: 'Tints and Shades Generator – Lighter & Darker Color Variations',
  desc: 'Create tints (lighter) and shades (darker) of any color in 5%, 10% or 20% steps. Build complete color scales for UI design systems and copy them as CSS variables.',
  kw: ['tints and shades', 'color shades generator', 'lighten color', 'darken color', 'color scale generator', 'tint generator'],
  short: 'Generate lighter tints and darker shades of any color for design systems.',
  intro: 'Turn a single brand color into a full range of lighter tints and darker shades — perfect for hover states, backgrounds, borders and design tokens.',
  html: `<div class="tool-layout"><div class="panel">
${color('tsBase', 'Base color', '#8a6d3b')}
${sel('tsSteps', 'Step size', [[20, '5% steps (20)'], [10, '10% steps (10)'], [5, '20% steps (5)']], 10)}
</div><div class="panel"><h3>Tints (mixed with white)</h3><div class="swatches tight" id="tsTints"></div><h3 style="margin-top:20px">Shades (mixed with black)</h3><div class="swatches tight" id="tsShades"></div>${code('tsCss', 'Copy CSS')}</div></div>`,
  js: () => {
    const base = el('tsBase'), st = el('tsSteps'), T = el('tsTints'), S = el('tsShades'), css = el('tsCss');
    const mix = (a, b, p) => rgbToHex(a.r + (b.r - a.r) * p, a.g + (b.g - a.g) * p, a.b + (b.b - a.b) * p);
    function upd() {
      const c = parseColor(base.value), n = +st.value, t = [], s = [];
      for (let i = 0; i <= n; i++) { t.push(mix(c, { r: 255, g: 255, b: 255 }, i / n)); s.push(mix(c, { r: 0, g: 0, b: 0 }, i / n)); }
      const row = a => a.map((x, i) => swatch(x, `<small style="display:block;opacity:.7;font-weight:500;margin-left:auto">${Math.round(i / n * 100)}%</small>`)).join('');
      T.innerHTML = row(t); S.innerHTML = row(s);
      css.textContent = ':root {\n' + t.map((x, i) => `  --tint-${Math.round(i / n * 100)}: ${x};`).join('\n') + '\n' + s.map((x, i) => `  --shade-${Math.round(i / n * 100)}: ${x};`).join('\n') + '\n}';
    }
    base.addEventListener('input', upd); st.addEventListener('change', upd); upd();
  },
  how: ['Pick or paste your base color.', 'Choose the step size (5%, 10% or 20%).', 'Click any tint or shade to copy its HEX code.', 'Copy all values as CSS custom properties.'],
  about: `<p>In color theory a <strong>tint</strong> is a color mixed with white, and a <strong>shade</strong> is a color mixed with black. Building a consistent scale from your brand color lets you create hover and active states, subtle backgrounds, borders and dark-mode variants that always feel on-brand.</p><p>This generator mixes colors in RGB space, which matches the way tools like Sass <code>mix()</code> work, so the output is predictable for developers.</p>`,
  faq: [['What is the difference between a tint and a shade?', 'A tint adds white to make a color lighter; a shade adds black to make it darker. A tone adds grey.'], ['How do I use tints in UI design?', 'Light tints (80–95%) make great backgrounds and badges, mid tints work for borders, and shades are ideal for hover states and text on light backgrounds.']],
},
{
  slug: 'image-color-picker', cat: 'color', name: 'Image Color Picker',
  title: 'Image Color Picker – Get HEX & RGB Color Codes From Any Image',
  desc: 'Upload a photo or screenshot and click anywhere to pick the exact pixel color. Get HEX and RGB color codes from images instantly — private, free and runs in your browser.',
  kw: ['image color picker', 'color picker from image', 'get color from image', 'eyedropper tool', 'pick color from photo', 'hex from image'],
  short: 'Click anywhere on an uploaded image to get its exact HEX and RGB color.',
  intro: 'Upload a screenshot, logo or photo, hover to preview colors and click to save exact pixel values. Nothing is uploaded — the image stays on your device.',
  html: `${drop('icpFile')}<div id="icpWrap" hidden><div class="hover-chip" id="icpHover"><i></i>Hover over the image</div>
<div class="tool-layout" style="grid-template-columns:minmax(0,1fr) 300px"><div class="preview checker" style="padding:0;cursor:crosshair"><canvas id="icpCanvas"></canvas></div>
<div class="panel"><h3>Picked colors</h3><div id="icpList" class="kv-list"><p class="note">Click on the image to pick a color.</p></div></div></div></div>
<p class="note">Want the whole palette automatically? Try the <a href="/tools/image-palette-extractor/">Image Palette Extractor</a>.</p>`,
  js: () => {
    const cv = el('icpCanvas'), ctx = cv.getContext('2d', { willReadFrequently: true }), hov = el('icpHover'), list = el('icpList');
    fileDrop(el('icpFileZone'), el('icpFile'), async fs => {
      const img = await loadImage(fs[0]), s = Math.min(1, 2000 / Math.max(imgW(img), imgH(img)));
      cv.width = Math.round(imgW(img) * s); cv.height = Math.round(imgH(img) * s); ctx.drawImage(img, 0, 0, cv.width, cv.height); el('icpWrap').hidden = false;
    });
    const at = e => { const r = cv.getBoundingClientRect(); const x = clamp(Math.floor((e.clientX - r.left) * cv.width / r.width), 0, cv.width - 1), y = clamp(Math.floor((e.clientY - r.top) * cv.height / r.height), 0, cv.height - 1); const d = ctx.getImageData(x, y, 1, 1).data; return { hex: rgbToHex(d[0], d[1], d[2]), r: d[0], g: d[1], b: d[2] }; };
    cv.addEventListener('pointermove', e => { const c = at(e); hov.innerHTML = `<i style="background:${c.hex}"></i>${c.hex.toUpperCase()} · rgb(${c.r}, ${c.g}, ${c.b})`; });
    let first = true;
    cv.addEventListener('click', e => { const c = at(e); if (first) { list.innerHTML = ''; first = false; } list.insertAdjacentHTML('afterbegin', `<div class="kv"><i class="dot" style="background:${c.hex}"></i><code>${c.hex.toUpperCase()}</code><button type="button" class="btn-sm" data-copy="${c.hex}">HEX</button><button type="button" class="btn-sm" data-copy="rgb(${c.r}, ${c.g}, ${c.b})">RGB</button></div>`); copyText(c.hex); toast('Copied ' + c.hex); });
  },
  how: ['Upload, drag & drop or paste an image.', 'Move your cursor over the image to preview colors live.', 'Click to pick a color — the HEX code is copied automatically.', 'Use the HEX or RGB buttons to copy saved colors again.'],
  about: `<p>An image color picker (or eyedropper) is the fastest way to match colors from a client’s logo, a mood-board photo or a competitor’s website screenshot. Because the image is drawn onto a canvas inside your browser, you get the exact pixel value without uploading files to a server.</p><p>Large images are scaled to a maximum of 2000px for smooth performance; this doesn’t change solid colors in logos or UI screenshots.</p>`,
  faq: [['How do I find the HEX code of a color in an image?', 'Upload the image and click the area you want. The HEX code appears in the list and is copied to your clipboard.'], ['Is my image uploaded anywhere?', 'No. The image is processed entirely in your browser and never leaves your device.']],
},
{
  slug: 'image-palette-extractor', cat: 'color', name: 'Image Palette Extractor',
  title: 'Extract Color Palette From Image – Dominant Colors Finder',
  desc: 'Extract a color palette from any image. Find the dominant colors of photos, logos and artwork in seconds and export them as HEX codes or CSS variables. Free and private.',
  kw: ['extract color palette from image', 'image palette generator', 'dominant colors', 'photo color palette', 'colors from image', 'palette from picture'],
  short: 'Pull the dominant colors out of any photo, logo or artwork automatically.',
  intro: 'Drop in an image and instantly get its dominant color palette. Adjust how many colors you want and copy them as HEX values or CSS variables.',
  html: `${drop('pfiFile')}<div class="tool-layout" id="pfiRes" hidden><div class="panel"><div class="preview checker" style="min-height:200px;padding:12px"><img id="pfiImg" alt="Uploaded image preview"></div>${range('pfiN', 'Number of colors', 3, 12, 6)}</div>
<div class="panel"><div class="swatches" id="pfiOut"></div>${code('pfiCss', 'Copy CSS')}</div></div>`,
  js: () => {
    let img = null; const n = el('pfiN'), out = el('pfiOut'), css = el('pfiCss');
    function extract() {
      if (!img) return;
      const s = Math.min(1, 140 / Math.max(imgW(img), imgH(img))), cv = makeCanvas(Math.max(1, Math.round(imgW(img) * s)), Math.max(1, Math.round(imgH(img) * s))), ctx = cv.getContext('2d');
      ctx.drawImage(img, 0, 0, cv.width, cv.height); const d = ctx.getImageData(0, 0, cv.width, cv.height).data, m = new Map();
      for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 128) continue; const k = (d[i] >> 4) << 8 | (d[i + 1] >> 4) << 4 | (d[i + 2] >> 4); let b = m.get(k); if (!b) m.set(k, b = [0, 0, 0, 0]); b[0] += d[i]; b[1] += d[i + 1]; b[2] += d[i + 2]; b[3]++; }
      const arr = [...m.values()].sort((a, b) => b[3] - a[3]).map(b => ({ r: b[0] / b[3], g: b[1] / b[3], b: b[2] / b[3] })), N = +n.value; let pick = [];
      for (const th of [56, 40, 26, 12]) { pick = []; for (const c of arr) { if (pick.every(p => Math.hypot(p.r - c.r, p.g - c.g, p.b - c.b) > th)) pick.push(c); if (pick.length >= N) break; } if (pick.length >= N) break; }
      const hx = pick.map(p => rgbToHex(p.r, p.g, p.b));
      out.innerHTML = hx.map(x => swatch(x)).join('');
      css.textContent = ':root {\n' + hx.map((x, i) => `  --palette-${i + 1}: ${x};`).join('\n') + '\n}';
    }
    fileDrop(el('pfiFileZone'), el('pfiFile'), async fs => { img = await loadImage(fs[0]); el('pfiImg').src = img.src; el('pfiRes').hidden = false; extract(); });
    n.addEventListener('input', extract);
  },
  how: ['Upload, drop or paste an image.', 'The tool samples the pixels and groups similar colors.', 'Use the slider to choose between 3 and 12 colors.', 'Click swatches to copy HEX codes or copy all as CSS.'],
  about: `<p>Extracting a palette from a photograph is a classic designer trick for creating harmonious color schemes. Nature photos, paintings and product shots already contain balanced colors — this tool finds the most common ones and filters out near-duplicates so you get a useful, varied palette.</p><p>Colors are ordered from most to least dominant. The algorithm runs locally on a downscaled copy of your image, so it is instant even for large photos.</p>`,
  faq: [['How are dominant colors calculated?', 'Pixels are grouped into color buckets, sorted by how often they appear, and similar colors are merged so the palette stays distinct.'], ['Can I extract colors from a logo?', 'Yes. Logos with flat colors give very precise results. Transparent areas are ignored.']],
},
{
  slug: 'color-blindness-simulator', cat: 'color', name: 'Color Blindness Simulator',
  title: 'Color Blindness Simulator – Test Designs for Protanopia & Deuteranopia',
  desc: 'See how your designs look to people with color vision deficiency. Simulate protanopia, deuteranopia, tritanopia and achromatopsia on any image, right in your browser.',
  kw: ['color blindness simulator', 'color blind test design', 'protanopia simulator', 'deuteranopia', 'tritanopia', 'accessibility testing'],
  short: 'Preview images as seen with protanopia, deuteranopia, tritanopia and more.',
  intro: 'About 1 in 12 men and 1 in 200 women have some form of color blindness. Upload a screenshot of your design to check that charts, buttons and status colors still make sense.',
  html: `${drop('cbFile')}<div id="cbRes" hidden>
${sel('cbType', 'Vision type', [['protanopia', 'Protanopia (no red)'], ['deuteranopia', 'Deuteranopia (no green)'], ['tritanopia', 'Tritanopia (no blue)'], ['protanomaly', 'Protanomaly (weak red)'], ['deuteranomaly', 'Deuteranomaly (weak green)'], ['tritanomaly', 'Tritanomaly (weak blue)'], ['achromatopsia', 'Achromatopsia (no color)']], 'deuteranopia')}
<div class="tool-layout even"><div><h3 class="muted" style="font-size:14px">Original</h3><div class="preview checker" style="padding:10px"><canvas id="cbA"></canvas></div></div><div><h3 class="muted" style="font-size:14px">Simulated</h3><div class="preview checker" style="padding:10px"><canvas id="cbB"></canvas></div></div></div>
<div class="btn-row" style="margin-top:14px"><button type="button" class="btn" id="cbDl">Download simulated image</button></div></div>`,
  js: () => {
    const M = { protanopia: [.567, .433, 0, .558, .442, 0, 0, .242, .758], deuteranopia: [.625, .375, 0, .7, .3, 0, 0, .3, .7], tritanopia: [.95, .05, 0, 0, .433, .567, 0, .475, .525], protanomaly: [.817, .183, 0, .333, .667, 0, 0, .125, .875], deuteranomaly: [.8, .2, 0, .258, .742, 0, 0, .142, .858], tritanomaly: [.967, .033, 0, 0, .733, .267, 0, .183, .817], achromatopsia: [.299, .587, .114, .299, .587, .114, .299, .587, .114] };
    const A = el('cbA'), B = el('cbB'), type = el('cbType'); let src = null, name = 'image.png';
    function run() {
      if (!src) return; const m = M[type.value], o = B.getContext('2d'), d = new ImageData(new Uint8ClampedArray(src.data), src.width, src.height), p = d.data;
      for (let i = 0; i < p.length; i += 4) { const r = p[i], g = p[i + 1], b = p[i + 2]; p[i] = r * m[0] + g * m[1] + b * m[2]; p[i + 1] = r * m[3] + g * m[4] + b * m[5]; p[i + 2] = r * m[6] + g * m[7] + b * m[8]; }
      B.width = src.width; B.height = src.height; o.putImageData(d, 0, 0);
    }
    fileDrop(el('cbFileZone'), el('cbFile'), async fs => {
      name = fs[0].name; const img = await loadImage(fs[0]), s = Math.min(1, 1600 / Math.max(imgW(img), imgH(img)));
      A.width = Math.round(imgW(img) * s); A.height = Math.round(imgH(img) * s); const c = A.getContext('2d', { willReadFrequently: true }); c.drawImage(img, 0, 0, A.width, A.height);
      src = c.getImageData(0, 0, A.width, A.height); el('cbRes').hidden = false; run();
    });
    type.addEventListener('change', run);
    el('cbDl').onclick = async () => downloadBlob(await toBlob(B), rename(name, type.value, 'image/png'));
  },
  how: ['Upload a screenshot of your website, app, chart or graphic.', 'Choose a type of color vision deficiency.', 'Compare the original and simulated versions side by side.', 'Download the simulated image to share with your team.'],
  about: `<p>Color vision deficiency affects roughly 300 million people worldwide. The most common types are <strong>deuteranopia</strong> and <strong>protanopia</strong> (red–green), which make red error states and green success states look nearly identical. <strong>Tritanopia</strong> affects blue–yellow perception and <strong>achromatopsia</strong> removes color entirely.</p><p>Use this simulator to verify that information is never communicated by color alone — add icons, labels, patterns or stronger lightness contrast where needed.</p>`,
  faq: [['How accurate is the simulation?', 'It uses widely used color transformation matrices that approximate each condition. It’s ideal for design checks, though individual perception varies.'], ['What is the most common type of color blindness?', 'Deuteranomaly (reduced green sensitivity) is the most common, followed by protanomaly and the full dichromacies.']],
},
{
  slug: 'color-mixer', cat: 'color', name: 'Color Mixer',
  title: 'Color Mixer – Blend Two Colors Online and Get the Mixed HEX',
  desc: 'Mix two colors together at any ratio and get the blended HEX, RGB and HSL value. Generate smooth color steps between two colors for gradients, charts and UI states.',
  kw: ['color mixer', 'blend two colors', 'mix colors online', 'color blender', 'color steps generator', 'midpoint color'],
  short: 'Blend two colors at any ratio and generate smooth in-between steps.',
  intro: 'Choose two colors and a mix ratio to get the exact blended color, plus a series of evenly spaced steps between them — ideal for data visualisation scales and gradients.',
  html: `<div class="tool-layout"><div class="panel">
${color('cmA', 'Color A', '#141414')}
${color('cmB', 'Color B', '#e8dcc4')}
${range('cmP', 'Mix amount of color B', 0, 100, 50, 1, '%')}
${range('cmN', 'Number of steps', 3, 15, 7)}
</div><div class="panel"><div class="swatch-lg" id="cmSw"></div><div class="kv-list" id="cmOut"></div><h3 style="margin-top:20px">Steps from A to B</h3><div class="swatches tight" id="cmSteps"></div></div></div>`,
  js: () => {
    const A = el('cmA'), B = el('cmB'), P = el('cmP'), N = el('cmN');
    const mix = (a, b, p) => rgbToHex(a.r + (b.r - a.r) * p, a.g + (b.g - a.g) * p, a.b + (b.b - a.b) * p);
    function upd() {
      const a = parseColor(A.value), b = parseColor(B.value), m = mix(a, b, P.value / 100), c = parseColor(m), h = rgbToHsl(c.r, c.g, c.b);
      el('cmSw').style.background = m;
      el('cmOut').innerHTML = [['HEX', m.toUpperCase()], ['RGB', `rgb(${c.r}, ${c.g}, ${c.b})`], ['HSL', `hsl(${h.h}, ${h.s}%, ${h.l}%)`]].map(([l, x]) => `<div class="kv"><span>${l}</span><code>${x}</code><button type="button" class="btn-sm" data-copy="${x}">Copy</button></div>`).join('');
      const n = +N.value; el('cmSteps').innerHTML = Array.from({ length: n }, (_, i) => swatch(mix(a, b, i / (n - 1)))).join('');
    }
    [A, B, P, N].forEach(x => x.addEventListener('input', upd)); upd();
  },
  how: ['Pick the first and second colors.', 'Drag the mix slider to set how much of color B to blend in.', 'Copy the mixed color in HEX, RGB or HSL.', 'Use the step swatches for gradients or chart scales.'],
  about: `<p>Mixing colors digitally is useful for finding the midpoint between brand colors, creating hover states that lean towards a background, or building sequential color scales for charts and heat maps.</p><p>The mixer interpolates each RGB channel linearly — the same method used by CSS <code>color-mix(in srgb, …)</code> and Sass <code>mix()</code>.</p>`,
  faq: [['How do I find the color halfway between two colors?', 'Set the mix slider to 50% and the result shows the exact midpoint color.'], ['Is this the same as mixing paint?', 'No. Digital mixing is additive light (RGB), while paint mixing is subtractive, so blue + yellow won’t give green here.']],
},
];
