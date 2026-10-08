import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { defaultTitle, services } from '../src/data/landing.ts';
import { buildStructuredGraph } from '../src/lib/structured-data.ts';
import { canonicalPathname, isIndexableUrl, portfolioIsPublic } from '../src/lib/seo.ts';

const origin = 'https://www.devstoremx.xyz';

function words(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[#>*_~`|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function splitFrontmatter(file) {
  const raw = readFileSync(file, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, `frontmatter en ${file}`);
  return { raw, fm: match[1], body: match[2] };
}

test('canonicalPathname quita .html y la barra final', () => {
  assert.equal(canonicalPathname('/shopify.html'), '/shopify');
  assert.equal(canonicalPathname('/shopify/'), '/shopify');
  assert.equal(canonicalPathname('/index.html'), '/');
  assert.equal(canonicalPathname('/blog/index.html'), '/blog');
  assert.equal(canonicalPathname('/'), '/');
  assert.equal(canonicalPathname('/blog/como-hacer-una-pagina-web.html'), '/blog/como-hacer-una-pagina-web');
});

test('el sitemap no debe incluir dashboard, portafolio vacío ni archivos de texto', () => {
  assert.equal(portfolioIsPublic(), false);
  assert.equal(isIndexableUrl(`${origin}/dashboard-cliente`), false);
  assert.equal(isIndexableUrl(`${origin}/dashboard-cliente/`), false);
  assert.equal(isIndexableUrl(`${origin}/portafolio`), false);
  assert.equal(isIndexableUrl(`${origin}/llms.txt`), false);
  assert.equal(isIndexableUrl(`${origin}/llms-full.txt`), false);
  assert.equal(isIndexableUrl(`${origin}/rss.xml`), false);
  assert.equal(isIndexableUrl(`${origin}/shopify`), true);
  assert.equal(isIndexableUrl(`${origin}/blog/como-hacer-una-pagina-web`), true);
  assert.equal(isIndexableUrl(`${origin}/aviso-de-privacidad`), true);
});

test('la portada se presenta como agencia y los servicios apuntan a páginas', () => {
  assert.equal(defaultTitle, 'Agencia de desarrollo web en México | Devstoremx');
  const hero = readFileSync('src/components/sections/Hero.astro', 'utf8');
  const h1 = hero.slice(hero.indexOf('<h1'), hero.indexOf('</h1>'));
  assert.match(h1, /Agencia de desarrollo web en México/);
  assert.match(h1, /Sitios que venden/);

  const config = readFileSync('astro.config.mjs', 'utf8');
  assert.match(config, /trailingSlash:\s*'never'/);

  const files = new Set(readdirSync('src/content/servicios').filter((name) => name.endsWith('.md')).map((name) => name.replace(/\.md$/, '')));
  for (const service of services) {
    assert.equal(service.href.startsWith('/'), true, service.href);
    assert.equal(service.href.endsWith('/'), false, service.href);
    assert.equal(service.href.includes('#'), false, service.href);
    assert.equal(files.has(service.href.slice(1)), true, service.href);
  }
});

test('el grafo de la portada usa Devstoremx y las URLs reales de servicio', () => {
  const graph = buildStructuredGraph({ origin, pathname: '/', variant: 'home' });
  const nodes = graph['@graph'];
  const organization = nodes.find((node) => Array.isArray(node['@type']) && node['@type'].includes('Organization'));
  assert.equal(organization.name, 'Devstoremx');
  assert.deepEqual(organization.alternateName, ['devstore mx', 'DevStore MX']);
  const ecommerce = nodes.find((node) => node['@type'] === 'Service' && node.name === 'Ecommerce');
  assert.equal(ecommerce.url, `${origin}/tienda-en-linea`);
  assert.equal(ecommerce['@id'], ecommerce.url);
  const serialized = JSON.stringify(graph);
  assert.equal(serialized.includes('/#ecommerce'), false);
  assert.equal(serialized.includes('/#desarrollo-web'), false);
  const fernando = nodes.find((node) => node['@id'] === `${origin}/#fernando-peralta`);
  assert.equal(fernando.url, `${origin}/equipo/fernando-peralta`);
});

test('una página de servicio publica su propia URL, migas y preguntas', () => {
  const graph = buildStructuredGraph({
    origin,
    pathname: '/shopify',
    title: 'Shopify',
    description: 'Tiendas Shopify',
    variant: 'service',
    serviceName: 'Shopify',
    serviceType: 'Desarrollo de tiendas Shopify en México',
    breadcrumbs: [
      { name: 'Inicio', href: '/' },
      { name: 'Shopify', href: '/shopify' },
    ],
    faqs: [{ question: '¿La cuenta queda del negocio?', answer: 'Sí.' }],
  });
  const nodes = graph['@graph'];
  const service = nodes.find((node) => node['@type'] === 'Service');
  assert.equal(service.url, `${origin}/shopify`);
  const crumbs = nodes.find((node) => node['@type'] === 'BreadcrumbList');
  assert.equal(crumbs.itemListElement.length, 2);
  const faq = nodes.find((node) => node['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity[0].name, '¿La cuenta queda del negocio?');
});

test('un artículo apunta al perfil de la persona que ya existe en el equipo', () => {
  const published = new Date('2026-10-07T00:00:00.000Z');
  const graph = buildStructuredGraph({
    origin,
    pathname: '/blog/como-hacer-una-pagina-web',
    title: 'Cómo hacer una página web',
    description: 'Guía',
    variant: 'article',
    article: {
      headline: 'Cómo hacer una página web',
      datePublished: published,
      dateModified: published,
      authorSlug: 'fernando-peralta',
    },
    howTo: {
      name: 'Cómo hacer una página web para un negocio',
      description: 'Pasos',
      steps: [{ name: 'Define la oferta', text: 'Escribe la acción.' }],
    },
  });
  const nodes = graph['@graph'];
  const article = nodes.find((node) => node['@type'] === 'BlogPosting');
  assert.deepEqual(article.author, { '@id': `${origin}/#fernando-peralta` });
  assert.equal(article.datePublished, '2026-10-07T00:00:00.000Z');
  const howTo = nodes.find((node) => node['@type'] === 'HowTo');
  assert.equal(howTo.step[0].position, 1);
});

test('los servicios y las guías tienen texto útil, sin precios ni niveles de partner no publicados', () => {
  const price = /\$\s?\d|\b\d[\d.,]*\s?(?:mxn|pesos|usd)\b/i;
  const unpublishedTier = /shopify (?:plus|premier|select) partner|partner (?:plus|premier|select)|shopify expert/i;
  for (const file of readdirSync('src/content/servicios').filter((name) => name.endsWith('.md'))) {
    const { raw, fm, body } = splitFrontmatter(`src/content/servicios/${file}`);
    assert.match(fm, /^intro: >/m, file);
    assert.match(fm, /faqs:/, file);
    assert.equal(words(body) >= 650, true, `${file} tiene ${words(body)} palabras en el cuerpo`);
    assert.doesNotMatch(raw, price, file);
    assert.doesNotMatch(raw, unpublishedTier, file);
  }
  const howTo = splitFrontmatter('src/content/blog/como-hacer-una-pagina-web.md');
  assert.match(howTo.fm, /howTo:/);
  for (const file of readdirSync('src/content/blog').filter((name) => name.endsWith('.md'))) {
    const { raw, body } = splitFrontmatter(`src/content/blog/${file}`);
    assert.equal(words(body) >= 650, true, `${file} tiene ${words(body)} palabras en el cuerpo`);
    assert.doesNotMatch(raw, price, file);
  }
});
