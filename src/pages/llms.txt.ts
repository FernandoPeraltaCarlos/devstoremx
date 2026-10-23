import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { authorPath } from '../data/authors';
import { memberSlug, shopifyPartner, site, steps, team } from '../data/landing';
import { authorProjects, projectPath } from '../lib/author-projects';

export const prerender = true;

const origin = site.url;

export const GET: APIRoute = async () => {
  const servicios = (await getCollection('servicios')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('blog')).sort((a, b) => a.data.publishedAt.valueOf() - b.data.publishedAt.valueOf());
  const lines = [
    '# Devstoremx',
    '',
    '> Agencia de desarrollo web en México. Trabaja en remoto con negocios de todo el país. Diseña y desarrolla páginas web, tiendas en línea, apps, automatizaciones y plantillas PDF personalizadas. No publica precios: la cotización sale por escrito después de una llamada.',
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
    '## Entradas de blog',
    '',
    `- [Blog de Devstoremx](${origin}/blog): Fernando Peralta escribe sobre problemas de sitios, tiendas y sistemas que resolvemos para negocios. Las entradas ayudan a identificar cuándo contratar un servicio; no son tutoriales de implementación.`,
    ...posts.map((post) => `- [${post.data.title}](${origin}/blog/${post.id}): ${post.data.intro.replace(/\s+/g, ' ')}`),
    '',
    '## Proceso',
    '',
    ...steps.map((step, index) => `${index + 1}. ${step.title}: ${step.description}`),
    '',
    '## Equipo',
    '',
    ...team.map((member) => {
      const profile = authorPath(memberSlug(member.image));
      return `- ${profile ? `[${member.name}](${origin}${profile})` : member.name}, ${member.role}. ${member.bio}`;
    }),
    '- Fernando Peralta es fundador de Devstoremx.',
    '',
    '## Soluciones de desarrollo con experiencia de Fernando Peralta',
    '',
    ...authorProjects.map((project) => `- [${project.content.title}](${origin}${projectPath(project)}): ${project.content.description} Proyecto completo de referencia: ${project.sourceUrl}`),
    '',
    '## Contacto',
    '',
    `- Sitio: ${origin}/`,
    `- Formulario: ${origin}/#contacto`,
    `- Correo: ${site.email}`,
    `- Teléfono: ${site.phone}`,
    `- WhatsApp: ${site.whatsappUrl}`,
    `- Aviso de privacidad: ${origin}/aviso-de-privacidad`,
    `- Texto completo de servicios, soluciones de desarrollo y entradas de blog: ${origin}/llms-full.txt`,
    `- RSS del blog: ${origin}/rss.xml`,
    '',
    'No se publica dirección: el trabajo es remoto y atiende negocios de todo México. El dashboard de ejemplo usa datos ficticios y no es un caso de cliente.',
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
