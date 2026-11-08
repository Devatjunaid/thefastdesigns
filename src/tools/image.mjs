import { range, num, txt, color, sel, chk, drop, code } from '../lib.mjs';

const fmtSel = (id, withOrig = true, def = 'image/webp') => sel(id, 'Output format', [...(withOrig ? [['orig', 'Same as original']] : []), ['image/webp', 'WebP (smallest)'], ['image/jpeg', 'JPG'], ['image/png', 'PNG (lossless)']], withOrig ? 'orig' : def);

export default [
{
  slug: 'image-resizer', cat: 'image', name: 'Image Resizer',
  title: 'Image Resizer – Resize Images Online in Pixels or Percentage',
  desc: 'Resize JPG, PNG and WebP images online to exact pixel dimensions or by percentage. Keep aspect ratio, pick output format and quality, and download instantly. 100% private.',
  kw: ['image resizer', 'resize image online', 'resize photo', 'change image size', 'resize png', 'resize jpg pixels'],
  short: 'Resize photos to exact pixel dimensions or a percentage, privately.',
  intro: 'Resize images for websites, social media or email without installing software. Your photos are processed locally and never uploaded.',
  html: `${drop('rsFile')}<div id="rsBox" hidden><p class="note" id="rsInfo" style="margin:0 0 14px"></p><div class="tool-layout"><div class="panel" id="rsP">
<div class="grid2">${num('rsW', 'Width (px)', 0, 'min="1"')}${num('rsH', 'Height (px)', 0, 'min="1"')}</div>
${chk('rsLock', 'Keep aspect ratio', true)}
<div class="btn-row" style="margin-bottom:14px"><button type="button" class="btn-sm" data-pct="25">25%</button><button type="button" class="btn-sm" data-pct="50">50%</button><button type="button" class="btn-sm" data-pct="75">75%</button><button type="button" class="btn-sm" data-pct="100">100%</button><button type="button" class="btn-sm" data-pct="200">200%</button></div>
${fmtSel('rsFmt')}${range('rsQ', 'Quality (JPG/WebP)', 10, 100, 90, 1, '%')}
<button type="button" class="btn" id="rsGo" style="width:100%">Resize &amp; download</button><div id="rsRes" class="file-list"></div>
</div><div class="panel"><div class="preview checker"><img id="rsPrev" alt="Image preview"></div></div></div></div>`,
  js: () => {
    let img, file; const W = el('rsW'), H = el('rsH'), lock = el('rsLock');
    fileDrop(el('rsFileZone'), el('rsFile'), async fs => { file = fs[0]; img = await loadImage(file); W.value = imgW(img); H.value = imgH(img); el('rsInfo').textContent = `Original: ${imgW(img)} × ${imgH(img)} px · ${fmtBytes(file.size)} · ${file.name}`; el('rsPrev').src = img.src; el('rsBox').hidden = false; el('rsRes').innerHTML = ''; });
    W.addEventListener('input', () => { if (lock.checked && img) H.value = Math.max(1, Math.round(W.value * imgH(img) / imgW(img))); });
    H.addEventListener('input', () => { if (lock.checked && img) W.value = Math.max(1, Math.round(H.value * imgW(img) / imgH(img))); });
    document.querySelectorAll('[data-pct]').forEach(b => b.onclick = () => { W.value = Math.max(1, Math.round(imgW(img) * b.dataset.pct / 100)); H.value = Math.max(1, Math.round(imgH(img) * b.dataset.pct / 100)); });
    el('rsGo').onclick = async () => {
      const w = clamp(+W.value | 0, 1, 16000), h = clamp(+H.value | 0, 1, 16000), type = el('rsFmt').value === 'orig' ? outType(file.type) : el('rsFmt').value;
      const cv = makeCanvas(w, h), ctx = cv.getContext('2d'); if (type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
      ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, w, h);
      const blob = await toBlob(cv, type, el('rsQ').value / 100), name = rename(file.name, `${w}x${h}`, type);
      el('rsRes').innerHTML = fileRow(name, file.size, blob, name); el('rsPrev').src = URL.createObjectURL(blob); downloadBlob(blob, name);
    };
  },
  how: ['Upload, drag & drop or paste an image.', 'Enter a new width or height — the other side updates automatically when the ratio is locked.', 'Or click a percentage preset like 50%.', 'Choose the output format and quality, then click “Resize & download”.'],
  about: `<p>Oversized images are the number-one cause of slow websites. Resizing a 4000px camera photo down to the size it is actually displayed (often 1200–1600px) can cut its file size by 80% or more. This resizer uses the browser’s high-quality image smoothing for crisp results.</p><p>Common sizes: 1920×1080 for full-HD hero images, 1200×630 for Open Graph link previews, 1080×1080 for Instagram posts and 800px wide for email newsletters.</p>`,
  faq: [['Will resizing reduce image quality?', 'Making an image smaller keeps it sharp. Enlarging beyond the original size adds no new detail and may look soft.'], ['Is there a file size limit?', 'No upload limit exists because nothing is uploaded. Very large images depend only on your device’s memory.'], ['Are my images stored?', 'No. All processing happens in your browser; files never leave your computer.']],
},
{
  slug: 'image-compressor', cat: 'image', name: 'Image Compressor',
  title: 'Image Compressor – Compress JPG, PNG & WebP Without Losing Quality',
  desc: 'Compress images online to reduce file size for faster websites. Batch compress JPG, PNG and WebP photos with adjustable quality and max width. Private — no uploads needed.',
  kw: ['image compressor', 'compress image', 'reduce image size', 'compress jpg', 'compress png', 'optimize images for web'],
  short: 'Shrink JPG, PNG and WebP file sizes in bulk while keeping quality high.',
  intro: 'Reduce image file sizes by up to 90% for faster page loads and smaller email attachments. Compress many images at once, right in your browser.',
  html: `<div class="tool-layout"><div class="panel">
${sel('icF', 'Output format', [['image/webp', 'WebP (best compression)'], ['image/jpeg', 'JPG'], ['orig', 'Keep original format']], 'image/webp')}
${range('icQ', 'Quality', 10, 100, 75, 1, '%')}
${num('icMax', 'Max width in px (0 = keep size)', 0, 'min="0"')}
<p class="note">75–80% quality is visually lossless for most photos. PNG output is lossless, so choose WebP or JPG for the biggest savings.</p>
</div><div class="panel">${drop('icFile', { multiple: true })}<div id="icList" class="file-list"></div><div class="btn-row"><button type="button" class="btn" id="icAll" hidden>Download all</button></div></div></div>`,
  js: () => {
    let files = [];
    async function run() {
      const list = el('icList'); list.innerHTML = ''; el('icAll').hidden = true; let tb = 0, ta = 0;
      for (const f of files) {
        const type = el('icF').value === 'orig' ? outType(f.type) : el('icF').value;
        try { const { blob } = await processImage(f, { type, quality: el('icQ').value / 100, maxW: +el('icMax').value || 0 }); tb += f.size; ta += blob.size; list.insertAdjacentHTML('beforeend', fileRow(f.name, f.size, blob, rename(f.name, 'min', type))); }
        catch (e) { list.insertAdjacentHTML('beforeend', `<div class="file-row"><span class="fn">${f.name}</span><span class="warn">Could not read file</span></div>`); }
      }
      if (files.length > 1) { list.insertAdjacentHTML('afterbegin', `<div class="file-row" style="background:var(--beige-3)"><span class="fn">Total (${files.length} files)</span><span>${fmtBytes(tb)} → <b>${fmtBytes(ta)}</b> <em class="ok">−${Math.max(0, Math.round((1 - ta / tb) * 100))}%</em></span></div>`); el('icAll').hidden = false; }
    }
    fileDrop(el('icFileZone'), el('icFile'), fs => { files = fs; run(); });
    ['icF', 'icQ', 'icMax'].forEach(i => el(i).addEventListener('change', () => files.length && run()));
    el('icAll').onclick = () => document.querySelectorAll('#icList a[download]').forEach((a, i) => setTimeout(() => a.click(), i * 250));
  },
  how: ['Choose an output format and quality level.', 'Optionally set a maximum width to downscale large photos.', 'Drop one or many images onto the upload area.', 'Compare the before and after sizes and download each file or all at once.'],
  about: `<p>Image compression removes data the human eye barely notices. <strong>WebP</strong> typically produces files 25–35% smaller than JPG at the same visual quality and is supported by every modern browser. Pairing compression with a sensible max width (e.g. 1600px) delivers the biggest savings.</p><p>Faster-loading images improve Core Web Vitals such as Largest Contentful Paint (LCP), which helps both user experience and search rankings.</p>`,
  faq: [['How much can I compress an image?', 'Photos often shrink by 60–90% when converted to WebP at 75% quality and resized to a sensible width.'], ['Why did my PNG get bigger?', 'PNG is lossless. If the original was already optimized, re-encoding can increase size — switch to WebP or JPG for photos.'], ['Can I compress multiple images at once?', 'Yes, select or drop as many images as you like and download them all with one click.']],
},
{
  slug: 'image-converter', cat: 'image', name: 'Image Format Converter',
  title: 'Image Converter – Convert PNG to JPG, JPG to WebP & WebP to PNG',
  desc: 'Convert images between PNG, JPG and WebP formats online for free. Batch convert transparent PNGs, WebP to JPG and more, entirely in your browser with no upload.',
  kw: ['image converter', 'png to jpg', 'jpg to png', 'webp to png', 'webp to jpg', 'convert to webp'],
  short: 'Batch convert images between PNG, JPG and WebP in your browser.',
  intro: 'Convert one or many images to PNG, JPG or WebP in seconds. Transparent areas are filled with your chosen color when converting to JPG.',
  html: `<div class="tool-layout"><div class="panel">
${sel('cvT', 'Convert to', [['image/png', 'PNG'], ['image/jpeg', 'JPG / JPEG'], ['image/webp', 'WebP']], 'image/png')}
${range('cvQ', 'Quality (JPG/WebP)', 10, 100, 92, 1, '%')}
${color('cvBg', 'Background for transparent areas (JPG)', '#ffffff')}
</div><div class="panel">${drop('cvFile', { multiple: true, text: 'PNG, JPG, WebP, GIF, BMP, SVG, AVIF · files never leave your device' })}<div id="cvList" class="file-list"></div><div class="btn-row"><button type="button" class="btn" id="cvAll" hidden>Download all</button></div></div></div>`,
  js: () => {
    let files = [];
    async function run() {
      const list = el('cvList'), type = el('cvT').value; list.innerHTML = '';
      for (const f of files) {
        try {
          const img = await loadImage(f), cv = makeCanvas(imgW(img), imgH(img)), ctx = cv.getContext('2d');
          if (type === 'image/jpeg') { ctx.fillStyle = el('cvBg').value; ctx.fillRect(0, 0, cv.width, cv.height); }
          ctx.drawImage(img, 0, 0, cv.width, cv.height); const blob = await toBlob(cv, type, el('cvQ').value / 100);
          list.insertAdjacentHTML('beforeend', fileRow(f.name, f.size, blob, rename(f.name, '', type)));
        } catch (e) { list.insertAdjacentHTML('beforeend', `<div class="file-row"><span class="fn">${f.name}</span><span class="warn">Format not supported by this browser</span></div>`); }
      }
      el('cvAll').hidden = files.length < 2;
    }
    fileDrop(el('cvFileZone'), el('cvFile'), fs => { files = fs; run(); });
    ['cvT', 'cvQ', 'cvBg'].forEach(i => el(i).addEventListener('change', () => files.length && run()));
    el('cvAll').onclick = () => document.querySelectorAll('#cvList a[download]').forEach((a, i) => setTimeout(() => a.click(), i * 250));
  },
  how: ['Pick the format you want to convert to.', 'Adjust quality and background color if converting to JPG or WebP.', 'Drop one or more images on the upload area.', 'Download each converted file or all at once.'],
  about: `<p><strong>PNG</strong> is lossless and supports transparency — best for logos, icons and screenshots. <strong>JPG</strong> is ideal for photographs and has universal compatibility. <strong>WebP</strong> supports both transparency and lossy compression with much smaller files, making it the best choice for websites.</p><p>Your browser decodes the source file, so any format your browser can display (including GIF, BMP, SVG and usually AVIF) can be converted.</p>`,
  faq: [['How do I convert WebP to JPG?', 'Choose “JPG” as the output, drop your WebP files and click Download.'], ['Will converting PNG to JPG lose transparency?', 'Yes, JPG doesn’t support transparency. Transparent pixels are filled with the background color you choose.']],
},
{
  slug: 'image-cropper', cat: 'image', name: 'Image Cropper',
  title: 'Crop Image Online – Free Photo Cropper With Aspect Ratios',
  desc: 'Crop images online with a free, easy photo cropper. Use preset aspect ratios like 1:1, 16:9, 4:5 and 9:16 for Instagram, YouTube and stories, then download in full quality.',
  kw: ['crop image', 'image cropper', 'crop photo online', 'crop to square', 'aspect ratio crop', 'instagram crop'],
  short: 'Crop photos freely or to 1:1, 16:9, 4:5 and other aspect ratios.',
  intro: 'Drag to move the crop area and use the corner handles to resize it. Lock an aspect ratio for social media posts, thumbnails and banners.',
  html: `${drop('crFile')}<div id="crBox" hidden><div class="tool-layout" style="grid-template-columns:minmax(0,1fr) 280px"><div class="preview" style="padding:12px"><div class="crop-stage" id="crStage"><img id="crImg" alt="Image to crop" draggable="false"><div class="crop-box" id="crSel"><i data-h="nw"></i><i data-h="ne"></i><i data-h="sw"></i><i data-h="se"></i></div></div></div>
<div class="panel">${sel('crAr', 'Aspect ratio', [['free', 'Free'], ['1:1', '1:1 Square'], ['4:5', '4:5 Portrait post'], ['16:9', '16:9 Widescreen'], ['9:16', '9:16 Story / Reel'], ['4:3', '4:3'], ['3:2', '3:2'], ['2:3', '2:3'], ['21:9', '21:9 Ultrawide'], ['1.91:1', '1.91:1 Link preview']], 'free')}
<div class="stat"><span>Crop size</span><b id="crInfo">–</b></div><div style="height:14px"></div>
${fmtSel('crFmt')}<button type="button" class="btn" id="crGo" style="width:100%">Crop &amp; download</button></div></div></div>`,
  js: () => {
    let file, b = { x: 0, y: 0, w: 0, h: 0 }, dW, dH, sc; const pic = el('crImg'), sb = el('crSel'), ar = el('crAr');
    const ratio = () => { if (ar.value === 'free') return 0; const [a, c] = ar.value.split(':').map(Number); return a / c; };
    const apply = () => { sb.style.left = b.x + 'px'; sb.style.top = b.y + 'px'; sb.style.width = b.w + 'px'; sb.style.height = b.h + 'px'; el('crInfo').textContent = `${Math.round(b.w * sc)} × ${Math.round(b.h * sc)} px`; };
    function reset() { dW = pic.clientWidth; dH = pic.clientHeight; sc = pic.naturalWidth / dW; const r = ratio(); let w = dW * .85, h = dH * .85; if (r) { if (w / h > r) w = h * r; else h = w / r; } b = { x: (dW - w) / 2, y: (dH - h) / 2, w, h }; apply(); }
    pic.onload = () => { el('crBox').hidden = false; requestAnimationFrame(reset); };
    fileDrop(el('crFileZone'), el('crFile'), fs => { file = fs[0]; pic.src = URL.createObjectURL(file); });
    ar.addEventListener('change', reset); window.addEventListener('resize', () => file && reset());
    sb.addEventListener('pointerdown', e => {
      e.preventDefault(); const mode = e.target.dataset.h || 'move', sx = e.clientX, sy = e.clientY, b0 = { ...b }, r = ratio(); sb.setPointerCapture(e.pointerId);
      const mv = ev => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (mode === 'move') { b.x = clamp(b0.x + dx, 0, dW - b0.w); b.y = clamp(b0.y + dy, 0, dH - b0.h); }
        else {
          const E = mode.includes('e'), S = mode.includes('s'), ax = E ? b0.x : b0.x + b0.w, ay = S ? b0.y : b0.y + b0.h;
          const px = clamp((E ? b0.x + b0.w : b0.x) + dx, 0, dW), py = clamp((S ? b0.y + b0.h : b0.y) + dy, 0, dH);
          let w = Math.max(20, Math.abs(px - ax)), h = Math.max(20, Math.abs(py - ay)); if (r) { if (w / h > r) w = h * r; else h = w / r; }
          const L = px < ax, T = py < ay, mW = L ? ax : dW - ax, mH = T ? ay : dH - ay;
          if (w > mW) { w = mW; if (r) h = w / r; } if (h > mH) { h = mH; if (r) w = h * r; }
          b = { x: L ? ax - w : ax, y: T ? ay - h : ay, w, h };
        }
        apply();
      };
      const up = () => { sb.removeEventListener('pointermove', mv); sb.removeEventListener('pointerup', up); };
      sb.addEventListener('pointermove', mv); sb.addEventListener('pointerup', up);
    });
    el('crGo').onclick = async () => {
      const w = Math.round(b.w * sc), h = Math.round(b.h * sc), type = el('crFmt').value === 'orig' ? outType(file.type) : el('crFmt').value, cv = makeCanvas(w, h), ctx = cv.getContext('2d');
      if (type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
      ctx.drawImage(pic, b.x * sc, b.y * sc, w, h, 0, 0, w, h); downloadBlob(await toBlob(cv, type, .92), rename(file.name, 'cropped', type));
    };
  },
  how: ['Upload, drop or paste the image you want to crop.', 'Choose an aspect ratio or keep it free.', 'Drag the box to reposition it and pull the corner handles to resize.', 'Click “Crop & download” to save the full-resolution result.'],
  about: `<p>Cropping improves composition and helps images fit the exact frames required by social platforms. Popular ratios include <strong>1:1</strong> for profile pictures and grid posts, <strong>4:5</strong> for portrait Instagram posts, <strong>9:16</strong> for Stories, Reels and TikTok, <strong>16:9</strong> for YouTube thumbnails and <strong>1.91:1</strong> for link previews.</p><p>The crop is applied to the original full-resolution image, not the on-screen preview, so you never lose detail.</p>`,
  faq: [['How do I crop an image to a square?', 'Select the 1:1 aspect ratio, position the box and click Crop & download.'], ['Does cropping reduce quality?', 'No. The cropped area is exported at the original pixel resolution.']],
},
{
  slug: 'photo-filters', cat: 'image', name: 'Photo Filters & Editor',
  title: 'Online Photo Editor – Brightness, Contrast, Saturation & Filters',
  desc: 'Edit photos online for free: adjust brightness, contrast, saturation, blur, hue and apply grayscale, sepia and vintage filters. Instant preview and full-resolution download.',
  kw: ['photo editor online', 'image filters', 'adjust brightness', 'black and white photo', 'sepia filter', 'photo effects'],
  short: 'Adjust brightness, contrast, saturation and apply photo filters.',
  intro: 'Quick photo edits without heavy software. Use the sliders or one-click presets like Vintage, B&W and Warm, then download at full resolution.',
  html: `${drop('pfFile')}<div id="pfBox" hidden><div class="tool-layout"><div class="panel" id="pfP">
<div class="btn-row" style="margin-bottom:14px"><button type="button" class="btn-sm" data-pf="none">Original</button><button type="button" class="btn-sm" data-pf="bw">B&amp;W</button><button type="button" class="btn-sm" data-pf="vintage">Vintage</button><button type="button" class="btn-sm" data-pf="warm">Warm</button><button type="button" class="btn-sm" data-pf="cool">Cool</button><button type="button" class="btn-sm" data-pf="drama">Dramatic</button><button type="button" class="btn-sm" data-pf="fade">Faded</button></div>
${range('pfBr', 'Brightness', 0, 200, 100, 1, '%')}${range('pfCo', 'Contrast', 0, 200, 100, 1, '%')}${range('pfSa', 'Saturation', 0, 200, 100, 1, '%')}
${range('pfGr', 'Grayscale', 0, 100, 0, 1, '%')}${range('pfSe', 'Sepia', 0, 100, 0, 1, '%')}${range('pfHu', 'Hue rotate', 0, 360, 0, 1, '°')}
${range('pfIn', 'Invert', 0, 100, 0, 1, '%')}${range('pfBl', 'Blur', 0, 20, 0, .5, 'px')}
${fmtSel('pfFmt')}<button type="button" class="btn" id="pfGo" style="width:100%">Download edited photo</button>
</div><div class="panel"><div class="preview checker"><img id="pfImg" alt="Photo preview"></div>${code('pfCode', 'Copy CSS filter')}</div></div></div>`,
  js: () => {
    let file; const K = ['pfBr', 'pfCo', 'pfSa', 'pfGr', 'pfSe', 'pfHu', 'pfIn', 'pfBl'];
    const PRE = { none: [100, 100, 100, 0, 0, 0, 0, 0], bw: [105, 120, 100, 100, 0, 0, 0, 0], vintage: [105, 90, 80, 0, 45, 350, 0, 0], warm: [105, 105, 120, 0, 20, 350, 0, 0], cool: [100, 105, 90, 0, 0, 12, 0, 0], drama: [95, 140, 120, 0, 0, 0, 0, 0], fade: [110, 80, 70, 0, 10, 0, 0, 0] };
    const f = () => { const v = K.map(k => +el(k).value); return `brightness(${v[0]}%) contrast(${v[1]}%) saturate(${v[2]}%) grayscale(${v[3]}%) sepia(${v[4]}%) hue-rotate(${v[5]}deg) invert(${v[6]}%) blur(${v[7]}px)`; };
    const upd = () => { el('pfImg').style.filter = f(); el('pfCode').textContent = `filter: ${f()};`; };
    fileDrop(el('pfFileZone'), el('pfFile'), fs => { file = fs[0]; el('pfImg').src = URL.createObjectURL(file); el('pfBox').hidden = false; upd(); });
    el('pfP').addEventListener('input', upd);
    document.querySelectorAll('[data-pf]').forEach(b => b.onclick = () => { PRE[b.dataset.pf].forEach((v, i) => { el(K[i]).value = v; syncOut(el(K[i])); }); upd(); });
    function manual(ctx, w, h) {
      const v = K.map(k => +el(k).value), I = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]];
      const mul = (A, B) => A.map(r => [0, 1, 2, 3].map(j => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j] + (j === 3 ? r[3] : 0)));
      const sat = s => [[.213 + .787 * s, .715 - .715 * s, .072 - .072 * s, 0], [.213 - .213 * s, .715 + .285 * s, .072 - .072 * s, 0], [.213 - .213 * s, .715 - .715 * s, .072 + .928 * s, 0]];
      const t = 1 - v[4] / 100, a = v[5] * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), b = v[0] / 100, k = v[1] / 100, n = v[6] / 100;
      const ops = [[[b, 0, 0, 0], [0, b, 0, 0], [0, 0, b, 0]], [[k, 0, 0, 127.5 * (1 - k)], [0, k, 0, 127.5 * (1 - k)], [0, 0, k, 127.5 * (1 - k)]], sat(v[2] / 100), sat(1 - v[3] / 100),
        [[.393 + .607 * t, .769 - .769 * t, .189 - .189 * t, 0], [.349 - .349 * t, .686 + .314 * t, .168 - .168 * t, 0], [.272 - .272 * t, .534 - .534 * t, .131 + .869 * t, 0]],
        [[.213 + c * .787 - s * .213, .715 - c * .715 - s * .715, .072 - c * .072 + s * .928, 0], [.213 - c * .213 + s * .143, .715 + c * .285 + s * .14, .072 - c * .072 - s * .283, 0], [.213 - c * .213 - s * .787, .715 - c * .715 + s * .715, .072 + c * .928 + s * .072, 0]],
        [[1 - 2 * n, 0, 0, 255 * n], [0, 1 - 2 * n, 0, 255 * n], [0, 0, 1 - 2 * n, 255 * n]]];
      const M = ops.reduce((m, o) => mul(o, m), I), d = ctx.getImageData(0, 0, w, h), p = d.data;
      for (let i = 0; i < p.length; i += 4) { const r = p[i], g = p[i + 1], bb = p[i + 2]; for (let j = 0; j < 3; j++) p[i + j] = M[j][0] * r + M[j][1] * g + M[j][2] * bb + M[j][3]; }
      ctx.putImageData(d, 0, 0);
    }
    el('pfGo').onclick = async () => {
      const img = el('pfImg'), w = img.naturalWidth, h = img.naturalHeight, type = el('pfFmt').value === 'orig' ? outType(file.type) : el('pfFmt').value, cv = makeCanvas(w, h), ctx = cv.getContext('2d', { willReadFrequently: true });
      if (type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
      ctx.filter = 'blur(1px)'; const native = ctx.filter === 'blur(1px)'; ctx.filter = native ? f() : 'none'; ctx.drawImage(img, 0, 0, w, h); ctx.filter = 'none';
      if (!native) manual(ctx, w, h);
      downloadBlob(await toBlob(cv, type, .92), rename(file.name, 'edited', type));
    };
  },
  how: ['Upload, drop or paste a photo.', 'Click a preset or fine-tune brightness, contrast, saturation and other sliders.', 'Compare the live preview as you go.', 'Download the edited photo at its original resolution.'],
  about: `<p>Small adjustments make a big difference: a touch more contrast and saturation brings flat smartphone photos to life, while grayscale and sepia create timeless looks for portfolios and blog headers. The same values are available as a CSS <code>filter</code> string if you’d rather apply the effect directly on your website.</p><p>Edits are rendered with your browser’s graphics engine at full resolution, and your photos never leave your device.</p>`,
  faq: [['How do I make a photo black and white?', 'Click the B&W preset or drag Grayscale to 100%, then download.'], ['Can I use the effect in CSS instead?', 'Yes. Copy the CSS filter string and apply it to any image on your website.']],
},
{
  slug: 'rotate-flip-image', cat: 'image', name: 'Rotate & Flip Image',
  title: 'Rotate Image Online – Flip Photos Horizontally or Vertically',
  desc: 'Rotate images 90°, 180° or 270° and flip them horizontally or vertically (mirror image) online. Fix sideways photos and download in PNG, JPG or WebP instantly.',
  kw: ['rotate image', 'flip image', 'mirror image online', 'rotate photo 90 degrees', 'flip photo horizontally', 'turn picture'],
  short: 'Rotate photos by 90° steps and mirror them horizontally or vertically.',
  intro: 'Fix sideways phone photos or create mirrored images in a click. Combine rotations and flips, preview the result and download.',
  html: `${drop('rfFile')}<div id="rfBox" hidden><div class="tool-layout"><div class="panel">
<div class="btn-row"><button type="button" class="btn-alt" id="rfL">⟲ Rotate left</button><button type="button" class="btn-alt" id="rfR">⟳ Rotate right</button></div>
<div class="btn-row"><button type="button" class="btn-alt" id="rfH">⇋ Flip horizontal</button><button type="button" class="btn-alt" id="rfV">⇵ Flip vertical</button></div>
<div class="btn-row" style="margin-bottom:16px"><button type="button" class="btn-sm" id="rfX">Reset</button></div>
<div class="stat" style="margin-bottom:14px"><span>Current state</span><b id="rfInfo">0°</b></div>
${fmtSel('rfFmt')}<button type="button" class="btn" id="rfGo" style="width:100%">Download image</button>
</div><div class="panel"><div class="preview checker"><canvas id="rfC"></canvas></div></div></div></div>`,
  js: () => {
    let img, file, rot = 0, fh = false, fv = false; const cv = el('rfC');
    function draw(target = cv, s = 1) {
      const w = imgW(img), h = imgH(img), sw = rot % 180 ? h : w, shh = rot % 180 ? w : h; target.width = Math.round(sw * s); target.height = Math.round(shh * s);
      const ctx = target.getContext('2d'); ctx.save(); ctx.translate(target.width / 2, target.height / 2); ctx.rotate(rot * Math.PI / 180); ctx.scale(fh ? -1 : 1, fv ? -1 : 1); ctx.drawImage(img, -w * s / 2, -h * s / 2, w * s, h * s); ctx.restore();
      el('rfInfo').textContent = `${rot}°${fh ? ' · flipped H' : ''}${fv ? ' · flipped V' : ''}`;
    }
    const prev = () => draw(cv, Math.min(1, 1200 / Math.max(imgW(img), imgH(img))));
    fileDrop(el('rfFileZone'), el('rfFile'), async fs => { file = fs[0]; img = await loadImage(file); rot = 0; fh = fv = false; el('rfBox').hidden = false; prev(); });
    el('rfL').onclick = () => { rot = (rot + 270) % 360; prev(); }; el('rfR').onclick = () => { rot = (rot + 90) % 360; prev(); };
    el('rfH').onclick = () => { if (rot % 180) fv = !fv; else fh = !fh; prev(); }; el('rfV').onclick = () => { if (rot % 180) fh = !fh; else fv = !fv; prev(); };
    el('rfX').onclick = () => { rot = 0; fh = fv = false; prev(); };
    el('rfGo').onclick = async () => { const type = el('rfFmt').value === 'orig' ? outType(file.type) : el('rfFmt').value, out = makeCanvas(1, 1); draw(out, 1); if (type === 'image/jpeg') { const c2 = makeCanvas(out.width, out.height), x = c2.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c2.width, c2.height); x.drawImage(out, 0, 0); downloadBlob(await toBlob(c2, type, .92), rename(file.name, 'rotated', type)); } else downloadBlob(await toBlob(out, type, .92), rename(file.name, 'rotated', type)); };
  },
  how: ['Upload, drop or paste your image.', 'Rotate left or right in 90° steps.', 'Flip horizontally to mirror the image, or vertically to turn it upside down.', 'Download the result in your preferred format.'],
  about: `<p>Phones sometimes save photos sideways, and many design tasks need mirrored images — for example to make a person face into the page layout. This tool applies lossless 90° rotations and flips on a canvas at the original resolution.</p>`,
  faq: [['How do I mirror an image?', 'Click “Flip horizontal” to create a mirror image, then download.'], ['Does rotating reduce quality?', 'No. 90° rotations and flips move pixels without resampling. Choose PNG for a perfectly lossless file.']],
},
{
  slug: 'image-to-base64', cat: 'image', name: 'Image to Base64 Converter',
  title: 'Image to Base64 Converter – Encode Images as Data URI (and Back)',
  desc: 'Convert images to Base64 data URI strings for HTML, CSS and JSON, or decode Base64 back to an image. Copy ready-made img tags and CSS background code. Fast and private.',
  kw: ['image to base64', 'base64 image encoder', 'data uri generator', 'base64 to image', 'png to base64', 'embed image css'],
  short: 'Encode images to Base64 data URIs or decode Base64 back to images.',
  intro: 'Embed small icons and images directly in your HTML or CSS. Upload an image to get its Base64 string, or paste Base64 to turn it back into a file.',
  html: `<div class="seg" role="tablist"><button type="button" class="on" data-tab="enc">Image → Base64</button><button type="button" data-tab="dec">Base64 → Image</button></div>
<div id="b64enc">${drop('b64File', { accept: 'image/*' })}<div id="b64Out" hidden><div class="stat-grid"><div class="stat"><span>Original size</span><b id="b64S1">–</b></div><div class="stat"><span>Base64 size</span><b id="b64S2">–</b></div><div class="stat"><span>Type</span><b id="b64T">–</b></div></div>
<label class="f"><span>Data URI</span><textarea id="b64Uri" readonly rows="5"></textarea></label><div class="btn-row"><button type="button" class="btn" data-copy-from="b64Uri">Copy data URI</button></div>
${code('b64Img', 'Copy HTML')}${code('b64Css', 'Copy CSS')}</div></div>
<div id="b64dec" hidden><label class="f"><span>Paste Base64 string or data URI</span><textarea id="b64In" rows="7" placeholder="data:image/png;base64,iVBORw0KGgo..."></textarea></label><div class="btn-row"><button type="button" class="btn" id="b64Go">Decode image</button><button type="button" class="btn-alt" id="b64Dl" hidden>Download image</button></div><p class="note" id="b64Err"></p><div class="preview checker" id="b64PrevW" hidden><img id="b64Prev" alt="Decoded image"></div></div>`,
  js: () => {
    document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { document.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('on', x === b)); el('b64enc').hidden = b.dataset.tab !== 'enc'; el('b64dec').hidden = b.dataset.tab !== 'dec'; });
    fileDrop(el('b64FileZone'), el('b64File'), fs => { const f = fs[0], r = new FileReader(); r.onload = () => { const u = r.result; el('b64Uri').value = u; el('b64S1').textContent = fmtBytes(f.size); el('b64S2').textContent = fmtBytes(u.length); el('b64T').textContent = f.type || 'unknown'; el('b64Img').textContent = `<img src="${u.length > 400 ? u.slice(0, 400) + '…' : u}" alt="">`; el('b64Img').dataset.full = `<img src="${u}" alt="">`; el('b64Css').textContent = `background-image: url("${u.length > 400 ? u.slice(0, 400) + '…' : u}");`; el('b64Css').dataset.full = `background-image: url("${u}");`; el('b64Out').hidden = false; }; r.readAsDataURL(f); });
    el('b64Out').addEventListener('click', e => { const b = e.target.closest('[data-copy-from]'); if (b && el(b.dataset.copyFrom).dataset.full) { e.stopPropagation(); copyText(el(b.dataset.copyFrom).dataset.full, b); } }, true);
    let dec = null;
    el('b64Go').onclick = () => {
      let s = el('b64In').value.trim().replace(/\s/g, ''); el('b64Err').textContent = '';
      if (!s.startsWith('data:')) { const sig = { '/9j/': 'jpeg', iVBOR: 'png', R0lG: 'gif', UklG: 'webp', PHN2: 'svg+xml', PD94: 'svg+xml' }; const k = Object.keys(sig).find(k => s.startsWith(k)); s = `data:image/${k ? sig[k] : 'png'};base64,` + s; }
      const im = el('b64Prev'); im.onload = () => { el('b64PrevW').hidden = false; el('b64Dl').hidden = false; dec = s; }; im.onerror = () => { el('b64Err').textContent = 'This does not look like a valid Base64 image.'; el('b64PrevW').hidden = true; el('b64Dl').hidden = true; }; im.src = s;
    };
    el('b64Dl').onclick = () => { const ext = (dec.match(/^data:image\/([a-z+]+)/) || [, 'png'])[1].replace('+xml', '').replace('jpeg', 'jpg'); downloadURL(dec, 'decoded-image.' + ext); };
  },
  how: ['Choose “Image → Base64” and upload an image.', 'Copy the data URI, the HTML img tag or the CSS background code.', 'To reverse it, switch to “Base64 → Image” and paste your string.', 'Click Decode to preview and download the image.'],
  about: `<p>A Base64 data URI embeds an image directly inside your code, saving an extra HTTP request. It’s perfect for tiny icons, email templates and single-file HTML documents. Keep in mind Base64 is about 33% larger than the original binary, so it’s best for small images under ~10 KB.</p>`,
  faq: [['When should I use Base64 images?', 'For very small images like icons, placeholders and email assets where avoiding an extra request matters more than file size.'], ['Can I decode Base64 without the data: prefix?', 'Yes. The decoder detects common image signatures (PNG, JPG, GIF, WebP, SVG) automatically.']],
},
{
  slug: 'svg-to-png', cat: 'image', name: 'SVG to PNG Converter',
  title: 'SVG to PNG Converter – Export SVG to High-Resolution PNG or JPG',
  desc: 'Convert SVG files or SVG code to high-resolution PNG, JPG or WebP images. Scale up to 8x for crisp exports, keep transparency or set a background color. Free and offline.',
  kw: ['svg to png', 'svg to png converter', 'convert svg to image', 'svg to jpg', 'export svg high resolution', 'svg rasterize'],
  short: 'Turn SVG files or code into crisp PNG, JPG or WebP at any scale.',
  intro: 'Paste SVG code or upload an .svg file, choose a scale or exact width, and export a sharp raster image with optional transparent background.',
  html: `<div class="tool-layout even"><div class="panel">${drop('s2pFile', { accept: '.svg,image/svg+xml', text: 'SVG files only · or paste SVG code below' })}
<label class="f"><span>SVG code</span><textarea id="s2pCode" rows="8" spellcheck="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#141414"/><circle cx="60" cy="60" r="30" fill="#E8DCC4"/></svg></textarea></label>
<div class="grid2">${sel('s2pS', 'Scale', [[1, '1x'], [2, '2x'], [3, '3x'], [4, '4x'], [8, '8x'], ['w', 'Custom width']], 2)}${num('s2pW', 'Custom width (px)', 1024, 'min="1"')}</div>
<div class="grid2">${sel('s2pF', 'Format', [['image/png', 'PNG'], ['image/jpeg', 'JPG'], ['image/webp', 'WebP']], 'image/png')}${color('s2pBg', 'Background', '#ffffff')}</div>
${chk('s2pT', 'Transparent background (PNG/WebP)', true)}
<button type="button" class="btn" id="s2pGo" style="width:100%">Download image</button><p class="note" id="s2pInfo"></p></div>
<div class="panel"><div class="preview checker" id="s2pPrev"></div></div></div>`,
  js: () => {
    let name = 'image';
    function parse() {
      let s = el('s2pCode').value.trim(); const doc = new DOMParser().parseFromString(s, 'image/svg+xml'), svg = doc.querySelector('svg');
      if (!svg || doc.querySelector('parsererror')) return null;
      if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number); let w = parseFloat(svg.getAttribute('width')), h = parseFloat(svg.getAttribute('height'));
      if (!w || !h || /%/.test(svg.getAttribute('width') || '')) { if (vb.length === 4 && vb[2]) { w = vb[2]; h = vb[3]; } else { w = 300; h = 150; } }
      svg.setAttribute('width', w); svg.setAttribute('height', h); return { str: new XMLSerializer().serializeToString(svg), w, h };
    }
    function prev() { const p = parse(), pv = el('s2pPrev'); el('s2pCode').classList.toggle('bad', !p); if (!p) { pv.innerHTML = '<p class="muted">Invalid SVG code</p>'; return; } pv.innerHTML = `<img alt="SVG preview" style="max-width:100%;max-height:420px" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(p.str)}">`; el('s2pInfo').textContent = `Detected size: ${+p.w.toFixed(2)} × ${+p.h.toFixed(2)}`; }
    fileDrop(el('s2pFileZone'), el('s2pFile'), fs => { name = fs[0].name.replace(/\.svg$/i, ''); fs[0].text().then(t => { el('s2pCode').value = t; prev(); }); });
    el('s2pCode').addEventListener('input', prev);
    el('s2pGo').onclick = async () => {
      const p = parse(); if (!p) return; const sv = el('s2pS').value, scale = sv === 'w' ? (+el('s2pW').value || p.w) / p.w : +sv, w = Math.round(p.w * scale), h = Math.round(p.h * scale), type = el('s2pF').value;
      const img = await loadImage(new Blob([p.str], { type: 'image/svg+xml' })), cv = makeCanvas(w, h), ctx = cv.getContext('2d');
      if (type === 'image/jpeg' || !el('s2pT').checked) { ctx.fillStyle = el('s2pBg').value; ctx.fillRect(0, 0, w, h); }
      ctx.drawImage(img, 0, 0, w, h); downloadBlob(await toBlob(cv, type, .95), `${name}-${w}x${h}.${EXT[type]}`); el('s2pInfo').textContent = `Exported ${w} × ${h} px`;
    };
    prev();
  },
  how: ['Upload an SVG file or paste SVG code.', 'Choose a scale (up to 8x) or enter an exact width.', 'Pick PNG, JPG or WebP and a background option.', 'Click Download to save the high-resolution image.'],
  about: `<p>SVG is a vector format that stays sharp at any size, but many platforms — social networks, presentation tools, app stores and email clients — require raster images. Exporting at 2x or 4x produces crisp results on high-DPI (Retina) screens.</p><p>External fonts and linked images inside an SVG may not render; convert text to outlines in your design tool for perfect results.</p>`,
  faq: [['How do I convert SVG to PNG with a transparent background?', 'Keep “Transparent background” checked and choose PNG or WebP as the format.'], ['Why is my SVG blank?', 'Make sure the code includes a valid <svg> element. SVGs that rely on external CSS or fonts may need those styles inlined.']],
},
{
  slug: 'favicon-generator', cat: 'image', name: 'Favicon Generator',
  title: 'Favicon Generator – Create favicon.ico & App Icons From Image or Text',
  desc: 'Generate favicons for your website from an image, letter or emoji. Download favicon.ico, 16x16, 32x32, Apple touch icon and Android 192/512 PNGs plus ready HTML tags.',
  kw: ['favicon generator', 'favicon.ico', 'create favicon', 'apple touch icon', 'favicon from text', 'website icon generator'],
  short: 'Create favicon.ico and app icons from an image, letter or emoji.',
  intro: 'Create a complete favicon set for your website. Start from your logo or simply type a letter or emoji, choose colors and shape, then download every size you need.',
  html: `<div class="seg"><button type="button" class="on" data-fm="text">From text / emoji</button><button type="button" data-fm="img">From image</button></div>
<div class="tool-layout"><div class="panel" id="fvP">
<div id="fvText">${txt('fvTx', 'Text (1–3 characters or an emoji)', 'F', 'maxlength="4"')}
<div class="grid2">${color('fvFg', 'Text color', '#e8dcc4')}${sel('fvW', 'Font weight', [[400, 'Regular'], [600, 'Semibold'], [800, 'Bold']], 800)}</div>
${range('fvSz', 'Text size', 30, 100, 64, 1, '%')}</div>
<div id="fvImg" hidden>${drop('fvFile', { text: 'Square images work best · at least 512×512px' })}${chk('fvPad', 'Add padding around the image')}</div>
${color('fvBg', 'Background color', '#141414')}${chk('fvNoBg', 'Transparent background')}
${sel('fvSh', 'Shape', [['square', 'Square'], ['rounded', 'Rounded'], ['circle', 'Circle']], 'rounded')}
</div><div class="panel"><h3>Preview</h3><div id="fvPrev" style="display:flex;align-items:flex-end;gap:18px;flex-wrap:wrap;padding:18px;border:1px solid var(--line);border-radius:14px;background:var(--beige-3)"></div>
<h3 style="margin-top:20px">Downloads</h3><div class="btn-row" id="fvDl"></div>${code('fvHtml', 'Copy HTML')}</div></div>`,
  js: () => {
    let mode = 'text', img = null; const SIZES = [16, 32, 48, 180, 192, 512];
    const NAMES = { 16: 'favicon-16x16.png', 32: 'favicon-32x32.png', 48: 'favicon-48x48.png', 180: 'apple-touch-icon.png', 192: 'android-chrome-192x192.png', 512: 'android-chrome-512x512.png' };
    function shape(ctx, s) { const t = el('fvSh').value; ctx.beginPath(); if (t === 'circle') ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2); else { const r = t === 'rounded' ? s * .22 : 0; ctx.moveTo(r, 0); ctx.arcTo(s, 0, s, s, r); ctx.arcTo(s, s, 0, s, r); ctx.arcTo(0, s, 0, 0, r); ctx.arcTo(0, 0, s, 0, r); } ctx.closePath(); }
    function render(s) {
      const cv = makeCanvas(s, s), ctx = cv.getContext('2d'); shape(ctx, s); ctx.save(); ctx.clip();
      if (!el('fvNoBg').checked) { ctx.fillStyle = el('fvBg').value; ctx.fillRect(0, 0, s, s); }
      if (mode === 'text') { const t = el('fvTx').value || ' '; ctx.fillStyle = el('fvFg').value; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; let fs = s * el('fvSz').value / 100; ctx.font = `${el('fvW').value} ${fs}px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`; const m = ctx.measureText(t).width; if (m > s * .9) { fs *= s * .9 / m; ctx.font = `${el('fvW').value} ${fs}px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`; } ctx.fillText(t, s / 2, s / 2 + fs * .05); }
      else if (img) { const p = el('fvPad').checked ? s * .12 : 0, w = imgW(img), h = imgH(img), m = Math.min(w, h); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, (w - m) / 2, (h - m) / 2, m, m, p, p, s - p * 2, s - p * 2); }
      ctx.restore(); return cv;
    }
    function upd() {
      const pv = el('fvPrev'); pv.innerHTML = ''; [16, 32, 48, 180].forEach(s => { const c = render(s); c.style.width = (s > 64 ? 90 : s * (s < 48 ? 2 : 1.5)) + 'px'; c.style.imageRendering = s < 48 ? 'pixelated' : 'auto'; const w = document.createElement('div'); w.style.textAlign = 'center'; w.appendChild(c); w.insertAdjacentHTML('beforeend', `<div class="note" style="margin-top:4px">${s}px</div>`); pv.appendChild(w); });
    }
    async function ico() {
      const cvs = [16, 32, 48].map(render), pngs = await Promise.all(cvs.map(c => toBlob(c).then(b => b.arrayBuffer()))); let off = 6 + 16 * pngs.length; const dv = new DataView(new ArrayBuffer(off));
      dv.setUint16(2, 1, true); dv.setUint16(4, pngs.length, true);
      pngs.forEach((p, i) => { const o = 6 + 16 * i, s = cvs[i].width; dv.setUint8(o, s); dv.setUint8(o + 1, s); dv.setUint16(o + 4, 1, true); dv.setUint16(o + 6, 32, true); dv.setUint32(o + 8, p.byteLength, true); dv.setUint32(o + 12, off, true); off += p.byteLength; });
      return new Blob([dv.buffer, ...pngs], { type: 'image/x-icon' });
    }
    el('fvDl').innerHTML = '<button type="button" class="btn" data-fs="ico">favicon.ico</button>' + SIZES.map(s => `<button type="button" class="btn-sm" data-fs="${s}">${NAMES[s]}</button>`).join('') + '<button type="button" class="btn-sm" data-fs="mf">site.webmanifest</button>';
    el('fvDl').addEventListener('click', async e => { const s = e.target.dataset.fs; if (!s) return; if (s === 'ico') downloadBlob(await ico(), 'favicon.ico'); else if (s === 'mf') downloadText(JSON.stringify({ name: '', short_name: '', icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }, { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }], theme_color: el('fvBg').value, background_color: el('fvBg').value, display: 'standalone' }, null, 2), 'site.webmanifest', 'application/manifest+json'); else downloadBlob(await toBlob(render(+s)), NAMES[s]); });
    el('fvHtml').textContent = '<link rel="icon" href="/favicon.ico" sizes="any">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">';
    document.querySelectorAll('[data-fm]').forEach(b => b.onclick = () => { mode = b.dataset.fm; document.querySelectorAll('[data-fm]').forEach(x => x.classList.toggle('on', x === b)); el('fvText').hidden = mode !== 'text'; el('fvImg').hidden = mode !== 'img'; upd(); });
    fileDrop(el('fvFileZone'), el('fvFile'), async fs => { img = await loadImage(fs[0]); upd(); });
    el('fvP').addEventListener('input', upd); el('fvP').addEventListener('change', upd); upd();
  },
  how: ['Choose to start from text/emoji or from an image.', 'Set colors, size and shape — previews update at real favicon sizes.', 'Download favicon.ico and the PNG icons you need.', 'Upload them to your site root and paste the HTML tags into your <head>.'],
  about: `<p>A favicon appears in browser tabs, bookmarks, search results and on phone home screens. Modern websites need a few sizes: <strong>favicon.ico</strong> (containing 16, 32 and 48px) for legacy support, <strong>32×32</strong> and <strong>16×16</strong> PNGs, a <strong>180×180 Apple touch icon</strong> for iOS and <strong>192/512px</strong> icons for Android and PWAs.</p><p>Simple, bold shapes and one or two letters read best at tiny sizes — check the 16px preview before you download.</p>`,
  faq: [['What size should a favicon be?', 'Provide 32×32 and 16×16 for browsers, 180×180 for Apple devices and 192×192 / 512×512 for Android. This tool generates all of them.'], ['Does favicon.ico support multiple sizes?', 'Yes. The generated .ico file contains 16, 32 and 48 pixel versions.']],
},
{
  slug: 'placeholder-image-generator', cat: 'image', name: 'Placeholder Image Generator',
  title: 'Placeholder Image Generator – Custom Size Dummy Images (PNG/SVG)',
  desc: 'Create placeholder and dummy images in any size with custom colors and text. Download PNG, JPG, WebP or SVG mockup images for wireframes and layouts — no external service.',
  kw: ['placeholder image generator', 'dummy image', 'placeholder image', 'mockup image size', 'image placeholder svg', 'wireframe images'],
  short: 'Generate dummy images in any size and color for wireframes and mockups.',
  intro: 'Need a 1200×630 placeholder for a layout? Set the size, colors and label and download it as PNG, JPG, WebP or a tiny SVG.',
  html: `<div class="tool-layout"><div class="panel" id="phP">
<div class="grid2">${num('phW', 'Width (px)', 1200, 'min="1" max="8000"')}${num('phH', 'Height (px)', 630, 'min="1" max="8000"')}</div>
<div class="btn-row" style="margin-bottom:14px"><button type="button" class="btn-sm" data-ph="1200x630">OG 1200×630</button><button type="button" class="btn-sm" data-ph="1920x1080">1920×1080</button><button type="button" class="btn-sm" data-ph="1080x1080">1080×1080</button><button type="button" class="btn-sm" data-ph="1080x1920">1080×1920</button><button type="button" class="btn-sm" data-ph="300x250">300×250</button><button type="button" class="btn-sm" data-ph="728x90">728×90</button></div>
<div class="grid2">${color('phBg', 'Background', '#e8dcc4')}${color('phFg', 'Text color', '#6b6358')}</div>
${txt('phTx', 'Text (leave empty for size)', '')}
${sel('phF', 'Format', [['image/png', 'PNG'], ['image/jpeg', 'JPG'], ['image/webp', 'WebP'], ['svg', 'SVG']], 'image/png')}
<button type="button" class="btn" id="phGo" style="width:100%">Download placeholder</button>
</div><div class="panel"><div class="preview"><canvas id="phC"></canvas></div>${code('phSvg', 'Copy SVG')}</div></div>`,
  js: () => {
    const cv = el('phC');
    const vals = () => ({ w: clamp(+el('phW').value | 0, 1, 8000), h: clamp(+el('phH').value | 0, 1, 8000), bg: el('phBg').value, fg: el('phFg').value });
    const label = v => el('phTx').value || `${v.w} × ${v.h}`;
    function svg(v) { const fs = Math.max(8, Math.round(Math.min(v.w / label(v).length * 1.4, v.h / 4))); return `<svg xmlns="http://www.w3.org/2000/svg" width="${v.w}" height="${v.h}" viewBox="0 0 ${v.w} ${v.h}"><rect width="100%" height="100%" fill="${v.bg}"/><text x="50%" y="50%" fill="${v.fg}" font-family="system-ui,sans-serif" font-size="${fs}" font-weight="600" text-anchor="middle" dominant-baseline="central">${label(v).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></svg>`; }
    function draw(c, v) { c.width = v.w; c.height = v.h; const x = c.getContext('2d'), fs = Math.max(8, Math.round(Math.min(v.w / label(v).length * 1.4, v.h / 4))); x.fillStyle = v.bg; x.fillRect(0, 0, v.w, v.h); x.fillStyle = v.fg; x.font = `600 ${fs}px system-ui,sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(label(v), v.w / 2, v.h / 2); }
    const upd = () => { const v = vals(); draw(cv, v); el('phSvg').textContent = svg(v); };
    el('phP').addEventListener('input', upd); el('phP').addEventListener('change', upd);
    document.querySelectorAll('[data-ph]').forEach(b => b.onclick = () => { const [w, h] = b.dataset.ph.split('x'); el('phW').value = w; el('phH').value = h; upd(); });
    el('phGo').onclick = async () => { const v = vals(), f = el('phF').value, n = `placeholder-${v.w}x${v.h}`; if (f === 'svg') downloadText(svg(v), n + '.svg', 'image/svg+xml'); else downloadBlob(await toBlob(cv, f, .92), n + '.' + EXT[f]); };
    upd();
  },
  how: ['Enter the width and height or pick a common size preset.', 'Choose background and text colors.', 'Optionally type a custom label.', 'Download as PNG, JPG, WebP or SVG, or copy the SVG code.'],
  about: `<p>Placeholder images help you design layouts before final assets are ready. Unlike online placeholder services, these images are generated locally, so your mockups work offline and never break when a third-party service goes down.</p><p>The SVG option produces a file of only a few hundred bytes that you can paste straight into HTML.</p>`,
  faq: [['What size is an Open Graph image?', '1200 × 630 pixels is the recommended size for link previews on Facebook, LinkedIn and X.'], ['Can I use the SVG inline?', 'Yes, copy the SVG code and paste it directly into your HTML.']],
},
{
  slug: 'watermark-image', cat: 'image', name: 'Add Watermark to Image',
  title: 'Add Watermark to Photo Online – Text Watermark Maker',
  desc: 'Add a text watermark to your photos online to protect your images. Set position, size, opacity, color and rotation, or tile the watermark across the whole image. Free and private.',
  kw: ['add watermark to photo', 'watermark image online', 'text watermark', 'watermark maker', 'protect photos', 'copyright watermark'],
  short: 'Protect photos with a custom text watermark — single or tiled.',
  intro: 'Brand and protect your photography and design previews. Add your name or website as a watermark, position it anywhere or repeat it across the image.',
  html: `${drop('wmFile')}<div id="wmBox" hidden><div class="tool-layout"><div class="panel" id="wmP">
${txt('wmTx', 'Watermark text', '© TheFastDesigns')}
${sel('wmPos', 'Position', [['br', 'Bottom right'], ['bl', 'Bottom left'], ['tr', 'Top right'], ['tl', 'Top left'], ['c', 'Center'], ['tile', 'Tiled (repeat)']], 'br')}
${range('wmSz', 'Size', 1, 20, 5, .5, '%')}${range('wmOp', 'Opacity', 5, 100, 60, 1, '%')}${range('wmRot', 'Rotation', -90, 90, 0, 1, '°')}
<div class="grid2">${color('wmCol', 'Text color', '#ffffff')}${sel('wmWt', 'Weight', [[400, 'Regular'], [700, 'Bold']], 700)}</div>
${chk('wmSh', 'Subtle shadow for readability', true)}
${fmtSel('wmFmt')}<button type="button" class="btn" id="wmGo" style="width:100%">Download watermarked image</button>
</div><div class="panel"><div class="preview checker"><canvas id="wmC"></canvas></div></div></div></div>`,
  js: () => {
    let img, file; const cv = el('wmC');
    function draw(c, s) {
      const w = Math.round(imgW(img) * s), h = Math.round(imgH(img) * s); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(img, 0, 0, w, h);
      const t = el('wmTx').value; if (!t) return; const fs = Math.max(8, Math.min(w, h) * el('wmSz').value / 100 * 1.6), pos = el('wmPos').value, rot = el('wmRot').value * Math.PI / 180, pad = fs * .9;
      x.globalAlpha = el('wmOp').value / 100; x.fillStyle = el('wmCol').value; x.font = `${el('wmWt').value} ${fs}px system-ui,-apple-system,"Segoe UI",sans-serif`; x.textBaseline = 'middle';
      if (el('wmSh').checked) { x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = fs * .25; x.shadowOffsetY = fs * .06; }
      const tw = x.measureText(t).width;
      const put = (px, py) => { x.save(); x.translate(px, py); x.rotate(rot); x.textAlign = 'center'; x.fillText(t, 0, 0); x.restore(); };
      if (pos === 'tile') { const sx = tw + fs * 3, sy = fs * 4; for (let yy = -h; yy < h * 2; yy += sy) for (let xx = -w + ((yy / sy) % 2) * sx / 2; xx < w * 2; xx += sx) put(xx, yy); }
      else { const P = { br: [w - pad - tw / 2, h - pad], bl: [pad + tw / 2, h - pad], tr: [w - pad - tw / 2, pad], tl: [pad + tw / 2, pad], c: [w / 2, h / 2] }[pos]; put(P[0], P[1]); }
      x.globalAlpha = 1;
    }
    const prev = () => img && draw(cv, Math.min(1, 1400 / Math.max(imgW(img), imgH(img))));
    fileDrop(el('wmFileZone'), el('wmFile'), async fs => { file = fs[0]; img = await loadImage(file); el('wmBox').hidden = false; prev(); });
    el('wmP').addEventListener('input', prev); el('wmP').addEventListener('change', prev);
    el('wmGo').onclick = async () => { const type = el('wmFmt').value === 'orig' ? outType(file.type) : el('wmFmt').value, c = makeCanvas(1, 1); draw(c, 1); downloadBlob(await toBlob(c, type, .92), rename(file.name, 'watermarked', type)); };
  },
  how: ['Upload, drop or paste the photo you want to protect.', 'Type your watermark text — your name, brand or website.', 'Choose position, size, opacity, color and rotation, or tile it.', 'Download the watermarked image at full resolution.'],
  about: `<p>Watermarking discourages unauthorised use of your photos and design previews and keeps your brand attached when images are shared. A <strong>tiled</strong>, semi-transparent watermark is the hardest to crop out, while a small corner watermark is better for portfolio pieces where the image itself should shine.</p>`,
  faq: [['What opacity should a watermark have?', 'Between 30% and 60% is usually visible without distracting from the image.'], ['Can I watermark images without uploading them?', 'Yes. This tool runs entirely in your browser, so your original photos stay private.']],
},
];
