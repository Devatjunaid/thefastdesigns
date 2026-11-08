// Static site generator for thefastdesigns.online — run: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ICONS, LOGO } from './src/lib.mjs';
import color from './src/tools/color.mjs';
import css from './src/tools/css.mjs';
import image from './src/tools/image.mjs';
import gen from './src/tools/gen.mjs';
import calc from './src/tools/calc.mjs';

const SITE = 'https://thefastdesigns.online', BRAND = 'TheFastDesigns', OUT = 'public';
const TOOLS = [...color, ...css, ...image, ...gen, ...calc];
const CATS = [
  { id: 'color', name: 'Color Tools', blurb: 'Convert, check, extract and generate colors and palettes.' },
  { id: 'css', name: 'CSS Generators', blurb: 'Visual editors that write clean, copy-ready CSS for you.' },
  { id: 'image', name: 'Image Tools', blurb: 'Resize, compress, convert and edit images privately in your browser.' },
  { id: 'gen', name: 'Typography & Shape Generators', blurb: 'Type scales, placeholder text and SVG shapes for layouts.' },
  { id: 'calc', name: 'Design Calculators', blurb: 'Ratios, units, resolution and grid maths for screen and print.' },
];
const catName = id => CATS.find(c => c.id === id).name;

// ---------- sanity checks ----------
const slugs = new Set(), titles = new Set(), descs = new Set();
for (const t of TOOLS) {
  for (const [set, v, k] of [[slugs, t.slug, 'slug'], [titles, t.title, 'title'], [descs, t.desc, 'desc']]) { if (set.has(v)) throw new Error(`Duplicate ${k}: ${v}`); set.add(v); }
  if (String(t.js).includes('</script')) throw new Error('Script tag inside tool JS: ' + t.slug);
}

