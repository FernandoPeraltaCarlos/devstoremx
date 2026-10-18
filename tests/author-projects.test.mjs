import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { authorProjects, localProjectPath, projectPath } from '../src/lib/author-projects.ts';
import { authorProfiles } from '../src/data/authors.ts';
import { services } from '../src/data/landing.ts';
import { isIndexableUrl, sitemapLastmod } from '../src/lib/seo.ts';
import { buildStructuredGraph } from '../src/lib/structured-data.ts';
import { projectSlugs, projectRedirects } from '../src/data/project-slugs.ts';
import { projectContentBySlug } from '../src/data/project-content.ts';

const origin = 'https://www.devstoremx.xyz';

test('los slugs describen el trabajo y las rutas anteriores redirigen directamente a un proyecto vigente', () => {
  const paths = new Set(authorProjects.map(projectPath));
  assert.equal(Object.keys(projectRedirects).length, 46);
  assert.equal(new Set(Object.values(projectSlugs)).size, 23);
  assert.deepEqual(new Set(authorProjects.map((project) => project.slug)), new Set(Object.values(projectSlugs)));
  for (const [oldPath, newPath] of Object.entries(projectRedirects)) {
    assert.equal(paths.has(oldPath), false, oldPath);
    assert.equal(paths.has(newPath), true, newPath);
    assert.equal(Object.hasOwn(projectRedirects, newPath), false, newPath);
    for (const suffix of ['', '/', '.html']) assert.equal(isIndexableUrl(origin + oldPath + suffix), false);
    assert.equal(isIndexableUrl(origin + newPath), true);
  }
  for (const project of authorProjects) {
    assert.ok(project.slug.startsWith('como-'), project.slug);
    assert.doesNotMatch(project.slug, /charlottes|hsbc|cream-right|palmers|exclusive-iron|laerdal|lerato|rivka|structurall|penguin|mezcal|rca|lena-pizzas|nutriandreaa|groovepro|grupo-aga|stitchers|10bet|cofaa/);
  }
  const config = readFileSync('astro.config.mjs', 'utf8');
  assert.match(config, /\.\.\.projectRedirects/);
  assert.match(config, /status: 301/);
  assert.equal(projectRedirects['/equipo/fernando-peralta/charlottes-web'], '/equipo/fernando-peralta/como-actualizar-un-tema-shopify-sin-perder-personalizaciones');
  assert.equal(projectRedirects['/equipo/fernando-peralta/actualizacion-tema-shopify'], '/equipo/fernando-peralta/como-actualizar-un-tema-shopify-sin-perder-personalizaciones');
});

test('solo los 23 casos profesionales tienen rutas locales únicas y datos completos', () => {
  assert.equal(authorProjects.length, 23);
  assert.equal(authorProjects.filter((project) => project.kind === 'career').length, 23);
  assert.equal(new Set(authorProjects.map(projectPath)).size, authorProjects.length);
  for (const project of authorProjects) {
    assert.equal(project.author, 'fernando-peralta');
    assert.ok(authorProfiles[project.author]);
    assert.match(project.slug, /^[a-z0-9-]+$/);
    assert.equal(isIndexableUrl(origin + projectPath(project)), true);
    assert.equal(sitemapLastmod(projectPath(project)), `${project.updatedAt}T00:00:00.000Z`);
    assert.ok(project.context && project.role && project.summary && project.challenge && project.approach, project.slug);
    assert.ok(project.work.length > 0 && project.results.length > 0, project.slug);
    assert.ok(project.relatedServices.every((id) => services.some((service) => service.href === `/${id}`)), project.slug);
    assert.equal(localProjectPath(project.sourceUrl), projectPath(project));
    for (const image of [...project.images, project.cover].filter(Boolean)) {
      assert.ok(image.alt && image.width > 0 && image.height > 0, project.slug);
      assert.ok(existsSync(`public${image.src}`), image.src);
      if (image.avif) assert.ok(existsSync(`public${image.avif}`), image.avif);
    }
    assert.ok(existsSync(`public${project.socialImage}`), project.socialImage);
    for (const item of project.gallery) assert.ok(project.images.some((image) => image.id === item.id), `${project.slug}: ${item.id}`);
  }
});

test('los casos del perfil conservan su referencia personal y la ruta local de la solución', () => {
  for (const role of authorProfiles['fernando-peralta'].roles) {
    for (const link of role.links) {
      assert.equal(new URL(link.href).hostname, 'fernandoperalta.xyz');
      assert.ok(localProjectPath(link.href).startsWith('/equipo/fernando-peralta/'), link.href);
    }
  }
  assert.equal(Object.hasOwn(authorProfiles['fernando-peralta'], 'products'), false);
  assert.equal(localProjectPath('https://example.com'), 'https://example.com');
  assert.deepEqual(readdirSync('src/pages/equipo').sort(), ['[slug]', '[slug].astro']);
});

