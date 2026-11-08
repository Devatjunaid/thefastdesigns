import { range, num, txt, color, sel, chk, code } from '../lib.mjs';

export default [
{
  slug: 'type-scale-generator', cat: 'gen', name: 'Type Scale Generator',
  title: 'Type Scale Generator – Modular Typography Scale Calculator',
  desc: 'Generate a modular type scale for harmonious typography. Pick a base font size and ratio like major third or golden ratio, preview headings and copy CSS font-size variables.',
  kw: ['type scale generator', 'modular scale', 'typography scale', 'font size scale', 'golden ratio typography', 'heading sizes css'],
  short: 'Create harmonious font-size scales using modular ratios.',
  intro: 'Choose a base size and a musical ratio to generate a consistent set of font sizes for body text and headings, with a live preview and CSS tokens.',
  html: `<div class="tool-layout"><div class="panel" id="tyP">
<div class="grid2">${num('tyB', 'Base size (px)', 16, 'min="8" max="40"')}${sel('tyU', 'Unit', ['rem', 'px'], 'rem')}</div>
${sel('tyR', 'Scale ratio', [[1.067, 'Minor second · 1.067'], [1.125, 'Major second · 1.125'], [1.2, 'Minor third · 1.2'], [1.25, 'Major third · 1.25'], [1.333, 'Perfect fourth · 1.333'], [1.414, 'Augmented fourth · 1.414'], [1.5, 'Perfect fifth · 1.5'], [1.618, 'Golden ratio · 1.618']], 1.25)}
<div class="grid2">${num('tyUp', 'Steps up', 6, 'min="1" max="10"')}${num('tyDn', 'Steps down', 2, 'min="0" max="4"')}</div>
${txt('tySample', 'Preview text', 'Design is intelligence made visible')}
</div><div class="panel"><div id="tyOut" style="border:1px solid var(--line);border-radius:14px;overflow:hidden"></div>${code('tyCode', 'Copy CSS')}</div></div>`,
  js: () => {
    function upd() {
      const b = +el('tyB').value || 16, r = +el('tyR').value, up = clamp(+el('tyUp').value, 1, 10), dn = clamp(+el('tyDn').value, 0, 4), u = el('tyU').value;
      const nm = i => i === 0 ? 'base' : i > 0 ? (['lg', 'xl'][i - 1] || `${i - 1}xl`) : (['sm', 'xs'][-i - 1] || `${-i - 1}xs`);
      const rows = []; for (let i = -dn; i <= up; i++) rows.push({ n: nm(i), px: b * r ** i });
      const v = px => u === 'rem' ? +(px / 16).toFixed(3) + 'rem' : +px.toFixed(2) + 'px';
      el('tyOut').innerHTML = rows.slice().reverse().map(x => `<div style="display:flex;gap:14px;align-items:baseline;padding:12px 16px;border-bottom:1px solid var(--line);background:#fff"><code style="width:96px;flex:none;color:var(--muted);font-size:12px">${x.n} · ${x.px.toFixed(1)}px</code><span style="font-size:${x.px}px;line-height:1.15;font-weight:${x.px > b * 1.3 ? 700 : 400};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${el('tySample').value.replace(/</g, '&lt;')}</span></div>`).join('');
      el('tyCode').textContent = ':root {\n' + rows.map(x => `  --text-${x.n}: ${v(x.px)};`).join('\n') + '\n}';
    }
    el('tyP').addEventListener('input', upd); el('tyP').addEventListener('change', upd); upd();
  },
  how: ['Enter your base body font size (16px is the browser default).', 'Choose a scale ratio — smaller ratios suit dense UIs, larger ones suit editorial sites.', 'Set how many steps up and down you need.', 'Preview the sizes and copy the CSS variables.'],
  about: `<p>A modular type scale multiplies a base size by the same ratio for each step, creating a natural rhythm between body text, subheadings and headings. Ratios are borrowed from music intervals: the <strong>major third (1.25)</strong> is a versatile default, while the <strong>golden ratio (1.618)</strong> creates dramatic, high-contrast headlines.</p><p>Output in rem keeps your typography accessible because it scales with the user’s browser font settings.</p>`,
  faq: [['What is the best type scale ratio?', 'For apps and dashboards use 1.125–1.2. For marketing sites and blogs, 1.25–1.333 works well. Use 1.5+ for bold, editorial headlines.'], ['Why use rem for font sizes?', 'rem units respect user font-size preferences, which is better for accessibility than fixed pixels.']],
},
{
  slug: 'lorem-ipsum-generator', cat: 'gen', name: 'Lorem Ipsum Generator',
  title: 'Lorem Ipsum Generator – Placeholder Text for Designs & Mockups',
  desc: 'Generate lorem ipsum dummy text by paragraphs, sentences or words. Optional HTML paragraph tags, word and character count, and one-click copy for designs, mockups and layouts.',
  kw: ['lorem ipsum generator', 'dummy text', 'placeholder text', 'lorem ipsum', 'filler text', 'random text generator'],
  short: 'Generate placeholder paragraphs, sentences or words instantly.',
  intro: 'Fill your layouts with realistic-looking placeholder copy. Choose how much text you need and copy it as plain text or HTML.',
  html: `<div class="tool-layout"><div class="panel" id="liP">
<div class="grid2">${num('liN', 'Amount', 3, 'min="1" max="100"')}${sel('liT', 'Type', [['p', 'Paragraphs'], ['s', 'Sentences'], ['w', 'Words']], 'p')}</div>
${chk('liStart', 'Start with “Lorem ipsum dolor sit amet…”', true)}${chk('liHtml', 'Wrap paragraphs in <p> tags')}
<div class="btn-row"><button type="button" class="btn" id="liGo">Generate</button><button type="button" class="btn-alt" data-copy-from="liOut">Copy text</button></div>
<div class="stat-grid" style="margin-top:14px"><div class="stat"><span>Words</span><b id="liW">0</b></div><div class="stat"><span>Characters</span><b id="liC">0</b></div></div>
</div><div class="panel"><textarea id="liOut" class="prose" rows="16" readonly></textarea></div></div>`,
  js: () => {
    const W = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum pellentesque habitant morbi tristique senectus netus malesuada fames ac turpis egestas integer vitae justo eget magna fermentum iaculis eu non diam phasellus vestibulum mauris viverra accumsan lacus vel facilisis volutpat blandit cursus risus at ultrices mi tempus imperdiet nulla porttitor massa'.split(' ');
    const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), word = () => W[R(0, W.length - 1)];
    const sentence = () => { const n = R(6, 14), w = Array.from({ length: n }, word); if (n > 8) w[R(2, n - 4)] += ','; const s = w.join(' '); return s[0].toUpperCase() + s.slice(1) + '.'; };
    const para = () => Array.from({ length: R(4, 7) }, sentence).join(' ');
    const START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    function gen() {
      const n = clamp(+el('liN').value || 1, 1, 100), t = el('liT').value, st = el('liStart').checked; let out;
      if (t === 'w') { const w = Array.from({ length: n }, word); if (st) START.toLowerCase().replace(/[.,]/g, '').split(' ').slice(0, n).forEach((x, i) => w[i] = x); out = w.join(' '); out = out[0].toUpperCase() + out.slice(1); }
      else if (t === 's') { const s = Array.from({ length: n }, sentence); if (st) s[0] = START; out = s.join(' '); }
      else { const p = Array.from({ length: n }, para); if (st) p[0] = START + ' ' + p[0]; out = el('liHtml').checked ? p.map(x => `<p>${x}</p>`).join('\n\n') : p.join('\n\n'); }
      el('liOut').value = out; el('liW').textContent = out.replace(/<\/?p>/g, '').split(/\s+/).filter(Boolean).length; el('liC').textContent = out.length;
    }
    el('liGo').onclick = gen; el('liP').addEventListener('change', gen); gen();
  },
  how: ['Enter how much text you need.', 'Choose paragraphs, sentences or words.', 'Toggle the classic opening line or HTML <p> tags.', 'Click Generate, then Copy text.'],
  about: `<p>Lorem ipsum is scrambled Latin derived from Cicero’s “de Finibus Bonorum et Malorum” and has been the standard filler text since the 1500s. It lets clients and stakeholders judge a layout’s typography and spacing without being distracted by readable content.</p><p>Tip: replace lorem ipsum with real content as early as possible — real copy often reveals layout problems that placeholder text hides.</p>`,
  faq: [['What does lorem ipsum mean?', 'It is derived from Latin text by Cicero but intentionally scrambled, so it has no real meaning.'], ['Can I generate HTML-ready text?', 'Yes, enable “Wrap paragraphs in <p> tags” to get HTML markup.']],
},
{
  slug: 'svg-blob-generator', cat: 'gen', name: 'SVG Blob Generator',
  title: 'SVG Blob Generator – Create Random Organic Blob Shapes',
  desc: 'Generate random, organic SVG blob shapes for backgrounds, illustrations and hero sections. Control complexity, randomness, color and gradient, then download SVG or copy code.',
  kw: ['svg blob generator', 'blob maker', 'organic shapes svg', 'random shape generator', 'blob background', 'svg shape generator'],
  short: 'Make random organic blob shapes and export them as SVG.',
  intro: 'Create smooth, organic blob shapes for modern landing pages and illustrations. Every click gives you a unique shape.',
  html: `<div class="tool-layout"><div class="panel" id="blP">
${range('blN', 'Complexity (points)', 3, 12, 6)}${range('blR', 'Randomness', 0, 100, 40, 1, '%')}
${color('blC', 'Fill color', '#c8a97e')}${chk('blG', 'Use gradient')}${color('blC2', 'Gradient end color', '#141414')}
${chk('blO', 'Outline only')}
<div class="btn-row"><button type="button" class="btn" id="blGo">New shape</button><button type="button" class="btn-alt" id="blDl">Download SVG</button></div>
</div><div class="panel"><div class="preview checker" id="blPrev" style="min-height:360px"></div>${code('blCode', 'Copy SVG')}</div></div>`,
  js: () => {
    let pts = [];
    function shape() { const n = +el('blN').value, rnd = el('blR').value / 100; pts = Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2, r = 150 * (1 - rnd * .55 * Math.random()); return [200 + Math.cos(a) * r, 200 + Math.sin(a) * r]; }); render(); }
    function path() { const n = pts.length, P = i => pts[(i + n) % n], f = v => +v.toFixed(1); let d = `M${f(P(0)[0])},${f(P(0)[1])}`; for (let i = 0; i < n; i++) { const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2); d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`; } return d + 'Z'; }
    function svg() { const g = el('blG').checked, o = el('blO').checked, fill = g ? 'url(#g)' : el('blC').value; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">${g ? `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${el('blC').value}"/><stop offset="1" stop-color="${el('blC2').value}"/></linearGradient></defs>` : ''}<path d="${path()}" ${o ? `fill="none" stroke="${fill}" stroke-width="4"` : `fill="${fill}"`}/></svg>`; }
    function render() { const s = svg(); el('blPrev').innerHTML = s.replace('width="400" height="400"', 'style="width:100%;max-width:380px;height:auto"'); el('blCode').textContent = s; }
    el('blP').addEventListener('input', e => { if (e.target.id === 'blN' || e.target.id === 'blR') shape(); else render(); });
    el('blP').addEventListener('change', render);
    el('blGo').onclick = shape; el('blDl').onclick = () => downloadText(svg(), 'blob.svg', 'image/svg+xml'); shape();
  },
  how: ['Set the complexity (number of points) and randomness.', 'Choose a fill color or a two-color gradient.', 'Click “New shape” until you love it.', 'Download the SVG or copy the code.'],
  about: `<p>Blobs add a friendly, organic feel to otherwise rigid layouts. Place them behind hero images, use them as section dividers or animate them subtly with CSS. Because they are SVG, they stay perfectly sharp at any size and weigh only a few hundred bytes.</p><p>Shapes are drawn using smooth Catmull-Rom curves converted to cubic Béziers, so edges never look jagged.</p>`,
  faq: [['Can I use these blobs commercially?', 'Yes, every generated shape is yours to use freely in personal and commercial projects.'], ['How do I edit a blob in Figma or Illustrator?', 'Download the SVG and drag it into your design tool — it imports as an editable vector path.']],
},
{
  slug: 'svg-wave-generator', cat: 'gen', name: 'SVG Wave Generator',
  title: 'SVG Wave Generator – Wavy Section Dividers for Websites',
  desc: 'Create smooth SVG waves and layered wave section dividers for website headers and footers. Adjust layers, height, wave count and colors, then download SVG or copy the code.',
  kw: ['svg wave generator', 'wave divider', 'section divider svg', 'wavy background', 'layered waves', 'website wave'],
  short: 'Design smooth or layered SVG wave dividers for page sections.',
  intro: 'Break up long pages with flowing wave dividers. Stack several layers for depth and flip them to sit at the top or bottom of a section.',
  html: `<div class="tool-layout"><div class="panel" id="wvP">
${range('wvL', 'Layers', 1, 4, 3)}${range('wvW', 'Waves', 2, 12, 5)}${range('wvA', 'Height', 10, 100, 55, 1, '%')}
${color('wvC', 'Color', '#141414')}${sel('wvPos', 'Position', [['bottom', 'Bottom (footer / section end)'], ['top', 'Top (header / section start)']], 'bottom')}
<div class="btn-row"><button type="button" class="btn" id="wvGo">Randomize</button><button type="button" class="btn-alt" id="wvDl">Download SVG</button></div>
</div><div class="panel"><div class="preview" style="padding:0;display:block;min-height:auto;background:#fff"><div id="wvPrev" style="line-height:0"></div></div>${code('wvCode', 'Copy SVG')}</div></div>`,
  js: () => {
    let seeds = [];
    const reseed = () => { seeds = Array.from({ length: 4 }, () => Array.from({ length: 14 }, Math.random)); };
    function svg() {
      const L = +el('wvL').value, N = +el('wvW').value, A = el('wvA').value / 100, top = el('wvPos').value === 'top', c = el('wvC').value, H = 320, f = v => +v.toFixed(1); let paths = '';
      for (let l = 0; l < L; l++) {
        const base = H * (1 - A) + (H * A) * (l / L) * .9, amp = H * A * .35, pts = Array.from({ length: N + 1 }, (_, i) => [i / N * 1440, clamp(base + (seeds[l][i] - .5) * 2 * amp, 0, H)]);
        let d = `M0,${f(pts[0][1])}`; for (let i = 0; i < N; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(N, i + 2)]; d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`; }
        d += `L1440,${H}L0,${H}Z`; paths += `<path d="${d}" fill="${c}" fill-opacity="${L === 1 ? 1 : +(0.25 + .75 * (l + 1) / L).toFixed(2)}"/>`;
      }
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">${top ? `<g transform="translate(0,320) scale(1,-1)">${paths}</g>` : paths}</svg>`;
    }
    function render() { const s = svg(); el('wvPrev').innerHTML = s.replace('<svg ', '<svg style="width:100%;height:220px;display:block" '); el('wvCode').textContent = s; }
    el('wvP').addEventListener('input', render); el('wvP').addEventListener('change', render);
    el('wvGo').onclick = () => { reseed(); render(); }; el('wvDl').onclick = () => downloadText(svg(), 'wave.svg', 'image/svg+xml'); reseed(); render();
  },
  how: ['Choose the number of layers and waves.', 'Adjust the height and pick a color.', 'Set whether the wave sits at the top or bottom of a section.', 'Randomize until you like it, then download or copy the SVG.'],
  about: `<p>Wave dividers soften the transition between page sections and add movement to static layouts. Using several semi-transparent layers of the same color creates a sense of depth without extra colors.</p><p>The SVG uses <code>preserveAspectRatio="none"</code> so it stretches to any width — place it at the edge of a section with <code>display: block; width: 100%</code>.</p>`,
  faq: [['How do I add an SVG wave to my website?', 'Paste the SVG code at the top or bottom of your section and give it width: 100% and display: block. Match the color to the next section’s background.'], ['Will the wave look good on mobile?', 'Yes, it stretches to fit any screen width. Adjust the height with CSS for smaller screens if needed.']],
},
];
