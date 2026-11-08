// Edge redirects for thefastdesigns.online, then serve the static site.
// - http:// → https:// (301)
// - www.thefastdesigns.online → thefastdesigns.online (301)
// - /tools/x → /tools/x/ (301, only when that page exists)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    if ((url.protocol === 'http:' && !local) || url.hostname.startsWith('www.')) {
      url.protocol = 'https:';
      url.hostname = url.hostname.replace(/^www\./, '');
      return Response.redirect(url.toString(), 301);
    }
    if ((request.method === 'GET' || request.method === 'HEAD') && !url.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(url.pathname)) {
      const withSlash = new URL(url); withSlash.pathname += '/';
      const probe = await env.ASSETS.fetch(new Request(withSlash, { method: 'HEAD' }));
      if (probe.status === 200) return Response.redirect(withSlash.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
