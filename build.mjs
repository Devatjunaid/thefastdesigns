// Static site generator for thefastdesigns.online — run: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { cpSync } from 'node:fs';
import { execSync } from 'node:child_process';
import * as SEO from './src/seo.mjs';
import { ICONS, LOGO } from './src/lib.mjs';
import { md, parseArticles } from './src/md.mjs';
import EXTRA from './src/extra.mjs';
import color from './src/tools/color.mjs';
import css from './src/tools/css.mjs';
import image from './src/tools/image.mjs';
import gen from './src/tools/gen.mjs';
import calc from './src/tools/calc.mjs';
import moreColorCss from './src/tools/more-color-css.mjs';
import moreImage from './src/tools/more-image.mjs';
import moreGenCalc from './src/tools/more-gen-calc.mjs';

const SCENES = createRequire(import.meta.url)('./scripts/scenes.cjs');
const SITE = 'https://thefastdesigns.online', BRAND = 'TheFastDesigns', OUT = 'public', EMAIL = 'elonopo@gmail.com';
const TOOLS = [...color, ...css, ...image, ...gen, ...calc, ...moreColorCss, ...moreImage, ...moreGenCalc];
const CATS = [
  { id: 'color', name: 'Color Tools', blurb: 'Convert, check, extract and generate colors and palettes.' },
  { id: 'css', name: 'CSS Generators', blurb: 'Visual editors that write clean, copy-ready CSS for you.' },
  { id: 'image', name: 'Image Tools', blurb: 'Resize, compress, convert and edit images privately in your browser.' },
  { id: 'gen', name: 'Typography & Generators', blurb: 'QR codes, type scales, text tools, textures and SVG shapes.' },
  { id: 'calc', name: 'Design Calculators', blurb: 'Ratios, units, resolution, paper sizes and grid maths for screen and print.' },
];
const catName = id => CATS.find(c => c.id === id).name;
const catUrl = id => `/${SEO.categories[id].slug}/`;
// ---------- SEO overrides ----------
const SRC = {}; [['color', color], ['css', css], ['image', image], ['gen', gen], ['calc', calc], ['more-color-css', moreColorCss], ['more-image', moreImage], ['more-gen-calc', moreGenCalc]].forEach(([f, list]) => list.forEach(t => SRC[t.slug] = `src/tools/${f}.mjs`));
for (const t of TOOLS) { const o = SEO.tools[t.slug]; if (!o) throw new Error('No SEO entry for tool ' + t.slug); Object.assign(t, { title: o.title, desc: o.desc, intro: o.intro, example: o.example, h1: o.h1 || t.name }); }
const gitDate = f => { try { return execSync(`git log -1 --format=%cs -- "${f}"`, { encoding: 'utf8' }).trim() || null; } catch { return null; } };
const toolBy = Object.fromEntries(TOOLS.map(t => [t.slug, t]));

// ---------- blog ----------
const ARTICLES = readdirSync('src/blog').filter(f => f.endsWith('.md')).sort().flatMap(f => parseArticles(readFileSync('src/blog/' + f, 'utf8')).map(a => (a.file = 'src/blog/' + f, a)));
ARTICLES.forEach(a => { const o = SEO.articles[a.slug]; if (!o) throw new Error('No SEO entry for article ' + a.slug); [a.seoTitle, a.desc, a.keywords] = o; a.tool = toolBy[a.tool]; if (!a.tool) throw new Error('Article without valid tool: ' + a.slug); a.cat = a.tool.cat; const r = md(a.body); a.html = r.html; a.toc = r.toc; a.words = a.body.split(/\s+/).filter(Boolean).length; a.mins = Math.max(3, Math.round(a.words / 220)); });
const articleFor = Object.fromEntries(ARTICLES.map(a => [a.tool.slug, a]));

