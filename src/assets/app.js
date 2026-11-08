/* TheFastDesigns – shared helpers. Everything runs locally in the browser. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = id => document.getElementById(id);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- clipboard & downloads ---------- */
function copyText(t, btn) {
  const done = () => { if (!btn) return; const o = btn.dataset.label || btn.textContent; btn.dataset.label = o; btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = o, 1200); };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(done, () => fallbackCopy(t, done));
  else fallbackCopy(t, done);
}
function fallbackCopy(t, done) {
  const a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0';
  document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} a.remove(); done();
}
function downloadURL(url, name) { const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
function downloadBlob(blob, name) { const u = URL.createObjectURL(blob); downloadURL(u, name); setTimeout(() => URL.revokeObjectURL(u), 5000); }
function downloadText(text, name, type = 'text/plain') { downloadBlob(new Blob([text], { type }), name); }
function fmtBytes(b) { if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'; return (b / 1048576).toFixed(2) + ' MB'; }

/* ---------- images ---------- */
function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image(); img.decoding = 'async';
    img.onload = () => res(img); img.onerror = () => rej(new Error('Could not read this image'));
    img.src = src instanceof Blob ? URL.createObjectURL(src) : src;
  });
}
const imgW = img => img.naturalWidth || 512, imgH = img => img.naturalHeight || 512;
function toBlob(cv, type = 'image/png', q = 0.92) { return new Promise(r => cv.toBlob(r, type, q)); }
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };
function outType(t) { return EXT[t] ? t : 'image/png'; }
function rename(name, suffix, type) { const base = name.replace(/\.[^.]+$/, ''); return base + (suffix ? '-' + suffix : '') + '.' + (EXT[type] || 'png'); }
function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
async function processImage(file, { type, quality = 0.9, maxW = 0, maxH = 0 } = {}) {
  const img = await loadImage(file);
  let w = imgW(img), h = imgH(img);
  const s = Math.min(1, maxW ? maxW / w : 1, maxH ? maxH / h : 1);
  w = Math.max(1, Math.round(w * s)); h = Math.max(1, Math.round(h * s));
  const cv = makeCanvas(w, h), ctx = cv.getContext('2d');
  if (type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
  ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, w, h);
  URL.revokeObjectURL(img.src);
  return { blob: await toBlob(cv, type, quality), w, h };
}
function fileDrop(zone, input, cb) {
  const run = fs => { fs = fs.filter(f => !input.accept || input.accept === '*' || input.accept.split(',').some(a => { a = a.trim(); return a.endsWith('/*') ? f.type.startsWith(a.slice(0, -1)) : (f.type === a || f.name.toLowerCase().endsWith(a)); })); if (fs.length) cb(input.multiple ? fs : [fs[0]]); };
  input.addEventListener('change', () => { run([...input.files]); input.value = ''; });
  ['dragenter', 'dragover'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(e => zone.addEventListener(e, () => zone.classList.remove('over')));
  zone.addEventListener('drop', ev => { ev.preventDefault(); run([...ev.dataTransfer.files]); });
  document.addEventListener('paste', ev => { const fs = [...(ev.clipboardData || {}).files || []]; if (fs.length) run(fs); });
}
function fileRow(name, before, blob, outName) {
  const url = URL.createObjectURL(blob), diff = before ? Math.round((1 - blob.size / before) * 100) : 0;
  return `<div class="file-row"><span class="fn" title="${name}">${name}</span><span class="sz">${before ? fmtBytes(before) + ' → ' : ''}<b>${fmtBytes(blob.size)}</b>${before ? ` <em class="${diff > 0 ? 'ok' : 'warn'}">${diff > 0 ? '−' + diff + '%' : '+' + Math.abs(diff) + '%'}</em>` : ''}</span><a class="btn-sm" href="${url}" download="${outName}">Download</a></div>`;
}

/* ---------- color ---------- */
function hexToRgb(h) {
  h = String(h).replace('#', '').trim();
  if (h.length === 3 || h.length === 4) h = h.split('').map(c => c + c).join('');
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) return null;
  const n = parseInt(h.slice(0, 6), 16);
  return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255, a: h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1 };
}
function rgbToHex(r, g, b) { return '#' + [r, g, b].map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join(''); }
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}
function hslHex(h, s, l) { const c = hslToRgb(h, s, l); return rgbToHex(c.r, c.g, c.b); }
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0;
  if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = Math.round(h * 60); if (h < 0) h += 360;
  return { h, s: Math.round(mx ? d / mx * 100 : 0), v: Math.round(mx * 100) };
}
function rgbToCmyk(r, g, b) {
  const k = 1 - Math.max(r, g, b) / 255; if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const f = v => Math.round((1 - v / 255 - k) / (1 - k) * 100);
  return { c: f(r), m: f(g), y: f(b), k: Math.round(k * 100) };
}
const _cctx = document.createElement('canvas').getContext('2d');
function parseColor(str) {
  str = String(str || '').trim(); if (!str) return null;
  const hx = hexToRgb(str); if (hx && /^#?[0-9a-f]{3,8}$/i.test(str)) return hx;
  _cctx.fillStyle = '#010203'; _cctx.fillStyle = str; const v = _cctx.fillStyle;
  if (v === '#010203' && !/^(#010203|rgb\(1,\s*2,\s*3\))$/i.test(str)) return null;
  if (v[0] === '#') return hexToRgb(v);
  const m = v.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 };
}
function luminance({ r, g, b }) { const f = v => (v /= 255) <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); }
function contrastRatio(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
function bestText(hex) { const c = parseColor(hex); return c && luminance(c) > .4 ? '#141414' : '#ffffff'; }
function rgba(hex, alpha) { const c = parseColor(hex); return `rgba(${c.r}, ${c.g}, ${c.b}, ${+(+alpha).toFixed(2)})`; }
function setColor(inp, v) { inp.value = v; const t = el(inp.id + 'T'); if (t) t.value = v; }
function swatch(hex, extra = '') { return `<button type="button" class="sw" style="background:${hex};color:${bestText(hex)}" data-copy="${hex}" title="Click to copy ${hex}"><span>${hex.toUpperCase()}</span>${extra}</button>`; }

/* ---------- UI wiring ---------- */
function syncOut(inp) { const o = inp.closest('label') && inp.closest('label').querySelector('output'); if (o) o.textContent = inp.value; }
document.addEventListener('input', e => { if (e.target.type === 'range') syncOut(e.target); });
document.addEventListener('click', e => {
  const c = e.target.closest('[data-copy]'); if (c) { copyText(c.dataset.copy, c.tagName === 'BUTTON' && c.classList.contains('btn-sm') ? c : null); toast('Copied ' + (c.dataset.copy.length > 40 ? 'to clipboard' : c.dataset.copy)); return; }
  const f = e.target.closest('[data-copy-from]'); if (f) { const s = el(f.dataset.copyFrom); copyText(s.value !== undefined && s.tagName !== 'PRE' ? s.value : s.textContent, f); }
});
let _toastT;
function toast(msg) { let t = el('toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); } t.textContent = msg; t.classList.add('show'); clearTimeout(_toastT); _toastT = setTimeout(() => t.classList.remove('show'), 1400); }

$$('.color-in').forEach(w => {
  const [c, t] = w.querySelectorAll('input');
  c.addEventListener('input', () => { t.value = c.value; t.classList.remove('bad'); });
  t.addEventListener('input', () => { const p = parseColor(t.value); t.classList.toggle('bad', !p); if (p) { c.value = rgbToHex(p.r, p.g, p.b); c.dispatchEvent(new Event('input', { bubbles: true })); } });
});
$$('input[type=range]').forEach(syncOut);

const mb = $('.menu-btn');
if (mb) mb.addEventListener('click', () => { const u = $('.nav ul'); const o = u.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });

const sq = el('toolSearch');
if (sq) sq.addEventListener('input', () => {
  const q = sq.value.trim().toLowerCase(); let n = 0;
  $$('.tool-card').forEach(c => { const m = !q || c.dataset.k.includes(q); c.hidden = !m; if (m) n++; });
  $$('.cat-section').forEach(s => s.hidden = !$$('.tool-card', s).some(c => !c.hidden));
  el('noResults').hidden = n > 0;
});
