import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { authorProjects } from '../src/lib/author-projects.ts';
import { buildStructuredGraph } from '../src/lib/structured-data.ts';
import { compareSnapshots, parseSnapshot } from '../scripts/compare-seo.mjs';

const baseline = JSON.parse(readFileSync('metrics/gsc-baseline-2026-11-02.json', 'utf8'));

test('las guías básicas ayudan a preparar un encargo sin publicar implementación', () => {
  const raw = readFileSync('src/content/blog/como-hacer-una-pagina-web.md', 'utf8');
  assert.match(raw, /completa este ejemplo/);
  assert.match(raw, /Comprueba la entrega/);
  assert.match(raw, /\/paginas-web/);
  assert.match(raw, /\/blog\/cuanto-cuesta-una-pagina-web/);
  assert.doesNotMatch(raw, /```/);
  const shopify = readFileSync('src/content/blog/desarrollo-de-tiendas-shopify.md', 'utf8');
  assert.match(shopify, /metaTitle: Qué revisar antes de lanzar/);
  assert.match(shopify, /\]\(\/shopify\)/);
  assert.match(shopify, /sin hacer un cargo real/);
  assert.doesNotMatch(shopify, /```/);
});

test('las guías de costos declaran la ausencia de tarifas y enlazan al servicio', () => {
  for (const [slug, service] of [
    ['cuanto-cuesta-una-pagina-web', 'paginas-web'],
    ['cuanto-cuesta-una-tienda-en-shopify', 'shopify'],
    ['cuanto-cuesta-hacer-una-app', 'apps-moviles'],
  ]) {
    const raw = readFileSync(`src/content/blog/${slug}.md`, 'utf8');
    const intro = raw.match(/intro: >\n([\s\S]*?)\nauthor:/)?.[1] ?? '';
    assert.match(intro, /no publica una tarifa/i);
    assert.match(raw, new RegExp(`\\]\\(/${service}\\)`));
    assert.match(raw, /cta:/);
    assert.doesNotMatch(raw, /\$\s?\d|\b\d[\d.,]*\s?(?:mxn|pesos|usd)\b/i);
  }
});

test('las soluciones de nicho conservan fuente y fecha editorial real', () => {
  for (const fragment of ['como-actualizar-un-tema-shopify', 'como-crear-filtros-de-productos', 'como-personalizar-envios-y-paquetes']) {
    const project = authorProjects.find((item) => item.slug.startsWith(fragment));
    assert.ok(project);
    assert.equal(project.updatedAt, '2026-11-04');
    assert.equal(new URL(project.sourceUrl).hostname, 'fernandoperalta.xyz');
    assert.equal(project.content.sections.length, 4);
    assert.match(JSON.stringify(project.content.sections), /básica|básico|sin programar/);
  }
});

test('el schema de servicio usa su descripción editorial y fecha, no el texto de tarjeta', () => {
  const graph = buildStructuredGraph({
    origin: 'https://www.devstoremx.xyz', pathname: '/wordpress', variant: 'service',
    description: 'Descripción propia del servicio WordPress.', dateModified: new Date('2026-11-04'),
  })['@graph'];
  assert.equal(graph.find((item) => item['@type'] === 'Service').description, 'Descripción propia del servicio WordPress.');
  assert.equal(graph.find((item) => item['@type'] === 'WebPage').dateModified, '2026-11-04T00:00:00.000Z');
});

test('un artículo enlaza semánticamente servicios reales sin inventar un HowTo', () => {
  const graph = buildStructuredGraph({
    origin: 'https://www.devstoremx.xyz', pathname: '/blog/desarrollo-de-tiendas-shopify', variant: 'article',
    article: { headline: 'Revisión Shopify', datePublished: new Date('2026-10-17'), dateModified: new Date('2026-11-04'), authorSlug: 'fernando-peralta', serviceIds: ['shopify', 'no-existe'] },
  })['@graph'];
  assert.deepEqual(graph.find((item) => item['@type'] === 'BlogPosting').about.map((item) => item.url), ['https://www.devstoremx.xyz/shopify']);
  assert.equal(graph.some((item) => item['@type'] === 'HowTo'), false);
});

test('la medición conserva URLs históricas y no transforma ausencia en cero', () => {
  assert.equal(parseSnapshot(baseline).days, 28);
  assert.equal(parseSnapshot({ result: JSON.stringify(baseline) }).rows.length, 37);
  const after = structuredClone(baseline);
  after.rows = after.rows.filter((row) => row.page !== 'https://devstoremx.xyz/');
  after.pagination.row_count = after.rows.length;
  after.rows[0].clicks += 2;
  after.rows[0].position -= 1;
  const rows = compareSnapshots(baseline, after);
  assert.equal(rows.find((row) => row.page === 'https://devstoremx.xyz/').after, null);
  assert.equal(rows.find((row) => row.page === 'https://devstoremx.xyz/').clickChange, null);
  const home = rows.find((row) => row.page === 'https://www.devstoremx.xyz/');
  assert.equal(home.clickChange, 2);
  assert.equal(home.positionImprovement, 1);
});

test('la medición rechaza periodos desiguales y exportaciones parciales o filtradas', () => {
  assert.throws(() => compareSnapshots(baseline, { ...baseline, date_range: { start: '2026-10-07', end: '2026-11-02' } }), /igual duración/);
  assert.throws(() => parseSnapshot({ ...baseline, pagination: { ...baseline.pagination, has_more: true } }), /parciales/);
  assert.throws(() => parseSnapshot({ ...baseline, filters_applied: [{ dimension: 'country' }] }), /sin filtros/);
  assert.throws(() => parseSnapshot({ ...baseline, dimensions: ['query'] }), /dimensión page/);
});