// ---------- sanity checks ----------
const seen = { slug: new Set(), title: new Set(), desc: new Set() };
for (const x of [...TOOLS, ...ARTICLES]) for (const k of ['slug', 'title', 'desc']) { if (seen[k].has(x[k])) throw new Error(`Duplicate ${k}: ${x[k]}`); seen[k].add(x[k]); }
for (const t of TOOLS) { if (t.title.length > 60) console.warn(`! tool title ${t.title.length} chars: ${t.slug}`); if (t.desc.length > 160) console.warn(`! tool desc ${t.desc.length} chars: ${t.slug}`); }
for (const a of ARTICLES) { if (a.seoTitle.length > 60) console.warn(`! article title ${a.seoTitle.length} chars: ${a.slug}`); if (a.desc.length > 160) console.warn(`! article desc ${a.desc.length} chars: ${a.slug}`); }
for (const t of TOOLS) if (String(t.js).includes('</script') || String(t.pre || '').includes('</script')) throw new Error('Script tag inside tool JS: ' + t.slug);
const validPaths = new Set(['/', ...CATS.map(c => catUrl(c.id)), '/blog/', '/about/', '/privacy/', '/terms/', '/contact/', ...TOOLS.map(t => `/tools/${t.slug}/`), ...ARTICLES.map(a => `/blog/${a.slug}/`)]);
for (const a of ARTICLES) { for (const [, u] of a.body.matchAll(/\]\((\/[^)#\s]*)/g)) if (!validPaths.has(u)) console.warn(`! broken link in ${a.slug}: ${u}`); if (a.words < 900) console.warn(`! short article (${a.words} words): ${a.slug}`); }

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
if (existsSync('src/images')) cpSync('src/images', `${OUT}/images`, { recursive: true });
for (const f of ['apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'og-image.png']) if (existsSync(`src/assets/${f}`)) copyFileSync(`src/assets/${f}`, `${OUT}/${f}`);

// ---------- templates ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ld = o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const imgV = f => existsSync(f) ? '?v=' + hash(readFileSync(f)) : '';
const iu = (dir, name) => `/images/${dir}/${name}${imgV(`src/images/${dir}/${name}`)}`;
const alt = key => esc(SCENES[key] ? SCENES[key].alt : '');
const pic = (dir, key, { sizes = '(max-width: 860px) 100vw, 760px', eager = false, cls = '' } = {}) => existsSync(`src/images/${dir}/${key}.webp`) ? `<img${cls ? ` class="${cls}"` : ''} src="${iu(dir, key + '.webp')}" srcset="${iu(dir, key + '-640.webp')} 640w, ${iu(dir, key + '.webp')} 1200w" sizes="${sizes}" width="1200" height="630" alt="${alt(key)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">` : '';
const thumb = (key, { sizes = '(max-width: 700px) calc(100vw - 40px), 380px', eager = 0 } = {}) => existsSync(`src/images/blog/${key}-640.webp`) ? `<img src="${iu('blog', key + '-640.webp')}" srcset="${iu('blog', key + '-400.webp')} 400w, ${iu('blog', key + '-640.webp')} 640w" sizes="${sizes}" width="640" height="336" alt="${alt(key)}" ${eager ? (eager === 2 ? 'fetchpriority="high"' : 'loading="eager"') : 'loading="lazy"'} decoding="async">` : '';
const ogFor = key => existsSync(`src/images/blog/${key}-og.jpg`) ? `${SITE}/images/blog/${key}-og.jpg` : null;
const fullTitle = t => (t.length + BRAND.length + 3 <= 60 ? `${t} | ${BRAND}` : t);
const fmtDate = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

function head({ title, desc, path, kw = [], schema = [], type = 'website', image = null }) {
  const url = SITE + path;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">${kw.length ? `\n<meta name="keywords" content="${esc(kw.join(', '))}">` : ''}
<link rel="canonical" href="${url}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="${type}"><meta property="og:site_name" content="${BRAND}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${image || SITE + '/og-image.png'}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${image || SITE + '/og-image.png'}">
<meta name="theme-color" content="#141414"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<style>${minCss}</style>
${schema.map(ld).join('\n')}
</head><body><a class="skip" href="#main">Skip to content</a>`;
}
const NAV = [[catUrl('color'), 'Color'], [catUrl('css'), 'CSS'], [catUrl('image'), 'Image'], [catUrl('gen'), 'Generators'], [catUrl('calc'), 'Calculators'], ['/blog/', 'Blog'], ['/contact/', 'Contact']];
const header = () => `<header class="site"><div class="wrap nav"><a class="brand" href="/" aria-label="${BRAND} home">${LOGO}<span>TheFast<em>Designs</em></span></a>
<button class="menu-btn" aria-label="Open menu" aria-expanded="false"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
<nav aria-label="Main"><ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></nav></div></header>`;
const footer = () => `<footer class="site"><div class="wrap"><div class="foot-grid"><div><a class="brand" href="/">${LOGO}<span>TheFast<em>Designs</em></span></a><p>${TOOLS.length} free design tools that run entirely in your browser. No sign-up, no uploads, no limits.</p></div>
<div><h2 class="fh">Popular tools</h2><ul>${['color-palette-generator', 'image-compressor', 'qr-code-generator', 'contrast-checker', 'css-gradient-generator', 'image-resizer', 'favicon-generator'].map(s => toolBy[s]).map(t => `<li><a href="/tools/${t.slug}/">${t.name}</a></li>`).join('')}</ul></div>
<div><h2 class="fh">Categories</h2><ul>${CATS.map(c => `<li><a href="${catUrl(c.id)}">${c.name}</a></li>`).join('')}<li><a href="/blog/">Design blog</a></li></ul></div>
<div><h2 class="fh">${BRAND}</h2><ul><li><a href="/about/">About</a></li><li><a href="/contact/">Contact</a></li><li><a href="/privacy/">Privacy policy</a></li><li><a href="/terms/">Terms &amp; conditions</a></li><li><a href="/sitemap.xml">Sitemap</a></li></ul></div></div>
<div class="foot-bottom"><span>© ${new Date().getFullYear()} ${BRAND} · All tools are free to use.</span><span><a href="mailto:${EMAIL}">${EMAIL}</a></span></div></div></footer>
<script src="/assets/app.js?v=${V.js}" defer></script>`;

const card = t => `<a class="tool-card" href="/tools/${t.slug}/" data-k="${esc([t.name, t.short, ...t.kw].join(' ').toLowerCase())}"><span class="ic">${ICONS[t.cat]}</span><h3>${t.name}</h3><p>${t.short}</p><span class="go">Use tool →</span></a>`;
const postCard = (a, i = 99, eagerN = 0) => `<a class="post-card" href="/blog/${a.slug}/" data-cat="${a.cat}">${thumb(a.slug, { eager: i < eagerN ? (i === 0 ? 2 : 1) : 0 })}<span class="post-cat">${catName(a.cat)}</span><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p><span class="post-meta">${a.mins} min read</span></a>`;
const faqHtml = list => list.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
const faqLd = list => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const crumbLd = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + item })) });
const write = (path, html) => { const dir = OUT + path; mkdirSync(dir, { recursive: true }); writeFileSync(dir + 'index.html', html.replace(/\n\s*\n/g, '\n')); };
const sideList = (title, list) => `<div class="side-box"><h3>${title}</h3><ul>${list.map(r => `<li><a href="/tools/${r.slug}/"><span class="ic">${ICONS[r.cat]}</span>${r.name}</a></li>`).join('')}</ul></div>`;

// ---------- tool pages ----------
for (const t of TOOLS) {
  const path = `/tools/${t.slug}/`, same = TOOLS.filter(x => x.cat === t.cat && x !== t), k = TOOLS.indexOf(t);
  const related = same.slice(k % Math.max(1, same.length - 5), k % Math.max(1, same.length - 5) + 6);
  const others = TOOLS.filter(x => x.cat !== t.cat).filter((_, i) => (i * 7 + k * 3) % 13 < 2).slice(0, 4);
  const tips = t.tips || EXTRA[t.slug] || [], art = articleFor[t.slug];
  const schema = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: t.name, url: SITE + path, description: t.desc, applicationCategory: 'DesignApplication', operatingSystem: 'Any (web browser)', browserRequirements: 'Requires JavaScript', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@type': 'Organization', name: BRAND, url: SITE } },
    crumbLd([['Home', '/'], [catName(t.cat), catUrl(t.cat)], [t.name, path]]),
    faqLd(t.faq),
  ];
  write(path, `${head({ title: fullTitle(t.title), desc: t.desc, path, kw: t.kw, schema, image: art ? ogFor(art.slug) : null })}${header()}
<main id="main" class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="${catUrl(t.cat)}">${catName(t.cat)}</a> › <span>${t.name}</span></nav>
<div class="tool-head"><h1>${t.h1}</h1><p>${t.intro}</p><div class="tags"><span>100% free</span><span>No sign-up</span><span>Works offline</span><span>Runs in your browser</span></div></div>
<section class="tool-box" aria-label="${esc(t.name)}">${t.html.replace(/<h3(\s|>)/g, '<h2 class="ph"$1').replace(/<\/h3>/g, '</h2>')}</section>
<div class="content"><article class="prose"><h2>How to use the ${t.name}</h2><ol class="howto">${t.how.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
<h2>About this ${t.name.toLowerCase()}</h2>${t.about}
${t.example || ''}
${tips.length ? `<h2>Tips and best practices</h2><ul class="tips">${tips.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
${art ? `<div class="guide-box with-img"><a href="/blog/${art.slug}/" class="gb-img" tabindex="-1">${thumb(art.slug, { sizes: '(max-width: 600px) calc(100vw - 80px), 220px' })}</a><div><span class="post-cat">In-depth guide</span><h3><a href="/blog/${art.slug}/">${esc(art.title)}</a></h3><p>${esc(art.desc)}</p><a class="btn-alt" href="/blog/${art.slug}/">Read the guide (${art.mins} min)</a></div></div>` : ''}
<h2>Frequently asked questions</h2><div class="faq">${faqHtml(t.faq)}</div></article>
<aside class="side"><div class="side-box"><div class="privacy-pill">${ICONS.shield}<span><b>Private by design.</b> This tool processes everything on your device. Nothing is uploaded or stored.</span></div></div>
${sideList(`More ${catName(t.cat).toLowerCase()}`, related)}${sideList('You might also like', others)}</aside></div></main>
${footer()}<script>document.addEventListener('DOMContentLoaded',()=>{${t.pre || ''}(${t.js.toString()})();});</script></body></html>`);
}

// ---------- blog ----------
const blogDesc = `Practical guides on color, CSS, images, typography and print design: ${ARTICLES.length} in-depth articles with comparisons, real numbers and step-by-step advice.`;
write('/blog/', `${head({ title: 'Design Blog: Color, CSS, Image & Typography Guides', desc: blogDesc, path: '/blog/', schema: [{ '@context': 'https://schema.org', '@type': 'Blog', name: `${BRAND} Blog`, url: SITE + '/blog/', description: blogDesc }, crumbLd([['Home', '/'], ['Blog', '/blog/']])] })}${header()}
<main id="main" class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <span>Blog</span></nav>
<div class="tool-head"><span class="eyebrow">Design blog</span><h1>Guides for designers who like to know why</h1><p>Plain-language explanations of the formats, standards and numbers behind everyday design work, each paired with a free tool so you can try it straight away.</p></div>
<div class="seg" id="blogFilter"><button type="button" class="on" data-f="all">All</button>${CATS.map(c => `<button type="button" data-f="${c.id}">${c.name.replace('Typography & ', '').replace('Design ', '')}</button>`).join('')}</div>
<h2 style="font-size:1.35rem;margin:0 0 16px">All ${ARTICLES.length} guides</h2><div class="post-grid" id="posts">${ARTICLES.map((a, i) => postCard(a, i, 3)).join('')}</div></main>
${footer()}<script>document.getElementById('blogFilter').addEventListener('click',e=>{const f=e.target.dataset.f;if(!f)return;document.querySelectorAll('#blogFilter button').forEach(b=>b.classList.toggle('on',b===e.target));document.querySelectorAll('#posts .post-card').forEach(c=>c.hidden=f!=='all'&&c.dataset.cat!==f)});</script></body></html>`);

for (const a of ARTICLES) {
  const ca = ARTICLES.filter(x => x.cat === a.cat), ix = ca.indexOf(a), pickRel = offs => [...new Set(offs.map(k => ca[(ix + k) % ca.length]))].filter(x => x !== a);
  const related = pickRel([1, 2, 3]), more = pickRel([4, 5, 6, 7]);
  const path = `/blog/${a.slug}/`, date = a.date || '2026-11-08';
  const schema = [{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.desc, datePublished: date, dateModified: date, wordCount: a.words, mainEntityOfPage: SITE + path, image: { '@type': 'ImageObject', url: ogFor(a.slug) || SITE + '/og-image.png', width: 1200, height: 630 }, author: { '@type': 'Organization', name: `${BRAND} Editorial`, url: SITE + '/about/' }, publisher: { '@type': 'Organization', name: BRAND, logo: { '@type': 'ImageObject', url: SITE + '/icon-512.png' } } }, crumbLd([['Home', '/'], ['Blog', '/blog/'], [a.title, path]])];
  write(path, `${head({ title: fullTitle(a.seoTitle), desc: a.desc, path, kw: (a.keywords || '').split(',').map(s => s.trim()).filter(Boolean), schema, type: 'article', image: ogFor(a.slug) })}${header()}
<main id="main" class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/blog/">Blog</a> › <a href="${catUrl(a.cat)}">${catName(a.cat)}</a></nav>
<div class="content article"><article class="prose"><header class="post-head"><span class="post-cat">${catName(a.cat)}</span><h1>${esc(a.title)}</h1><p class="lead">${esc(a.desc)}</p><p class="post-meta">By ${BRAND} Editorial · ${fmtDate(date)} · ${a.mins} min read</p></header>
${pic('blog', a.slug, { eager: true, cls: 'hero-img' })}
${a.toc.length > 2 ? `<nav class="toc" aria-label="Contents"><b>In this guide</b><ol>${a.toc.map(h => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></nav>` : ''}
${a.html}
${related.length ? `<h2>Related guides</h2><ul class="tips">${related.map(x => `<li><a href="/blog/${x.slug}/">${esc(x.title)}</a></li>`).join('')}</ul>` : ''}
<div class="guide-box"><span class="post-cat">Free tool</span><h3><a href="/tools/${a.tool.slug}/">${a.tool.name}</a></h3><p>${a.tool.short} Runs in your browser, nothing is uploaded.</p><a class="btn" href="/tools/${a.tool.slug}/">Open the ${a.tool.name}</a></div></article>
<aside class="side"><div class="side-box"><h3>Try the tool</h3><p class="note" style="margin:0 0 12px">${a.tool.short}</p><a class="btn" style="width:100%" href="/tools/${a.tool.slug}/">${a.tool.name}</a></div>
${more.length ? `<div class="side-box"><h3>More guides</h3><ul>${more.map(x => `<li><a href="/blog/${x.slug}/">${esc(x.title)}</a></li>`).join('')}</ul></div>` : ''}</aside></div></main>
${footer()}</body></html>`);
}

// ---------- category pages ----------
for (const c of CATS) {
  const m = SEO.categories[c.id], path = catUrl(c.id), list = TOOLS.filter(t => t.cat === c.id), guides = ARTICLES.filter(a => a.cat === c.id);
  const schema = [crumbLd([['Home', '/'], [c.name, path]]), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: m.h1, url: SITE + path, description: m.desc, mainEntity: { '@type': 'ItemList', itemListElement: list.map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/tools/${t.slug}/`, name: t.name })) } }];
  write(path, `${head({ title: m.title, desc: m.desc, path, schema })}${header()}
<main id="main" class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <span>${c.name}</span></nav>
<div class="tool-head"><span class="eyebrow">${list.length} free tools</span><h1>${m.h1}</h1>${m.intro}</div>
<h2 style="font-size:1.35rem;margin:0 0 16px">All ${c.name.toLowerCase()}</h2><div class="tool-grid" style="margin-bottom:56px">${list.map(card).join('')}</div>
<section style="margin-bottom:56px"><h2>Guides for ${c.name.toLowerCase()}</h2><div class="post-grid">${guides.map(a => postCard(a)).join('')}</div></section></main>
${footer()}</body></html>`);
}

// ---------- home ----------
const homeFaq = [
  ['Are the tools on TheFastDesigns really free?', 'Yes. Every tool is completely free with no sign-up, no watermarks, no daily limits and no premium tier.'],
  ['Do you upload my images or files?', 'No. All tools run locally in your web browser using JavaScript and the HTML canvas. Your images, colors and text never leave your device.'],
  ['Do the tools work offline?', 'Once a tool page has loaded, it keeps working without an internet connection because there are no server calls or third-party APIs.'],
  ['Can I use the results in commercial projects?', 'Yes. Everything you create (palettes, CSS code, images, QR codes, SVG shapes and icons) is yours to use in personal and commercial work.'],
  ['Which browsers are supported?', 'All modern browsers: Chrome, Edge, Firefox, Safari and their mobile versions. The tools are fully responsive and work on phones and tablets.'],
  ['Why are the tools so fast?', 'Each page is a lightweight static file with no frameworks, trackers or external scripts, and processing happens instantly on your own device.'],
];
const homeDesc = `${TOOLS.length} free design tools that run in your browser: QR codes, color palettes, contrast checker, CSS generators, image resizer and compressor. No sign-up.`;
write('/', `${head({
  title: 'Free Online Design Tools & Generators | TheFastDesigns', desc: homeDesc, path: '/', kw: ['free design tools', 'online design tools', 'color palette generator', 'css generator', 'image tools', 'design calculators'],
  schema: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: SITE + '/', description: homeDesc }, { '@context': 'https://schema.org', '@type': 'Organization', name: BRAND, url: SITE, logo: SITE + '/assets/logo.svg', email: EMAIL }, { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Free design tools', itemListElement: TOOLS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/tools/${t.slug}/`, name: t.name })) }, faqLd(homeFaq)],
})}${header()}
<main id="main"><section class="hero"><div class="wrap"><span class="eyebrow">${TOOLS.length} free tools · no sign-up</span>
<h1>Free online design tools that are <span>fast &amp; private</span></h1>
<p class="lead">Color palettes, CSS generators, image editing, QR codes and design calculators. Everything runs instantly in your browser. No uploads, no accounts, no limits.</p>
<div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" id="toolSearch" placeholder="Search tools… e.g. gradient, compress, QR" aria-label="Search design tools" autocomplete="off"></div>
<div class="btn-row" style="justify-content:center"><a class="btn" href="#tools">Browse all tools</a><a class="btn-alt" href="/blog/">Read the guides</a></div>
<div class="stats"><div><b>${TOOLS.length}</b><span>Design tools</span></div><div><b>0</b><span>Files uploaded</span></div><div><b>${ARTICLES.length}</b><span>In-depth guides</span></div><div><b>&lt;1s</b><span>Page load</span></div></div></div></section>
<section class="block" id="tools" style="border-top:0;padding-top:24px"><div class="wrap"><p id="noResults" class="note" style="text-align:center;font-size:16px" hidden>No tools match your search. Try “color”, “image” or “css”.</p>
${CATS.map(c => `<div class="cat-section" id="${c.id}"><div class="cat-title"><span class="ic">${ICONS[c.id]}</span><div><h2><a href="${catUrl(c.id)}">${c.name}</a></h2><p>${c.blurb}</p></div><a class="btn-sm" style="margin-left:auto" href="${catUrl(c.id)}">View all</a></div><div class="tool-grid">${TOOLS.filter(t => t.cat === c.id).map(card).join('')}</div></div>`).join('')}
</div></section>
<section class="block" id="benefits"><div class="wrap"><div class="sec-head"><span class="eyebrow">Why TheFastDesigns</span><h2>Built for speed, privacy and everyday design work</h2><p>We built the toolbox we wanted ourselves: no clutter, no pop-ups and no waiting for uploads.</p></div>
<div class="features">${[
  ['bolt', 'Instant results', 'Tools respond as you type or drag a slider. There is no server round-trip, so results appear in milliseconds.'],
  ['lock', 'Completely private', 'Your images and data are processed on your own device. Nothing is uploaded, logged or stored on any server.'],
  ['free', 'Free with no limits', 'No accounts, no watermarks, no file caps and no paywalls. Use every tool as often as you like.'],
  ['wifi', 'Works offline', 'No third-party APIs or cloud services. Once a page loads, the tool keeps working even without internet.'],
  ['layers', 'Copy-ready output', 'Get clean CSS, HEX codes, SVG markup and optimized image files that you can paste straight into your project.'],
  ['user', 'Made for everyone', 'Designers, developers, marketers, students and small businesses. Simple enough for beginners and fast enough for pros.'],
].map(([i, h, p]) => `<div class="feature"><span class="ic">${ICONS[i]}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}</div></div></section>
<section class="block" id="how-it-works"><div class="wrap"><div class="sec-head"><span class="eyebrow">How it works</span><h2>Three steps, zero friction</h2><p>Every tool follows the same simple pattern, so once you’ve used one you know them all.</p></div>
<ol class="steps"><li><h3>Pick a tool</h3><p>Browse the categories above or search for what you need: palettes, gradients, image resizing, QR codes, unit conversion and more.</p></li><li><h3>Add your input</h3><p>Drop an image, choose a color or adjust the sliders. A live preview shows the result instantly as you work.</p></li><li><h3>Copy or download</h3><p>Copy the generated code or values with one click, or download your finished files in the format you need.</p></li></ol>
<div class="split" style="margin-top:48px"><div><h2>Browser-based technology, no cloud required</h2><p class="muted">Each tool uses standard web technologies built into your browser: the Canvas API for images, native color parsing for colors and plain JavaScript for calculations. That’s why the tools are fast, reliable and safe to use with client work or confidential files.</p><ul class="checklist" style="margin:0 0 24px"><li>Images are edited with the HTML5 Canvas on your device</li><li>No external scripts, trackers, fonts or APIs</li><li>Lightweight static pages that load in under a second</li><li>Responsive design for desktop, tablet and phone</li><li>Accessible, keyboard-friendly controls</li></ul><a class="btn" href="#tools">Start designing</a></div>
<div>${pic('pages', 'home-toolbox', { sizes: '(max-width: 820px) 100vw, 560px', cls: 'hero-img' })}</div></div></section>
<section class="block" id="guides"><div class="wrap"><div class="sec-head"><span class="eyebrow">From the blog</span><h2>Learn the why behind the tools</h2><p>Short, practical guides with real numbers: file formats compared, accessibility rules explained, and print sizes demystified.</p></div>
<div class="post-grid">${[0, 9, 20, 41, 52, 60].map(i => ARTICLES[i % ARTICLES.length]).filter((a, i, arr) => a && arr.indexOf(a) === i).map(a => postCard(a)).join('')}</div><p style="margin-top:20px"><a class="btn-alt" href="/blog/">All ${ARTICLES.length} guides</a></p></div></section>
<section class="block" id="who"><div class="wrap"><div class="dark-band"><div class="split"><div><h2>One toolbox for every creative workflow</h2><p>Web designers build palettes and check contrast. Developers grab CSS for gradients, shadows, grids and fluid type. Marketers resize and compress images for social media. Print designers convert units and calculate DPI. All in one place, all free.</p><a class="btn" href="#tools">Explore the tools</a></div>
<ul class="checklist" style="color:#F5EFE4">${['UI & web designers', 'Front-end developers', 'Social media managers & marketers', 'Print & graphic designers', 'Students & educators', 'Bloggers & small businesses'].map(x => `<li style="border-color:#2E2B27">${x}</li>`).join('')}</ul></div></div></div></section>
<section class="block" id="faq"><div class="wrap" style="max-width:860px"><div class="sec-head"><span class="eyebrow">FAQ</span><h2>Frequently asked questions</h2></div><div class="faq">${faqHtml(homeFaq)}</div></div></section></main>
${footer()}</body></html>`);

// ---------- static pages ----------
const page = (path, title, desc, body, extra = '') => write(path, `${head({ title, desc, path, schema: [crumbLd([['Home', '/'], [title.split(' –')[0], path]])] })}${header()}<main id="main" class="wrap" style="max-width:820px;padding-top:48px;padding-bottom:64px"><article class="prose">${body}</article></main>${footer()}${extra}</body></html>`);
const updated = 'November 8, 2026';
page('/about/', 'About TheFastDesigns – Free Browser-Based Design Tools', 'Learn about TheFastDesigns, a free collection of fast, private, browser-based design tools for colors, CSS, images, typography and design calculations.',
  `<span class="eyebrow">About</span><h1>Design tools that respect your time and privacy</h1>${pic('pages', 'about-studio', { eager: true, cls: 'hero-img' })}<p>${BRAND} is a collection of ${TOOLS.length} free design tools and ${ARTICLES.length} in-depth guides: color utilities, CSS generators, image editors, typography helpers, QR codes and design calculators. The goal is simple: give designers, developers and creators the small everyday utilities they reach for constantly, without sign-ups, intrusive ads or uploads to unknown servers.</p><h2>How we’re different</h2><ul><li><strong>Everything runs in your browser.</strong> No cloud processing and no third-party APIs.</li><li><strong>Fast by default.</strong> Lightweight static pages with no frameworks or tracking scripts.</li><li><strong>Free forever.</strong> No paywalls, no watermarks and no usage limits.</li><li><strong>Explained, not just provided.</strong> Every tool links to a guide that explains the standards and numbers behind it.</li></ul><h2>Our tools</h2><ul>${CATS.map(c => `<li><a href="/#${c.id}">${c.name}</a>: ${c.blurb}</li>`).join('')}</ul><h2>Get in touch</h2><p>Suggestions for new tools, bug reports and feedback are welcome at <a href="mailto:${EMAIL}">${EMAIL}</a>.</p><p><a class="btn" href="/#tools">Browse all tools</a></p>`);
page('/contact/', 'Contact TheFastDesigns – Feedback and Tool Requests', 'Contact TheFastDesigns by email for feedback, bug reports, tool suggestions or partnership questions. We read every message.',
  `<span class="eyebrow">Contact</span><h1>Contact us</h1><p>Found a bug, have an idea for a new tool, or want to suggest an improvement to a guide? Email us and we’ll get back to you.</p>
<div class="guide-box" style="margin:24px 0"><span class="post-cat">Email</span><p style="font-size:1.25rem;font-weight:700;margin:8px 0"><a href="mailto:${EMAIL}">${EMAIL}</a></p><p>Best for bug reports, tool requests, corrections and general questions.</p><button type="button" class="btn-alt" data-copy="${EMAIL}">Copy email address</button></div>
<h2>Write your message</h2><p class="note">This form opens your own email app with the message filled in. Nothing is sent through our servers.</p>
<form id="cf" class="tool-box" style="box-shadow:none;padding:20px"><label class="f"><span>Your name</span><input type="text" id="cfN" required autocomplete="name"></label><label class="f"><span>Topic</span><select id="cfT"><option>Bug report</option><option>Tool suggestion</option><option>Feedback</option><option>Content correction</option><option>Other</option></select></label><label class="f"><span>Message</span><textarea id="cfM" class="prose" rows="6" required></textarea></label><button class="btn" type="submit">Open in email app</button></form>
<h2>When reporting a bug</h2><ul><li>Tell us which tool and what you expected to happen.</li><li>Include your browser and device. The <a href="/tools/screen-resolution-checker/">screen resolution checker</a> can copy these details for you.</li><li>If a file caused the problem, describe it (format and size). Please don’t send private images.</li></ul>`,
  `<script>document.getElementById('cf').addEventListener('submit',e=>{e.preventDefault();const n=document.getElementById('cfN').value,t=document.getElementById('cfT').value,m=document.getElementById('cfM').value;location.href='mailto:${EMAIL}?subject='+encodeURIComponent('[${BRAND}] '+t)+'&body='+encodeURIComponent(m+'\\n\\n— '+n)})</script>`);
page('/privacy/', 'Privacy Policy – TheFastDesigns', 'Read the TheFastDesigns privacy policy. Our design tools run entirely in your browser: we do not upload, collect or store your images, files or personal data.',
  `<span class="eyebrow">Privacy</span><h1>Privacy policy</h1><p class="note">Last updated: ${updated}</p><p>This policy explains what information ${BRAND} (${SITE.replace('https://', '')}) handles when you use the website. The short version: our tools run on your device, and we don’t collect personal data through them.</p>
<h2>1. Files and data you use in the tools</h2><p>All tools process images, colors, text and other input locally in your web browser using JavaScript. Files you select, drop or paste are never uploaded to our servers or sent to any third party. When you close or reload the page, that data is gone. Files you download are created by your browser on your device.</p>
<h2>2. Information we do not collect</h2><p>We do not require an account, and we do not ask for or collect names, email addresses, phone numbers, payment details or similar personal information through the tools. We do not use advertising cookies, analytics trackers or social media pixels.</p>
<h2>3. Server logs</h2><p>Like every website, our pages are delivered by a hosting provider (Cloudflare). To deliver pages securely and protect against abuse, the provider may automatically process technical data such as IP address, browser type, requested page and time of the request. This data is handled under Cloudflare’s own privacy policy, and we do not use it to identify individual visitors.</p>
<h2>4. Cookies and local storage</h2><p>The website does not set cookies for tracking. The tools don’t store your work in your browser. Your hosting provider may set strictly necessary security cookies.</p>
<h2>5. Emails you send us</h2><p>If you email us at <a href="mailto:${EMAIL}">${EMAIL}</a>, we receive your email address and the content of your message. We use it only to reply to you and to improve the website, we don’t add you to any mailing list, and we delete correspondence when it’s no longer needed. You can ask us to delete your messages at any time.</p>
<h2>6. External links</h2><p>Some pages link to other websites (for example a map link in the EXIF viewer, which you choose to open). Those sites have their own privacy policies, which we don’t control.</p>
<h2>7. Children</h2><p>The website is a general design resource and does not knowingly collect any information from children.</p>
<h2>8. Your rights</h2><p>Because we don’t collect personal data through the tools, there is normally nothing to access, correct or delete. If you have emailed us, you can request a copy or deletion of that correspondence by writing to <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
<h2>9. Changes to this policy</h2><p>If we change how the website handles information, we’ll update this page and the “last updated” date above.</p>
<h2>10. Contact</h2><p>Questions about this policy: <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`);
page('/terms/', 'Terms and Conditions – TheFastDesigns', 'Terms and conditions for using TheFastDesigns free design tools and guides, including acceptable use, ownership of your output and liability.',
  `<span class="eyebrow">Terms</span><h1>Terms and conditions</h1><p class="note">Last updated: ${updated}</p><p>By using ${BRAND} (${SITE.replace('https://', '')}), you agree to these terms. If you don’t agree, please don’t use the website.</p>
<h2>1. The service</h2><p>${BRAND} provides free, browser-based design tools and informational articles. The tools run on your device; we don’t host, store or review the files you process.</p>
<h2>2. Your content and output</h2><p>You keep all rights to the files and data you use with the tools. Everything you create with the tools (for example images, CSS code, palettes, QR codes and SVG files) belongs to you, and you may use it for personal and commercial purposes without attribution.</p>
<h2>3. Acceptable use</h2><p>You agree to use the tools lawfully. You are responsible for having the right to use any images or content you process, and for how you use the results. Don’t attempt to disrupt, overload or attack the website or its hosting infrastructure, or to copy and republish the website’s tools or articles as your own.</p>
<h2>4. Our content</h2><p>The website design, code, logo, tool interfaces and articles are owned by ${BRAND}. You may quote short excerpts of our articles with a link to the source. Republishing whole articles or copying the site requires written permission.</p>
<h2>5. No warranty</h2><p>The tools and articles are provided “as is” and “as available”, free of charge. We work hard to make them accurate, but we don’t guarantee that results are error-free or suitable for a specific purpose. Always check critical output, such as print dimensions, color values for print production, accessibility results or QR codes, before relying on it. Articles are general information, not professional advice.</p>
<h2>6. Limitation of liability</h2><p>To the extent permitted by law, ${BRAND} is not liable for any indirect, incidental or consequential damages, or for loss of data, profits or business, arising from your use of the website. Because files are processed on your device, keep your own backups of original files.</p>
<h2>7. Third-party links</h2><p>Articles may link to other websites for reference. We aren’t responsible for their content or practices.</p>
<h2>8. Changes</h2><p>We may add, change or remove tools and update these terms. The current version is always published on this page with its “last updated” date.</p>
<h2>9. Contact</h2><p>Questions about these terms: <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`);
writeFileSync(`${OUT}/404.html`, `${head({ title: 'Page Not Found – TheFastDesigns', desc: 'The page you are looking for could not be found. Browse our free online design tools instead.', path: '/404' }).replace('index,follow', 'noindex')}${header()}<main id="main" class="wrap" style="text-align:center;padding:90px 20px"><span class="eyebrow">404</span><h1>Page not found</h1><p class="muted">The page you’re looking for doesn’t exist or has moved.</p><p><a class="btn" href="/">Go to all design tools</a></p></main>${footer()}</body></html>`);

// ---------- seo files ----------
const today = new Date().toISOString().slice(0, 10);
const urls = [...validPaths];
const newest = ds => ds.filter(Boolean).sort().pop() || today;
const lastmod = u => { if (u.startsWith('/tools/')) { const t = toolBy[u.split('/')[2]]; return newest([gitDate(SRC[t.slug]), gitDate('src/seo.mjs'), gitDate('src/extra.mjs')]); }
  const a = ARTICLES.find(x => u === `/blog/${x.slug}/`); if (a) return newest([gitDate(a.file), gitDate('src/seo.mjs')]);
  return newest([gitDate('build.mjs'), gitDate('src/seo.mjs')]); };
writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${lastmod(u)}</lastmod><priority>${u === '/' ? '1.0' : u.startsWith('/tools/') ? '0.8' : u.startsWith('/blog/') ? '0.7' : '0.4'}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(`${OUT}/site.webmanifest`, JSON.stringify({ name: BRAND, short_name: BRAND, start_url: '/', display: 'standalone', background_color: '#FAF7F2', theme_color: '#141414', icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }, { src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2));
writeFileSync(`${OUT}/_headers`, `/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/images/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`);

const totalWords = ARTICLES.reduce((s, a) => s + a.words, 0);
console.log(`Built ${TOOLS.length} tools, ${ARTICLES.length} articles (${totalWords} words) → ${urls.length} pages in ./${OUT}`);
