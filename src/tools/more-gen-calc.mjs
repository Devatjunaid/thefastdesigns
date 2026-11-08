import { range, num, txt, color, sel, chk, code } from '../lib.mjs';

export default [
{
  slug: 'qr-code-generator', cat: 'gen', name: 'QR Code Generator',
  title: 'Free QR Code Generator – URL, Wi-Fi, Email & Text (PNG & SVG)',
  desc: 'Create free static QR codes for links, Wi-Fi networks, email, phone and text. Custom colors, error correction and size, with PNG and print-ready SVG downloads. No sign-up, never expires.',
  kw: ['qr code generator', 'free qr code', 'wifi qr code', 'qr code svg', 'url to qr code', 'static qr code'],
  short: 'Make static QR codes for links, Wi-Fi and text as PNG or SVG.',
  intro: 'Generate a QR code that works forever: it’s static, so it encodes your data directly with no redirect service in between. Download a PNG or a vector SVG for print.',
  html: `<div class="tool-layout"><div class="panel" id="qrP"><div class="seg" id="qrTabs"><button type="button" class="on" data-q="url">URL / text</button><button type="button" data-q="wifi">Wi-Fi</button><button type="button" data-q="email">Email</button><button type="button" data-q="tel">Phone</button></div>
<div data-qp="url"><label class="f"><span>URL or text</span><textarea id="qrText" rows="3" class="prose">https://thefastdesigns.online</textarea></label></div>
<div data-qp="wifi" hidden>${txt('qrSsid', 'Network name (SSID)', '')}${txt('qrPass', 'Password', '')}${sel('qrSec', 'Security', [['WPA', 'WPA / WPA2 / WPA3'], ['WEP', 'WEP'], ['nopass', 'No password']], 'WPA')}${chk('qrHid', 'Hidden network')}</div>
<div data-qp="email" hidden>${txt('qrMail', 'Email address', '')}${txt('qrSub', 'Subject', '')}</div>
<div data-qp="tel" hidden>${txt('qrTel', 'Phone number (with country code)', '+')}</div>
${sel('qrEc', 'Error correction', [['L', 'Low · 7%'], ['M', 'Medium · 15%'], ['Q', 'Quartile · 25%'], ['H', 'High · 30%']], 'M')}
<div class="grid2">${color('qrFg', 'Foreground', '#141414')}${color('qrBg', 'Background', '#ffffff')}</div>${range('qrSz', 'PNG size', 128, 2048, 1024, 32, 'px')}
<div class="btn-row"><button type="button" class="btn" id="qrPng">Download PNG</button><button type="button" class="btn-alt" id="qrSvg">Download SVG</button></div><p class="note" id="qrInfo"></p></div>
<div class="panel"><div class="preview" style="min-height:360px;background:#fff"><canvas id="qrC" width="320" height="320" style="width:320px;max-width:100%;image-rendering:pixelated"></canvas></div><p class="note" id="qrWarn"></p></div></div>`,
  js: () => {
    const ECC = { L: [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], M: [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28], Q: [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], H: [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30] };
    const BLK = { L: [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25], M: [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49], Q: [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68], H: [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81] };
    const FMT = { L: 1, M: 0, Q: 3, H: 2 };
    const rawMods = v => { let r = (16 * v + 128) * v + 64; if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; } return r; };
    const dataCw = (v, e) => Math.floor(rawMods(v) / 8) - ECC[e][v] * BLK[e][v];
    const gmul = (x, y) => { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 255; };
    function rsDiv(d) { const r = new Array(d).fill(0); r[d - 1] = 1; let root = 1; for (let i = 0; i < d; i++) { for (let j = 0; j < d; j++) { r[j] = gmul(r[j], root); if (j + 1 < d) r[j] ^= r[j + 1]; } root = gmul(root, 2); } return r; }
    function rsRem(data, div) { const r = div.map(() => 0); for (const b of data) { const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => r[i] ^= gmul(c, f)); } return r; }
    function encode(text, ecl) {
      const bytes = [...new TextEncoder().encode(text)]; let ver = 0;
      for (let v = 1; v <= 40; v++) { const cc = v < 10 ? 8 : 16; if (4 + cc + bytes.length * 8 <= dataCw(v, ecl) * 8) { ver = v; break; } }
      if (!ver) throw new Error('Too much data for a QR code');
      const bits = [], put = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
      put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(b => put(b, 8));
      const cap = dataCw(ver, ecl) * 8; put(0, Math.min(4, cap - bits.length)); put(0, (8 - bits.length % 8) % 8);
      for (let p = 0xEC; bits.length < cap; p ^= 0xEC ^ 0x11) put(p, 8);
      const data = []; for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
      const nb = BLK[ecl][ver], el2 = ECC[ecl][ver], raw = Math.floor(rawMods(ver) / 8), nShort = nb - raw % nb, sLen = Math.floor(raw / nb), div = rsDiv(el2), blocks = [];
      for (let i = 0, k = 0; i < nb; i++) { const dat = data.slice(k, k + sLen - el2 + (i < nShort ? 0 : 1)); k += dat.length; const ecc = rsRem(dat, div); if (i < nShort) dat.push(0); blocks.push(dat.concat(ecc)); }
      const all = []; for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i !== sLen - el2 || j >= nShort) all.push(b[i]); });
      const n = ver * 4 + 17, M = [...Array(n)].map(() => Array(n).fill(false)), F = [...Array(n)].map(() => Array(n).fill(false));
      const setF = (x, y, d) => { M[y][x] = d; F[y][x] = true; };
      for (let i = 0; i < n; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
      const finder = (x, y) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const d = Math.max(Math.abs(dx), Math.abs(dy)), xx = x + dx, yy = y + dy; if (xx >= 0 && xx < n && yy >= 0 && yy < n) setF(xx, yy, d !== 2 && d !== 4); } };
      finder(3, 3); finder(n - 4, 3); finder(3, n - 4);
      if (ver > 1) { const na = Math.floor(ver / 7) + 2, step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (na * 2 - 2)) * 2, pos = [6]; for (let p = n - 7; pos.length < na; p -= step) pos.splice(1, 0, p);
        pos.forEach((a, i) => pos.forEach((b, j) => { if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) return; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setF(a + dx, b + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); })); }
      const fmt = mask => { const d = FMT[ecl] << 3 | mask; let r = d; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537); const b = (d << 10 | r) ^ 0x5412, g = i => ((b >>> i) & 1) === 1;
        for (let i = 0; i <= 5; i++) setF(8, i, g(i)); setF(8, 7, g(6)); setF(8, 8, g(7)); setF(7, 8, g(8)); for (let i = 9; i < 15; i++) setF(14 - i, 8, g(i));
        for (let i = 0; i < 8; i++) setF(n - 1 - i, 8, g(i)); for (let i = 8; i < 15; i++) setF(8, n - 15 + i, g(i)); setF(8, n - 8, true); };
      fmt(0);
      if (ver >= 7) { let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25); const b = ver << 12 | r; for (let i = 0; i < 18; i++) { const bit = ((b >>> i) & 1) === 1, a = n - 11 + i % 3, c = Math.floor(i / 3); setF(a, c, bit); setF(c, a, bit); } }
      let i = 0; for (let right = n - 1; right >= 1; right -= 2) { if (right === 6) right = 5; for (let vert = 0; vert < n; vert++) for (let j = 0; j < 2; j++) { const x = right - j, up = ((right + 1) & 2) === 0, y = up ? n - 1 - vert : vert; if (!F[y][x] && i < all.length * 8) { M[y][x] = ((all[i >>> 3] >>> (7 - (i & 7))) & 1) === 1; i++; } } }
      const MASKS = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x, y) => x % 3 === 0, (x, y) => (x + y) % 3 === 0, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0, (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0];
      const applyMask = m => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!F[y][x] && MASKS[m](x, y)) M[y][x] = !M[y][x]; };
      const penalty = () => { let p = 0, dark = 0; const line = get => { let run = 1, prev = get(0); for (let k = 1; k < n; k++) { const c = get(k); if (c === prev) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else { run = 1; prev = c; } } let s = ''; for (let k = 0; k < n; k++) s += get(k) ? 1 : 0; p += 40 * ((s.match(/(?=10111010000|00001011101)/g) || []).length); };
        for (let y = 0; y < n; y++) line(x => M[y][x]); for (let x = 0; x < n; x++) line(y => M[y][x]);
        for (let y = 0; y < n - 1; y++) for (let x = 0; x < n - 1; x++) { const c = M[y][x]; if (c === M[y][x + 1] && c === M[y + 1][x] && c === M[y + 1][x + 1]) p += 3; }
        M.forEach(r => r.forEach(c => dark += c)); p += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10; return p; };
      let best = 0, bp = Infinity; for (let m = 0; m < 8; m++) { applyMask(m); fmt(m); const p = penalty(); if (p < bp) { bp = p; best = m; } applyMask(m); }
      applyMask(best); fmt(best); return { M, n, ver };
    }
    let tab = 'url', last = null;
    const esc = s => s.replace(/([\\;,:"])/g, '\\$1');
    function payload() { if (tab === 'wifi') return `WIFI:T:${el('qrSec').value};S:${esc(el('qrSsid').value)};${el('qrSec').value === 'nopass' ? '' : `P:${esc(el('qrPass').value)};`}${el('qrHid').checked ? 'H:true;' : ''};`; if (tab === 'email') return `mailto:${el('qrMail').value}${el('qrSub').value ? '?subject=' + encodeURIComponent(el('qrSub').value) : ''}`; if (tab === 'tel') return 'tel:' + el('qrTel').value.replace(/[^\d+]/g, ''); return el('qrText').value; }
    function draw(c, px) { const { M, n } = last, q = 4, s = Math.max(1, Math.floor(px / (n + 2 * q))), W = s * (n + 2 * q); c.width = c.height = W; const x = c.getContext('2d'); x.fillStyle = el('qrBg').value; x.fillRect(0, 0, W, W); x.fillStyle = el('qrFg').value; M.forEach((r, y) => r.forEach((d, xx) => d && x.fillRect((xx + q) * s, (y + q) * s, s, s))); }
    function upd() {
      const t = payload(); el('qrWarn').textContent = ''; if (!t) return;
      try { last = encode(t, el('qrEc').value); } catch (e) { el('qrWarn').textContent = e.message; return; }
      draw(el('qrC'), 320); el('qrInfo').textContent = `Version ${last.ver} · ${last.n}×${last.n} modules · ${new TextEncoder().encode(t).length} bytes`;
      const cr = contrastRatio(parseColor(el('qrFg').value), parseColor(el('qrBg').value)); if (luminance(parseColor(el('qrFg').value)) > luminance(parseColor(el('qrBg').value))) el('qrWarn').textContent = 'Warning: light-on-dark QR codes are not supported by some scanners.'; else if (cr < 4) el('qrWarn').textContent = 'Warning: low contrast between colors may make the code hard to scan.';
    }
    el('qrTabs').addEventListener('click', e => { const q = e.target.dataset.q; if (!q) return; tab = q; document.querySelectorAll('#qrTabs button').forEach(b => b.classList.toggle('on', b === e.target)); document.querySelectorAll('[data-qp]').forEach(d => d.hidden = d.dataset.qp !== q); upd(); });
    el('qrP').addEventListener('input', upd); el('qrP').addEventListener('change', upd);
    el('qrPng').onclick = async () => { if (!last) return; const c = makeCanvas(1, 1); draw(c, +el('qrSz').value); downloadBlob(await toBlob(c), 'qr-code.png'); };
    el('qrSvg').onclick = () => { if (!last) return; const { M, n } = last, q = 4; let d = ''; M.forEach((r, y) => r.forEach((v, x) => { if (v) d += `M${x + q},${y + q}h1v1h-1z`; })); downloadText(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n + 2 * q} ${n + 2 * q}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="${el('qrBg').value}"/><path d="${d}" fill="${el('qrFg').value}"/></svg>`, 'qr-code.svg', 'image/svg+xml'); };
    upd();
  },
  how: ['Choose the type: URL/text, Wi-Fi, email or phone.', 'Fill in the details; the QR code updates as you type.', 'Pick error correction and colors (keep dark on light).', 'Download a PNG for screens or an SVG for print, and test it with your phone camera.'],
  about: `<p>A QR (Quick Response) code stores data in a grid of square modules. It was invented in 1994 by Denso Wave for tracking car parts and is now an ISO standard (ISO/IEC 18004). This generator creates <strong>static</strong> codes: your URL or text is encoded directly into the pattern. There is no tracking redirect, no account and nothing that can expire.</p><p>Error correction uses Reed–Solomon codes. Higher levels let the code survive damage or a logo overlay, but add more modules. Level M (about 15% recovery) is a good default for screens and print.</p>`,
  tips: ['Keep at least a 4-module quiet zone (white margin) around the code; the downloads include it.', 'For print, the code should be roughly 2 cm (0.8 in) wide at minimum; increase size for long scanning distances (about 1/10 of the distance).', 'Shorter URLs give simpler codes that scan faster; use a short, clean link where possible.', 'Use error correction H if you plan to place a small logo in the middle.', 'Always test the final printed or exported code with two different phones before publishing.'],
  faq: [['Do these QR codes expire?', 'No. They are static codes that contain your data directly, so they work as long as the destination (for example your website) exists.'], ['Can I change the URL after printing?', 'Not with a static code. Changing the destination later requires a dynamic QR service that uses a redirect link.'], ['Which format should I use for print?', 'SVG. It is vector, so it stays sharp at any size.']],
},
{
  slug: 'noise-texture-generator', cat: 'gen', name: 'Noise Texture Generator',
  title: 'Noise Texture Generator – Grain Overlay PNG & CSS Background',
  desc: 'Generate seamless noise and grain textures for backgrounds and gradients. Set grain size, opacity, color and monochrome or color noise, then download a tileable PNG or copy CSS.',
  kw: ['noise texture generator', 'grain texture', 'noise background css', 'film grain overlay', 'seamless noise png'],
  short: 'Create tileable grain textures as PNG or ready-to-use CSS.',
  intro: 'Add subtle grain to flat colors and gradients for a tactile, printed feel. The texture tiles seamlessly and can be layered with CSS.',
  html: `<div class="tool-layout"><div class="panel" id="nzP">${sel('nzT', 'Noise type', [['mono', 'Monochrome'], ['color', 'Color'], ['light', 'Light specks only'], ['dark', 'Dark specks only']], 'mono')}
${range('nzO', 'Opacity', 2, 100, 18, 1, '%')}${range('nzG', 'Grain size', 1, 4, 1, 1, 'px')}${range('nzD', 'Density', 10, 100, 100, 5, '%')}${sel('nzS', 'Tile size', [[128, '128px'], [256, '256px'], [512, '512px']], 256)}${color('nzBg', 'Preview background', '#c8a97e')}
<div class="btn-row"><button type="button" class="btn" id="nzGo">Regenerate</button><button type="button" class="btn-alt" id="nzDl">Download PNG tile</button></div></div>
<div class="panel"><div class="preview" id="nzPrev" style="min-height:340px"></div>${code('nzCode', 'Copy CSS')}</div></div>`,
  js: () => {
    let url = '';
    function gen() {
      const S = +el('nzS').value, g = +el('nzG').value, t = el('nzT').value, o = el('nzO').value / 100, dens = el('nzD').value / 100, c = makeCanvas(S, S), x = c.getContext('2d'), d = x.createImageData(S, S), p = d.data;
      for (let y = 0; y < S; y += g) for (let xx = 0; xx < S; xx += g) {
        if (Math.random() > dens) continue; let r, gg, b, v = Math.random() * 255; if (t === 'color') { r = Math.random() * 255; gg = Math.random() * 255; b = Math.random() * 255; } else { if (t === 'light') v = 255; if (t === 'dark') v = 0; r = gg = b = v; } const a = (t === 'light' || t === 'dark' ? Math.random() : 1) * o * 255;
        for (let dy = 0; dy < g && y + dy < S; dy++) for (let dx = 0; dx < g && xx + dx < S; dx++) { const i = ((y + dy) * S + xx + dx) * 4; p[i] = r; p[i + 1] = gg; p[i + 2] = b; p[i + 3] = a; }
      }
      x.putImageData(d, 0, 0); url = c.toDataURL('image/png'); upd(); c.toBlob(b => el('nzDl').onclick = () => downloadBlob(b, `noise-${S}.png`));
    }
    function upd() { el('nzPrev').style.background = `url(${url}), ${el('nzBg').value}`; el('nzCode').textContent = `/* Save the PNG as noise.png, or paste the data URI */\n.grain {\n  background-color: ${el('nzBg').value};\n  background-image: url("noise.png");\n  background-repeat: repeat;\n}\n\n/* Data URI (${fmtBytes(url.length)}): */\n/* url("${url.slice(0, 60)}…") */`; }
    el('nzP').addEventListener('change', gen); el('nzP').addEventListener('input', e => { if (e.target.type === 'range') gen(); else upd(); }); el('nzGo').onclick = gen; gen();
  },
  how: ['Choose monochrome, color, light or dark noise.', 'Set opacity, grain size and density.', 'Preview it over your background color.', 'Download the tileable PNG and use it as a repeating background.'],
  about: `<p>Grain breaks up large flat areas and smooth gradients, which makes digital designs feel more physical and also hides color banding: the visible stripes that appear in subtle gradients on 8-bit displays. Because each pixel is random, the tile repeats without visible seams at normal viewing sizes.</p><p>A 256px PNG tile of semi-transparent noise is usually 50–150 KB, so keep opacity low and reuse one tile across the site, where it will be cached after the first load.</p>`,
  tips: ['Keep opacity between 5% and 20%; strong grain looks dirty rather than textured.', 'Layer noise over gradients as the first background-image so it sits on top.', 'Light specks work best on dark backgrounds and dark specks on light ones.', 'Use a 128px tile for small elements and 256px for full-page backgrounds to limit file size.', 'Use mix-blend-mode: overlay on a noise layer for richer, contrast-aware grain.'],
  faq: [['Why add noise to a gradient?', 'It hides banding and adds a subtle texture that makes flat digital colors feel less sterile.'], ['Is the texture seamless?', 'Yes. Random noise has no structure, so the tile repeats without visible edges.']],
},
{
  slug: 'text-case-converter', cat: 'gen', name: 'Text Case Converter',
  title: 'Text Case Converter – Title Case, Sentence Case, UPPER & camelCase',
  desc: 'Convert text to Title Case, Sentence case, UPPERCASE, lowercase, camelCase, PascalCase, snake_case, kebab-case and CONSTANT_CASE. Smart title case for headlines, with word and character counts.',
  kw: ['text case converter', 'title case converter', 'sentence case', 'uppercase to lowercase', 'camelcase converter', 'kebab case'],
  short: 'Switch text between title, sentence, upper, lower and code cases.',
  intro: 'Fix headings, buttons and file names in one click. Title case follows headline rules and keeps short words like “and” and “of” lowercase.',
  html: `<label class="f"><span>Your text</span><textarea id="tcIn" rows="6" class="prose">the quick guide to choosing colors for a brand identity</textarea></label>
<div class="btn-row" id="tcBtns">${[['title', 'Title Case'], ['sentence', 'Sentence case'], ['upper', 'UPPERCASE'], ['lower', 'lowercase'], ['capital', 'Capitalize Each Word'], ['camel', 'camelCase'], ['pascal', 'PascalCase'], ['snake', 'snake_case'], ['kebab', 'kebab-case'], ['constant', 'CONSTANT_CASE'], ['invert', 'iNVERT cASE']].map(([k, l]) => `<button type="button" class="btn-sm" data-c="${k}">${l}</button>`).join('')}</div>
<div class="stat-grid" style="margin-top:14px"><div class="stat"><span>Characters</span><b id="tcCh">0</b></div><div class="stat"><span>Words</span><b id="tcW">0</b></div><div class="stat"><span>Lines</span><b id="tcL">0</b></div></div><div class="btn-row"><button type="button" class="btn" data-copy-from="tcIn">Copy text</button></div>`,
  js: () => {
    const SMALL = new Set('a an and as at but by en for if in nor of off on or per so the to up via vs yet'.split(' '));
    const words = s => s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_\-]+/g, ' ').trim().split(/\s+/).filter(Boolean);
    const C = {
      upper: s => s.toUpperCase(), lower: s => s.toLowerCase(),
      capital: s => s.toLowerCase().replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + b.toUpperCase()),
      sentence: s => s.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, m => m.toUpperCase()).replace(/\bi\b/g, 'I'),
      title: s => s.split('\n').map(line => { const w = line.split(/(\s+)/); const idx = w.map((x, i) => /\S/.test(x) ? i : -1).filter(i => i >= 0); return w.map((x, i) => { if (!/\S/.test(x)) return x; const lw = x.toLowerCase(), first = i === idx[0], lastW = i === idx[idx.length - 1], afterColon = i > 1 && /[:.!?]$/.test(w[i - 2] || ''); if (!first && !lastW && !afterColon && SMALL.has(lw.replace(/[^\w]/g, ''))) return lw; if (/[A-Z].*[A-Z]/.test(x.slice(1)) || /\d/.test(x)) return x; return lw.replace(/\p{L}/u, c => c.toUpperCase()).replace(/-(\p{L})/gu, (m, c) => '-' + c.toUpperCase()); }).join(''); }).join('\n'),
      camel: s => words(s).map((w, i) => i ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()).join(''),
      pascal: s => words(s).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(''),
      snake: s => words(s).map(w => w.toLowerCase()).join('_'), kebab: s => words(s).map(w => w.toLowerCase()).join('-'), constant: s => words(s).map(w => w.toUpperCase()).join('_'),
      invert: s => [...s].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
    };
    const stats = () => { const v = el('tcIn').value; el('tcCh').textContent = v.length; el('tcW').textContent = v.trim() ? v.trim().split(/\s+/).length : 0; el('tcL').textContent = v ? v.split('\n').length : 0; };
    el('tcBtns').addEventListener('click', e => { const k = e.target.dataset.c; if (!k) return; el('tcIn').value = C[k](el('tcIn').value); stats(); });
    el('tcIn').addEventListener('input', stats); stats();
  },
  how: ['Paste or type your text.', 'Click the case you want, for example Title Case for a headline.', 'Check the word and character counts.', 'Copy the converted text.'],
  about: `<p>Title case capitalises the main words of a headline. Style guides disagree on details: AP style capitalises words of four letters or more, while Chicago lowercases all articles, coordinating conjunctions and prepositions regardless of length. This converter follows a common middle ground: the first and last words are always capitalised, short articles, conjunctions and prepositions are lowercased, and words with existing inner capitals or numbers (iPhone, CSS3, McDonald) are left alone.</p><p>Programming cases (camelCase, snake_case, kebab-case) are handy for naming CSS classes, design tokens, files and variables.</p>`,
  tips: ['Use sentence case for UI labels and buttons; it reads faster and feels friendlier than title case.', 'Use kebab-case for CSS class names and file names that appear in URLs.', 'Design tokens are commonly written in kebab-case in CSS (--color-primary) and camelCase in JavaScript (colorPrimary).', 'Avoid long passages in ALL CAPS; uppercase text is slower to read. If you need caps for style, use CSS text-transform so screen readers get normal text.', 'Double-check brand names after converting: tools can’t know that “iOS” or “eBay” have special casing.'],
  faq: [['What is the difference between title case and sentence case?', 'Title case capitalises most words in a heading; sentence case only capitalises the first word and proper nouns.'], ['Which words stay lowercase in title case?', 'Short articles, conjunctions and prepositions such as a, an, the, and, but, of, in, on and to, unless they are the first or last word.']],
},
{
  slug: 'spacing-scale-generator', cat: 'gen', name: 'Spacing Scale Generator',
  title: 'Spacing Scale Generator – 4pt & 8pt Grid Spacing Tokens',
  desc: 'Generate a consistent spacing scale for your design system based on a 4pt or 8pt grid, Fibonacci or geometric steps. Export spacing tokens as CSS variables, Tailwind config or JSON.',
  kw: ['spacing scale generator', '8pt grid', 'spacing system', 'design tokens spacing', '4pt grid', 'margin padding scale'],
  short: 'Create spacing tokens on a 4pt or 8pt grid for design systems.',
  intro: 'Consistent spacing is what makes a layout look organised. Pick a base unit and progression to get a ready-made set of spacing tokens.',
  html: `<div class="tool-layout"><div class="panel" id="spP">${sel('spB', 'Base unit', [[4, '4px'], [8, '8px'], [5, '5px'], [6, '6px']], 4)}${sel('spT', 'Progression', [['tshirt', 'Practical (0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16…)'], ['linear', 'Linear multiples (1, 2, 3, 4…)'], ['double', 'Doubling (1, 2, 4, 8, 16…)'], ['fib', 'Fibonacci (1, 2, 3, 5, 8, 13…)']], 'tshirt')}
${range('spN', 'Number of steps', 4, 14, 10)}${txt('spPre', 'Token prefix', 'space')}${sel('spU', 'Unit', ['px', 'rem'], 'px')}</div>
<div class="panel"><div id="spOut" style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px"></div>${code('spCss', 'Copy CSS')}${code('spJson', 'Copy JSON')}</div></div>`,
  js: () => {
    function upd() {
      const b = +el('spB').value, t = el('spT').value, n = +el('spN').value, pre = el('spPre').value.trim() || 'space', u = el('spU').value;
      const seq = { tshirt: [.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24], linear: [...Array(14)].map((_, i) => i + 1), double: [.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096], fib: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610] }[t].slice(0, n);
      const v = m => u === 'rem' ? +(m * b / 16).toFixed(4) + 'rem' : m * b + 'px', names = seq.map((m, i) => String(i + 1));
      el('spOut').innerHTML = seq.map((m, i) => `<div style="display:flex;align-items:center;gap:12px"><code style="width:110px;font-size:12px;color:var(--muted)">--${pre}-${names[i]}</code><span style="height:16px;width:${Math.min(m * b, 400)}px;background:var(--ink);border-radius:3px"></span><b style="font-size:13px">${m * b}px</b></div>`).join('');
      el('spCss').textContent = ':root {\n' + seq.map((m, i) => `  --${pre}-${names[i]}: ${v(m)};`).join('\n') + '\n}';
      el('spJson').textContent = JSON.stringify({ [pre]: Object.fromEntries(seq.map((m, i) => [names[i], v(m)])) }, null, 2);
    }
    el('spP').addEventListener('input', upd); el('spP').addEventListener('change', upd); upd();
  },
  how: ['Choose a base unit, usually 4px or 8px.', 'Choose how the steps grow.', 'Set the number of steps and a token prefix.', 'Copy the CSS variables or JSON tokens.'],
  about: `<p>The 8-point grid, popularised by Material Design and many product teams, sizes and spaces elements in multiples of 8px. Most common screen sizes divide evenly by 8, and halving and doubling stay on the grid. A 4px base gives finer control for dense interfaces and small components, which is why many systems use 4px steps for small values and 8px steps for larger ones.</p><p>The “practical” progression grows slowly at small sizes, where you need fine control for padding, and faster at large sizes, where you only need a few section-spacing values.</p>`,
  tips: ['Use the smallest steps (4–12px) inside components and the larger ones (32–96px) between page sections.', 'Space related items closer together than unrelated ones; spacing communicates grouping.', 'Limit yourself to the tokens; one-off values like 13px or 27px are what make layouts look messy.', 'Set line heights to multiples of 4 so text aligns to the same rhythm as spacing.', 'Name tokens by step number or t-shirt size and never by value, so you can retune the scale later.'],
  faq: [['What is the 8pt grid?', 'A system where all spacing and sizes are multiples of 8px, which keeps layouts consistent and scales cleanly across screen densities.'], ['Should I use 4px or 8px?', 'Use 8px as the main rhythm and 4px for fine adjustments inside small components like icons, badges and inputs.']],
},
{
  slug: 'line-height-calculator', cat: 'calc', name: 'Line Height Calculator',
  title: 'Line Height Calculator – Ideal Leading for Readable Typography',
  desc: 'Calculate the ideal line height for any font size. Get unitless, px and rem values, snap to a 4pt baseline grid, check WCAG text spacing and preview readability with your settings.',
  kw: ['line height calculator', 'leading calculator', 'css line-height', 'best line height for readability', 'typography line spacing'],
  short: 'Find readable line height values in unitless, px and rem.',
  intro: 'Line height has a bigger effect on readability than almost any other typography setting. Enter your font size and line length to get a solid recommendation.',
  html: `<div class="tool-layout"><div class="panel" id="lhP">${num('lhF', 'Font size (px)', 16, 'min="6" step="any"')}${range('lhR', 'Line height ratio', 1, 2.2, 1.5, .05)}${range('lhCh', 'Characters per line', 30, 110, 66)}${sel('lhG', 'Snap to grid', [[0, 'No snapping'], [4, '4px grid'], [8, '8px grid']], 4)}
<button type="button" class="btn-alt" id="lhSug" style="width:100%">Suggest ratio for this size & length</button></div>
<div class="panel"><div class="stat-grid"><div class="stat"><span>Unitless</span><b id="lhU">–</b></div><div class="stat"><span>Pixels</span><b id="lhPx">–</b></div><div class="stat"><span>REM</span><b id="lhRem">–</b></div><div class="stat"><span>Line width</span><b id="lhW">–</b></div></div><p class="note" id="lhNote"></p>
<div class="preview" style="display:block;min-height:auto;background:#fff"><p id="lhPrev" style="margin:0">Good typography is invisible. When line height, line length and font size work together, readers stop noticing the text and start absorbing the ideas. Too little space and lines blur together; too much and the eye loses its place when jumping to the next line. Most body text reads best with a line height between 1.4 and 1.6 times the font size.</p></div>${code('lhCode', 'Copy CSS')}</div></div>`,
  js: () => {
    function upd() {
      const f = +el('lhF').value || 16, g = +el('lhG').value; let px = f * el('lhR').value; if (g) px = Math.round(px / g) * g; const u = +(px / f).toFixed(3), ch = +el('lhCh').value;
      el('lhU').textContent = u; el('lhPx').textContent = px + 'px'; el('lhRem').textContent = +(px / 16).toFixed(4) + 'rem'; el('lhW').textContent = ch + 'ch ≈ ' + Math.round(ch * f * .5) + 'px';
      el('lhNote').textContent = u < 1.5 && f <= 20 ? 'Note: WCAG 1.4.12 requires that layouts still work when users set line height to 1.5; for body text, 1.5 is a good default.' : u > 1.8 ? 'Very loose: readers may lose track of which line comes next.' : 'This is a comfortable line height for body text.';
      const p = el('lhPrev'); p.style.fontSize = f + 'px'; p.style.lineHeight = u; p.style.maxWidth = ch + 'ch';
      el('lhCode').textContent = `body {\n  font-size: ${f}px;\n  line-height: ${u};\n}\n.prose {\n  max-width: ${ch}ch;\n}`;
    }
    el('lhSug').onclick = () => { const f = +el('lhF').value || 16, ch = +el('lhCh').value; let r = f >= 40 ? 1.1 : f >= 28 ? 1.2 : f >= 20 ? 1.35 : 1.5; r += (ch - 66) * .003; el('lhR').value = clamp(+r.toFixed(2), 1, 2.2); syncOut(el('lhR')); upd(); };
    el('lhP').addEventListener('input', upd); el('lhP').addEventListener('change', upd); upd();
  },
  how: ['Enter your font size.', 'Set the line height ratio, or click “Suggest ratio”.', 'Set the line length in characters and optional grid snapping.', 'Check the preview and copy the CSS.'],
  about: `<p>Line height (leading) is the vertical distance between lines of text. For body text, 1.4–1.6 is the widely recommended range, and WCAG success criterion 1.4.12 (Text Spacing) requires that content still works when users increase line height to at least 1.5. Headings need less, around 1.1–1.3, because large type already has generous space between lines.</p><p>Line length matters too: longer lines need more line height so the eye can find the start of the next line. Readable body text usually sits between 45 and 75 characters per line.</p>`,
  tips: ['Write line-height without a unit (1.5, not 1.5em) so child elements inherit the ratio, not a fixed size.', 'Decrease the ratio as font size increases: body 1.5, subheads 1.3, large headings 1.1–1.2.', 'Snap line heights to a 4px grid to keep vertical rhythm consistent with your spacing scale.', 'Use the ch unit for max-width to control line length directly in characters.', 'Fonts with a tall x-height usually need a bit more line height than fonts with a small x-height.'],
  faq: [['What is the best line height for body text?', 'Around 1.5 times the font size is a reliable default and matches the WCAG text spacing guideline.'], ['Should line-height have units?', 'Usually no. A unitless value scales with each element’s own font size and avoids inheritance problems.']],
},
{
  slug: 'viewport-unit-converter', cat: 'calc', name: 'Viewport Unit Converter',
  title: 'VW to PX Converter – Viewport Units (vw, vh, %) Calculator',
  desc: 'Convert pixels to vw and vh and back for any screen size. Pick common device presets, see percentage of container width and get CSS values for responsive layouts and fluid sizing.',
  kw: ['vw to px', 'px to vw', 'viewport units calculator', 'vh to px', 'responsive units converter'],
  short: 'Convert px ↔ vw/vh and percentages for any screen size.',
  intro: 'Find out what 5vw actually is on a phone, or which vw value gives you 48px on a laptop. Choose a device preset or enter your own viewport size.',
  html: `<div class="tool-layout"><div class="panel" id="vuP">${sel('vuD', 'Device preset', [['390x844', 'Phone · 390 × 844'], ['360x800', 'Android phone · 360 × 800'], ['768x1024', 'Tablet portrait · 768 × 1024'], ['1280x800', 'Laptop · 1280 × 800'], ['1440x900', 'Laptop · 1440 × 900'], ['1920x1080', 'Desktop · 1920 × 1080'], ['custom', 'Custom']], '1440x900')}
<div class="grid2">${num('vuW', 'Viewport width', 1440, 'min="1"')}${num('vuH', 'Viewport height', 900, 'min="1"')}</div>${num('vuC', 'Container width for % (px)', 1200, 'min="1"')}</div>
<div class="panel"><h3>Pixels → viewport units</h3>${num('vuPx', 'Pixels', 48, 'step="any"')}<div class="kv-list" id="vuA"></div><h3 style="margin-top:20px">Viewport units → pixels</h3><div class="grid2">${num('vuV', 'Value', 5, 'step="any"')}${sel('vuVu', 'Unit', ['vw', 'vh', 'vmin', 'vmax', '%'], 'vw')}</div><div class="result-big" id="vuB">–</div></div></div>`,
  js: () => {
    const f = n => +n.toFixed(3);
    function upd() {
      const W = +el('vuW').value || 1, H = +el('vuH').value || 1, C = +el('vuC').value || 1, p = +el('vuPx').value || 0;
      el('vuA').innerHTML = [['vw', p / W * 100], ['vh', p / H * 100], ['vmin', p / Math.min(W, H) * 100], ['vmax', p / Math.max(W, H) * 100], ['% of container', p / C * 100]].map(([u, v]) => { const s = f(v) + (u.startsWith('%') ? '%' : u); return `<div class="kv"><span>${u}</span><code>${s}</code><button type="button" class="btn-sm" data-copy="${s}">Copy</button></div>`; }).join('');
      const v = +el('vuV').value || 0, u = el('vuVu').value, base = { vw: W, vh: H, vmin: Math.min(W, H), vmax: Math.max(W, H), '%': C }[u]; el('vuB').innerHTML = f(v * base / 100) + ' <small>px</small>';
    }
    el('vuD').addEventListener('change', e => { if (e.target.value === 'custom') return; const [w, h] = e.target.value.split('x'); el('vuW').value = w; el('vuH').value = h; upd(); });
    el('vuP').addEventListener('input', e => { if (e.target.id === 'vuW' || e.target.id === 'vuH') el('vuD').value = 'custom'; upd(); });
    ['vuPx', 'vuV', 'vuVu'].forEach(i => el(i).addEventListener('input', upd)); upd();
  },
  how: ['Pick a device preset or enter a custom viewport size.', 'Enter a pixel value to see it in vw, vh, vmin, vmax and %.', 'Or enter a viewport unit value to get pixels.', 'Copy the value you need.'],
  about: `<p>1vw equals 1% of the viewport width and 1vh equals 1% of the viewport height. So 5vw is 19.5px on a 390px-wide phone but 96px on a 1920px desktop: that 5× difference is why pure vw font sizes are usually wrapped in <code>clamp()</code> with a minimum and maximum.</p><p>On mobile, 100vh includes the area behind the browser’s address bar, which can make full-height sections overflow. The newer <code>svh</code>, <code>lvh</code> and <code>dvh</code> units (small, large and dynamic viewport height) fix this and are supported in all modern browsers.</p>`,
  tips: ['Never use vw alone for font sizes; combine it with rem in clamp() so text still respects zoom settings.', 'Use 100dvh instead of 100vh for full-screen mobile sections.', 'vw includes the vertical scrollbar width on desktop, so 100vw can cause a small horizontal scroll; use 100% for full-width elements.', 'Percentages are relative to the parent element, not the screen; use them for widths inside containers.', 'Container query units (cqw, cqh) are like vw/vh but relative to a component’s container.'],
  faq: [['How many pixels is 1vw?', '1% of the viewport width. On a 1440px-wide window, 1vw = 14.4px.'], ['What is the difference between vh and dvh?', 'vh is based on the largest possible viewport; dvh updates as mobile browser toolbars show and hide.']],
},
{
  slug: 'paper-size-chart', cat: 'calc', name: 'Paper Size Chart',
  title: 'Paper Size Chart – A4, A3, Letter, Legal Sizes in mm, Inches & Pixels',
  desc: 'Complete paper size chart for ISO A and B series, envelopes and US sizes like Letter, Legal and Tabloid. See dimensions in mm, cm and inches plus pixel sizes at 72, 96, 150 and 300 DPI.',
  kw: ['paper size chart', 'a4 size in pixels', 'a4 size in inches', 'letter size dimensions', 'a3 size', 'paper sizes mm'],
  short: 'Look up A-series, B-series and US paper sizes in mm, inches and pixels.',
  intro: 'Every common paper size in one table, with pixel dimensions at the DPI you choose. Search or filter, then click a pixel size to copy it.',
  html: `<div class="grid3">${txt('psSearch', 'Search', '', 'placeholder="e.g. A4, letter, poster"')}${sel('psDpi', 'Resolution', [[72, '72 DPI'], [96, '96 DPI (CSS)'], [150, '150 DPI'], [300, '300 DPI (print)']], 300)}${sel('psO', 'Orientation', [['p', 'Portrait'], ['l', 'Landscape']], 'p')}</div>
<div class="scroll-x"><table class="table"><thead><tr><th>Size</th><th>Millimetres</th><th>Inches</th><th>Pixels</th><th>Use</th></tr></thead><tbody id="psT"></tbody></table></div>`,
  js: () => {
    const mm = (n, w, h, u) => ({ n, w, h, u }), IN = 25.4, inch = (n, w, h, u) => ({ n, w: w * IN, h: h * IN, u, imp: true });
    const A = [[841, 1189, 'Posters, technical drawings'], [594, 841, 'Posters, flip charts'], [420, 594, 'Posters, diagrams'], [297, 420, 'Drawings, small posters'], [210, 297, 'Letters, documents'], [148, 210, 'Booklets, flyers'], [105, 148, 'Postcards'], [74, 105, 'Small leaflets'], [52, 74, 'Labels'], [37, 52, 'Tiny labels'], [26, 37, 'Stamps']].map((x, i) => mm('A' + i, ...x));
    const B = [[1000, 1414, 'Large posters'], [707, 1000, 'Posters'], [500, 707, 'Posters'], [353, 500, 'Newspapers'], [250, 353, 'Envelopes, books'], [176, 250, 'Books, magazines'], [125, 176, 'Paperbacks'], [88, 125, 'Passports, small books']].map((x, i) => mm('B' + i, ...x));
    const ALL = [...A, ...B, mm('C4', 229, 324, 'Envelope for unfolded A4'), mm('C5', 162, 229, 'Envelope for A4 folded once'), mm('C6', 114, 162, 'Envelope for A4 folded twice'), mm('DL', 110, 220, 'Envelope for A4 folded in three'),
      inch('US Letter', 8.5, 11, 'Standard US documents'), inch('US Legal', 8.5, 14, 'Legal documents'), inch('Tabloid', 11, 17, 'Newsletters, small posters'), inch('Executive', 7.25, 10.5, 'Notepads, letterhead'), inch('Half Letter', 5.5, 8.5, 'Booklets, planners'), inch('Arch D poster', 24, 36, 'Architectural posters'),
      inch('Photo 4×6', 4, 6, 'Standard photo print'), inch('Photo 5×7', 5, 7, 'Photo prints, cards'), inch('Photo 8×10', 8, 10, 'Portrait prints'), inch('US business card', 3.5, 2, 'Business cards'), mm('EU business card', 85, 55, 'Business cards'), mm('Credit card (ID-1)', 85.6, 53.98, 'Cards, badges')];
    function upd() {
      const q = el('psSearch').value.toLowerCase(), d = +el('psDpi').value, land = el('psO').value === 'l';
      el('psT').innerHTML = ALL.filter(s => !q || (s.n + ' ' + s.u).toLowerCase().includes(q)).map(s => { let w = s.w, h = s.h; if ((land && w < h) || (!land && w > h)) [w, h] = [h, w]; const px = `${Math.round(w / IN * d)} × ${Math.round(h / IN * d)}`; return `<tr><td><b>${s.n}</b></td><td>${+w.toFixed(1)} × ${+h.toFixed(1)}</td><td>${+(w / IN).toFixed(2)} × ${+(h / IN).toFixed(2)}</td><td><button type="button" class="btn-sm" data-copy="${px.replace(' × ', 'x')}">${px}</button></td><td class="muted">${s.u}</td></tr>`; }).join('') || '<tr><td colspan="5">No sizes match.</td></tr>';
    }
    ['psSearch', 'psDpi', 'psO'].forEach(i => el(i).addEventListener('input', upd)); upd();
  },
  how: ['Choose the resolution you need (300 DPI for print).', 'Pick portrait or landscape.', 'Search for a size like A4 or Letter.', 'Click the pixel size to copy it for your design canvas.'],
  about: `<p>ISO 216 defines the A and B series. A0 has an area of one square metre, and every size has an aspect ratio of 1:√2 (about 1:1.414), so cutting a sheet in half along its long side gives the next size with the same proportions: two A4 sheets make an A3. B sizes sit between A sizes, and C sizes (ISO 269) are envelopes designed to fit A-series paper.</p><p>North America uses inch-based sizes instead. US Letter (8.5 × 11 in, 216 × 279 mm) is slightly wider and shorter than A4 (210 × 297 mm), so documents laid out for one can lose margins when printed on the other.</p>`,
  tips: ['Design for A4 and US Letter at the same time by keeping content within 210 × 279 mm with generous margins.', 'Add 3 mm (0.125 in) bleed on each side when artwork runs to the edge of the page.', 'Use 300 DPI pixel sizes for print and 96 or 150 DPI for screen-only PDFs to keep file sizes down.', 'Scaling between A sizes is always 141% (up) or 71% (down) because of the √2 ratio.', 'DL envelopes fit A4 folded in three, the standard for business letters in Europe.'],
  faq: [['What is A4 in pixels?', '2480 × 3508 px at 300 DPI, 1240 × 1754 px at 150 DPI and 794 × 1123 px at 96 DPI.'], ['Is A4 bigger than Letter?', 'A4 is narrower (210 vs 216 mm) but taller (297 vs 279 mm) than US Letter.']],
},
{
  slug: 'screen-resolution-checker', cat: 'calc', name: 'Screen Resolution Checker',
  title: 'What Is My Screen Resolution? – Viewport Size & Pixel Ratio Checker',
  desc: 'Check your screen resolution, browser viewport size, device pixel ratio, color depth and orientation instantly. Useful for responsive design testing and bug reports. Updates live.',
  kw: ['what is my screen resolution', 'viewport size checker', 'device pixel ratio', 'screen size checker', 'browser window size'],
  short: 'See your screen resolution, viewport size and device pixel ratio.',
  intro: 'Everything a designer or developer needs to know about the current screen and browser window, updated live as you resize.',
  html: `<div class="result-big" id="srMain">–</div><p class="note" style="margin:-4px 0 18px">Screen resolution in CSS pixels</p><div class="stat-grid" id="srGrid"></div><div class="btn-row"><button type="button" class="btn" id="srCopy">Copy report</button></div>`,
  js: () => {
    function data() {
      const s = screen, d = window.devicePixelRatio || 1, mq = q => matchMedia(q).matches;
      return [['Screen (CSS px)', `${s.width} × ${s.height}`], ['Screen (physical px)', `${Math.round(s.width * d)} × ${Math.round(s.height * d)}`], ['Device pixel ratio', +d.toFixed(2)], ['Viewport (window)', `${innerWidth} × ${innerHeight}`], ['Available screen', `${s.availWidth} × ${s.availHeight}`],
        ['Color depth', s.colorDepth + '-bit'], ['Orientation', (s.orientation && s.orientation.type) || (innerWidth > innerHeight ? 'landscape' : 'portrait')], ['Touch screen', navigator.maxTouchPoints > 0 ? `Yes (${navigator.maxTouchPoints} points)` : 'No'], ['Pointer', mq('(pointer: coarse)') ? 'Coarse (touch)' : 'Fine (mouse)'],
        ['Color scheme', mq('(prefers-color-scheme: dark)') ? 'Dark' : 'Light'], ['Reduced motion', mq('(prefers-reduced-motion: reduce)') ? 'Requested' : 'No preference'], ['Wide color (P3)', mq('(color-gamut: p3)') ? 'Supported' : 'No'], ['HDR', mq('(dynamic-range: high)') ? 'Supported' : 'No']];
    }
    function upd() { const d = data(); el('srMain').innerHTML = `${screen.width} × ${screen.height}`; el('srGrid').innerHTML = d.map(([k, v]) => `<div class="stat"><span>${k}</span><b>${v}</b></div>`).join(''); }
    el('srCopy').onclick = e => copyText(data().map(([k, v]) => `${k}: ${v}`).join('\n') + '\nUser agent: ' + navigator.userAgent, e.target);
    addEventListener('resize', upd); upd();
  },
  how: ['Open the page; your details appear instantly.', 'Resize the browser window to watch the viewport size update.', 'Check the device pixel ratio to know which @2x/@3x assets you need.', 'Click “Copy report” to paste the details into a bug report.'],
  about: `<p>Screen resolution and viewport size are different things. The screen size is the whole display; the viewport is the part of the browser window where your page renders, which is what CSS media queries respond to. On high-density displays, CSS pixels are also different from physical pixels: a device pixel ratio (DPR) of 3 means each CSS pixel is drawn with a 3×3 block of physical pixels.</p><p>That’s why a phone with a 1179px-wide panel reports a 393px-wide screen to websites. Designers use the DPR to decide whether to export images at 2× or 3×.</p>`,
  tips: ['Design breakpoints around your content, but test at common viewport widths like 360, 390, 768, 1280 and 1440px.', 'Export raster images at 2× for most modern screens; 3× rarely gives a visible gain for photos.', 'Use SVG for icons and logos so DPR never matters.', 'Include this report in bug tickets; many layout bugs only happen at a specific viewport size or zoom level.', 'Browser zoom changes the reported device pixel ratio and viewport size, so reset zoom before measuring.'],
  faq: [['Why is my screen resolution smaller than my monitor’s specs?', 'Browsers report CSS pixels. With display scaling or a high-DPI screen, CSS pixels equal physical pixels divided by the device pixel ratio.'], ['What is a device pixel ratio?', 'The number of physical pixels per CSS pixel. 2 means each CSS pixel uses a 2×2 grid of physical pixels.']],
},
];
