import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { test } from 'node:test';
import { defaultTitle, metaDescription, navigation, services, site } from '../src/data/landing.ts';
import { buildStructuredGraph } from '../src/lib/structured-data.ts';
import { canonicalPathname, isIndexableUrl, portfolioIsPublic, sitemapLastmod } from '../src/lib/seo.ts';
import { blogRedirects } from '../src/data/blog-redirects.ts';

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

test('el sitemap toma lastmod del updatedAt de cada entrada', () => {
  assert.equal(sitemapLastmod('/blog/cuando-redisenar-la-pagina-web-de-tu-negocio'), '2026-10-17T00:00:00.000Z');
  assert.equal(sitemapLastmod('/blog/como-hacer-una-pagina-web'), '2026-10-18T00:00:00.000Z');
  assert.equal(sitemapLastmod('/shopify'), undefined);
  assert.equal(sitemapLastmod('/blog'), undefined);
});

test('canonicalPathname quita .html y la barra final', () => {
  assert.equal(canonicalPathname('/shopify.html'), '/shopify');
  assert.equal(canonicalPathname('/shopify/'), '/shopify');
  assert.equal(canonicalPathname('/index.html'), '/');
  assert.equal(canonicalPathname('/blog/index.html'), '/blog');
  assert.equal(canonicalPathname('/'), '/');
  assert.equal(canonicalPathname('/blog/como-hacer-una-pagina-web.html'), '/blog/como-hacer-una-pagina-web');
});

test('el sitemap incluye el perfil de Fernando y excluye dashboard, portafolio retirado, archivos de texto y el índice de equipo', () => {
  assert.equal(portfolioIsPublic(), false);
  assert.equal(isIndexableUrl(`${origin}/dashboard-cliente`), false);
  assert.equal(isIndexableUrl(`${origin}/dashboard-cliente/`), false);
  assert.equal(isIndexableUrl(`${origin}/portafolio`), false);
  assert.equal(isIndexableUrl(`${origin}/portafolio/`), false);
  assert.equal(isIndexableUrl(`${origin}/llms.txt`), false);
  assert.equal(isIndexableUrl(`${origin}/llms-full.txt`), false);
  assert.equal(isIndexableUrl(`${origin}/rss.xml`), false);
  assert.equal(isIndexableUrl(`${origin}/equipo`), false);
  assert.equal(isIndexableUrl(`${origin}/equipo/`), false);
  assert.equal(isIndexableUrl(`${origin}/equipo/fernando-peralta`), true);
  assert.equal(isIndexableUrl(`${origin}/equipo/fernando-peralta/`), true);
  assert.equal(isIndexableUrl(`${origin}/blog`), true);
  assert.equal(isIndexableUrl(`${origin}/shopify`), true);
  assert.equal(isIndexableUrl(`${origin}/blog/cuando-redisenar-la-pagina-web-de-tu-negocio`), true);
  assert.equal(isIndexableUrl(`${origin}/blog/como-hacer-una-pagina-web`), true);
  assert.equal(isIndexableUrl(`${origin}/aviso-de-privacidad`), true);
});

