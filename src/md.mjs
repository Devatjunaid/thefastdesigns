// Tiny Markdown → HTML converter for blog articles (build-time only).
// Supports: ## / ### headings, paragraphs, - and 1. lists, tables, > quotes, **bold**, *italic*, `code`, [links](url).
const escHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const slugify = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(`<code>${escHtml(c)}</code>`); return `\u0000${codes.length - 1}\u0000`; });
  s = escHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${u}"${/^https?:/.test(u) ? ' rel="noopener" target="_blank"' : ''}>${t}</a>`);
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[i]);
}

export function md(src) {
  const lines = src.replace(/\r/g, '').split('\n'), out = [], toc = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if (/^```/.test(l)) { const c = []; i++; while (i < lines.length && !/^```/.test(lines[i])) c.push(lines[i++]); i++; out.push(`<div class="code"><pre><code>${escHtml(c.join('\n'))}</code></pre></div>`); continue; }
    if ((m = l.match(/^(#{2,4})\s+(.*)$/))) { const lv = m[1].length, txt = inline(m[2]), id = slugify(m[2]); if (lv === 2) toc.push({ id, text: m[2].replace(/[*`]/g, '') }); out.push(`<h${lv} id="${id}">${txt}</h${lv}>`); i++; continue; }
    if (/^\|/.test(l)) {
      const rows = []; while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = r => r.replace(/^\||\|\s*$/g, '').split('|').map(c => inline(c.trim()));
      const head = cells(rows[0]), body = rows.slice(2).map(cells);
      out.push(`<div class="scroll-x"><table class="table"><thead><tr>${head.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${body.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue;
    }
    if (/^>\s?/.test(l)) { const q = []; while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, '')); out.push(`<blockquote><p>${inline(q.join(' '))}</p></blockquote>`); continue; }
    if (/^[-*]\s+/.test(l) || /^\d+\.\s+/.test(l)) {
      const ordered = /^\d+\./.test(l), items = [];
      while (i < lines.length && (ordered ? /^\d+\.\s+/ : /^[-*]\s+/).test(lines[i])) { let it = lines[i++].replace(/^([-*]|\d+\.)\s+/, ''); while (i < lines.length && /^\s{2,}\S/.test(lines[i])) it += ' ' + lines[i++].trim(); items.push(`<li>${inline(it)}</li>`); }
      out.push(ordered ? `<ol>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`); continue;
    }
    const p = []; while (i < lines.length && lines[i].trim() && !/^(#{2,4}\s|\||>|[-*]\s|\d+\.\s|```)/.test(lines[i])) p.push(lines[i++].trim());
    out.push(`<p>${inline(p.join(' '))}</p>`);
  }
  return { html: out.join('\n'), toc };
}

export function parseArticles(text) {
  return text.split(/^@@@\s*$/m).map(s => s.trim()).filter(Boolean).map(chunk => {
    const [head, ...body] = chunk.split(/^###\s*$/m), meta = {};
    head.trim().split('\n').forEach(l => { const k = l.indexOf(':'); if (k > 0) meta[l.slice(0, k).trim()] = l.slice(k + 1).trim(); });
    meta.body = body.join('###').trim();
    return meta;
  });
}
