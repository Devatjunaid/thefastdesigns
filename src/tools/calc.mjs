import { range, num, txt, color, sel, chk, code } from '../lib.mjs';

export default [
{
  slug: 'aspect-ratio-calculator', cat: 'calc', name: 'Aspect Ratio Calculator',
  title: 'Aspect Ratio Calculator – Resize Dimensions & Find 16:9, 4:3 Ratios',
  desc: 'Calculate aspect ratios and missing width or height for images, video and screens. Find the ratio of any resolution, scale 16:9, 4:3, 1:1 and 9:16 sizes, and keep proportions.',
  kw: ['aspect ratio calculator', '16:9 calculator', 'ratio calculator', 'image aspect ratio', 'resolution calculator', 'video aspect ratio'],
  short: 'Find any aspect ratio and calculate the missing width or height.',
  intro: 'Keep images and videos in proportion. Enter a ratio and one dimension to get the other, or enter any resolution to find its simplified aspect ratio.',
  html: `<div class="tool-layout even"><div class="panel"><h3>Calculate missing dimension</h3>
<div class="grid2">${num('arA', 'Ratio width', 16, 'min="0.01" step="any"')}${num('arB', 'Ratio height', 9, 'min="0.01" step="any"')}</div>
<div class="btn-row" style="margin-bottom:14px">${['16:9', '4:3', '3:2', '1:1', '21:9', '9:16', '4:5', '2:3'].map(r => `<button type="button" class="btn-sm" data-ar="${r}">${r}</button>`).join('')}</div>
<div class="grid2">${num('arW', 'Width (px)', 1920, 'min="0" step="any"')}${num('arH', 'Height (px)', 1080, 'min="0" step="any"')}</div>
<div class="preview" style="min-height:200px"><div id="arBox" style="background:var(--ink);border-radius:8px;display:grid;place-items:center;color:var(--beige);font-weight:700;max-width:100%"></div></div></div>
<div class="panel"><h3>Find ratio from resolution</h3><div class="grid2">${num('arFW', 'Width', 2560, 'min="1"')}${num('arFH', 'Height', 1440, 'min="1"')}</div>
<div class="stat-grid"><div class="stat"><span>Aspect ratio</span><b id="arR">–</b></div><div class="stat"><span>Decimal</span><b id="arD">–</b></div><div class="stat"><span>Orientation</span><b id="arO">–</b></div><div class="stat"><span>Megapixels</span><b id="arM">–</b></div></div>
<h3>Common sizes for this ratio</h3><div id="arList" class="kv-list"></div></div></div>`,
  js: () => {
    const gcd = (a, b) => b ? gcd(b, a % b) : a, A = el('arA'), B = el('arB'), W = el('arW'), H = el('arH');
    const r = () => (+A.value || 1) / (+B.value || 1);
    function box() { const k = r(), w = k >= 1 ? 260 : 180 * k, h = k >= 1 ? 260 / k : 180; el('arBox').style.width = w + 'px'; el('arBox').style.height = Math.min(h, 220) + 'px'; el('arBox').textContent = `${A.value}:${B.value}`; }
    W.addEventListener('input', () => { H.value = +(W.value / r()).toFixed(2); });
    H.addEventListener('input', () => { W.value = +(H.value * r()).toFixed(2); });
    [A, B].forEach(x => x.addEventListener('input', () => { H.value = +(W.value / r()).toFixed(2); box(); }));
    document.querySelectorAll('[data-ar]').forEach(b => b.onclick = () => { const [x, y] = b.dataset.ar.split(':'); A.value = x; B.value = y; H.value = +(W.value / r()).toFixed(2); box(); });
    function find() {
      const w = Math.round(+el('arFW').value), h = Math.round(+el('arFH').value); if (!w || !h) return; const g = gcd(w, h), rw = w / g, rh = h / g;
      el('arR').textContent = rw > 50 ? `≈ ${(w / h).toFixed(2)}:1` : `${rw}:${rh}`; el('arD').textContent = (w / h).toFixed(4); el('arO').textContent = w > h ? 'Landscape' : w < h ? 'Portrait' : 'Square'; el('arM').textContent = (w * h / 1e6).toFixed(2) + ' MP';
      el('arList').innerHTML = [480, 720, 1080, 1440, 2160].map(hh => { const ww = Math.round(hh * w / h); return `<div class="kv"><code>${ww} × ${hh}</code><button type="button" class="btn-sm" data-copy="${ww}x${hh}">Copy</button></div>`; }).join('');
    }
    el('arFW').addEventListener('input', find); el('arFH').addEventListener('input', find); box(); find();
  },
  how: ['Enter the ratio (e.g. 16 and 9) or click a preset.', 'Type a width to calculate the height, or a height to calculate the width.', 'To find the ratio of an existing size, enter it in “Find ratio from resolution”.', 'Copy any of the suggested common sizes.'],
  about: `<p>Aspect ratio is the proportional relationship between width and height. <strong>16:9</strong> is the standard for HD video, YouTube and most monitors; <strong>4:3</strong> is classic photography and iPad screens; <strong>1:1</strong> is used for profile pictures; and <strong>9:16</strong> is the vertical format for Stories, Reels, Shorts and TikTok.</p><p>Keeping the ratio when resizing prevents stretched or squashed images. In CSS you can lock an element’s proportions with <code>aspect-ratio: 16 / 9</code>.</p>`,
  faq: [['How do I calculate aspect ratio?', 'Divide width and height by their greatest common divisor. For 1920×1080 the GCD is 120, giving 16:9.'], ['What height is 16:9 at 1280 wide?', '1280 ÷ 16 × 9 = 720, so the size is 1280×720.']],
},
{
  slug: 'px-to-rem-converter', cat: 'calc', name: 'PX to REM Converter',
  title: 'PX to REM Converter – Pixels to REM & EM Calculator for CSS',
  desc: 'Convert pixels to rem and rem to pixels for responsive CSS. Set your root font size, convert values both ways and use the handy px-to-rem conversion table for common sizes.',
  kw: ['px to rem', 'rem to px', 'pixel to rem converter', 'px to em', 'css unit converter', 'rem calculator'],
  short: 'Convert pixels to rem (and back) based on your root font size.',
  intro: 'Switch between pixel and rem units in a second. Change the base font size if your project doesn’t use the default 16px.',
  html: `<div class="tool-layout even"><div class="panel">
${num('prBase', 'Root font size (px)', 16, 'min="1" step="any"')}
<div class="grid2">${num('prPx', 'Pixels (px)', 24, 'step="any"')}${num('prRem', 'REM', 1.5, 'step="any"')}</div>
<div class="kv"><span>CSS</span><code id="prCss">1.5rem</code><button type="button" class="btn-sm" id="prCopy">Copy</button></div>
<p class="note">Formula: rem = px ÷ root font size. EM works the same way but is relative to the parent element’s font size.</p>
</div><div class="panel"><div class="scroll-x"><table class="table"><thead><tr><th>Pixels</th><th>REM</th><th></th></tr></thead><tbody id="prT"></tbody></table></div></div></div>`,
  js: () => {
    const B = el('prBase'), P = el('prPx'), R = el('prRem'), f = n => +(+n).toFixed(4);
    const css = () => { el('prCss').textContent = f(R.value) + 'rem'; };
    const table = () => { const b = +B.value || 16; el('prT').innerHTML = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96, 128].map(p => `<tr><td>${p}px</td><td><code>${f(p / b)}rem</code></td><td><button type="button" class="btn-sm" data-copy="${f(p / b)}rem">Copy</button></td></tr>`).join(''); };
    P.addEventListener('input', () => { R.value = f(P.value / (+B.value || 16)); css(); });
    R.addEventListener('input', () => { P.value = f(R.value * (+B.value || 16)); css(); });
    B.addEventListener('input', () => { R.value = f(P.value / (+B.value || 16)); css(); table(); });
    el('prCopy').onclick = e => copyText(el('prCss').textContent, e.target); css(); table();
  },
  how: ['Set your root font size (16px is the browser default).', 'Type a pixel value to get rem, or a rem value to get pixels.', 'Copy the CSS value.', 'Use the table for quick lookups of common sizes.'],
  about: `<p>The <code>rem</code> unit is relative to the root (<code>html</code>) font size. Using rem for typography and spacing means your entire layout scales when a user increases their browser’s default font size — an important accessibility win over fixed pixels.</p><p>With the default 16px root: 8px = 0.5rem, 12px = 0.75rem, 24px = 1.5rem and 32px = 2rem.</p>`,
  faq: [['How many pixels is 1rem?', '1rem equals the root font size, which is 16px by default in all major browsers.'], ['What is the difference between rem and em?', 'rem is relative to the root element; em is relative to the font size of the current element’s parent, so em values compound when nested.']],
},
{
  slug: 'ppi-calculator', cat: 'calc', name: 'PPI / DPI Screen Calculator',
  title: 'PPI Calculator – Screen Pixel Density (DPI) & Dot Pitch Calculator',
  desc: 'Calculate the pixel density (PPI) of any screen from its resolution and diagonal size. Get dot pitch, physical dimensions and total pixels for monitors, laptops and phones.',
  kw: ['ppi calculator', 'dpi calculator', 'pixel density calculator', 'screen ppi', 'monitor dpi', 'dot pitch calculator'],
  short: 'Work out screen pixel density, dot pitch and physical display size.',
  intro: 'Enter a display’s resolution and diagonal size to calculate its pixels per inch (PPI), dot pitch and physical width and height.',
  html: `<div class="tool-layout"><div class="panel" id="ppP">
${sel('ppPre', 'Preset', [['', 'Custom…'], ['1920,1080,24', '24″ Full HD monitor'], ['2560,1440,27', '27″ QHD monitor'], ['3840,2160,27', '27″ 4K monitor'], ['3840,2160,32', '32″ 4K monitor'], ['5120,2880,27', '27″ 5K display'], ['2560,1664,13.6', '13.6″ laptop 2560×1664'], ['1920,1080,15.6', '15.6″ Full HD laptop'], ['1179,2556,6.1', '6.1″ phone 1179×2556'], ['1290,2796,6.7', '6.7″ phone 1290×2796'], ['3840,2160,55', '55″ 4K TV']], '')}
<div class="grid2">${num('ppW', 'Horizontal pixels', 2560, 'min="1"')}${num('ppH', 'Vertical pixels', 1440, 'min="1"')}</div>
${num('ppD', 'Diagonal size (inches)', 27, 'min="0.1" step="any"')}
</div><div class="panel"><div class="result-big" id="ppR">–</div><div class="stat-grid"><div class="stat"><span>Dot pitch</span><b id="ppDp">–</b></div><div class="stat"><span>Total pixels</span><b id="ppT">–</b></div><div class="stat"><span>Aspect ratio</span><b id="ppA">–</b></div><div class="stat"><span>Width</span><b id="ppSW">–</b></div><div class="stat"><span>Height</span><b id="ppSH">–</b></div><div class="stat"><span>Retina distance*</span><b id="ppRd">–</b></div></div><p class="note">*Approximate viewing distance at which individual pixels become indistinguishable for 20/20 vision.</p></div></div>`,
  js: () => {
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    function upd() {
      const w = +el('ppW').value, h = +el('ppH').value, d = +el('ppD').value; if (!w || !h || !d) return;
      const dp = Math.hypot(w, h), ppi = dp / d, wi = d * w / dp, hi = d * h / dp, g = gcd(w, h);
      el('ppR').innerHTML = ppi.toFixed(2) + ' <small>PPI</small>'; el('ppDp').textContent = (25.4 / ppi).toFixed(4) + ' mm'; el('ppT').textContent = (w * h).toLocaleString();
      el('ppA').textContent = w / g > 50 ? (w / h).toFixed(2) + ':1' : `${w / g}:${h / g}`; el('ppSW').textContent = `${wi.toFixed(2)}″ · ${(wi * 2.54).toFixed(1)} cm`; el('ppSH').textContent = `${hi.toFixed(2)}″ · ${(hi * 2.54).toFixed(1)} cm`;
      const rd = 1 / (ppi * Math.tan(Math.PI / 10800)); el('ppRd').textContent = `${rd.toFixed(1)}″ · ${(rd * 2.54).toFixed(0)} cm`;
    }
    el('ppPre').addEventListener('change', e => { if (!e.target.value) return; const [w, h, d] = e.target.value.split(','); el('ppW').value = w; el('ppH').value = h; el('ppD').value = d; upd(); });
    el('ppP').addEventListener('input', e => { if (e.target.tagName === 'INPUT') el('ppPre').value = ''; upd(); }); upd();
  },
  how: ['Pick a preset or enter the screen’s horizontal and vertical resolution.', 'Enter the diagonal screen size in inches.', 'Read the pixel density (PPI) and dot pitch.', 'Check physical width/height and the retina viewing distance.'],
  about: `<p>Pixel density, measured in pixels per inch (PPI), determines how sharp a display looks. It is calculated by dividing the diagonal resolution in pixels (√(w² + h²)) by the diagonal size in inches. Phones typically exceed 400 PPI, laptops range from 130–250 PPI and desktop monitors from 90–220 PPI.</p><p>Designers use PPI to understand how large UI elements will physically appear and to decide which @2x or @3x image assets to export.</p>`,
  faq: [['What is the difference between PPI and DPI?', 'PPI (pixels per inch) describes screens; DPI (dots per inch) describes printers. They are often used interchangeably in everyday speech.'], ['What PPI is considered retina?', 'It depends on viewing distance. Around 300 PPI for phones held at 25–30cm and around 110–220 PPI for monitors viewed from 50–70cm.']],
},
{
  slug: 'print-size-calculator', cat: 'calc', name: 'Print Size & DPI Calculator',
  title: 'Print Size Calculator – Pixels to Inches, CM & DPI for Printing',
  desc: 'Calculate print size from pixels and DPI, or the pixels you need for a print size. Convert pixels to inches, cm and mm at 300 DPI and check print quality for A4, letter and photos.',
  kw: ['print size calculator', 'pixels to inches', 'dpi calculator for print', 'pixels to cm', '300 dpi calculator', 'image print size'],
  short: 'Convert between pixels, DPI and physical print size in inches or cm.',
  intro: 'Planning a poster, flyer or photo print? Find out how big your image will print at a given DPI, or how many pixels you need for a target size.',
  html: `<div class="tool-layout even"><div class="panel"><h3>Pixels → print size</h3>
<div class="grid2">${num('psW', 'Width (px)', 3000, 'min="1"')}${num('psH', 'Height (px)', 2400, 'min="1"')}</div>
${sel('psD', 'Print resolution', [[72, '72 DPI · screen'], [150, '150 DPI · posters / large prints'], [200, '200 DPI · good'], [240, '240 DPI · very good'], [300, '300 DPI · professional print'], [600, '600 DPI · line art']], 300)}
<div class="stat-grid"><div class="stat"><span>Inches</span><b id="psIn">–</b></div><div class="stat"><span>Centimetres</span><b id="psCm">–</b></div><div class="stat"><span>Millimetres</span><b id="psMm">–</b></div></div></div>
<div class="panel"><h3>Print size → pixels needed</h3>
${sel('psPaper', 'Paper / photo size', [['210,297,mm', 'A4 · 210 × 297 mm'], ['297,420,mm', 'A3 · 297 × 420 mm'], ['148,210,mm', 'A5 · 148 × 210 mm'], ['8.5,11,in', 'US Letter · 8.5 × 11 in'], ['11,17,in', 'Tabloid · 11 × 17 in'], ['4,6,in', 'Photo · 4 × 6 in'], ['5,7,in', 'Photo · 5 × 7 in'], ['8,10,in', 'Photo · 8 × 10 in'], ['3.5,2,in', 'Business card · 3.5 × 2 in'], ['18,24,in', 'Poster · 18 × 24 in'], ['custom', 'Custom size']], '210,297,mm')}
<div class="grid3">${num('psPW', 'Width', 210, 'min="0" step="any"')}${num('psPH', 'Height', 297, 'min="0" step="any"')}${sel('psPU', 'Unit', ['mm', 'cm', 'in'], 'mm')}</div>
${sel('psPD', 'Target DPI', [150, 200, 300, 600], 300)}
<div class="result-big" id="psPx">–</div><p class="note" id="psMp"></p></div></div>`,
  js: () => {
    function a() { const w = +el('psW').value, h = +el('psH').value, d = +el('psD').value, iw = w / d, ih = h / d; el('psIn').textContent = `${iw.toFixed(2)} × ${ih.toFixed(2)}`; el('psCm').textContent = `${(iw * 2.54).toFixed(1)} × ${(ih * 2.54).toFixed(1)}`; el('psMm').textContent = `${Math.round(iw * 25.4)} × ${Math.round(ih * 25.4)}`; }
    function b() { const u = el('psPU').value, k = u === 'in' ? 1 : u === 'cm' ? 1 / 2.54 : 1 / 25.4, d = +el('psPD').value, w = Math.round(el('psPW').value * k * d), h = Math.round(el('psPH').value * k * d); el('psPx').innerHTML = `${w.toLocaleString()} × ${h.toLocaleString()} <small>px</small>`; el('psMp').textContent = `${(w * h / 1e6).toFixed(1)} megapixels needed at ${d} DPI. Add 3 mm (0.125″) bleed on each side for edge-to-edge printing.`; }
    el('psPaper').addEventListener('change', e => { if (e.target.value === 'custom') return; const [w, h, u] = e.target.value.split(','); el('psPW').value = w; el('psPH').value = h; el('psPU').value = u; b(); });
    ['psW', 'psH', 'psD'].forEach(i => el(i).addEventListener('input', a)); ['psPW', 'psPH', 'psPU', 'psPD'].forEach(i => el(i).addEventListener('input', () => { if (i === 'psPW' || i === 'psPH') el('psPaper').value = 'custom'; b(); }));
    ['psPU', 'psPD', 'psD'].forEach(i => el(i).addEventListener('change', () => { a(); b(); })); a(); b();
  },
  how: ['Enter your image’s pixel dimensions and choose a print DPI to see the print size.', 'Or pick a paper size such as A4 or 8×10 to see the pixels required.', 'Use 300 DPI for professional prints and 150 DPI for large posters viewed from a distance.', 'Add bleed if your design runs to the edge of the paper.'],
  about: `<p>Print resolution is measured in dots per inch (DPI). To print sharply at a given size, multiply the size in inches by the DPI: an A4 page (8.27 × 11.69 in) at 300 DPI needs about <strong>2480 × 3508 pixels</strong>. Large posters are viewed from further away, so 150 DPI is usually enough.</p><p>Changing the DPI value in a file’s metadata doesn’t add detail — only the pixel dimensions matter for print quality.</p>`,
  faq: [['How many pixels do I need for an A4 print?', 'At 300 DPI an A4 print needs 2480 × 3508 pixels. At 150 DPI it needs 1240 × 1754.'], ['Is 72 DPI good for printing?', 'No. 72 DPI is a screen convention. For print, aim for 300 DPI for close viewing and at least 150 DPI for posters.']],
},
{
  slug: 'golden-ratio-calculator', cat: 'calc', name: 'Golden Ratio Calculator',
  title: 'Golden Ratio Calculator – Phi (1.618) for Layout & Typography',
  desc: 'Calculate golden ratio proportions (φ = 1.618) for design layouts, logos and typography. Split any length into golden sections and get ideal line height from font size and width.',
  kw: ['golden ratio calculator', 'phi calculator', '1.618 ratio', 'golden ratio design', 'golden ratio typography', 'golden section'],
  short: 'Split lengths into golden proportions and calculate golden typography.',
  intro: 'Use the divine proportion in your layouts. Enter any length to get its golden sections, or calculate harmonious line height for your text.',
  html: `<div class="tool-layout even"><div class="panel"><h3>Golden sections</h3>
<div class="grid2">${num('grV', 'Value', 960, 'min="0" step="any"')}${sel('grM', 'This value is…', [['total', 'Total length (A + B)'], ['a', 'Longer side (A)'], ['b', 'Shorter side (B)']], 'total')}</div>
<div class="stat-grid"><div class="stat"><span>Total (A+B)</span><b id="grT">–</b></div><div class="stat"><span>Longer (A)</span><b id="grA">–</b></div><div class="stat"><span>Shorter (B)</span><b id="grB">–</b></div></div>
<div style="display:flex;height:56px;border-radius:10px;overflow:hidden;font-weight:700;font-size:14px"><div style="flex:1.618;background:var(--ink);color:var(--beige);display:grid;place-items:center">A · 61.8%</div><div style="flex:1;background:var(--beige-2);display:grid;place-items:center">B · 38.2%</div></div>
<p class="note">Example: a 960px layout splits into a 593px content column and a 367px sidebar.</p></div>
<div class="panel"><h3>Golden ratio typography</h3><div class="grid2">${num('grF', 'Font size (px)', 16, 'min="6" step="any"')}${num('grW', 'Content width (px)', 640, 'min="50"')}</div>
<div class="stat-grid"><div class="stat"><span>Line height</span><b id="grLh">–</b></div><div class="stat"><span>Ideal width</span><b id="grIw">–</b></div><div class="stat"><span>Heading size</span><b id="grH">–</b></div></div>${code('grCode', 'Copy CSS')}</div></div>`,
  js: () => {
    const P = (1 + Math.sqrt(5)) / 2, f = n => +n.toFixed(2);
    function a() { const v = +el('grV').value, m = el('grM').value; let t = m === 'total' ? v : m === 'a' ? v * P : v * P * P; t = t || 0; el('grT').textContent = f(t); el('grA').textContent = f(t / P); el('grB').textContent = f(t - t / P); }
    function b() { const fs = +el('grF').value || 16, w = +el('grW').value || 640, ideal = (fs * P) ** 2, lh = fs * (P - (1 / (2 * P)) * (1 - w / ideal)); el('grLh').textContent = f(lh) + 'px'; el('grIw').textContent = Math.round(ideal) + 'px'; el('grH').textContent = f(fs * P * P) + 'px'; el('grCode').textContent = `body {\n  font-size: ${fs}px;\n  line-height: ${f(lh / fs)};\n  max-width: ${Math.round(ideal)}px;\n}\nh1 { font-size: ${f(fs * P * P)}px; }\nh2 { font-size: ${f(fs * P)}px; }`; }
    ['grV', 'grM'].forEach(i => el(i).addEventListener('input', a)); el('grM').addEventListener('change', a); ['grF', 'grW'].forEach(i => el(i).addEventListener('input', b)); a(); b();
  },
  how: ['Enter a length and tell the calculator whether it is the total, the long side or the short side.', 'Read the golden sections A and B.', 'For typography, enter your font size and content width.', 'Copy the suggested CSS line height, width and heading sizes.'],
  about: `<p>The golden ratio, φ ≈ 1.618, appears in nature, architecture and classic art. In design it creates proportions that feel balanced: dividing a layout into 61.8% and 38.2%, sizing a logo’s elements, or scaling typography by φ.</p><p>The typography calculator uses the Golden Ratio Typography formula, which adjusts line height based on both font size and line width — wider lines need more line height to stay readable.</p>`,
  faq: [['What is the golden ratio number?', 'φ (phi) = (1 + √5) / 2 ≈ 1.6180339887.'], ['How do I use the golden ratio in web design?', 'Split layouts 61.8/38.2, scale headings by 1.618, and use it to size spacing and images for natural harmony.']],
},
{
  slug: 'design-unit-converter', cat: 'calc', name: 'Design Unit Converter',
  title: 'Design Unit Converter – PX, PT, EM, Inches, CM & MM Converter',
  desc: 'Convert between pixels, points, picas, em, rem, inches, centimetres and millimetres for print and web design. Set custom DPI and base font size for accurate unit conversions.',
  kw: ['px to pt', 'pt to px', 'pixels to mm', 'cm to px', 'unit converter design', 'inches to pixels'],
  short: 'Convert px, pt, pc, em, rem, in, cm and mm in one place.',
  intro: 'Translate measurements between screen and print units. Enter a value once and see it in every unit, using the DPI and base font size you choose.',
  html: `<div class="tool-layout"><div class="panel" id="ucP">
<div class="grid2">${num('ucV', 'Value', 12, 'step="any"')}${sel('ucU', 'From unit', [['px', 'Pixels (px)'], ['pt', 'Points (pt)'], ['pc', 'Picas (pc)'], ['em', 'EM'], ['rem', 'REM'], ['in', 'Inches (in)'], ['cm', 'Centimetres (cm)'], ['mm', 'Millimetres (mm)']], 'pt')}</div>
<div class="grid2">${num('ucD', 'DPI / PPI', 96, 'min="1"')}${num('ucB', 'Base font size (px)', 16, 'min="1"')}</div>
<p class="note">CSS uses 96 DPI: 1in = 96px = 72pt. Use 300 for print-resolution pixel values.</p>
</div><div class="panel"><div id="ucOut" class="kv-list"></div></div></div>`,
  js: () => {
    function upd() {
      const v = +el('ucV').value || 0, u = el('ucU').value, d = +el('ucD').value || 96, b = +el('ucB').value || 16;
      const toPx = { px: 1, pt: d / 72, pc: d / 6, em: b, rem: b, in: d, cm: d / 2.54, mm: d / 25.4 }, px = v * toPx[u];
      const L = { px: 'Pixels', pt: 'Points', pc: 'Picas', em: 'EM', rem: 'REM', in: 'Inches', cm: 'Centimetres', mm: 'Millimetres' };
      el('ucOut').innerHTML = Object.keys(toPx).map(k => { const x = +(px / toPx[k]).toFixed(4) + k; return `<div class="kv"${k === u ? ' style="border-color:var(--ink)"' : ''}><span>${L[k]}</span><code>${x}</code><button type="button" class="btn-sm" data-copy="${x}">Copy</button></div>`; }).join('');
    }
    el('ucP').addEventListener('input', upd); el('ucP').addEventListener('change', upd); upd();
  },
  how: ['Enter a value and choose the unit you are converting from.', 'Adjust the DPI (96 for CSS, 300 for print) and base font size if needed.', 'See the value in all other units instantly.', 'Copy the unit you need.'],
  about: `<p>Designers move between print and screen constantly. Print uses absolute units — points, picas, inches and millimetres — while screens use pixels and relative units like em and rem. The link between them is resolution: CSS defines 1 inch as 96 pixels, and typography defines 1 inch as 72 points.</p><p>So 12pt type equals 16px in CSS, and a 10mm margin equals about 37.8px on screen or 118px at 300 DPI.</p>`,
  faq: [['How many pixels is 12pt?', 'At the CSS standard of 96 DPI, 12pt = 16px.'], ['How many pixels are in 1 cm?', 'About 37.8px at 96 DPI and 118.1px at 300 DPI.']],
},
{
  slug: 'layout-grid-calculator', cat: 'calc', name: 'Layout Grid Calculator',
  title: 'Layout Grid Calculator – Column Width, Gutter & 12-Column Grid',
  desc: 'Calculate column widths for responsive layout grids. Enter container width, number of columns, gutter and margins to get exact column sizes, spans and CSS for 12-column grids.',
  kw: ['grid calculator', 'column width calculator', 'layout grid', '12 column grid', 'gutter width', 'web design grid system'],
  short: 'Calculate column widths, gutters and spans for layout grid systems.',
  intro: 'Plan a pixel-perfect column grid for your website or print layout. See every column width and span size, plus a visual overlay.',
  html: `<div class="tool-layout"><div class="panel" id="lgP">
${num('lgW', 'Container width (px)', 1200, 'min="100"')}
<div class="grid3">${num('lgC', 'Columns', 12, 'min="1" max="24"')}${num('lgG', 'Gutter (px)', 24, 'min="0"')}${num('lgM', 'Margin (px)', 24, 'min="0"')}</div>
<div class="stat-grid"><div class="stat"><span>Column width</span><b id="lgCw">–</b></div><div class="stat"><span>Content width</span><b id="lgIw">–</b></div></div>
</div><div class="panel"><div id="lgPrev" style="display:flex;height:120px;border:1px solid var(--line);border-radius:12px;background:var(--beige-3);margin-bottom:16px;overflow:hidden"></div>
<div class="scroll-x"><table class="table"><thead><tr><th>Span</th><th>Width</th><th>% of content</th></tr></thead><tbody id="lgT"></tbody></table></div>${code('lgCode', 'Copy CSS')}</div></div>`,
  js: () => {
    function upd() {
      const W = +el('lgW').value || 0, C = clamp(+el('lgC').value || 1, 1, 24), G = +el('lgG').value || 0, M = +el('lgM').value || 0, inner = W - 2 * M, cw = (inner - G * (C - 1)) / C, f = n => +n.toFixed(2);
      el('lgCw').textContent = f(cw) + 'px'; el('lgIw').textContent = f(inner) + 'px';
      el('lgPrev').style.padding = `0 ${M / W * 100}%`; el('lgPrev').style.gap = `${G / W * 100}%`; el('lgPrev').innerHTML = Array.from({ length: C }, () => '<div style="flex:1;background:rgba(20,20,20,.14);border-left:1px solid rgba(20,20,20,.25);border-right:1px solid rgba(20,20,20,.25)"></div>').join('');
      el('lgT').innerHTML = Array.from({ length: C }, (_, i) => { const n = i + 1, w = cw * n + G * (n - 1); return `<tr><td>${n} col${n > 1 ? 's' : ''}</td><td><code>${f(w)}px</code></td><td>${f(w / inner * 100)}%</td></tr>`; }).join('');
      el('lgCode').textContent = `.container {\n  max-width: ${W}px;\n  margin: 0 auto;\n  padding: 0 ${M}px;\n}\n.grid {\n  display: grid;\n  grid-template-columns: repeat(${C}, 1fr);\n  column-gap: ${G}px;\n}\n/* span example */\n.span-6 { grid-column: span 6; }`;
    }
    el('lgP').addEventListener('input', upd); upd();
  },
  how: ['Enter the total container width.', 'Set the number of columns, gutter width and outer margins.', 'Read the exact column width and every span width in the table.', 'Copy the CSS grid code to implement it.'],
  about: `<p>Column grids bring order and rhythm to layouts. The <strong>12-column grid</strong> is the most popular because 12 divides evenly into halves, thirds, quarters and sixths. Common setups are 1200px with 24px gutters for desktop, 8 columns for tablets and 4 columns for mobile.</p><p>The column width formula is: (container − 2 × margin − gutter × (columns − 1)) ÷ columns.</p>`,
  faq: [['Why use a 12-column grid?', '12 can be divided into 2, 3, 4 and 6 equal parts, giving the most layout flexibility.'], ['What gutter size should I use?', 'Multiples of 8 work well: 16px on mobile, 24px or 32px on desktop.']],
},
];
