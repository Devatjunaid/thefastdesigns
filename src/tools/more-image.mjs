import { range, num, txt, color, sel, chk, drop, code } from '../lib.mjs';

const fmtSel = id => sel(id, 'Output format', [['image/jpeg', 'JPG'], ['image/png', 'PNG'], ['image/webp', 'WebP']], 'image/jpeg');
const SOCIAL = [
  ['1080x1080', 'Instagram post · square 1080×1080'], ['1080x1350', 'Instagram post · portrait 1080×1350'], ['1080x1920', 'Instagram / Facebook Story, Reels, TikTok · 1080×1920'],
  ['1200x630', 'Facebook / LinkedIn link image · 1200×630'], ['851x315', 'Facebook cover · 851×315'], ['1600x900', 'X (Twitter) post image · 1600×900'], ['1500x500', 'X (Twitter) header · 1500×500'],
  ['1584x396', 'LinkedIn personal banner · 1584×396'], ['1200x1200', 'LinkedIn square post · 1200×1200'], ['1280x720', 'YouTube thumbnail · 1280×720'], ['2560x1440', 'YouTube channel banner · 2560×1440'],
  ['1000x1500', 'Pinterest pin · 1000×1500'], ['400x400', 'Profile picture · 400×400'],
];

export default [
{
  slug: 'social-media-image-resizer', cat: 'image', name: 'Social Media Image Resizer',
  title: 'Social Media Image Resizer – Instagram, YouTube, X & LinkedIn Sizes',
  desc: 'Resize images to the right social media sizes: Instagram posts and stories, YouTube thumbnails, Facebook covers, X headers, LinkedIn banners and Pinterest pins. Crop or fit, privately.',
  kw: ['social media image resizer', 'instagram image size', 'youtube thumbnail size', 'resize for instagram', 'linkedin banner size', 'facebook cover size'],
  short: 'Resize and crop images to exact Instagram, YouTube, X and LinkedIn sizes.',
  intro: 'Pick a platform format, choose whether to crop or fit, and download an image at exactly the right pixel size. Your photo never leaves your device.',
  html: `${drop('smFile')}<div id="smBox" hidden><div class="tool-layout"><div class="panel" id="smP">${sel('smSize', 'Format', SOCIAL, '1080x1080')}
${sel('smMode', 'Fit mode', [['cover', 'Fill and crop (no bars)'], ['contain', 'Fit inside with background'], ['blur', 'Fit inside with blurred background']], 'cover')}
${sel('smFocus', 'Crop focus', [['c', 'Center'], ['t', 'Top'], ['b', 'Bottom'], ['l', 'Left'], ['r', 'Right']], 'c')}${color('smBg', 'Background color (fit mode)', '#ffffff')}
${fmtSel('smFmt')}<button type="button" class="btn" id="smGo" style="width:100%">Download image</button></div>
<div class="panel"><div class="preview checker"><canvas id="smC"></canvas></div><p class="note" id="smInfo"></p></div></div></div>`,
  js: () => {
    let img, file; const cv = el('smC');
    function draw(c) {
      const [W, H] = el('smSize').value.split('x').map(Number), m = el('smMode').value, f = el('smFocus').value, x = c.getContext('2d'), w = imgW(img), h = imgH(img); c.width = W; c.height = H; x.imageSmoothingQuality = 'high';
      const fit = s => [w * s, h * s];
      if (m === 'cover') { const s = Math.max(W / w, H / h), [dw, dh] = fit(s); const dx = f === 'l' ? 0 : f === 'r' ? W - dw : (W - dw) / 2, dy = f === 't' ? 0 : f === 'b' ? H - dh : (H - dh) / 2; x.drawImage(img, dx, dy, dw, dh); }
      else {
        if (m === 'blur') { const s = Math.max(W / w, H / h), [bw, bh] = fit(s); x.filter = 'blur(' + Math.round(Math.max(W, H) / 40) + 'px) brightness(.85)'; x.drawImage(img, (W - bw) / 2 - 20, (H - bh) / 2 - 20, bw + 40, bh + 40); x.filter = 'none'; }
        else { x.fillStyle = el('smBg').value; x.fillRect(0, 0, W, H); }
        const s = Math.min(W / w, H / h), [dw, dh] = fit(s); x.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      }
      el('smInfo').textContent = `Output: ${W} × ${H} px · source ${w} × ${h} px${Math.max(W / w, H / h) > 1.05 && m === 'cover' ? ' · note: the source is smaller than the target, so it will be upscaled' : ''}`;
    }
    fileDrop(el('smFileZone'), el('smFile'), async fs => { file = fs[0]; img = await loadImage(file); el('smBox').hidden = false; draw(cv); });
    el('smP').addEventListener('change', () => img && draw(cv)); el('smP').addEventListener('input', () => img && draw(cv));
    el('smGo').onclick = async () => { const t = el('smFmt').value; downloadBlob(await toBlob(cv, t, .92), rename(file.name, el('smSize').value, t)); };
  },
  how: ['Upload, drop or paste your image.', 'Choose the platform and format you need.', 'Pick “fill and crop” for edge-to-edge images or a fit mode to keep the whole picture.', 'Adjust the crop focus and download.'],
  about: `<p>Every platform crops images differently, and uploading the wrong shape means faces get cut off or awkward bars appear. Exporting at the exact recommended size also stops platforms from re-compressing your image as aggressively.</p><p>Platforms change their recommendations from time to time, and some (like YouTube banners and Facebook covers) crop differently on mobile and desktop. Keep important text and faces near the center of wide banners.</p>`,
  tips: ['For YouTube channel banners, keep text and logos inside the central 1546×423px “safe area” so they show on every device.', 'Instagram’s portrait 4:5 format takes up more screen space in the feed than a square post.', 'Use the blurred background mode to post a landscape photo as a Story without cropping it.', 'Export JPG for photos and PNG for graphics with text or flat colors to avoid smudged edges.', 'Upload images at the recommended size rather than larger; platforms will recompress oversized files anyway.'],
  faq: [['What size is an Instagram post?', '1080×1080 for square and 1080×1350 for portrait (4:5). Stories and Reels are 1080×1920 (9:16).'], ['What size is a YouTube thumbnail?', '1280×720 pixels (16:9). YouTube’s limit for thumbnail files is 2 MB.']],
},
{
  slug: 'image-grid-splitter', cat: 'image', name: 'Image Grid Splitter',
  title: 'Image Splitter – Cut Photos Into a Grid for Instagram Carousels',
  desc: 'Split an image into equal grid tiles online: 3×1 panoramas for Instagram carousels, 3×3 profile grids or any rows × columns. Preview the cuts and download every tile in order.',
  kw: ['image splitter', 'split image into grid', 'instagram grid maker', 'panorama splitter', 'cut image into pieces', 'image tiles'],
  short: 'Cut one image into equal tiles for carousels and grid posts.',
  intro: 'Turn a wide photo into a swipeable panorama or a big picture into a 3×3 profile grid. Tiles are numbered in posting order.',
  html: `${drop('gsFile')}<div id="gsBox" hidden><div class="tool-layout"><div class="panel" id="gsP"><div class="grid2">${num('gsR', 'Rows', 1, 'min="1" max="10"')}${num('gsC', 'Columns', 3, 'min="1" max="10"')}</div>
<div class="btn-row" style="margin-bottom:14px"><button type="button" class="btn-sm" data-g="1x2">1×2</button><button type="button" class="btn-sm" data-g="1x3">1×3 panorama</button><button type="button" class="btn-sm" data-g="3x3">3×3 grid</button><button type="button" class="btn-sm" data-g="2x2">2×2</button></div>
${fmtSel('gsFmt')}<button type="button" class="btn" id="gsGo" style="width:100%">Download all tiles</button><p class="note" id="gsInfo"></p></div>
<div class="panel"><div class="preview checker" style="padding:12px"><div style="position:relative;line-height:0"><img id="gsImg" alt="Image to split" style="max-height:480px"><div id="gsLines" style="position:absolute;inset:0;pointer-events:none"></div></div></div></div></div></div>`,
  js: () => {
    let img, file;
    function upd() {
      const R = clamp(+el('gsR').value | 0, 1, 10), C = clamp(+el('gsC').value | 0, 1, 10), l = el('gsLines'); let h = '';
      for (let i = 1; i < C; i++) h += `<i style="position:absolute;top:0;bottom:0;left:${i / C * 100}%;border-left:2px dashed #fff;outline:1px solid rgba(0,0,0,.3)"></i>`;
      for (let i = 1; i < R; i++) h += `<i style="position:absolute;left:0;right:0;top:${i / R * 100}%;border-top:2px dashed #fff;outline:1px solid rgba(0,0,0,.3)"></i>`;
      l.innerHTML = h; if (img) el('gsInfo').textContent = `${R * C} tiles of ${Math.floor(imgW(img) / C)} × ${Math.floor(imgH(img) / R)} px`;
    }
    fileDrop(el('gsFileZone'), el('gsFile'), async fs => { file = fs[0]; img = await loadImage(file); el('gsImg').src = img.src; el('gsBox').hidden = false; upd(); });
    el('gsP').addEventListener('input', upd);
    document.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { const [r, c] = b.dataset.g.split('x'); el('gsR').value = r; el('gsC').value = c; upd(); });
    el('gsGo').onclick = async () => {
      const R = clamp(+el('gsR').value | 0, 1, 10), C = clamp(+el('gsC').value | 0, 1, 10), tw = Math.floor(imgW(img) / C), th = Math.floor(imgH(img) / R), t = el('gsFmt').value; let n = 0;
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) { const cv = makeCanvas(tw, th), x = cv.getContext('2d'); if (t === 'image/jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, tw, th); } x.drawImage(img, c * tw, r * th, tw, th, 0, 0, tw, th); const b = await toBlob(cv, t, .92); n++; setTimeout(() => downloadBlob(b, rename(file.name, String(n).padStart(2, '0'), t)), n * 250); }
    };
  },
  how: ['Upload the image you want to split.', 'Set rows and columns, or click a preset like 1×3 panorama or 3×3 grid.', 'Check the dashed cut lines on the preview.', 'Download all tiles; they are numbered left to right, top to bottom.'],
  about: `<p>Splitting a panorama into equal tiles and posting them as a carousel lets followers swipe across one continuous image. The same idea in a 3×3 layout turns nine separate posts into one large picture on an Instagram profile grid.</p><p>Tiles are cut at whole-pixel boundaries; if the image width doesn’t divide evenly, the last few pixels on the right or bottom are trimmed so every tile is identical in size.</p>`,
  tips: ['For a seamless Instagram carousel, make the source exactly 1080×N wide (e.g. 3240×1080 for three square slides).', 'Since Instagram’s 2025 grid change, profile thumbnails are shown at 3:4, so square tiles may be cropped on the grid; check before posting.', 'For a profile-grid mosaic, post tiles in reverse order (the last tile first), because the newest post appears top-left.', 'Avoid placing faces or text right on a cut line.', 'Choose PNG for graphics with text so edges stay crisp after splitting.'],
  faq: [['How do I make a seamless Instagram carousel?', 'Create a wide image at 1080px height (e.g. 3240×1080), split it into 1×3 tiles and upload them in order as one carousel post.'], ['In what order are tiles named?', 'Left to right, top to bottom: 01, 02, 03 and so on.']],
},
{
  slug: 'combine-images', cat: 'image', name: 'Combine Images',
  title: 'Combine Images Online – Merge Photos Side by Side or Vertically',
  desc: 'Merge two or more images into one: side by side, stacked vertically or in a grid. Add spacing and background color, auto-match sizes and download a single PNG or JPG. No upload.',
  kw: ['combine images', 'merge photos', 'join images side by side', 'stitch images', 'photo collage maker', 'put two pictures together'],
  short: 'Merge multiple images side by side, vertically or in a grid.',
  intro: 'Put screenshots, before-and-after photos or product shots together in one image. Images are scaled to match automatically.',
  html: `<div class="tool-layout"><div class="panel" id="ciP">${drop('ciFile', { multiple: true })}${sel('ciDir', 'Layout', [['h', 'Side by side (horizontal)'], ['v', 'Stacked (vertical)'], ['g', 'Grid']], 'h')}${num('ciCols', 'Grid columns', 2, 'min="1" max="10"')}
${range('ciGap', 'Spacing', 0, 80, 10, 1, 'px')}${color('ciBg', 'Background', '#ffffff')}${chk('ciMatch', 'Scale images to the same height/width', true)}${fmtSel('ciFmt')}<button type="button" class="btn" id="ciGo" style="width:100%">Download combined image</button><p class="note" id="ciInfo">Add at least two images.</p></div>
<div class="panel"><div class="preview checker"><canvas id="ciC"></canvas></div></div></div>`,
  js: () => {
    let imgs = []; const cv = el('ciC');
    function layout() {
      const d = el('ciDir').value, g = +el('ciGap').value, m = el('ciMatch').checked; let items = imgs.map(i => ({ i, w: imgW(i), h: imgH(i) }));
      if (d === 'h') { const H = m ? Math.min(...items.map(x => x.h)) : Math.max(...items.map(x => x.h)); if (m) items.forEach(x => { x.w = x.w * H / x.h; x.h = H; }); let X = g; items.forEach(x => { x.x = X; x.y = g + (H - x.h) / 2; X += x.w + g; }); return { W: X, H: H + 2 * g, items }; }
      if (d === 'v') { const W = m ? Math.min(...items.map(x => x.w)) : Math.max(...items.map(x => x.w)); if (m) items.forEach(x => { x.h = x.h * W / x.w; x.w = W; }); let Y = g; items.forEach(x => { x.y = Y; x.x = g + (W - x.w) / 2; Y += x.h + g; }); return { W: W + 2 * g, H: Y, items }; }
      const C = clamp(+el('ciCols').value | 0, 1, 10), cw = Math.min(...items.map(x => x.w)), ch = Math.min(...items.map(x => x.h)), R = Math.ceil(items.length / C);
      items.forEach((x, k) => { const s = Math.min(cw / x.w, ch / x.h); x.w *= s; x.h *= s; x.x = g + (k % C) * (cw + g) + (cw - x.w) / 2; x.y = g + Math.floor(k / C) * (ch + g) + (ch - x.h) / 2; });
      return { W: C * cw + (C + 1) * g, H: R * ch + (R + 1) * g, items };
    }
    function draw(c, maxS) {
      if (imgs.length < 1) return; const L = layout(), s = Math.min(1, maxS / Math.max(L.W, L.H), 12000 / Math.max(L.W, L.H)); c.width = Math.round(L.W * s); c.height = Math.round(L.H * s); const x = c.getContext('2d');
      x.fillStyle = el('ciBg').value; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingQuality = 'high'; L.items.forEach(it => x.drawImage(it.i, it.x * s, it.y * s, it.w * s, it.h * s));
      el('ciInfo').textContent = `${imgs.length} images · output ${Math.round(L.W * Math.min(1, 12000 / Math.max(L.W, L.H)))} × ${Math.round(L.H * Math.min(1, 12000 / Math.max(L.W, L.H)))} px`;
    }
    fileDrop(el('ciFileZone'), el('ciFile'), async fs => { imgs = imgs.concat(await Promise.all(fs.map(loadImage))); draw(cv, 1400); });
    el('ciP').addEventListener('input', () => draw(cv, 1400)); el('ciP').addEventListener('change', () => draw(cv, 1400));
    el('ciGo').onclick = async () => { if (!imgs.length) return; const c = makeCanvas(1, 1); draw(c, 1e9); downloadBlob(await toBlob(c, el('ciFmt').value, .92), 'combined.' + EXT[el('ciFmt').value]); };
  },
  how: ['Add two or more images (you can add more later; they’re appended in order).', 'Choose side by side, stacked or grid layout.', 'Set spacing, background color and size matching.', 'Download the combined image.'],
  about: `<p>Combining images is a quick way to make before/after comparisons, show app screens next to each other, build simple collages or attach several photos as one file. When “scale to the same height/width” is on, images in a row are resized to the smallest height (or the smallest width in a column), so nothing is upscaled and the edges line up.</p><p>Very large results are capped at 12,000px on the longest side to stay within browser canvas limits.</p>`,
  tips: ['For before/after comparisons, crop both photos to the same aspect ratio first so they align perfectly.', 'Use a spacing of 0 for seamless panoramas and 8–20px for a clean collage look.', 'Choose PNG when combining screenshots so text stays sharp.', 'Grid layout works well for product thumbnails and mood boards.', 'Re-upload the page to start over; images are added in the order you select them.'],
  faq: [['How do I put two pictures side by side?', 'Add both images, choose “Side by side” and click Download.'], ['Is there a limit to how many images I can combine?', 'There’s no fixed limit, but very large outputs are scaled to fit within 12,000 pixels on the longest side.']],
},
{
  slug: 'pixelate-image', cat: 'image', name: 'Pixelate & Blur Image',
  title: 'Pixelate Image Online – Blur Faces, Censor Text & Hide Details',
  desc: 'Pixelate or blur parts of an image to hide faces, license plates, emails or personal data. Drag over areas to censor them, or pixelate the whole picture for a retro pixel art look.',
  kw: ['pixelate image', 'blur part of image', 'censor image', 'blur faces in photo', 'hide personal information screenshot', 'pixel art effect'],
  short: 'Pixelate or blur selected areas to hide faces and private data.',
  intro: 'Hide sensitive details before sharing screenshots and photos. Drag a box over anything you want to censor; the original never leaves your device.',
  html: `${drop('pxFile')}<div id="pxBox" hidden><div class="tool-layout"><div class="panel">${sel('pxM', 'Effect', [['pixel', 'Pixelate'], ['blur', 'Blur'], ['solid', 'Solid black box']], 'pixel')}${range('pxS', 'Strength', 4, 60, 16, 1)}
<div class="btn-row"><button type="button" class="btn-alt" id="pxAll">Apply to whole image</button><button type="button" class="btn-sm" id="pxUndo">Undo</button><button type="button" class="btn-sm" id="pxReset">Reset</button></div>
<p class="note">Drag on the image to select an area. Each selection is applied immediately.</p>${sel('pxFmt', 'Output format', [['image/png', 'PNG'], ['image/jpeg', 'JPG'], ['image/webp', 'WebP']], 'image/png')}<button type="button" class="btn" id="pxGo" style="width:100%">Download image</button></div>
<div class="panel"><div class="preview checker" style="padding:10px"><div id="pxStage" style="position:relative;line-height:0;touch-action:none;cursor:crosshair"><canvas id="pxC" style="max-height:600px"></canvas><div id="pxSel" style="position:absolute;border:2px dashed #fff;outline:1px solid #000;display:none;pointer-events:none"></div></div></div></div></div></div>`,
  js: () => {
    let img, file, hist = []; const cv = el('pxC'), ctx = cv.getContext('2d');
    const snap = () => { hist.push(ctx.getImageData(0, 0, cv.width, cv.height)); if (hist.length > 15) hist.shift(); };
    function apply(x, y, w, h) {
      if (w < 2 || h < 2) return; snap(); const m = el('pxM').value, s = +el('pxS').value;
      if (m === 'solid') { ctx.fillStyle = '#000'; ctx.fillRect(x, y, w, h); return; }
      if (m === 'blur') { ctx.filter = 'blur(1px)'; if (ctx.filter === 'blur(1px)') { const t = makeCanvas(w, h); t.getContext('2d').drawImage(cv, x, y, w, h, 0, 0, w, h); ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.filter = `blur(${s / 2}px)`; ctx.drawImage(t, x - s, y - s, w + 2 * s, h + 2 * s); ctx.restore(); ctx.filter = 'none'; return; } ctx.filter = 'none'; }
      const sz = Math.max(2, Math.round(s * Math.max(cv.width, cv.height) / 1200)), t = makeCanvas(Math.max(1, Math.ceil(w / sz)), Math.max(1, Math.ceil(h / sz))), tx = t.getContext('2d');
      tx.drawImage(cv, x, y, w, h, 0, 0, t.width, t.height); ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(t, 0, 0, t.width, t.height, x, y, t.width * sz, t.height * sz); ctx.restore();
    }
    fileDrop(el('pxFileZone'), el('pxFile'), async fs => { file = fs[0]; img = await loadImage(file); cv.width = imgW(img); cv.height = imgH(img); ctx.drawImage(img, 0, 0); hist = []; el('pxBox').hidden = false; });
    let st = null; const sel = el('pxSel'), pos = e => { const r = cv.getBoundingClientRect(); return [clamp(e.clientX - r.left, 0, r.width), clamp(e.clientY - r.top, 0, r.height), r]; };
    el('pxStage').addEventListener('pointerdown', e => { e.preventDefault(); st = pos(e); el('pxStage').setPointerCapture(e.pointerId); sel.style.display = 'block'; });
    el('pxStage').addEventListener('pointermove', e => { if (!st) return; const [x, y] = pos(e); sel.style.left = Math.min(x, st[0]) + 'px'; sel.style.top = Math.min(y, st[1]) + 'px'; sel.style.width = Math.abs(x - st[0]) + 'px'; sel.style.height = Math.abs(y - st[1]) + 'px'; });
    el('pxStage').addEventListener('pointerup', e => { if (!st) return; const [x, y, r] = pos(e), k = cv.width / r.width; apply(Math.round(Math.min(x, st[0]) * k), Math.round(Math.min(y, st[1]) * k), Math.round(Math.abs(x - st[0]) * k), Math.round(Math.abs(y - st[1]) * k)); st = null; sel.style.display = 'none'; });
    el('pxAll').onclick = () => apply(0, 0, cv.width, cv.height);
    el('pxUndo').onclick = () => { const d = hist.pop(); if (d) ctx.putImageData(d, 0, 0); };
    el('pxReset').onclick = () => { ctx.drawImage(img, 0, 0); hist = []; };
    el('pxGo').onclick = async () => { const t = el('pxFmt').value; let c = cv; if (t === 'image/jpeg') { c = makeCanvas(cv.width, cv.height); const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(cv, 0, 0); } downloadBlob(await toBlob(c, t, .92), rename(file.name, 'censored', t)); };
  },
  how: ['Upload the photo or screenshot.', 'Choose pixelate, blur or a solid box and set the strength.', 'Drag over each area you want to hide; use Undo if you miss.', 'Download the censored image.'],
  about: `<p>Before posting a screenshot, check it for email addresses, phone numbers, order IDs, faces, license plates and browser tabs. Pixelation and blur hide these details, and the new pixels are written into the exported image, so the original information is not recoverable from the file.</p><p>Be aware that light blur and large pixel blocks over short text (like a single number) can sometimes be reversed by guessing. For truly sensitive information such as passwords or card numbers, use the solid black box, which removes the data completely.</p>`,
  tips: ['Use the solid box for passwords, card numbers and ID numbers; it’s the only effect that can’t be guessed back.', 'Pixelate with a high strength for faces; small blocks can leave a face recognisable.', 'Check every corner of a screenshot: notification badges and browser tabs often reveal names.', 'Download as PNG for screenshots to keep the rest of the text crisp.', 'Whole-image pixelation with a medium strength creates a quick 8-bit pixel art look.'],
  faq: [['Can pixelated text be recovered?', 'Weakly pixelated or blurred short text can sometimes be reconstructed. Use strong pixelation or the solid black box for anything sensitive.'], ['Is my photo uploaded to a server?', 'No. All editing happens in your browser.']],
},
{
  slug: 'rounded-corners-image', cat: 'image', name: 'Rounded Corners & Border',
  title: 'Round Image Corners Online – Add Rounded Corners & Borders to Photos',
  desc: 'Add rounded corners or a circle crop to images and give them a colored border. Keep transparent corners as PNG or fill them with a background color. Fast, free and private.',
  kw: ['round image corners', 'rounded corners image', 'add border to image', 'circle crop image', 'round photo online', 'image frame'],
  short: 'Round the corners of an image, crop to a circle and add a border.',
  intro: 'Give screenshots and photos soft rounded corners and an optional border. Export with transparent corners or a matching background.',
  html: `${drop('rcFile')}<div id="rcBox" hidden><div class="tool-layout"><div class="panel" id="rcP">${range('rcR', 'Corner radius', 0, 50, 8, 1, '%')}${chk('rcCircle', 'Circle / ellipse crop')}${range('rcB', 'Border width', 0, 60, 0, 1, 'px')}${color('rcBc', 'Border color', '#141414')}
${chk('rcT', 'Transparent corners (PNG / WebP)', true)}${color('rcBg', 'Corner background', '#ffffff')}${sel('rcFmt', 'Output format', [['image/png', 'PNG'], ['image/webp', 'WebP'], ['image/jpeg', 'JPG']], 'image/png')}<button type="button" class="btn" id="rcGo" style="width:100%">Download image</button></div>
<div class="panel"><div class="preview checker"><canvas id="rcC"></canvas></div></div></div></div>`,
  js: () => {
    let img, file;
    const rr = (x, a, b, w, h, r) => { r = Math.min(r, w / 2, h / 2); x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); };
    function draw(c, s) {
      const w = imgW(img) * s, h = imgH(img) * s, bw = +el('rcB').value * s, W = Math.round(w + 2 * bw), H = Math.round(h + 2 * bw); c.width = W; c.height = H; const x = c.getContext('2d'), circ = el('rcCircle').checked, r = Math.min(W, H) * el('rcR').value / 100;
      const shape = (a, b, ww, hh, rad) => { if (circ) { x.beginPath(); x.ellipse(a + ww / 2, b + hh / 2, ww / 2, hh / 2, 0, 0, Math.PI * 2); } else rr(x, a, b, ww, hh, rad); };
      if (!el('rcT').checked || el('rcFmt').value === 'image/jpeg') { x.fillStyle = el('rcBg').value; x.fillRect(0, 0, W, H); }
      if (bw > 0) { x.fillStyle = el('rcBc').value; shape(0, 0, W, H, r); x.fill(); }
      x.save(); shape(bw, bw, w, h, Math.max(0, r - bw)); x.clip(); x.drawImage(img, bw, bw, w, h); x.restore();
    }
    const prev = () => img && draw(el('rcC'), Math.min(1, 1000 / Math.max(imgW(img), imgH(img))));
    fileDrop(el('rcFileZone'), el('rcFile'), async fs => { file = fs[0]; img = await loadImage(file); el('rcBox').hidden = false; prev(); });
    el('rcP').addEventListener('input', prev); el('rcP').addEventListener('change', prev);
    el('rcGo').onclick = async () => { const c = makeCanvas(1, 1), t = el('rcFmt').value; draw(c, 1); downloadBlob(await toBlob(c, t, .92), rename(file.name, 'rounded', t)); };
  },
  how: ['Upload an image.', 'Set the corner radius, or tick “Circle / ellipse crop”.', 'Optionally add a border and choose its color.', 'Keep transparent corners for PNG/WebP, or pick a background color, then download.'],
  about: `<p>Rounded corners make screenshots and photos feel softer and more “app-like”, and they help images match the rounded cards and buttons common in modern interfaces. Transparent corners require a format with an alpha channel, so use PNG or WebP. JPG doesn’t support transparency; corners are filled with your background color instead.</p><p>If the image is only used on a website, you can also round it with CSS (<code>border-radius</code>) without editing the file, which is easier to change later.</p>`,
  tips: ['Match the radius to your UI: if your cards use 12px corners, export images with a similar radius at display size.', 'Use the circle crop on a square image for perfect round avatars.', 'For slides and documents with colored backgrounds, set the corner background to the slide color and export JPG.', 'A thin border in a light grey helps white-background screenshots stand out on white pages.', 'Radius is a percentage of the shorter side, so 50% on a square makes a circle.'],
  faq: [['Why are my corners white instead of transparent?', 'JPG doesn’t support transparency. Choose PNG or WebP and keep “Transparent corners” checked.'], ['How do I make a circular profile picture?', 'Upload a square image, tick “Circle / ellipse crop” and download as PNG.']],
},
{
  slug: 'duotone-image-generator', cat: 'image', name: 'Duotone Image Generator',
  title: 'Duotone Effect Generator – Two-Color Photo Filter Online',
  desc: 'Apply a duotone effect to photos online. Map shadows and highlights to any two colors, adjust contrast, try popular presets and download a striking two-color image for posters and web.',
  kw: ['duotone generator', 'duotone effect', 'two color photo effect', 'duotone image online', 'gradient map photo'],
  short: 'Turn any photo into a bold two-color duotone image.',
  intro: 'Recolor photos with two brand colors for a consistent, graphic look. Shadows take one color, highlights take the other.',
  html: `${drop('dtFile')}<div id="dtBox" hidden><div class="tool-layout"><div class="panel" id="dtP"><div class="grid2">${color('dtA', 'Shadows', '#141414')}${color('dtB', 'Highlights', '#e8dcc4')}</div>${range('dtC', 'Contrast', 50, 200, 110, 1, '%')}${range('dtBr', 'Brightness', 50, 150, 100, 1, '%')}
<div class="btn-row" style="margin-bottom:14px"><button type="button" class="btn-sm" data-dt="#141414,#e8dcc4">Ink & sand</button><button type="button" class="btn-sm" data-dt="#1b1464,#ff6f61">Indigo & coral</button><button type="button" class="btn-sm" data-dt="#0b3d2e,#d8f3dc">Forest & mint</button><button type="button" class="btn-sm" data-dt="#3a0ca3,#f72585">Violet & pink</button><button type="button" class="btn-sm" data-dt="#023047,#ffb703">Navy & gold</button></div>
${sel('dtFmt', 'Output format', [['image/jpeg', 'JPG'], ['image/png', 'PNG'], ['image/webp', 'WebP']], 'image/jpeg')}<button type="button" class="btn" id="dtGo" style="width:100%">Download image</button></div>
<div class="panel"><div class="preview checker"><canvas id="dtCanvas"></canvas></div></div></div></div>`,
  js: () => {
    let img, file;
    function draw(c, s) {
      const w = Math.round(imgW(img) * s), h = Math.round(imgH(img) * s); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, w, h);
      const d = x.getImageData(0, 0, w, h), p = d.data, A = parseColor(el('dtA').value), B = parseColor(el('dtB').value), k = el('dtC').value / 100, br = el('dtBr').value / 100;
      for (let i = 0; i < p.length; i += 4) { let l = (.2126 * p[i] + .7152 * p[i + 1] + .0722 * p[i + 2]) / 255; l = clamp(((l * br) - .5) * k + .5, 0, 1); p[i] = A.r + (B.r - A.r) * l; p[i + 1] = A.g + (B.g - A.g) * l; p[i + 2] = A.b + (B.b - A.b) * l; }
      x.putImageData(d, 0, 0);
    }
    const prev = () => img && draw(el("dtCanvas"), Math.min(1, 1000 / Math.max(imgW(img), imgH(img))));
    fileDrop(el('dtFileZone'), el('dtFile'), async fs => { file = fs[0]; img = await loadImage(file); el('dtBox').hidden = false; prev(); });
    el('dtP').addEventListener('input', prev);
    document.querySelectorAll('[data-dt]').forEach(b => b.onclick = () => { const [a, c] = b.dataset.dt.split(','); setColor(el('dtA'), a); setColor(el('dtB'), c); prev(); });
    el('dtGo').onclick = async () => { const c = makeCanvas(1, 1), t = el('dtFmt').value; draw(c, 1); downloadBlob(await toBlob(c, t, .92), rename(file.name, 'duotone', t)); };
  },
  how: ['Upload a photo.', 'Pick a shadow color and a highlight color, or try a preset.', 'Adjust contrast and brightness until the image pops.', 'Download the duotone image.'],
  about: `<p>Duotone is a printing technique that uses two inks. Digitally, it works as a “gradient map”: each pixel’s brightness is calculated and then mapped onto a gradient between two colors. Dark areas take the shadow color and bright areas take the highlight color.</p><p>Brands use duotone to make photos from different sources look like one consistent set, and to put text over images without fighting busy colors.</p>`,
  tips: ['Use a dark shadow color and a light highlight color; two mid-tones produce a flat, low-contrast image.', 'Photos with strong lighting and simple backgrounds give the most graphic result.', 'Apply the same two colors to every image in a campaign for instant visual consistency.', 'Raise contrast slightly (110–130%) to avoid muddy mid-tones.', 'Duotone images with a dark shadow color make excellent backgrounds for white headline text.'],
  faq: [['What is a duotone image?', 'An image made of two colors, where shadows use one color and highlights use the other, based on each pixel’s brightness.'], ['Can I use my brand colors?', 'Yes. Enter any two HEX codes in the shadow and highlight fields.']],
},
{
  slug: 'exif-remover', cat: 'image', name: 'EXIF Viewer & Metadata Remover',
  title: 'EXIF Remover – View & Remove Photo Metadata and GPS Location',
  desc: 'View hidden photo metadata such as camera model, date and GPS location, then remove EXIF data before sharing. JPEG metadata is stripped losslessly without re-compressing the photo.',
  kw: ['exif remover', 'remove metadata from photo', 'remove gps from photo', 'exif viewer', 'strip exif data', 'photo metadata'],
  short: 'See and remove hidden EXIF data, including GPS location, from photos.',
  intro: 'Photos from phones often contain the exact GPS location where they were taken. Check what’s inside your image and download a clean copy.',
  html: `${drop('exFile', { multiple: true, text: 'JPG, PNG or WebP · analysed locally, never uploaded' })}<div id="exOut"></div>`,
  js: () => {
    const TAGS = { 0x010F: 'Camera make', 0x0110: 'Camera model', 0x0112: 'Orientation', 0x0131: 'Software', 0x0132: 'Date modified', 0x013B: 'Artist', 0x8298: 'Copyright', 0x9003: 'Date taken', 0x829A: 'Exposure time', 0x829D: 'F-number', 0x8827: 'ISO', 0x920A: 'Focal length', 0xA434: 'Lens model', 0xA002: 'Pixel width', 0xA003: 'Pixel height' };
    function exif(u8, start) {
      const dv = new DataView(u8.buffer, u8.byteOffset), t = start, le = dv.getUint16(t) === 0x4949, U16 = o => dv.getUint16(t + o, le), U32 = o => dv.getUint32(t + o, le), out = {}, gps = {};
      const val = (e) => { const type = U16(e + 2), n = U32(e + 4), size = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8][type] * n, o = size > 4 ? U32(e + 8) : e + 8;
        if (type === 2) { let s = ''; for (let i = 0; i < n - 1; i++) s += String.fromCharCode(u8[t + o + i]); return s.trim(); }
        if (type === 3) return U16(o); if (type === 4) return U32(o);
        if (type === 5 || type === 10) { const r = []; for (let i = 0; i < n; i++) { const a = type === 5 ? U32(o + i * 8) : dv.getInt32(t + o + i * 8, le), b = type === 5 ? U32(o + i * 8 + 4) : dv.getInt32(t + o + i * 8 + 4, le); r.push(b ? a / b : 0); } return n === 1 ? r[0] : r; } return null; };
      const ifd = (off, into, isGps) => { if (!off || t + off + 2 > u8.length) return; const n = U16(off); for (let i = 0; i < n; i++) { const e = off + 2 + i * 12, tag = U16(e); if (tag === 0x8769) ifd(U32(e + 8), into); else if (tag === 0x8825) ifd(U32(e + 8), gps, true); else if (isGps) into[tag] = val(e); else if (TAGS[tag]) into[TAGS[tag]] = val(e); } };
      ifd(U32(4), out);
      if (gps[2] && gps[4]) { const dms = a => a[0] + a[1] / 60 + a[2] / 3600; out['GPS latitude'] = ((gps[1] === 'S' ? -1 : 1) * dms(gps[2])).toFixed(6); out['GPS longitude'] = ((gps[3] === 'W' ? -1 : 1) * dms(gps[4])).toFixed(6); }
      if (out['Exposure time']) out['Exposure time'] = out['Exposure time'] < 1 ? '1/' + Math.round(1 / out['Exposure time']) + 's' : out['Exposure time'] + 's';
      if (out['F-number']) out['F-number'] = 'f/' + (+out['F-number']).toFixed(1); if (out['Focal length']) out['Focal length'] = (+out['Focal length']).toFixed(1) + 'mm';
      return out;
    }
    function jpeg(u8) {
      const keep = [u8.subarray(0, 2)], found = []; let meta = {}, orient = 1, p = 2;
      while (p < u8.length - 4) {
        if (u8[p] !== 0xFF) break; const m = u8[p + 1]; if (m === 0xFF) { p++; continue; }
        if (m === 0xDA) { keep.push(u8.subarray(p)); break; }
        const len = (u8[p + 2] << 8) | u8[p + 3], seg = u8.subarray(p, p + 2 + len);
        if (m === 0xE1 && String.fromCharCode(...u8.subarray(p + 4, p + 8)) === 'Exif') { found.push('EXIF'); try { meta = exif(u8, p + 10); orient = meta.Orientation || 1; } catch (e) {} }
        else if (m === 0xE1) found.push('XMP'); else if (m === 0xED) found.push('IPTC / Photoshop'); else if (m === 0xFE) found.push('Comment'); else if (m >= 0xE3 && m <= 0xEF) found.push('APP' + (m - 0xE0));
        if (!((m >= 0xE1 && m <= 0xEF && m !== 0xE2) || m === 0xFE)) keep.push(seg);
        p += 2 + len;
      }
      return { meta, found, orient, clean: new Blob(keep, { type: 'image/jpeg' }) };
    }
    function png(u8) {
      const dv = new DataView(u8.buffer, u8.byteOffset), keep = [u8.subarray(0, 8)], found = [], meta = {}; let p = 8;
      while (p + 8 <= u8.length) { const len = dv.getUint32(p), type = String.fromCharCode(...u8.subarray(p + 4, p + 8)), end = p + 12 + len;
        if (['tEXt', 'iTXt', 'zTXt', 'eXIf', 'tIME'].includes(type)) { found.push(type); if (type === 'tEXt') { const s = new TextDecoder('latin1').decode(u8.subarray(p + 8, p + 8 + len)), i = s.indexOf('\0'); meta[s.slice(0, i)] = s.slice(i + 1).slice(0, 120); } if (type === 'eXIf') try { Object.assign(meta, exif(u8, p + 8)); } catch (e) {} }
        else keep.push(u8.subarray(p, end)); p = end; if (type === 'IEND') break; }
      return { meta, found, orient: 1, clean: new Blob(keep, { type: 'image/png' }) };
    }
    fileDrop(el('exFileZone'), el('exFile'), async fs => {
      const out = el('exOut'); out.innerHTML = '';
      for (const f of fs) {
        const u8 = new Uint8Array(await f.arrayBuffer()); let r, note = 'Metadata removed losslessly, image data untouched.';
        if (u8[0] === 0xFF && u8[1] === 0xD8) r = jpeg(u8); else if (u8[0] === 0x89 && u8[1] === 0x50) r = png(u8);
        else { const { blob } = await processImage(f, { type: outType(f.type), quality: .95 }); r = { meta: {}, found: ['unknown (re-encoded)'], orient: 1, clean: blob }; note = 'Re-encoded through canvas, which drops all metadata.'; }
        if (r.orient > 1) { const { blob } = await processImage(f, { type: 'image/jpeg', quality: .95 }); r.clean = blob; note = 'Photo had a rotation flag, so it was re-encoded upright at 95% quality.'; }
        const rows = Object.entries(r.meta).filter(([k]) => k !== 'Orientation'), gps = r.meta['GPS latitude'];
        const name = rename(f.name, 'clean', r.clean.type), url = URL.createObjectURL(r.clean);
        out.insertAdjacentHTML('beforeend', `<div class="tool-box" style="padding:18px;margin:0 0 14px;box-shadow:none"><div class="file-row" style="margin-bottom:12px"><span class="fn">${f.name}</span><span>${fmtBytes(f.size)} → <b>${fmtBytes(r.clean.size)}</b></span><a class="btn-sm" href="${url}" download="${name}">Download clean copy</a></div>
${gps ? `<div class="badge fail" style="margin-bottom:12px"><b>⚠ GPS location found:</b> ${gps}, ${r.meta['GPS longitude']} <small><a href="https://www.openstreetmap.org/?mlat=${gps}&mlon=${r.meta['GPS longitude']}#map=15/${gps}/${r.meta['GPS longitude']}" target="_blank" rel="noopener">view on map</a></small></div>` : ''}
<p class="note" style="margin:0 0 10px">Metadata blocks found: ${r.found.length ? r.found.join(', ') : 'none'} · ${note}</p>${rows.length ? `<div class="scroll-x"><table class="table"><tbody>${rows.map(([k, v]) => `<tr><th style="width:180px">${k}</th><td>${String(Array.isArray(v) ? v.join(', ') : v).replace(/</g, '&lt;')}</td></tr>`).join('')}</tbody></table></div>` : ''}</div>`);
      }
    });
  },
  how: ['Drop one or more photos onto the upload area.', 'Review the metadata found, including any GPS location warning.', 'Click “Download clean copy” for each image.', 'Share the clean copy instead of the original.'],
  about: `<p>EXIF (Exchangeable Image File Format) data is written by cameras and phones into JPEG files. It can include the camera model, lens, exposure settings, the date and time, editing software, and, if location services were on, the GPS coordinates where the photo was taken. Some sites strip this on upload (most big social networks do), but email attachments, messaging apps that send “original quality”, cloud share links and many forums keep it.</p><p>For JPEGs, this tool removes the metadata segments (EXIF, XMP, IPTC and comments) without re-compressing, so image quality is identical. The color profile segment (ICC) is kept so colors stay accurate. PNG text and eXIf chunks are removed the same way.</p>`,
  tips: ['Check photos of your home, children or valuables for GPS data before sending them to strangers.', 'Turn off location tagging in your phone camera settings if you never need it.', 'Keep the original files with metadata in your own archive; dates and camera settings are useful for organising.', 'Screenshots usually contain little metadata, but edited images may carry software and author fields.', 'If a photo appears rotated after cleaning in other tools, it lost its orientation flag; this tool re-encodes such photos upright automatically.'],
  faq: [['Does removing EXIF reduce image quality?', 'No, not for JPEGs and PNGs here: only metadata blocks are removed and the image data is copied unchanged (except photos with a rotation flag, which are re-encoded upright at high quality).'], ['Do social media sites remove EXIF data?', 'Most large platforms strip GPS data from public images, but email, many messaging apps, file-sharing links and some forums do not.']],
},
{
  slug: 'svg-optimizer', cat: 'image', name: 'SVG Optimizer',
  title: 'SVG Optimizer – Minify & Clean SVG Code From Figma and Illustrator',
  desc: 'Optimize SVG files online: remove editor metadata, comments and hidden junk, round coordinates and minify markup. Compare before and after size and preview to make sure nothing breaks.',
  kw: ['svg optimizer', 'minify svg', 'compress svg', 'clean svg code', 'svg cleaner', 'reduce svg file size'],
  short: 'Clean and minify SVG code exported from design tools.',
  intro: 'Exported SVGs often carry editor data you don’t need. Paste code or upload a file to strip it, round numbers and see how many bytes you save.',
  html: `<div class="tool-layout even"><div class="panel">${drop('soFile', { accept: '.svg,image/svg+xml', text: 'SVG files · or paste code below' })}<label class="f"><span>SVG input</span><textarea id="soIn" rows="9" spellcheck="false"><?xml version="1.0" encoding="UTF-8"?>
<!-- Generator: Design App 1.0 -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="120" height="120" viewBox="0 0 120 120" version="1.1">
  <metadata>Exported metadata</metadata>
  <g id="Layer_1" inkscape:label="Layer 1">
    <rect x="0.000000" y="0.000000" width="120.000000" height="120.000000" rx="28.000000" fill="#141414"/>
    <circle cx="60.0000032" cy="60.0000017" r="30.0000005" fill="#E8DCC4"/>
  </g>
</svg></textarea></label>
<div class="grid2">${sel('soP', 'Decimal precision', [[0, '0'], [1, '1'], [2, '2'], [3, '3']], 2)}<div>${chk('soT', 'Remove &lt;title&gt; and &lt;desc&gt;')}${chk('soId', 'Remove unused IDs', true)}</div></div><button type="button" class="btn" id="soGo" style="width:100%">Optimize SVG</button></div>
<div class="panel"><div class="stat-grid"><div class="stat"><span>Before</span><b id="soA">–</b></div><div class="stat"><span>After</span><b id="soB">–</b></div><div class="stat"><span>Saved</span><b id="soS">–</b></div></div>
<div class="grid2"><div class="preview checker" id="soPa" style="min-height:140px"></div><div class="preview checker" id="soPb" style="min-height:140px"></div></div><p class="note">Left: original · Right: optimized</p>
<label class="f"><span>Optimized SVG</span><textarea id="soOut" rows="7" readonly spellcheck="false"></textarea></label><div class="btn-row"><button type="button" class="btn-alt" data-copy-from="soOut">Copy</button><button type="button" class="btn-alt" id="soDl">Download .svg</button></div></div></div>`,
  js: () => {
    const NUMA = ['d', 'points', 'transform', 'viewBox', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'width', 'height', 'stroke-width', 'offset', 'opacity', 'fill-opacity', 'stroke-opacity', 'font-size', 'fx', 'fy', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset'];
    function opt(src) {
      const doc = new DOMParser().parseFromString(src, 'image/svg+xml'), svg = doc.documentElement; if (doc.querySelector('parsererror') || svg.nodeName !== 'svg') throw new Error('Invalid SVG');
      const p = +el('soP').value, rnd = s => s.replace(/-?\d*\.\d+(e-?\d+)?/gi, n => String(+(+n).toFixed(p)));
      const walker = doc.createTreeWalker(svg, 128 | 1); const kill = [];
      const nodes = [svg]; while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const n of nodes) { if (n.nodeType === 8) { kill.push(n); continue; }
        if (/^(sodipodi|inkscape|sketch|figma|serif|i|x|a|graph|dc|cc|rdf):/.test(n.nodeName) || n.nodeName === 'metadata' || (el('soT').checked && (n.nodeName === 'title' || n.nodeName === 'desc'))) { kill.push(n); continue; }
        [...n.attributes].forEach(a => { if (/^(xmlns:(sodipodi|inkscape|sketch|serif|i|x|graph|dc|cc|rdf|figma|xlink)|sodipodi:|inkscape:|sketch:|serif:|data-name|enable-background|xml:space)/.test(a.name) || (n === svg && a.name === 'version')) (a.name.startsWith('xmlns:') ? n.removeAttributeNS('http://www.w3.org/2000/xmlns/', a.localName) : n.removeAttribute(a.name)); else if (NUMA.includes(a.name)) n.setAttribute(a.name, rnd(a.value).replace(/\s+/g, ' ').trim()); }); }
      kill.forEach(n => n.remove());
      if (el('soId').checked) { const s = new XMLSerializer().serializeToString(svg); svg.querySelectorAll('[id]').forEach(n => { const id = n.id; if (!s.includes('#' + id + ')') && !s.includes('"#' + id + '"') && !s.includes("'#" + id + "'")) n.removeAttribute('id'); }); }
      svg.querySelectorAll('g').forEach(g => { if (!g.attributes.length && g.parentNode) { while (g.firstChild) g.parentNode.insertBefore(g.firstChild, g); g.remove(); } });
      let out = new XMLSerializer().serializeToString(svg); if (/xlink:href/.test(out) && !/xmlns:xlink/.test(out)) out = out.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      return out.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').replace(/ \/>/g, '/>').trim();
    }
    const enc = s => `<img alt="" style="max-width:100%;max-height:120px" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}">`;
    function run() { const src = el('soIn').value; try { const o = opt(src), a = new Blob([src]).size, b = new Blob([o]).size; el('soOut').value = o; el('soA').textContent = fmtBytes(a); el('soB').textContent = fmtBytes(b); el('soS').textContent = Math.round((1 - b / a) * 100) + '%'; el('soPa').innerHTML = enc(src); el('soPb').innerHTML = enc(o); el('soIn').classList.remove('bad'); } catch (e) { el('soIn').classList.add('bad'); el('soOut').value = 'Could not parse this SVG: ' + e.message; } }
    fileDrop(el('soFileZone'), el('soFile'), fs => fs[0].text().then(t => { el('soIn').value = t; run(); }));
    el('soGo').onclick = run; el('soDl').onclick = () => downloadText(el('soOut').value, 'optimized.svg', 'image/svg+xml'); run();
  },
  how: ['Upload an SVG file or paste SVG code.', 'Choose the decimal precision for coordinates (2 is safe for most icons).', 'Click Optimize and compare the original and optimized previews.', 'Copy the code or download the optimized file.'],
  about: `<p>Design tools add a lot to exported SVGs: XML declarations, generator comments, editor namespaces (Inkscape, Sketch, Illustrator), metadata blocks, empty groups, unused IDs and coordinates with six or more decimal places. None of this affects how the graphic looks in a browser. Removing it often cuts icon files by 30–60%.</p><p>This optimizer works on the parsed SVG structure rather than with blind text replacement, and shows both versions side by side so you can confirm nothing changed. For build pipelines, SVGO is the standard command-line tool with many more optimisations.</p>`,
  tips: ['Precision 1–2 is enough for icons displayed under 100px; use 3 for large illustrations or maps.', 'Keep <title> for meaningful standalone SVG images, because screen readers use it as the accessible name.', 'Convert text to outlines in your design tool before exporting if the font may not be available.', 'Inline small optimized SVG icons directly into HTML to save requests and allow CSS coloring with currentColor.', 'Always compare the previews; very low precision can distort small curves.'],
  faq: [['Will optimizing change how my SVG looks?', 'It shouldn’t at precision 2 or higher. Compare the previews; if anything shifts, raise the precision.'], ['Why are SVGs from Illustrator or Inkscape so large?', 'They include editor metadata, namespaces and very precise coordinates that browsers don’t need.']],
},
];
