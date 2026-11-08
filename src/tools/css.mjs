import { range, num, txt, color, sel, chk, code } from '../lib.mjs';

export default [
{
  slug: 'css-gradient-generator', cat: 'css', name: 'CSS Gradient Generator',
  title: 'CSS Gradient Generator – Linear, Radial & Conic Gradient Maker',
  desc: 'Create beautiful linear, radial and conic CSS gradients with multiple color stops. Live preview, random gradients and copy-ready CSS background code for your website.',
  kw: ['css gradient generator', 'linear gradient', 'radial gradient', 'conic gradient', 'gradient background', 'gradient maker'],
  short: 'Design linear, radial and conic gradients and copy the CSS code.',
  intro: 'Build smooth gradient backgrounds visually. Add up to eight color stops, change the angle or type, and copy production-ready CSS.',
  html: `<div class="tool-layout"><div class="panel">
${sel('gType', 'Gradient type', [['linear', 'Linear'], ['radial', 'Radial'], ['conic', 'Conic']], 'linear')}
<div id="gAngW">${range('gAng', 'Angle', 0, 360, 135, 1, '°')}</div>
<div id="gShapeW" hidden>${sel('gShape', 'Radial shape', [['circle', 'Circle'], ['ellipse', 'Ellipse']], 'circle')}</div>
<label class="f"><span>Color stops</span></label><div id="gStops"></div>
<div class="btn-row"><button type="button" class="btn-alt" id="gAdd">+ Add stop</button><button type="button" class="btn" id="gRand">Random</button></div>
</div><div class="panel"><div class="preview" id="gPrev" style="min-height:340px"></div>${code('gCode', 'Copy CSS')}</div></div>`,
  js: () => {
    let stops = [{ c: '#e8dcc4', p: 0 }, { c: '#8a6d3b', p: 55 }, { c: '#141414', p: 100 }];
    const type = el('gType'), ang = el('gAng'), shape = el('gShape'), list = el('gStops');
    const css = () => { const s = [...stops].sort((a, b) => a.p - b.p).map(x => `${x.c} ${x.p}%`).join(', '), t = type.value; return t === 'linear' ? `linear-gradient(${ang.value}deg, ${s})` : t === 'radial' ? `radial-gradient(${shape.value} at center, ${s})` : `conic-gradient(from ${ang.value}deg at center, ${s})`; };
    function upd() { const g = css(); el('gPrev').style.background = g; el('gCode').textContent = `background: ${stops[0].c};\nbackground: ${g};`; el('gAngW').hidden = type.value === 'radial'; el('gShapeW').hidden = type.value !== 'radial'; }
    function draw() { list.innerHTML = stops.map((x, i) => `<div class="stop" data-i="${i}" style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><input type="color" value="${x.c}" data-k="c" aria-label="Stop color"><input type="range" min="0" max="100" value="${x.p}" data-k="p" aria-label="Stop position"><span style="width:42px;font-size:13px;font-weight:600">${x.p}%</span><button type="button" class="btn-sm" data-del="${i}"${stops.length < 3 ? ' disabled' : ''} aria-label="Remove stop">✕</button></div>`).join(''); upd(); }
    list.addEventListener('input', e => { const s = e.target.closest('.stop'), k = e.target.dataset.k; if (!s || !k) return; const i = +s.dataset.i; stops[i][k] = k === 'p' ? +e.target.value : e.target.value; if (k === 'p') e.target.nextElementSibling.textContent = e.target.value + '%'; upd(); });
    list.addEventListener('click', e => { const d = e.target.dataset.del; if (d != null && stops.length > 2) { stops.splice(+d, 1); draw(); } });
    el('gAdd').onclick = () => { if (stops.length < 8) { stops.push({ c: hslHex(Math.random() * 360, 60, 60), p: 50 }); draw(); } };
    el('gRand').onclick = () => { const h = Math.random() * 360; stops = [{ c: hslHex(h, 70, 62), p: 0 }, { c: hslHex(h + 40 + Math.random() * 140, 65, 52), p: 100 }]; if (Math.random() < .4) stops.splice(1, 0, { c: hslHex(h + 20, 60, 70), p: 50 }); ang.value = Math.round(Math.random() * 360); syncOut(ang); draw(); };
    [type, ang, shape].forEach(x => x.addEventListener('input', upd)); draw();
  },
  how: ['Choose linear, radial or conic gradient type.', 'Adjust the angle and edit each color stop’s color and position.', 'Add more stops or hit “Random” for inspiration.', 'Copy the CSS — it includes a solid-color fallback.'],
  about: `<p>CSS gradients are resolution-independent, load instantly and replace heavy background images. <strong>Linear gradients</strong> blend along a straight line, <strong>radial gradients</strong> radiate from a center point, and <strong>conic gradients</strong> rotate around a center — perfect for pie charts and color wheels.</p><p>All modern browsers support these gradient functions without vendor prefixes, so the generated code is clean and ready to paste.</p>`,
  faq: [['How do I make a gradient background in CSS?', 'Use background: linear-gradient(angle, color1, color2). This generator writes the code for you — just copy it.'], ['Can I use more than two colors?', 'Yes, add up to eight color stops and set the position of each one.']],
},
{
  slug: 'box-shadow-generator', cat: 'css', name: 'CSS Box Shadow Generator',
  title: 'CSS Box Shadow Generator – Soft, Layered & Inset Shadows',
  desc: 'Generate CSS box-shadow code visually. Adjust offset, blur, spread, color, opacity and inset with a live preview, then copy clean box-shadow CSS for cards and buttons.',
  kw: ['box shadow generator', 'css box shadow', 'drop shadow css', 'inset shadow', 'shadow generator', 'card shadow css'],
  short: 'Create soft or sharp CSS box shadows with a live visual preview.',
  intro: 'Fine-tune shadows for cards, buttons and modals. Enable the layered option for ultra-soft, realistic depth.',
  html: `<div class="tool-layout"><div class="panel" id="bsP">
<div class="grid2">${range('bsX', 'Offset X', -60, 60, 0, 1, 'px')}${range('bsY', 'Offset Y', -60, 60, 12, 1, 'px')}</div>
<div class="grid2">${range('bsB', 'Blur', 0, 120, 32, 1, 'px')}${range('bsS', 'Spread', -50, 50, -6, 1, 'px')}</div>
${color('bsC', 'Shadow color', '#141414')}
${range('bsO', 'Opacity', 0, 100, 18, 1, '%')}
${chk('bsI', 'Inset shadow')}${chk('bsL', 'Layered (smoother, more realistic)', true)}
<div class="grid2">${color('bsBox', 'Box color', '#ffffff')}${color('bsBg', 'Background', '#f3ecdf')}</div>
</div><div class="panel"><div class="preview" id="bsPrev" style="min-height:340px"><div id="bsEl" style="width:200px;height:140px;border-radius:16px"></div></div>${code('bsCode', 'Copy CSS')}</div></div>`,
  js: () => {
    function upd() {
      const x = +el('bsX').value, y = +el('bsY').value, b = +el('bsB').value, s = +el('bsS').value, o = el('bsO').value / 100, c = el('bsC').value, ins = el('bsI').checked ? 'inset ' : '';
      let v;
      if (el('bsL').checked) v = [.25, .5, 1, 2].map((k, i) => `${ins}${Math.round(x * k)}px ${Math.round(y * k)}px ${Math.round(b * k)}px ${Math.round(s * k)}px ${rgba(c, o * [.6, .7, .8, 1][i] / 1.6)}`).join(',\n    ');
      else v = `${ins}${x}px ${y}px ${b}px ${s}px ${rgba(c, o)}`;
      el('bsEl').style.boxShadow = v; el('bsEl').style.background = el('bsBox').value; el('bsPrev').style.background = el('bsBg').value;
      el('bsCode').textContent = `box-shadow: ${v};`;
    }
    el('bsP').addEventListener('input', upd); el('bsP').addEventListener('change', upd); upd();
  },
  how: ['Drag the offset sliders to move the shadow horizontally and vertically.', 'Increase blur for softness and use spread to grow or shrink it.', 'Pick a color and opacity — or switch to an inset shadow.', 'Copy the generated box-shadow CSS.'],
  about: `<p>Shadows create depth and hierarchy in flat interfaces. Subtle, large-blur shadows with low opacity look the most natural. The <strong>layered</strong> mode stacks four progressively larger shadows, a technique used by modern design systems to mimic how real light falls off.</p><p>Negative spread keeps shadows tucked under the element so they don’t look muddy, and inset shadows are useful for pressed buttons and input fields.</p>`,
  faq: [['What does each box-shadow value mean?', 'The order is offset-x, offset-y, blur radius, spread radius and color. Add “inset” at the start for an inner shadow.'], ['How do I make a soft shadow?', 'Use a large blur (24–48px), small Y offset, slightly negative spread and low opacity (8–20%). Or enable layered mode.']],
},
{
  slug: 'border-radius-generator', cat: 'css', name: 'Border Radius Generator',
  title: 'CSS Border Radius Generator – Rounded Corners Made Easy',
  desc: 'Visually create CSS border-radius for rounded corners. Set each corner individually in px or %, preview shapes like pills and blobs, and copy the border-radius CSS.',
  kw: ['border radius generator', 'css rounded corners', 'border-radius css', 'rounded corner generator', 'pill shape css'],
  short: 'Set rounded corners per corner and copy the border-radius CSS.',
  intro: 'Control every corner of your element. Link corners for uniform rounding or unlink them to create leaf shapes, tabs and organic blobs.',
  html: `<div class="tool-layout"><div class="panel" id="brP">
${chk('brLink', 'Link all corners', true)}
${range('brTL', 'Top left', 0, 200, 24)}${range('brTR', 'Top right', 0, 200, 24)}${range('brBR', 'Bottom right', 0, 200, 24)}${range('brBL', 'Bottom left', 0, 200, 24)}
${sel('brUnit', 'Unit', ['px', '%'], 'px')}
<div class="btn-row"><button type="button" class="btn-sm" data-pre="0,0,0,0">Square</button><button type="button" class="btn-sm" data-pre="12,12,12,12">Soft</button><button type="button" class="btn-sm" data-pre="200,200,200,200">Pill</button><button type="button" class="btn-sm" data-pre="120,0,120,0">Leaf</button><button type="button" class="btn-sm" data-pre="24,24,0,0">Tab</button></div>
</div><div class="panel"><div class="preview" style="min-height:340px"><div id="brPrev" style="width:260px;height:180px;background:var(--ink)"></div></div>${code('brCode', 'Copy CSS')}</div></div>`,
  js: () => {
    const ids = ['brTL', 'brTR', 'brBR', 'brBL'];
    function upd() { const u = el('brUnit').value, v = ids.map(i => el(i).value + (el(i).value === '0' ? '' : u)), val = v.every(x => x === v[0]) ? v[0] : v.join(' '); el('brPrev').style.borderRadius = val; el('brCode').textContent = `border-radius: ${val};`; }
    el('brP').addEventListener('input', e => { if (el('brLink').checked && ids.includes(e.target.id)) ids.forEach(i => { el(i).value = e.target.value; syncOut(el(i)); }); upd(); });
    el('brUnit').addEventListener('change', () => { const pct = el('brUnit').value === '%'; ids.forEach(i => { el(i).max = pct ? 50 : 200; syncOut(el(i)); }); upd(); });
    document.querySelectorAll('[data-pre]').forEach(b => b.onclick = () => { el('brLink').checked = false; el('brUnit').value = 'px'; b.dataset.pre.split(',').forEach((v, i) => { el(ids[i]).max = 200; el(ids[i]).value = v; syncOut(el(ids[i])); }); upd(); });
    upd();
  },
  how: ['Drag a slider to round the corners — all corners move together while linked.', 'Uncheck “Link all corners” to control each corner separately.', 'Switch between px and % units, or try a preset.', 'Copy the shorthand border-radius CSS.'],
  about: `<p>The CSS <code>border-radius</code> property rounds the corners of any element. The shorthand order is top-left, top-right, bottom-right, bottom-left. Pixel values give consistent corners across sizes; percentage values scale with the element, which makes perfect circles (50%) and ellipses easy.</p><p>Consistent corner radii are a hallmark of polished UI — pick one or two radius values and reuse them across buttons, cards and inputs.</p>`,
  faq: [['How do I make a circle with CSS?', 'Give the element equal width and height and set border-radius: 50%.'], ['How do I make a pill-shaped button?', 'Use a very large pixel radius such as 999px — the browser caps it at half the element height.']],
},
{
  slug: 'glassmorphism-generator', cat: 'css', name: 'Glassmorphism Generator',
  title: 'Glassmorphism CSS Generator – Frosted Glass Effect Maker',
  desc: 'Create the frosted glass UI effect with CSS backdrop-filter. Adjust blur, transparency, saturation, border and shadow with a live preview, then copy the glassmorphism CSS.',
  kw: ['glassmorphism generator', 'frosted glass css', 'backdrop filter blur', 'glass effect css', 'glassmorphism css'],
  short: 'Generate frosted-glass cards with backdrop-filter CSS.',
  intro: 'Design modern frosted-glass panels in seconds. Tweak blur and transparency over a colorful background and copy cross-browser CSS.',
  html: `<div class="tool-layout"><div class="panel" id="glP">
${range('glB', 'Blur', 0, 40, 14, 1, 'px')}
${range('glT', 'Transparency', 0, 100, 22, 1, '%')}
${range('glS', 'Saturation', 100, 220, 160, 5, '%')}
${color('glC', 'Glass color', '#ffffff')}
${range('glBo', 'Border opacity', 0, 100, 35, 1, '%')}
${range('glR', 'Border radius', 0, 48, 20, 1, 'px')}
${chk('glSh', 'Drop shadow', true)}
</div><div class="panel"><div class="preview" style="min-height:360px;background:radial-gradient(circle at 20% 25%,#e0a96d 0 18%,transparent 19%),radial-gradient(circle at 78% 70%,#141414 0 20%,transparent 21%),radial-gradient(circle at 70% 18%,#c9b28a 0 12%,transparent 13%),linear-gradient(135deg,#f3ecdf,#d6c3a0)">
<div id="glEl" style="width:min(320px,90%);padding:28px;color:#141414"><b style="font-size:20px">Frosted glass</b><p style="margin:8px 0 0">Backdrop blur lets the background shine through softly.</p></div></div>${code('glCode', 'Copy CSS')}</div></div>`,
  js: () => {
    function upd() {
      const c = el('glC').value, b = el('glB').value, s = el('glS').value;
      const lines = [`background: ${rgba(c, el('glT').value / 100)};`, `backdrop-filter: blur(${b}px) saturate(${s}%);`, `-webkit-backdrop-filter: blur(${b}px) saturate(${s}%);`, `border: 1px solid ${rgba(c, el('glBo').value / 100)};`, `border-radius: ${el('glR').value}px;`];
      if (el('glSh').checked) lines.push('box-shadow: 0 8px 32px rgba(20, 20, 20, 0.12);');
      el('glEl').style.cssText = 'width:min(320px,90%);padding:28px;color:#141414;' + lines.join(''); el('glCode').textContent = lines.join('\n');
    }
    el('glP').addEventListener('input', upd); el('glP').addEventListener('change', upd); upd();
  },
  how: ['Increase the blur to frost the glass more.', 'Adjust transparency and saturation to taste.', 'Set the border opacity and corner radius.', 'Copy the CSS and place the element over a colorful background.'],
  about: `<p>Glassmorphism uses a semi-transparent background combined with <code>backdrop-filter: blur()</code> so content behind the element appears frosted. It works best over vivid gradients or photos and with a subtle light border that mimics the edge of glass.</p><p>The generated code includes the <code>-webkit-</code> prefix for Safari. Keep text contrast in mind — add more opacity if text becomes hard to read.</p>`,
  faq: [['Is backdrop-filter supported in all browsers?', 'Yes, all current versions of Chrome, Edge, Firefox and Safari support it (Safari with the -webkit- prefix, which is included).'], ['Why doesn’t my glass effect show?', 'The element needs something visible behind it and a background color that is partly transparent.']],
},
{
  slug: 'text-shadow-generator', cat: 'css', name: 'Text Shadow Generator',
  title: 'CSS Text Shadow Generator – Glow, Neon & 3D Text Effects',
  desc: 'Create CSS text-shadow effects with a live preview: soft shadows, glowing neon text, retro 3D and outlined text. Adjust offset, blur and color and copy the CSS code.',
  kw: ['text shadow generator', 'css text shadow', 'neon text css', 'glow text effect', '3d text css', 'text effects'],
  short: 'Craft glow, neon, retro and soft text shadows with CSS.',
  intro: 'Add depth and personality to headlines. Start from a preset like Neon or Retro 3D, then fine-tune every value.',
  html: `<div class="tool-layout"><div class="panel" id="tsP">
${txt('tsTxt', 'Preview text', 'Fast Designs')}
<div class="grid2">${range('tsX', 'Offset X', -30, 30, 3, 1, 'px')}${range('tsY', 'Offset Y', -30, 30, 3, 1, 'px')}</div>
${range('tsB', 'Blur', 0, 50, 0, 1, 'px')}
<div class="grid2">${color('tsC', 'Shadow color', '#c8a97e')}${range('tsO', 'Opacity', 0, 100, 100, 1, '%')}</div>
<div class="grid2">${color('tsFg', 'Text color', '#141414')}${color('tsBg', 'Background', '#faf7f2')}</div>
${range('tsSz', 'Font size', 20, 120, 64, 1, 'px')}
<div class="btn-row"><button type="button" class="btn-sm" data-ts="soft">Soft</button><button type="button" class="btn-sm" data-ts="neon">Neon</button><button type="button" class="btn-sm" data-ts="retro">Retro 3D</button><button type="button" class="btn-sm" data-ts="outline">Outline</button><button type="button" class="btn-sm" data-ts="basic">Basic</button></div>
</div><div class="panel"><div class="preview" id="tsPrev" style="min-height:300px"><div id="tsEl" style="font-weight:800;text-align:center;line-height:1.1;word-break:break-word"></div></div>${code('tsCode', 'Copy CSS')}</div></div>`,
  js: () => {
    let preset = null;
    const PRE = {
      soft: { x: 0, y: 4, b: 12, c: '#141414', o: 25, fg: '#141414', bg: '#faf7f2' }, neon: { x: 0, y: 0, b: 10, c: '#e8dcc4', o: 100, fg: '#ffffff', bg: '#141414', neon: 1 },
      retro: { x: 4, y: 4, b: 0, c: '#c8a97e', o: 100, fg: '#141414', bg: '#f3ecdf', retro: 1 }, outline: { x: 0, y: 0, b: 0, c: '#141414', o: 100, fg: '#faf7f2', bg: '#faf7f2', outline: 1 }, basic: { x: 3, y: 3, b: 0, c: '#c8a97e', o: 100, fg: '#141414', bg: '#faf7f2' },
    };
    function upd() {
      const x = el('tsX').value, y = el('tsY').value, b = el('tsB').value, c = rgba(el('tsC').value, el('tsO').value / 100); let v = `${x}px ${y}px ${b}px ${c}`;
      if (preset === 'neon') v = [b / 2, b, b * 2, b * 4].map(k => `0 0 ${k}px ${c}`).join(', ');
      if (preset === 'retro') v = Array.from({ length: 6 }, (_, i) => `${Math.sign(x) * (i + 1)}px ${Math.sign(y) * (i + 1)}px 0 ${c}`).join(', ');
      if (preset === 'outline') v = `-1px -1px 0 ${c}, 1px -1px 0 ${c}, -1px 1px 0 ${c}, 1px 1px 0 ${c}`;
      const t = el('tsEl'); t.textContent = el('tsTxt').value || ' '; t.style.textShadow = v; t.style.color = el('tsFg').value; t.style.fontSize = el('tsSz').value + 'px'; el('tsPrev').style.background = el('tsBg').value;
      el('tsCode').textContent = `color: ${el('tsFg').value};\ntext-shadow: ${v};`;
    }
    el('tsP').addEventListener('input', e => { if (['tsX', 'tsY', 'tsB'].includes(e.target.id)) preset = null; upd(); });
    document.querySelectorAll('[data-ts]').forEach(btn => btn.onclick = () => { const p = PRE[btn.dataset.ts]; preset = btn.dataset.ts; [['tsX', p.x], ['tsY', p.y], ['tsB', p.b], ['tsO', p.o]].forEach(([i, v]) => { el(i).value = v; syncOut(el(i)); }); setColor(el('tsC'), p.c); setColor(el('tsFg'), p.fg); setColor(el('tsBg'), p.bg); upd(); });
    upd();
  },
  how: ['Type your preview text.', 'Pick a preset or adjust offset, blur, color and opacity.', 'Change text and background colors to match your design.', 'Copy the text-shadow CSS.'],
  about: `<p>The CSS <code>text-shadow</code> property accepts a comma-separated list of shadows, which makes complex effects possible without images. Stacking several blurred shadows creates a <strong>neon glow</strong>, stacking hard offsets creates <strong>retro 3D</strong> lettering, and four 1px shadows create a simple text outline.</p><p>Use text shadows sparingly on body copy; they work best on large display headings and hero titles.</p>`,
  faq: [['How do I make glowing text in CSS?', 'Stack several text shadows with zero offset and increasing blur in the same bright color. Click the Neon preset to see it.'], ['Does text-shadow affect performance?', 'Small numbers of text shadows are cheap to render. Avoid very large blur values on long paragraphs.']],
},
{
  slug: 'cubic-bezier-generator', cat: 'css', name: 'Cubic Bezier Generator',
  title: 'Cubic Bezier Generator – CSS Easing Curve & Animation Timing Editor',
  desc: 'Create custom CSS easing curves with a visual cubic-bezier editor. Drag the handles, compare with linear timing, try presets like ease-in-out and back, and copy the code.',
  kw: ['cubic bezier generator', 'css easing', 'cubic-bezier css', 'animation timing function', 'easing curve editor', 'transition timing'],
  short: 'Draw custom easing curves for CSS transitions and animations.',
  intro: 'Drag the two control points to shape your animation’s timing, then press play to compare it against linear motion.',
  html: `<div class="tool-layout"><div class="panel"><div style="background:var(--beige-3);border:1px solid var(--line);border-radius:14px;padding:8px;max-width:320px"><canvas id="cbzC" width="600" height="760" style="width:100%;touch-action:none;cursor:grab"></canvas></div></div>
<div class="panel"><div class="grid4">${num('cbz1', 'x1', .25, 'step="0.01" min="0" max="1"')}${num('cbz2', 'y1', .1, 'step="0.01"')}${num('cbz3', 'x2', .25, 'step="0.01" min="0" max="1"')}${num('cbz4', 'y2', 1, 'step="0.01"')}</div>
${sel('cbzPre', 'Presets', [['', 'Choose a preset…'], ['.25,.1,.25,1', 'ease'], ['.42,0,1,1', 'ease-in'], ['0,0,.58,1', 'ease-out'], ['.42,0,.58,1', 'ease-in-out'], ['0,0,1,1', 'linear'], ['.34,1.56,.64,1', 'ease-out-back'], ['.36,0,.66,-.56', 'ease-in-back'], ['.68,-.6,.32,1.6', 'ease-in-out-back'], ['.16,1,.3,1', 'ease-out-expo'], ['.7,0,.84,0', 'ease-in-expo'], ['.65,0,.35,1', 'ease-in-out-cubic']], '')}
${range('cbzD', 'Duration', 200, 3000, 1000, 50, 'ms')}
<h3>Your curve</h3><div class="track"><i id="cbzA"></i></div><h3>Linear</h3><div class="track lin"><i id="cbzL"></i></div>
<div class="btn-row"><button type="button" class="btn" id="cbzPlay">▶ Play</button></div>${code('cbzCode', 'Copy CSS')}</div></div>`,
  js: () => {
    const cv = el('cbzC'), ctx = cv.getContext('2d'), I = [1, 2, 3, 4].map(i => el('cbz' + i)), W = 600, PAD = 60, S = W - PAD * 2, Y0 = 560;
    const toX = v => PAD + v * S, toY = v => Y0 - v * S, fromX = p => (p - PAD) / S, fromY = p => (Y0 - p) / S;
    const val = () => I.map(i => +i.value || 0);
    function draw() {
      const [a, b, c, d] = val(); ctx.clearRect(0, 0, W, 760);
      ctx.strokeStyle = '#d6c3a0'; ctx.lineWidth = 2; ctx.strokeRect(PAD, toY(1), S, S);
      ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(toX(0), toY(0)); ctx.lineTo(toX(1), toY(1)); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = '#8a6d3b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(toX(0), toY(0)); ctx.lineTo(toX(a), toY(b)); ctx.moveTo(toX(1), toY(1)); ctx.lineTo(toX(c), toY(d)); ctx.stroke();
      ctx.strokeStyle = '#141414'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(toX(0), toY(0)); ctx.bezierCurveTo(toX(a), toY(b), toX(c), toY(d), toX(1), toY(1)); ctx.stroke();
      [[a, b], [c, d]].forEach(([x, y]) => { ctx.fillStyle = '#141414'; ctx.beginPath(); ctx.arc(toX(x), toY(y), 16, 0, 7); ctx.fill(); ctx.fillStyle = '#e8dcc4'; ctx.beginPath(); ctx.arc(toX(x), toY(y), 7, 0, 7); ctx.fill(); });
      ctx.fillStyle = '#6b6358'; ctx.font = '22px system-ui'; ctx.fillText('time →', W - PAD - 70, Y0 + 40); ctx.fillText('progress', 8, toY(1) - 16);
      const s = `cubic-bezier(${[a, b, c, d].map(n => +n.toFixed(2)).join(', ')})`; el('cbzCode').textContent = `transition: all ${el('cbzD').value}ms ${s};\n/* or */\nanimation-timing-function: ${s};`;
    }
    let drag = -1;
    const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * 760 / r.height]; };
    cv.addEventListener('pointerdown', e => { const [px, py] = pos(e), [a, b, c, d] = val(); const d1 = Math.hypot(px - toX(a), py - toY(b)), d2 = Math.hypot(px - toX(c), py - toY(d)); drag = Math.min(d1, d2) < 60 ? (d1 < d2 ? 0 : 1) : -1; if (drag >= 0) cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => { if (drag < 0) return; const [px, py] = pos(e); I[drag * 2].value = clamp(fromX(px), 0, 1).toFixed(2); I[drag * 2 + 1].value = clamp(fromY(py), -.9, 1.3).toFixed(2); el('cbzPre').value = ''; draw(); });
    cv.addEventListener('pointerup', () => drag = -1);
    I.forEach(i => i.addEventListener('input', draw)); el('cbzD').addEventListener('input', draw);
    el('cbzPre').addEventListener('change', e => { if (!e.target.value) return; e.target.value.split(',').forEach((v, i) => I[i].value = v); draw(); play(); });
    function play() { const [a, b, c, d] = val(), dur = +el('cbzD').value; [['cbzA', `cubic-bezier(${a},${b},${c},${d})`], ['cbzL', 'linear']].forEach(([id, ease]) => { const n = el(id), dx = n.parentElement.clientWidth - 36; n.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], { duration: dur, easing: ease, fill: 'forwards' }); }); }
    el('cbzPlay').onclick = play; draw();
  },
  how: ['Drag the two round handles on the graph to shape the curve.', 'Or type exact values, or pick a preset such as ease-out-back.', 'Press Play to compare your easing against linear motion.', 'Copy the cubic-bezier() CSS for transitions or animations.'],
  about: `<p>Easing makes motion feel natural. The horizontal axis is time and the vertical axis is progress. A steep start means a fast beginning; a curve that rises above the top creates an overshoot or “bounce back” effect.</p><p>As a rule of thumb, use <strong>ease-out</strong> for elements entering the screen, <strong>ease-in</strong> for elements leaving, and <strong>ease-in-out</strong> for elements moving across the screen. Keep UI transitions between 150ms and 400ms.</p>`,
  faq: [['What does cubic-bezier mean in CSS?', 'It defines a timing curve with two control points (x1, y1) and (x2, y2). The x values must be between 0 and 1; y values can go beyond to create overshoot.'], ['What is the default CSS easing?', 'The default is “ease”, which equals cubic-bezier(0.25, 0.1, 0.25, 1).']],
},
{
  slug: 'css-grid-generator', cat: 'css', name: 'CSS Grid Generator',
  title: 'CSS Grid Generator – Build Grid Layouts Visually & Copy the Code',
  desc: 'Build responsive CSS Grid layouts visually. Set columns, rows, gaps and track sizes, see a live preview and copy clean grid-template CSS and HTML for your website layout.',
  kw: ['css grid generator', 'grid layout generator', 'grid-template-columns', 'css grid builder', 'responsive grid css'],
  short: 'Set up CSS Grid columns, rows and gaps visually and copy the code.',
  intro: 'Choose the number of columns and rows, adjust gaps and track sizes, and get copy-paste CSS Grid code with matching HTML.',
  html: `<div class="tool-layout"><div class="panel" id="cgP">
<div class="grid2">${num('cgC', 'Columns', 3, 'min="1" max="12"')}${num('cgR', 'Rows', 2, 'min="1" max="12"')}</div>
<div class="grid2">${range('cgCG', 'Column gap', 0, 64, 16, 1, 'px')}${range('cgRG', 'Row gap', 0, 64, 16, 1, 'px')}</div>
${txt('cgCT', 'Column sizes (optional)', '', 'placeholder="e.g. 200px 1fr 2fr"')}
${txt('cgRT', 'Row sizes (optional)', '', 'placeholder="e.g. auto 120px"')}
${chk('cgAuto', 'Responsive: auto-fit columns (min 200px)')}
</div><div class="panel"><div class="preview" style="display:block;min-height:280px;padding:16px"><div id="cgPrev"></div></div>${code('cgCode', 'Copy CSS')}${code('cgHtml', 'Copy HTML')}</div></div>`,
  js: () => {
    function upd() {
      const c = clamp(+el('cgC').value || 1, 1, 12), r = clamp(+el('cgR').value || 1, 1, 12), ct = el('cgCT').value.trim(), rt = el('cgRT').value.trim();
      const cols = el('cgAuto').checked ? 'repeat(auto-fit, minmax(200px, 1fr))' : ct || `repeat(${c}, 1fr)`, rows = rt || `repeat(${r}, minmax(80px, auto))`;
      const css = `.grid {\n  display: grid;\n  grid-template-columns: ${cols};\n  grid-template-rows: ${rows};\n  column-gap: ${el('cgCG').value}px;\n  row-gap: ${el('cgRG').value}px;\n}`;
      const p = el('cgPrev'); p.style.cssText = `display:grid;grid-template-columns:${cols};grid-template-rows:${rows};column-gap:${el('cgCG').value}px;row-gap:${el('cgRG').value}px`;
      p.innerHTML = Array.from({ length: c * r }, (_, i) => `<div style="background:var(--ink);color:var(--beige);border-radius:8px;min-height:60px;display:grid;place-items:center;font-weight:700">${i + 1}</div>`).join('');
      el('cgCode').textContent = css; el('cgHtml').textContent = `<div class="grid">\n${Array.from({ length: c * r }, (_, i) => `  <div>${i + 1}</div>`).join('\n')}\n</div>`;
    }
    el('cgP').addEventListener('input', upd); el('cgP').addEventListener('change', upd); upd();
  },
  how: ['Set the number of columns and rows.', 'Adjust column and row gaps with the sliders.', 'Optionally type custom track sizes like “200px 1fr 2fr”.', 'Copy the CSS and HTML into your project.'],
  about: `<p>CSS Grid is the most powerful layout system on the web, letting you control rows and columns at the same time. The <code>fr</code> unit divides free space proportionally, <code>minmax()</code> sets flexible limits, and <code>repeat(auto-fit, minmax(200px, 1fr))</code> creates a responsive grid that wraps automatically without media queries.</p>`,
  faq: [['What is the difference between CSS Grid and Flexbox?', 'Grid is two-dimensional (rows and columns together) while Flexbox is one-dimensional (a single row or column). Use Grid for page layouts and Flexbox for components.'], ['What does 1fr mean?', 'One fraction of the remaining free space in the grid container.']],
},
{
  slug: 'flexbox-generator', cat: 'css', name: 'Flexbox Generator',
  title: 'CSS Flexbox Generator – Interactive Flexbox Playground',
  desc: 'Learn and generate CSS Flexbox layouts interactively. Change flex-direction, justify-content, align-items, wrap and gap with a live preview and copy the flexbox CSS code.',
  kw: ['flexbox generator', 'css flexbox', 'justify-content', 'align-items', 'flexbox playground', 'flex layout css'],
  short: 'Experiment with flex-direction, justify-content and align-items live.',
  intro: 'Not sure which flexbox property does what? Change any option and watch the boxes rearrange instantly, then copy the CSS.',
  html: `<div class="tool-layout"><div class="panel" id="fxP">
${sel('fxD', 'flex-direction', ['row', 'row-reverse', 'column', 'column-reverse'], 'row')}
${sel('fxJ', 'justify-content', ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'], 'center')}
${sel('fxA', 'align-items', ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'], 'center')}
${sel('fxW', 'flex-wrap', ['nowrap', 'wrap', 'wrap-reverse'], 'wrap')}
${sel('fxAC', 'align-content', ['normal', 'flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'stretch'], 'normal')}
<div class="grid2">${range('fxG', 'Gap', 0, 48, 12, 1, 'px')}${range('fxN', 'Items', 1, 12, 5)}</div>
${chk('fxV', 'Vary item sizes', true)}
</div><div class="panel"><div id="fxPrev" style="min-height:320px;border:1px solid var(--line);border-radius:14px;background:var(--beige-3);padding:14px"></div>${code('fxCode', 'Copy CSS')}</div></div>`,
  js: () => {
    function upd() {
      const p = { 'flex-direction': el('fxD').value, 'justify-content': el('fxJ').value, 'align-items': el('fxA').value, 'flex-wrap': el('fxW').value, 'align-content': el('fxAC').value, gap: el('fxG').value + 'px' };
      const pr = el('fxPrev'); pr.style.cssText = 'min-height:320px;border:1px solid var(--line);border-radius:14px;background:var(--beige-3);padding:14px;display:flex;' + Object.entries(p).map(([k, v]) => `${k}:${v}`).join(';');
      const n = +el('fxN').value, v = el('fxV').checked;
      pr.innerHTML = Array.from({ length: n }, (_, i) => `<div style="background:var(--ink);color:var(--beige);border-radius:8px;display:grid;place-items:center;font-weight:700;min-width:${v ? 50 + (i * 37 % 60) : 70}px;min-height:${v ? 40 + (i * 23 % 50) : 60}px;padding:6px">${i + 1}</div>`).join('');
      el('fxCode').textContent = '.container {\n  display: flex;\n' + Object.entries(p).filter(([k, v]) => !(k === 'align-content' && v === 'normal') && !(k === 'flex-wrap' && v === 'nowrap')).map(([k, v]) => `  ${k}: ${v};`).join('\n') + '\n}';
    }
    el('fxP').addEventListener('input', upd); el('fxP').addEventListener('change', upd); upd();
  },
  how: ['Pick a flex-direction to lay items in a row or column.', 'Use justify-content to distribute items along the main axis.', 'Use align-items to align them on the cross axis.', 'Adjust wrap, gap and item count, then copy the CSS.'],
  about: `<p>Flexbox is ideal for navigation bars, button groups, cards and centring content. <code>justify-content</code> works along the main axis (horizontal for rows), while <code>align-items</code> works along the cross axis. Switching to a column direction swaps these axes — the playground makes that behaviour easy to see.</p><p>The <code>gap</code> property is now supported for flexbox in all modern browsers, replacing margin hacks.</p>`,
  faq: [['How do I center a div with flexbox?', 'Set display: flex; justify-content: center; align-items: center on the parent element.'], ['When does align-content apply?', 'Only when items wrap onto multiple lines. It controls the spacing between those lines.']],
},
{
  slug: 'css-clamp-generator', cat: 'css', name: 'Fluid Typography Clamp Generator',
  title: 'CSS Clamp Generator – Fluid Responsive Font Size Calculator',
  desc: 'Generate CSS clamp() values for fluid, responsive typography and spacing. Enter min and max sizes and viewport widths to get a perfect clamp() formula in rem and vw.',
  kw: ['css clamp generator', 'fluid typography', 'responsive font size', 'clamp calculator', 'fluid type scale', 'vw font size'],
  short: 'Calculate clamp() values for fluid, responsive font sizes and spacing.',
  intro: 'Stop writing font-size media queries. Enter the smallest and largest sizes you want and get a single clamp() value that scales smoothly between screen widths.',
  html: `<div class="tool-layout"><div class="panel" id="clP">
<div class="grid2">${num('clMin', 'Min size (px)', 18, 'min="1"')}${num('clMax', 'Max size (px)', 40, 'min="1"')}</div>
<div class="grid2">${num('clVmin', 'Min viewport (px)', 375, 'min="1"')}${num('clVmax', 'Max viewport (px)', 1440, 'min="1"')}</div>
<div class="grid2">${num('clRoot', 'Root font size (px)', 16, 'min="1"')}${sel('clU', 'Output unit', ['rem', 'px'], 'rem')}</div>
${txt('clProp', 'CSS property', 'font-size')}
</div><div class="panel">${code('clCode', 'Copy CSS')}
<div style="margin-top:20px">${range('clW', 'Preview viewport width', 320, 1920, 900, 10, 'px')}</div>
<div class="stat-grid"><div class="stat"><span>Computed size</span><b id="clNow">–</b></div><div class="stat"><span>Slope</span><b id="clSlope">–</b></div></div>
<div class="preview" style="min-height:160px;place-items:start;overflow:auto"><div id="clPrev" style="font-weight:700;line-height:1.15">The quick brown fox jumps over the lazy dog</div></div></div></div>`,
  js: () => {
    function upd() {
      const mn = +el('clMin').value, mx = +el('clMax').value, vmn = +el('clVmin').value, vmx = +el('clVmax').value, root = +el('clRoot').value || 16, u = el('clU').value;
      if (vmx <= vmn) { el('clCode').textContent = '/* Max viewport must be larger than min viewport */'; return; }
      const slope = (mx - mn) / (vmx - vmn), inter = mn - slope * vmn, f = n => +n.toFixed(4);
      const conv = px => u === 'rem' ? f(px / root) + 'rem' : f(px) + 'px';
      const lo = Math.min(mn, mx), hi = Math.max(mn, mx), val = `clamp(${conv(lo)}, ${conv(inter)} + ${f(slope * 100)}vw, ${conv(hi)})`;
      el('clCode').textContent = `${el('clProp').value || 'font-size'}: ${val};`;
      const w = +el('clW').value, now = clamp(inter + slope * w, lo, hi); el('clNow').textContent = now.toFixed(1) + 'px'; el('clSlope').textContent = f(slope * 100) + 'vw'; el('clPrev').style.fontSize = now + 'px';
    }
    el('clP').addEventListener('input', upd); el('clP').addEventListener('change', upd); el('clW').addEventListener('input', upd); upd();
  },
  how: ['Enter the minimum and maximum size in pixels.', 'Set the viewport widths where scaling should start and stop.', 'Copy the generated clamp() CSS.', 'Drag the preview slider to see the computed size at any screen width.'],
  about: `<p>The CSS <code>clamp(min, preferred, max)</code> function lets a value grow with the viewport while staying within limits. Combining a rem value with a vw value in the middle keeps text accessible: it still responds to the user’s browser zoom and font settings.</p><p>The formula is linear interpolation: <code>slope = (maxSize − minSize) / (maxViewport − minViewport)</code>. Fluid sizing works for font sizes, padding, margins and gaps alike.</p>`,
  faq: [['Why use rem instead of px in clamp()?', 'rem respects the user’s default font size, which improves accessibility. The tool converts using your root font size.'], ['Is clamp() supported by all browsers?', 'Yes, clamp() is supported in all modern browsers since 2020.']],
},
];