// ---------- assets ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/assets`, { recursive: true });
const minCss = readFileSync('src/assets/style.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}');
const appJs = readFileSync('src/assets/app.js', 'utf8').replace(/^\s*\/\*[^\n]*\*\/\s*$/gm, '').replace(/^\s+/gm, '').replace(/\n{2,}/g, '\n');
const hash = s => createHash('sha1').update(s).digest('hex').slice(0, 8);
writeFileSync(`${OUT}/assets/style.css`, minCss);
writeFileSync(`${OUT}/assets/app.js`, appJs);
const V = { css: hash(minCss), js: hash(appJs) };
const faviconSvg = LOGO.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace(' aria-hidden="true"', '');
writeFileSync(`${OUT}/favicon.svg`, faviconSvg);
writeFileSync(`${OUT}/assets/logo.svg`, faviconSvg);
for (const f of ['apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'og-image.png']) if (existsSync(`src/assets/${f}`)) copyFileSync(`src/assets/${f}`, `${OUT}/${f}`);

// ---------- templates ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ld = o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const fullTitle = t => (t.length + BRAND.length + 3 <= 70 ? `${t} | ${BRAND}` : t);

function head({ title, desc, path, kw = [], schema = [] }) {
  const url = SITE + path;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">${kw.length ? `\n<meta name="keywords" content="${esc(kw.join(', '))}">` : ''}
<link rel="canonical" href="${url}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:site_name" content="${BRAND}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/og-image.png">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}">
<meta name="theme-color" content="#141414"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/assets/style.css?v=${V.css}">
${schema.map(ld).join('\n')}
</head><body><a class="skip" href="#main">Skip to content</a>`;
}
const header = () => `<header class="site"><div class="wrap nav"><a class="brand" href="/" aria-label="${BRAND} home">${LOGO}<span>TheFast<em>Designs</em></span></a>
<button class="menu-btn" aria-label="Open menu" aria-expanded="false"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
<nav aria-label="Main"><ul>${CATS.map(c => `<li><a href="/#${c.id}">${c.name.replace('Typography & Shape ', '').replace('Design ', '')}</a></li>`).join('')}<li><a href="/about/">About</a></li></ul></nav></div></header>`;
const footer = () => `<footer class="site"><div class="wrap"><div class="foot-grid"><div><a class="brand" href="/">${LOGO}<span>TheFast<em>Designs</em></span></a><p>Free, fast and private design tools that run entirely in your browser. No sign-up, no uploads, no limits.</p></div>
<div><h4>Popular tools</h4><ul>${['color-palette-generator', 'image-compressor', 'contrast-checker', 'css-gradient-generator', 'image-resizer', 'favicon-generator'].map(s => TOOLS.find(t => t.slug === s)).map(t => `<li><a href="/tools/${t.slug}/">${t.name}</a></li>`).join('')}</ul></div>
<div><h4>Categories</h4><ul>${CATS.map(c => `<li><a href="/#${c.id}">${c.name}</a></li>`).join('')}</ul></div>
<div><h4>${BRAND}</h4><ul><li><a href="/about/">About</a></li><li><a href="/privacy/">Privacy policy</a></li><li><a href="/#how-it-works">How it works</a></li><li><a href="/#faq">FAQ</a></li><li><a href="/sitemap.xml">Sitemap</a></li></ul></div></div>
<div class="foot-bottom"><span>© ${new Date().getFullYear()} ${BRAND} · All tools are free to use.</span><span>Made for designers, developers &amp; creators.</span></div></div></footer>
<script src="/assets/app.js?v=${V.js}"></script>`;

const card = t => `<a class="tool-card" href="/tools/${t.slug}/" data-k="${esc([t.name, t.short, ...t.kw].join(' ').toLowerCase())}"><span class="ic">${ICONS[t.cat]}</span><h3>${t.name}</h3><p>${t.short}</p><span class="go">Use tool →</span></a>`;
const faqHtml = list => list.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');
const faqLd = list => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const write = (path, html) => { const dir = OUT + path; mkdirSync(dir, { recursive: true }); writeFileSync(dir + 'index.html', html.replace(/\n\s*\n/g, '\n')); };

// ---------- tool pages ----------
for (const t of TOOLS) {
  const path = `/tools/${t.slug}/`, related = TOOLS.filter(x => x.cat === t.cat && x !== t).slice(0, 6);
  const others = TOOLS.filter(x => x.cat !== t.cat).sort((a, b) => (a.slug.length * 7 + t.slug.length) % 11 - (b.slug.length * 7 + t.slug.length) % 11).slice(0, 4);
  const schema = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: t.name, url: SITE + path, description: t.desc, applicationCategory: 'DesignApplication', operatingSystem: 'Any (web browser)', browserRequirements: 'Requires JavaScript', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@type': 'Organization', name: BRAND, url: SITE } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: catName(t.cat), item: `${SITE}/#${t.cat}` }, { '@type': 'ListItem', position: 3, name: t.name, item: SITE + path }] },
    { '@context': 'https://schema.org', '@type': 'HowTo', name: `How to use the ${t.name}`, step: t.how.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })) },
    faqLd(t.faq),
  ];
  write(path, `${head({ title: fullTitle(t.title), desc: t.desc, path, kw: t.kw, schema })}${header()}
<main id="main" class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/#${t.cat}">${catName(t.cat)}</a> › <span>${t.name}</span></nav>
<div class="tool-head"><h1>${t.name}</h1><p>${t.intro}</p><div class="tags"><span>100% free</span><span>No sign-up</span><span>Works offline</span><span>Private — runs in your browser</span></div></div>
<section class="tool-box" aria-label="${esc(t.name)}">${t.html}</section>
<div class="content"><article class="prose"><h2>How to use the ${t.name}</h2><ol class="howto">${t.how.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
<h2>About this ${t.name.toLowerCase()}</h2>${t.about}
<h2>Why use ${BRAND}?</h2><p>Every tool on ${BRAND} runs locally using modern browser technology. That means instant results with no waiting for uploads, no file size limits imposed by a server and complete privacy — your files and data never leave your device.</p>
<h2>Frequently asked questions</h2><div class="faq">${faqHtml(t.faq)}</div></article>
<aside class="side"><div class="side-box"><div class="privacy-pill">${ICONS.shield}<span><b>Private by design.</b> This tool processes everything on your device. Nothing is uploaded or stored.</span></div></div>
<div class="side-box"><h3>More ${catName(t.cat).toLowerCase()}</h3><ul>${related.map(r => `<li><a href="/tools/${r.slug}/"><span class="ic">${ICONS[r.cat]}</span>${r.name}</a></li>`).join('')}</ul></div>
<div class="side-box"><h3>You might also like</h3><ul>${others.map(r => `<li><a href="/tools/${r.slug}/"><span class="ic">${ICONS[r.cat]}</span>${r.name}</a></li>`).join('')}</ul></div></aside></div></main>
${footer()}<script>(${t.js.toString()})();</script></body></html>`);
}

