import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Run after `pnpm build`. Checks generated HTML, not just Markdown frontmatter.
const root = process.argv[2] ?? (existsSync('.vercel/output/static/sitemap-index.xml') ? '.vercel/output/static' : 'dist');
const origin = 'https://www.devstoremx.xyz';
const decode = (value) => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attribute = (tag, name) => decode(tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] ?? '');
const pageFile = (pathname) => {
  const path = decodeURIComponent(pathname).replace(/^\/+/, '');
  return [join(root, path, 'index.html'), join(root, `${path}.html`)].find(existsSync);
};

try {
  assert.ok(existsSync(join(root, 'sitemap-index.xml')), 'Falta sitemap-index.xml. Ejecuta pnpm build primero.');
  const maps = readdirSync(root).filter((name) => /^sitemap.*\.xml$/.test(name));
  const urls = [...new Set(maps.flatMap((name) => [...readFileSync(join(root, name), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]))))].filter((url) => !url.endsWith('.xml'));
  assert.ok(urls.length > 0, 'Sitemap vacío.');
  const titles = new Map();
  const descriptions = new Map();
  const cache = new Map();
  let linksChecked = 0;
  function htmlAt(pathname) {
    if (!cache.has(pathname)) {
      const file = pageFile(pathname);
      assert.ok(file, `Falta HTML para ${pathname}`);
      cache.set(pathname, readFileSync(file, 'utf8'));
    }
    return cache.get(pathname);
  }
  for (const url of urls) {
    const parsed = new URL(url);
    assert.equal(parsed.origin, origin, `Origen no canónico: ${url}`);
    assert.ok(parsed.pathname === '/' || !parsed.pathname.endsWith('/'), `Barra final: ${url}`);
    const html = htmlAt(parsed.pathname);
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `H1 único: ${url}`);
    const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '');
    const metaTags = html.match(/<meta\b[^>]*>/g) ?? [];
    const description = attribute(metaTags.find((tag) => attribute(tag, 'name') === 'description') ?? '', 'content');
    const robots = attribute(metaTags.find((tag) => attribute(tag, 'name') === 'robots') ?? '', 'content');
    assert.doesNotMatch(robots, /noindex/i, `Noindex en sitemap: ${url}`);
    assert.ok(title && description, `Falta título o descripción: ${url}`);
    for (const [map, value, field] of [[titles, title, 'título'], [descriptions, description, 'descripción']]) {
      assert.ok(!map.has(value), `${field} duplicado: ${map.get(value)} y ${url}`);
      map.set(value, url);
    }
    const canonical = (html.match(/<link\b[^>]*>/g) ?? []).filter((tag) => attribute(tag, 'rel') === 'canonical');
    assert.equal(canonical.length, 1, `Canónica única: ${url}`);
    assert.equal(attribute(canonical[0], 'href'), url, `Canónica no coincide: ${url}`);
    const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    const nodes = schemas.flatMap((schema) => schema['@graph'] ?? [schema]);
    assert.ok(nodes.some((node) => node['@id'] === `${url}#webpage`), `Falta schema WebPage: ${url}`);
    for (const tag of html.match(/<a\b[^>]*>/g) ?? []) {
      const href = attribute(tag, 'href');
      if (!href || /^(?:mailto:|tel:|javascript:)/i.test(href)) continue;
      const target = new URL(href, url);
      if (target.origin !== origin) continue;
      const localFile = join(root, decodeURIComponent(target.pathname).replace(/^\/+/, ''));
      const targetPage = pageFile(target.pathname);
      assert.ok(targetPage || existsSync(localFile), `Enlace interno roto: ${url} → ${href}`);
      if (target.hash && targetPage) {
        const id = decodeURIComponent(target.hash.slice(1));
        const ids = [...htmlAt(target.pathname).matchAll(/\bid=["']([^"']+)["']/g)].map((match) => decode(match[1]));
        assert.ok(ids.includes(id), `Ancla inexistente: ${url} → ${href}`);
      }
      linksChecked++;
    }
  }
  for (const slug of ['cuanto-cuesta-una-pagina-web', 'cuanto-cuesta-una-tienda-en-shopify', 'cuanto-cuesta-hacer-una-app']) {
    assert.ok(urls.includes(`${origin}/blog/${slug}`), `Falta guía recuperada: ${slug}`);
    assert.doesNotMatch(htmlAt(`/blog/${slug}`), /http-equiv="refresh"/i, `La guía sigue redirigiendo: ${slug}`);
  }
  for (const pathname of ['/dashboard-cliente', '/llms.txt', '/llms-full.txt', '/rss.xml', '/404', '/portafolio']) {
    assert.ok(!urls.includes(`${origin}${pathname}`), `URL privada o auxiliar en sitemap: ${pathname}`);
  }
  console.log(`SEO OK: ${urls.length} URLs, títulos y descripciones únicos, canónicas, H1, JSON-LD y ${linksChecked} enlaces/anclas internos.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
