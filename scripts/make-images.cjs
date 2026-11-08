// Renders the illustration scenes in scripts/scenes.cjs to optimized WebP files in src/images/.
// Usage: node build.mjs && (cd public && python3 -m http.server 8787 &) && node scripts/make-images.cjs [slug...]
// The local server is only needed to borrow the site's own QR encoder for the QR illustrations.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const S = require('./scenes.cjs');
const OUT = path.join(__dirname, '..', 'src', 'images');
const PAGES = new Set(['home-toolbox', 'about-studio']);

(async () => {
  const only = process.argv.slice(2);
  const b = await chromium.launch(), q = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  // QR code image from the real QR tool
  await q.goto('http://localhost:8787/tools/qr-code-generator/');
  await q.fill('#qrText', 'https://thefastdesigns.online'); await q.waitForTimeout(150);
  const qr = await q.evaluate(() => document.getElementById('qrC').toDataURL('image/png'));
  for (const [key, s] of Object.entries(S)) {
    if (only.length && !only.includes(key)) continue;
    const html = typeof s.html === 'function' ? s.html(qr) : s.html;
    const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await p.setContent(html, { waitUntil: 'load' });
    if (html.includes('<script>')) {
      const ready = () => p.waitForFunction(() => document.title === 'ready', null, { timeout: 3000 }).then(() => true, () => false);
      if (!(await ready())) { await p.addScriptTag({ content: html.match(/<script>([\s\S]*?)<\/script>/)[1] }); if (!(await ready())) throw new Error('scene script failed: ' + key); }
    }
    await p.waitForTimeout(60);
    const png = (await p.screenshot({ type: 'png' })).toString('base64');
    const out = await p.evaluate(async src => {
      const img = new Image(); img.src = 'data:image/png;base64,' + src; await img.decode();
      const enc = (w, q) => { const c = document.createElement('canvas'); c.width = w; c.height = Math.round(w * 630 / 1200); const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height); return c.toDataURL('image/webp', q).split(',')[1]; };
      const jpg = (() => { const c = document.createElement('canvas'); c.width = 1200; c.height = 630; c.getContext('2d').drawImage(img, 0, 0); return c.toDataURL('image/jpeg', 0.82).split(',')[1]; })();
      return { big: enc(1200, 0.8), small: enc(640, 0.78), jpg };
    }, png);
    const dir = path.join(OUT, PAGES.has(key) ? 'pages' : 'blog'); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, key + '.webp'), Buffer.from(out.big, 'base64'));
    fs.writeFileSync(path.join(dir, key + '-640.webp'), Buffer.from(out.small, 'base64'));
    fs.writeFileSync(path.join(dir, key + '-og.jpg'), Buffer.from(out.jpg, 'base64'));
    await p.close();
    console.log(key, Math.round(Buffer.from(out.big, 'base64').length / 1024) + 'KB', Math.round(Buffer.from(out.small, 'base64').length / 1024) + 'KB');
  }
  await b.close();
})();