// ---------- home ----------
const homeFaq = [
  ['Are the tools on TheFastDesigns really free?', 'Yes. Every tool is completely free with no sign-up, no watermarks, no daily limits and no premium tier.'],
  ['Do you upload my images or files?', 'No. All tools run locally in your web browser using JavaScript and the HTML canvas. Your images, colors and text never leave your device.'],
  ['Do the tools work offline?', 'Once a tool page has loaded, it keeps working without an internet connection because there are no server calls or third-party APIs.'],
  ['Can I use the results in commercial projects?', 'Absolutely. Everything you create — palettes, CSS code, images, SVG shapes and icons — is yours to use in personal and commercial work.'],
  ['Which browsers are supported?', 'All modern browsers: Chrome, Edge, Firefox, Safari and their mobile versions. The tools are fully responsive and work on phones and tablets.'],
  ['Why are the tools so fast?', 'Each page is a lightweight static file with no frameworks, trackers or external scripts, and processing happens instantly on your own device.'],
];
const homeDesc = `${TOOLS.length} free online design tools that run in your browser: color palette generator, contrast checker, CSS gradient & box shadow generators, image resizer, compressor and more.`;
write('/', `${head({
  title: 'TheFastDesigns – Free Online Design Tools, Generators & Calculators', desc: homeDesc, path: '/', kw: ['free design tools', 'online design tools', 'color palette generator', 'css generator', 'image tools', 'design calculators'],
  schema: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: SITE + '/', description: homeDesc }, { '@context': 'https://schema.org', '@type': 'Organization', name: BRAND, url: SITE, logo: SITE + '/assets/logo.svg' }, { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Free design tools', itemListElement: TOOLS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/tools/${t.slug}/`, name: t.name })) }, faqLd(homeFaq)],
})}${header()}
<main id="main"><section class="hero"><div class="wrap"><span class="eyebrow">${TOOLS.length} free tools · no sign-up</span>
<h1>Free online design tools that are <span>fast &amp; private</span></h1>
<p class="lead">Color palettes, CSS generators, image editing and design calculators — everything runs instantly in your browser. No uploads, no accounts, no limits.</p>
<div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" id="toolSearch" placeholder="Search tools… e.g. gradient, compress, favicon" aria-label="Search design tools" autocomplete="off"></div>
<div class="btn-row" style="justify-content:center"><a class="btn" href="#tools">Browse all tools</a><a class="btn-alt" href="#how-it-works">How it works</a></div>
<div class="stats"><div><b>${TOOLS.length}</b><span>Design tools</span></div><div><b>0</b><span>Files uploaded</span></div><div><b>100%</b><span>Free forever</span></div><div><b>&lt;1s</b><span>Page load</span></div></div></div></section>
<section class="block" id="tools" style="border-top:0;padding-top:24px"><div class="wrap"><p id="noResults" class="note" style="text-align:center;font-size:16px" hidden>No tools match your search. Try “color”, “image” or “css”.</p>
${CATS.map(c => `<div class="cat-section" id="${c.id}"><div class="cat-title"><span class="ic">${ICONS[c.id]}</span><div><h2>${c.name}</h2><p>${c.blurb}</p></div></div><div class="tool-grid">${TOOLS.filter(t => t.cat === c.id).map(card).join('')}</div></div>`).join('')}
</div></section>
<section class="block" id="benefits"><div class="wrap"><div class="sec-head"><span class="eyebrow">Why TheFastDesigns</span><h2>Built for speed, privacy and everyday design work</h2><p>We built the toolbox we wanted ourselves: no clutter, no pop-ups and no waiting for uploads.</p></div>
<div class="features">${[
  ['bolt', 'Instant results', 'Tools respond as you type or drag a slider. There is no server round-trip, so results appear in milliseconds.'],
  ['lock', 'Completely private', 'Your images and data are processed on your own device. Nothing is uploaded, logged or stored on any server.'],
  ['free', 'Free with no limits', 'No accounts, no watermarks, no file caps and no paywalls. Use every tool as often as you like.'],
  ['wifi', 'Works offline', 'No third-party APIs or cloud services. Once a page loads, the tool keeps working even without internet.'],
  ['layers', 'Copy-ready output', 'Get clean CSS, HEX codes, SVG markup and optimized image files that you can paste straight into your project.'],
  ['user', 'Made for everyone', 'Designers, developers, marketers, students and small businesses — every tool is simple enough for beginners and fast enough for pros.'],
].map(([i, h, p]) => `<div class="feature"><span class="ic">${ICONS[i]}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}</div></div></section>
<section class="block" id="how-it-works"><div class="wrap"><div class="sec-head"><span class="eyebrow">How it works</span><h2>Three steps, zero friction</h2><p>Every tool follows the same simple pattern, so once you’ve used one you know them all.</p></div>
<ol class="steps"><li><h3>Pick a tool</h3><p>Browse the categories above or search for what you need — palettes, gradients, image resizing, unit conversion and more.</p></li><li><h3>Add your input</h3><p>Drop an image, choose a color or adjust the sliders. A live preview shows the result instantly as you work.</p></li><li><h3>Copy or download</h3><p>Copy the generated code or values with one click, or download your finished files in the format you need.</p></li></ol>
<div class="split" style="margin-top:48px"><div><h2>Browser-based technology, no cloud required</h2><p class="muted">Each tool uses standard web technologies built into your browser — the Canvas API for images, native color parsing for colors and plain JavaScript for calculations. That’s why the tools are fast, reliable and safe to use with client work or confidential files.</p><a class="btn" href="#tools">Start designing</a></div>
<ul class="checklist"><li>Images are edited with the HTML5 Canvas on your device</li><li>No external scripts, trackers, fonts or APIs</li><li>Lightweight static pages that load in under a second</li><li>Responsive design for desktop, tablet and phone</li><li>Accessible, keyboard-friendly controls</li></ul></div></div></section>
<section class="block" id="who"><div class="wrap"><div class="dark-band"><div class="split"><div><h2>One toolbox for every creative workflow</h2><p>Web designers build palettes and check contrast. Developers grab CSS for gradients, shadows, grids and fluid type. Marketers resize and compress images for social media. Print designers convert units and calculate DPI. All in one place, all free.</p><a class="btn" href="#tools">Explore the tools</a></div>
<ul class="checklist" style="color:#F5EFE4">${['UI & web designers', 'Front-end developers', 'Social media managers & marketers', 'Print & graphic designers', 'Students & educators', 'Bloggers & small businesses'].map(x => `<li style="border-color:#2E2B27">${x}</li>`).join('')}</ul></div></div></div></section>
<section class="block" id="faq"><div class="wrap" style="max-width:860px"><div class="sec-head"><span class="eyebrow">FAQ</span><h2>Frequently asked questions</h2></div><div class="faq">${faqHtml(homeFaq)}</div></div></section></main>
${footer()}</body></html>`);

// ---------- static pages ----------
const page = (path, title, desc, body) => write(path, `${head({ title, desc, path })}${header()}<main id="main" class="wrap" style="max-width:820px;padding-top:48px;padding-bottom:64px"><article class="prose">${body}</article></main>${footer()}</body></html>`);
page('/about/', 'About TheFastDesigns – Free Browser-Based Design Tools', 'Learn about TheFastDesigns, a free collection of fast, private, browser-based design tools for colors, CSS, images, typography and design calculations.',
  `<span class="eyebrow">About</span><h1>Design tools that respect your time and privacy</h1><p>${BRAND} is a growing collection of ${TOOLS.length} free design tools — color utilities, CSS generators, image editors, typography helpers and design calculators. Our goal is simple: give designers, developers and creators the small everyday utilities they reach for constantly, without sign-ups, ads that get in the way, or uploads to unknown servers.</p><h2>How we’re different</h2><ul><li><strong>Everything runs in your browser.</strong> No cloud processing and no third-party APIs.</li><li><strong>Fast by default.</strong> Lightweight static pages with no frameworks or tracking scripts.</li><li><strong>Free forever.</strong> No paywalls, no watermarks and no usage limits.</li></ul><h2>Our tools</h2><ul>${CATS.map(c => `<li><a href="/#${c.id}">${c.name}</a> — ${c.blurb}</li>`).join('')}</ul><p><a class="btn" href="/#tools">Browse all tools</a></p>`);
page('/privacy/', 'Privacy Policy – TheFastDesigns', 'TheFastDesigns privacy policy. Our design tools run entirely in your browser: we do not upload, collect or store your images, files or personal data.',
  `<span class="eyebrow">Privacy</span><h1>Privacy policy</h1><p>Your privacy is built into how ${BRAND} works.</p><h2>Your files stay on your device</h2><p>All tools process images, colors and text locally in your web browser. Files you select are never uploaded to our servers or to any third party.</p><h2>No accounts and no personal data</h2><p>We do not require registration and we do not collect names, email addresses or other personal information through our tools.</p><h2>No third-party scripts</h2><p>Our pages do not load external fonts, analytics trackers or advertising scripts. Standard web server logs (such as IP address and pages requested) may be processed by our hosting provider for security and reliability.</p><h2>Local storage</h2><p>Tools do not store your work. Downloads you create are saved directly by your browser.</p><h2>Contact</h2><p>If you have any questions about this policy, please contact us through the website.</p>`);
writeFileSync(`${OUT}/404.html`, `${head({ title: 'Page Not Found – TheFastDesigns', desc: 'The page you are looking for could not be found. Browse our free online design tools instead.', path: '/404' }).replace('index,follow', 'noindex')}${header()}<main id="main" class="wrap" style="text-align:center;padding:90px 20px"><span class="eyebrow">404</span><h1>Page not found</h1><p class="muted">The page you’re looking for doesn’t exist or has moved.</p><p><a class="btn" href="/">Go to all design tools</a></p></main>${footer()}</body></html>`);

// ---------- seo files ----------
const today = new Date().toISOString().slice(0, 10);
const urls = ['/', '/about/', '/privacy/', ...TOOLS.map(t => `/tools/${t.slug}/`)];
writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><priority>${u === '/' ? '1.0' : u.startsWith('/tools/') ? '0.8' : '0.4'}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(`${OUT}/site.webmanifest`, JSON.stringify({ name: BRAND, short_name: BRAND, start_url: '/', display: 'standalone', background_color: '#FAF7F2', theme_color: '#141414', icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }, { src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2));
writeFileSync(`${OUT}/_headers`, `/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`);

console.log(`Built ${TOOLS.length} tools → ${urls.length} pages in ./${OUT}`);