test('el portafolio de agencia está archivado y no se anuncia como página pública', () => {
  assert.equal(existsSync('src/pages/portafolio.astro'), false);
  assert.equal(existsSync('src/pages/_portafolio.astro'), true);
  assert.equal(navigation.some((item) => item.href === '/portafolio'), false);
  assert.doesNotMatch(readFileSync('src/pages/llms.txt.ts', 'utf8'), /\/portafolio|## Portafolio/);
  assert.doesNotMatch(readFileSync('src/components/ui/TeamCard.astro', 'utf8'), /Ver portafolio/);
});

test('la imagen social usa un JPG optimizado sin reemplazar el original', () => {
  assert.equal(site.ogImage, '/devstoremx-social.jpg');
  assert.equal(existsSync(`public${site.ogImage}`), true);
  assert.ok(statSync(`public${site.ogImage}`).size < 100 * 1024);
  assert.ok(statSync(`public${site.ogImage}`).size < statSync('public/devstore_mx.png').size);
  assert.deepEqual([...readFileSync(`public${site.ogImage}`).subarray(0, 2)], [0xff, 0xd8]);
});

test('robots explicita permisos para buscadores y asistentes sin restringir los demás', () => {
  const robots = readFileSync('public/robots.txt', 'utf8');
  for (const agent of ['*', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'Claude-User', 'Applebot-Extended']) {
    assert.ok(robots.includes(`User-agent: ${agent}\nAllow: /`), agent);
  }
  assert.match(robots, /Sitemap: https:\/\/www\.devstoremx\.xyz\/sitemap-index\.xml/);
});

test('el fundador confirmado y el contacto usan datos públicos y nodos sin duplicar', () => {
  for (const variant of ['home', 'page', 'service', 'article']) {
    const graph = buildStructuredGraph({
      origin,
      pathname: variant === 'home' ? '/' : '/plantillas-pdf',
      variant,
      ...(variant === 'article' ? { article: {
        headline: 'Documento de marca', authorSlug: 'fernando-peralta',
        datePublished: new Date('2026-10-18'), dateModified: new Date('2026-10-18'),
      } } : {}),
    });
    const nodes = graph['@graph'];
    const org = nodes.find((node) => Array.isArray(node['@type']) && node['@type'].includes('Organization'));
    assert.deepEqual(org.founder, { '@id': `${origin}/#fernando-peralta` });
    assert.equal(nodes.filter((node) => node['@id'] === org.founder['@id']).length, 1, variant);
    assert.equal(org.contactPoint.email, site.email);
    assert.equal(org.contactPoint.url, `${origin}/#contacto`);
    assert.deepEqual(org.contactPoint.availableLanguage, ['es-MX']);
    assert.equal(org.contactPoint.telephone, site.phone);
    assert.equal(org.telephone, site.phone);
    assert.equal(Object.hasOwn(org.contactPoint, 'hoursAvailable'), false);
  }
});

test('el servicio PDF tiene página, catálogo y schema con su URL real', () => {
  const pdf = services.find((service) => service.href === '/plantillas-pdf');
  assert.equal(pdf?.title, 'Plantillas PDF');
  const { fm, body } = splitFrontmatter('src/content/servicios/plantillas-pdf.md');
  assert.match(fm, /formularios pdf rellenables/);
  assert.match(body, /compatibilidad|lectores/i);
  const graph = buildStructuredGraph({ origin, pathname: '/plantillas-pdf', variant: 'service' });
  assert.equal(graph['@graph'].find((node) => node['@type'] === 'Service').url, `${origin}/plantillas-pdf`);
});

test('la página 404 no se indexa y ofrece rutas para continuar', () => {
  for (const path of ['/404', '/404/', '/404.html']) {
    assert.equal(isIndexableUrl(`${origin}${path}`), false);
  }
  const page = readFileSync('src/pages/404.astro', 'utf8');
  assert.match(page, /<BaseLayout\b[^>]*\bnoindex\b/);
  assert.match(page, /<SiteFrame>/);
  assert.match(page, /<h1\b/);
  assert.match(page, /href="\/"/);
  assert.match(page, /href="\/#contacto"/);
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
  assert.ok(fernando.sameAs.includes('https://fernandoperalta.xyz'));
  assert.ok(fernando.sameAs.includes('https://www.linkedin.com/in/fernandodperaltac/'));
  assert.equal(serialized.match(/\/equipo\//g).length, 1);
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

test('un artículo identifica al autor y lo enlaza a su página de perfil', () => {
  const published = new Date('2026-10-07T00:00:00.000Z');
  const graph = buildStructuredGraph({
    origin,
    pathname: '/blog/cuando-redisenar-la-pagina-web-de-tu-negocio',
    title: 'Cuándo rediseñar tu sitio',
    description: 'Entrada de blog',
    image: '/blog/como-hacer-una-pagina-web.webp',
    imageAlt: 'Laptop con el esquema de un sitio web.',
    variant: 'article',
    article: {
      headline: 'Cuándo rediseñar tu sitio',
      datePublished: published,
      dateModified: published,
      authorSlug: 'fernando-peralta',
    },
    faqs: [{ question: '¿Debo rehacer todo?', answer: 'Primero revisamos qué funciona.' }],
  });
  const nodes = graph['@graph'];
  const article = nodes.find((node) => node['@type'] === 'BlogPosting');
  assert.deepEqual(article.author, { '@id': `${origin}/#fernando-peralta` });
  const author = nodes.find((node) => node['@id'] === article.author['@id']);
  assert.equal(author.name, 'Fernando Peralta');
  assert.equal(author.url, `${origin}/equipo/fernando-peralta`);
  assert.equal(article.datePublished, '2026-10-07T00:00:00.000Z');
  assert.equal(article.image, `${origin}/blog/como-hacer-una-pagina-web.webp`);
  const webpage = nodes.find((node) => node['@type'] === 'WebPage');
  assert.equal(webpage.primaryImageOfPage.url, article.image);
  assert.equal(webpage.primaryImageOfPage.caption, 'Laptop con el esquema de un sitio web.');
  assert.equal(nodes.some((node) => node['@type'] === 'HowTo'), false);
  assert.equal(nodes.find((node) => node['@type'] === 'FAQPage').mainEntity[0].name, '¿Debo rehacer todo?');
});

test('el índice del blog identifica al autor y las portadas de sus entradas', () => {
  const graph = buildStructuredGraph({
    origin,
    pathname: '/blog',
    variant: 'page',
    image: '/blog/como-hacer-una-pagina-web.webp',
    imageAlt: 'Bocetos de una página web.',
    blogPosts: [{
      headline: 'Cuándo rediseñar tu sitio',
      href: '/blog/cuando-redisenar-la-pagina-web-de-tu-negocio',
      datePublished: new Date('2026-10-07T00:00:00.000Z'),
      authorSlug: 'fernando-peralta',
      image: '/blog/como-hacer-una-pagina-web.webp',
    }],
  });
  const nodes = graph['@graph'];
  const webpage = nodes.find((node) => node['@type'] === 'WebPage');
  const blog = nodes.find((node) => node['@type'] === 'Blog');
  assert.deepEqual(webpage.mainEntity, { '@id': blog['@id'] });
  assert.equal(webpage.primaryImageOfPage.url, `${origin}/blog/como-hacer-una-pagina-web.webp`);
  assert.equal(webpage.primaryImageOfPage.caption, 'Bocetos de una página web.');
  const entry = blog.blogPost[0];
  assert.equal(entry['@id'], `${origin}/blog/cuando-redisenar-la-pagina-web-de-tu-negocio#article`);
  assert.equal(entry.image, webpage.primaryImageOfPage.url);
  const author = nodes.find((node) => node['@id'] === entry.author['@id']);
  assert.equal(author.name, 'Fernando Peralta');
  assert.equal(author.url, `${origin}/equipo/fernando-peralta`);
});

test('los servicios y las entradas de blog tienen texto útil, sin precios ni niveles de partner no publicados', () => {
  const price = /\$\s?\d|\b\d[\d.,]*\s?(?:mxn|pesos|usd)\b/i;
  const unpublishedTier = /shopify (?:plus|premier|select) partner|partner (?:plus|premier|select)|shopify expert/i;
  for (const file of readdirSync('src/content/servicios').filter((name) => name.endsWith('.md'))) {
    const { raw, fm, body } = splitFrontmatter(`src/content/servicios/${file}`);
    assert.match(fm, /^intro: >/m, file);
    assert.match(fm, /faqs:/, file);
    assert.match(fm, /^highlights:/m, file);
    assert.equal(words(body) >= 650, true, `${file} tiene ${words(body)} palabras en el cuerpo`);
    assert.doesNotMatch(raw, price, file);
    assert.doesNotMatch(raw, unpublishedTier, file);
  }
  const covered = new Set();
  for (const file of readdirSync('src/content/blog').filter((name) => name.endsWith('.md'))) {
    const { raw, fm, body } = splitFrontmatter(`src/content/blog/${file}`);
    assert.match(fm, /^author: fernando-peralta$/m, file);
    assert.match(fm, /^faqs:/m, file);
    assert.match(fm, /^relatedServices:/m, file);
    assert.match(fm, /^cta:/m, file);
    assert.doesNotMatch(fm, /^howTo:/m, file);
    const primary = fm.match(/^relatedService: (\S+)/m)?.[1];
    assert.ok(primary, file);
    covered.add(primary);
    const secondaryServices = fm.match(/^relatedServices:\n((?:  - [^\n]+\n)*)/m)?.[1] ?? '';
    for (const [, id] of secondaryServices.matchAll(/  - (\S+)/g)) covered.add(id);
    assert.equal(words(body) >= 650, true, `${file} tiene ${words(body)} palabras en el cuerpo`);
    assert.doesNotMatch(raw, price, file);
    assert.doesNotMatch(raw, unpublishedTier, file);
  }
  const serviceIds = readdirSync('src/content/servicios').filter((name) => name.endsWith('.md')).map((name) => name.replace(/\.md$/, ''));
  for (const id of serviceIds) assert.equal(covered.has(id), true, `falta una entrada relacionada para ${id}`);
});

test('las URLs editoriales anteriores tienen un reemplazo directo, excluido del sitemap viejo', () => {
  const files = new Set(readdirSync('src/content/blog').filter((name) => name.endsWith('.md')).map((name) => `/blog/${name.replace(/\.md$/, '')}`));
  assert.equal(files.size, 17);
  assert.equal(Object.keys(blogRedirects).length, 11);
  assert.equal(Object.hasOwn(blogRedirects, '/blog/como-hacer-una-pagina-web'), false);
  assert.equal(files.has('/blog/como-hacer-una-pagina-web'), true);
  for (const [from, to] of Object.entries(blogRedirects)) {
    assert.equal(files.has(from), false, from);
    assert.equal(files.has(to), true, to);
    assert.equal(Object.hasOwn(blogRedirects, to), false, `cadena: ${to}`);
    assert.equal(isIndexableUrl(`${origin}${from}`), false);
    assert.equal(isIndexableUrl(`${origin}${to}`), true);
  }
  assert.match(readFileSync('astro.config.mjs', 'utf8'), /blogRedirects/);
  assert.match(readFileSync('astro.config.mjs', 'utf8'), /status: 301/);
});

test('los enlaces internos del contenido no apuntan a URLs de blog retiradas', () => {
  const posts = new Set(readdirSync('src/content/blog').map((name) => `/blog/${name.replace(/\.md$/, '')}`));
  for (const collection of ['blog', 'servicios']) {
    for (const file of readdirSync(`src/content/${collection}`).filter((name) => name.endsWith('.md'))) {
      const { raw } = splitFrontmatter(`src/content/${collection}/${file}`);
      for (const [, href] of raw.matchAll(/\]\((\/blog\/[^)#]+)(?:#[^)]*)?\)/g)) {
        assert.equal(Object.hasOwn(blogRedirects, href), false, `${file}: ${href}`);
        assert.equal(posts.has(href), true, `${file}: ${href}`);
      }
    }
  }
});

test('el perfil de Fernando es una ProfilePage con su persona, sin duplicar nodos', () => {
  const graph = buildStructuredGraph({
    origin,
    pathname: '/equipo/fernando-peralta',
    variant: 'profile',
    profileSlug: 'fernando-peralta',
    breadcrumbs: [
      { name: 'Inicio', href: '/' },
      { name: 'Equipo', href: '/#nosotros' },
      { name: 'Fernando Peralta', href: '/equipo/fernando-peralta' },
    ],
  });
  const nodes = graph['@graph'];
  const page = nodes.find((node) => node['@id'] === `${origin}/equipo/fernando-peralta#webpage`);
  assert.equal(page['@type'], 'ProfilePage');
  assert.deepEqual(page.mainEntity, { '@id': `${origin}/#fernando-peralta` });
  const people = nodes.filter((node) => node['@id'] === `${origin}/#fernando-peralta`);
  assert.equal(people.length, 1);
  assert.equal(people[0].url, `${origin}/equipo/fernando-peralta`);
  assert.ok(people[0].sameAs.includes('https://github.com/fernandoperaltacarlos'));
  assert.ok(people[0].knowsAbout.includes('Shopify'));
});

test('el perfil de autor presenta proyectos locales y conserva el enlace al portafolio personal', () => {
  const profile = readFileSync('src/pages/equipo/[slug].astro', 'utf8');
  assert.doesNotMatch(profile, /No son casos de clientes de Devstoremx/);
  assert.match(profile, /<ProjectCard project=\{project\}/);
  assert.match(profile, /href=\{link.href\} \{\.\.\.external\}/);
  assert.match(profile, /proyecto completo en el portafolio personal/);
  assert.match(profile, /<h1|PageHero/);
  const data = readFileSync('src/data/authors.ts', 'utf8');
  assert.match(data, /fernandoperalta\.xyz\/es\/casos-de-estudio/);
  assert.match(data, /portfolio: 'https:\/\/fernandoperalta\.xyz\/es\/'/);
});

test('la ciudad base solo va en datos estructurados y no aparece en texto visible', () => {
  assert.equal(site.location, '');
  assert.equal(site.baseLocality, 'Ciudad de México');
  const graph = buildStructuredGraph({ origin, pathname: '/', variant: 'home' });
  const org = graph['@graph'].find((node) => Array.isArray(node['@type']) && node['@type'].includes('Organization'));
  assert.deepEqual(org.address, { '@type': 'PostalAddress', addressLocality: 'Ciudad de México', addressCountry: 'MX' });
  assert.equal(Object.hasOwn(org.address, 'streetAddress'), false);
  assert.doesNotMatch(metaDescription(), /Ciudad de México|CDMX/);
  assert.doesNotMatch(defaultTitle, /Ciudad de México|CDMX/);
  for (const file of ['src/components/sections/Footer.astro', 'src/pages/llms.txt.ts']) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /Ciudad de México|CDMX/, file);
  }
});
