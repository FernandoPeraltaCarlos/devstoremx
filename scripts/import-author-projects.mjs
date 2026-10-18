/**
 * Importación explícita, no forma parte del build. No modifica el portafolio fuente.
 * node --experimental-strip-types scripts/import-author-projects.mjs /ruta/al/portafolio
 * El JSON y los archivos copiados quedan versionados; producción no depende de otra carpeta.
 */
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { projectSlugs } from '../src/data/project-slugs.ts';

if (!process.argv[2]) throw new Error('Indica la carpeta del portafolio de origen.');
const source = resolve(process.argv[2]);
const root = fileURLToPath(new URL('../', import.meta.url));
if (source === resolve(root)) throw new Error('El origen debe ser el portafolio, no este repositorio.');
const { es } = await import(pathToFileURL(resolve(source, 'src/i18n/es.ts')).href);
const { caseStudyFacts } = await import(pathToFileURL(resolve(source, 'src/i18n/case-studies.ts')).href);
const { getCaseStudyPath } = await import(pathToFileURL(resolve(source, 'src/i18n/routes.ts')).href);

// Identificadores anteriores para la migración y contexto laboral de cada caso.
const cases = [
  ['charlottes-web-shopify-theme-upgrade', 'charlottes-web', "Charlotte's Web", ['shopify', 'mantenimiento-web']],
  ['hsbc-innovation-banking-sitecore-launch', 'hsbc-innovation-banking', 'HSBC México', ['desarrollo-web']],
  ['hsbc-chromium-extension-ticket-qc', 'hsbc-extension-chromium', 'HSBC México', ['automatizaciones', 'integraciones']],
  ['cream-right-shopify-theme-home-product', 'cream-right', 'Applabmx', ['shopify']],
  ['palmers-shopify-theme-promo-collections', 'palmers', 'Applabmx', ['shopify', 'landing-pages']],
  ['exclusive-iron-doors-shopify-theme-filters', 'exclusive-iron-doors', 'Applabmx', ['shopify']],
  ['laerdal-shopify-theme-navigation-forms', 'laerdal', 'Applabmx', ['shopify']],
  ['lerato-shopify-theme-wishlist-sections', 'lerato', 'Applabmx', ['shopify']],
  ['rivka-shopify-liquid-components-and-promo-codes-app', 'rivka', 'Rivka', ['shopify', 'integraciones']],
  ['structurall-custom-wordpress-theme', 'structurall', 'Industria Social', ['wordpress', 'paginas-web']],
  ['original-penguin-shopify-components-and-email', 'original-penguin', 'Industria Social', ['shopify', 'email-templates']],
  ['mezcal-viviente-bilingual-wordpress-website', 'mezcal-viviente', 'Industria Social', ['wordpress', 'paginas-web']],
  ['rca-shopify-api-forms-and-email', 'rca', 'Industria Social', ['shopify', 'integraciones', 'email-templates']],
  ['delena-astro-restaurant-website', 'de-lena-pizzas', 'Industria Social', ['paginas-web']],
  ['nutriandreaa-webflow-stripe-course-automation', 'nutriandreaa', 'Industria Social', ['automatizaciones', 'integraciones']],
  ['groovepro-custom-woocommerce-plugins', 'groovepro', 'Industria Social', ['wordpress', 'tienda-en-linea']],
  ['grupo-aga-wordpress-website', 'grupo-aga', 'Brainfood Marketing', ['wordpress', 'paginas-web']],
  ['stitchers-space-web-ad-integration', 'stitchers-space', 'Stitchers.Space', ['integraciones']],
  ['10bet-latam-compliance-and-email', '10bet-latam', '10Bet Latam', ['landing-pages', 'email-templates']],
  ['cofaa-institutional-website', 'cofaa-sitio-institucional', 'COFAA-IPN', ['paginas-web', 'desarrollo-web']],
  ['cofaa-service-desk', 'cofaa-gestion-tickets', 'COFAA-IPN', ['apps-web']],
  ['cofaa-code-of-conduct', 'cofaa-acuses', 'COFAA-IPN', ['apps-web']],
  ['cofaa-transparency-portal', 'cofaa-transparencia', 'COFAA-IPN', ['apps-web', 'automatizaciones']],
];

const copied = new Set();
function asset(path) {
  if (!path) return undefined;
  if (!path.startsWith('/') || path.includes('..')) throw new Error(`Asset inválido: ${path}`);
  const local = `/equipo/proyectos${path}`;
  if (!copied.has(path)) {
    const dest = resolve(root, `public${local}`);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(resolve(source, `public${path}`), dest);
    copied.add(path);
  }
  return local;
}

const imported = cases.map(([key, oldSlug, context, relatedServices]) => {
  const slug = projectSlugs[oldSlug];
  if (!slug) throw new Error(`Falta definir el slug descriptivo: ${oldSlug}`);
  const page = es.portfolio.caseStudyPages[key];
  const facts = caseStudyFacts[key];
  if (!page || !facts) throw new Error(`Caso no encontrado: ${key}`);
  const sourceUrl = `https://fernandoperalta.xyz${getCaseStudyPath(key, 'es')}`;
  const card = es.portfolio.specialties.caseStudies.items.find((item) => item.href === getCaseStudyPath(key, 'es'));
  const images = Object.entries(facts.images).map(([id, image]) => ({
    id,
    src: asset(typeof image.src === 'string' ? image.src : image.src?.es || image.webp),
    avif: asset(image.avif),
    width: image.width,
    height: image.height,
    source: image.source,
    capturedDate: image.capturedDate,
    ...page.images[id],
  }));
  return {
    slug, author: 'fernando-peralta', kind: 'career', context, relatedServices,
    title: page.title, metaTitle: `${page.meta.title} | Devstoremx`, name: page.client, description: page.meta.description,
    lead: page.lead, summary: page.summary, role: page.role, year: facts.year,
    publishedAt: '2026-10-18', updatedAt: '2026-10-18',
    sourceUrl, sourcePublishedAt: facts.publishedDate,
    liveUrl: facts.liveUrl,
    socialImage: asset(`/case-studies/${key}/og-es.jpg`),
    cover: card ? { src: asset(card.image.webp), width: card.image.width, height: card.image.height, alt: card.alt } : undefined,
    stack: page.stack, skills: page.skills,
    challenge: page.challenge, approach: page.approach,
    howItWorks: page.howItWorks,
    workTitle: page.workTitle, work: page.work,
    resultsTitle: page.resultsTitle, results: page.results,
    currentNote: page.currentNote,
    images, gallery: facts.gallery,
    sources: page.sources,
  };
});

writeFileSync(resolve(root, 'src/data/author-projects.json'), `${JSON.stringify(imported, null, 2)}\n`);
console.log(`Importados ${imported.length} proyectos y ${copied.size} assets. El portafolio fuente no fue modificado.`);