test('cada solución tiene Article comercial, autor local y el caso de referencia en el portafolio', () => {
  for (const project of authorProjects) {
    const graph = buildStructuredGraph({ origin, pathname: projectPath(project), variant: 'project', project });
    const article = graph['@graph'].find((node) => node['@type'] === 'Article');
    assert.equal(article.url, origin + projectPath(project));
    assert.equal(article.headline, project.content.title);
    assert.equal(article.description, project.content.description);
    assert.equal(article.abstract, project.content.intro);
    assert.equal(article.genre, 'Desarrollo web para empresas');
    assert.deepEqual(article.author, { '@id': `${origin}/#fernando-peralta` });
    assert.equal(article.isBasedOn, project.sourceUrl);
    assert.equal(article.dateModified, project.updatedAt);
    assert.equal(graph['@graph'].filter((node) => node['@id'] === `${origin}/#fernando-peralta`).length, 1);
    assert.equal(Object.hasOwn(article, 'provider'), false);
    assert.ok(article.about.every((item) => item['@type'] === 'Service'));
    assert.deepEqual(article.citation, [project.sourceUrl]);
  }
  const page = readFileSync('src/pages/equipo/[slug]/[proyecto].astro', 'utf8');
  assert.match(page, /project.content/);
  assert.doesNotMatch(page, /project\.(summary|challenge|approach|work|results|howItWorks)/);
  assert.match(page, /href=\{project.sourceUrl\}/);
  assert.match(page, /Ver proyecto completo/);
  assert.match(page, /faqs=\{content.faqs\}/);
  assert.doesNotMatch(page, /\bnoindex\b/);
});

test('ProfilePage lista todos los proyectos en los datos estructurados', () => {
  const graph = buildStructuredGraph({ origin, pathname: '/equipo/fernando-peralta', variant: 'profile', profileSlug: 'fernando-peralta' });
  const list = graph['@graph'].find((node) => node['@type'] === 'ItemList');
  assert.deepEqual(list.itemListElement.map((item) => item.url), authorProjects.map((project) => origin + projectPath(project)));
  assert.deepEqual(list.itemListElement.map((item) => item.name), authorProjects.map((project) => project.content.title));
});

test('las 23 soluciones tienen contenido comercial propio alineado con sus URLs, sin precios ni tutoriales de implementación', () => {
  assert.equal(Object.keys(projectContentBySlug).length, 23);
  assert.equal(new Set(authorProjects.map((project) => project.content.title)).size, 23);
  assert.equal(new Set(authorProjects.map((project) => project.content.intro)).size, 23);
  for (const project of authorProjects) {
    const content = project.content;
    assert.match(content.title, /^Cómo /, project.slug);
    assert.match(content.intro, /Devstoremx/, project.slug);
    assert.ok(content.metaTitle.length <= 65, content.metaTitle);
    assert.ok(content.description.length >= 120 && content.description.length <= 165, project.slug);
    assert.ok(content.sections.length >= 2 && content.sections.every((section) => section.paragraphs.length >= 2), project.slug);
    assert.ok(content.deliverables.length >= 4 && content.faqs.length >= 3, project.slug);
    assert.ok(content.proof && content.cta.title && content.cta.label && content.cta.text, project.slug);
    assert.equal(new URL(project.sourceUrl).hostname, 'fernandoperalta.xyz');
    assert.doesNotMatch(JSON.stringify(content), /\$\s?\d|\b\d[\d.,]*\s?(?:mxn|pesos|usd)\b|```|paso a paso/i, project.slug);
  }
  const full = readFileSync('src/pages/llms-full.txt.ts', 'utf8');
  assert.match(full, /content.sections/);
  assert.match(full, /content.faqs/);
  assert.doesNotMatch(full, /project\.(summary|challenge|approach|work|results|howItWorks)/);
});

test('la foto y el nombre abren el perfil sin botón adicional ni enlaces anidados', () => {
  const card = readFileSync('src/components/ui/TeamCard.astro', 'utf8');
  assert.match(card, /const CardTag = profile \? 'a' : 'div'/);
  assert.match(card, /<CardTag href=\{profile\}/);
  assert.match(card, /linkedin && !profile/);
  assert.doesNotMatch(card, />Ver perfil/);
});
