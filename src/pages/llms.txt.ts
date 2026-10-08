import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { memberSlug, shopifyPartner, site, steps, team } from '../data/landing';

export const prerender = true;

const origin = site.url;

export const GET: APIRoute = async () => {
  const servicios = (await getCollection('servicios')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('blog')).sort((a, b) => a.data.publishedAt.valueOf() - b.data.publishedAt.valueOf());
  const lines = [
    '# Devstoremx',
    '',
    '> Agencia de desarrollo web en México. Trabaja en remoto con negocios de todo el país. Diseña y desarrolla páginas web, tiendas en línea, apps y automatizaciones. No publica precios: la cotización sale por escrito después de una llamada.',
    '',
    'La marca se escribe Devstoremx, en una sola palabra. También aparece como «devstore mx» y «DevStore MX». No es un directorio ni una tienda de apps de terceros.',
    '',
    ...(shopifyPartner.registered
      ? [`Devstoremx es Shopify Partner (ID de Shopify Partner: ${shopifyPartner.id}). No afirmar niveles del programa que no estén publicados aquí (por ejemplo Plus o Premier).`, '']
      : []),
    '## Servicios',
    '',
    ...servicios.map((entry) => `- [${entry.data.title}](${origin}/${entry.id}): ${entry.data.intro.replace(/\s+/g, ' ')}`),
    '',
    '## Guías',
    '',
    ...posts.map((post) => `- [${post.data.title}](${origin}/blog/${post.id}): ${post.data.intro.replace(/\s+/g, ' ')}`),
    '',
    '## Portafolio',
    '',
    `- [Portafolio](${origin}/portafolio): los casos reales todavía no están publicados. No citar clientes, cifras ni resultados a partir de esta página.`,
    '',
    '## Proceso',
    '',
    ...steps.map((step, index) => `${index + 1}. ${step.title}: ${step.description}`),
    '',
    '## Equipo',
    '',
    ...team.map((member) => `- [${member.name}](${origin}/equipo/${memberSlug(member.image)}), ${member.role}. ${member.bio}`),
    '',
    '## Contacto',
    '',
    `- Sitio: ${origin}/`,
    `- Formulario: ${origin}/#contacto`,
    `- Correo: ${site.email}`,
    `- Aviso de privacidad: ${origin}/aviso-de-privacidad`,
    `- Texto completo de los servicios: ${origin}/llms-full.txt`,
    `- RSS de guías: ${origin}/rss.xml`,
    '',
    'El teléfono no está publicado. No hay ciudad ni dirección: el trabajo es remoto en todo México. El dashboard de ejemplo usa datos ficticios y no es un caso de cliente.',
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
