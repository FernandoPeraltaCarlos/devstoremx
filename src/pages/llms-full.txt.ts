import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { authorPath } from '../data/authors';
import { memberSlug, site, team } from '../data/landing';
import { formatDate } from '../lib/seo';
import { authorProjects, projectPath } from '../lib/author-projects';

export const prerender = true;

function plain(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, (_, text, href) => `${text} (${new URL(href, site.url).href})`)
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const GET: APIRoute = async () => {
  const servicios = (await getCollection('servicios')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('blog')).sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  const blocks = [
    'Devstoremx — servicios, entradas de blog y soluciones de desarrollo',
    '',
    `Agencia de desarrollo web en México. Trabajo remoto en todo el país. No hay precios publicados. Este archivo contiene los servicios, las entradas de blog y las soluciones de desarrollo para buscadores y asistentes. Los proyectos completos de referencia están en el portafolio personal de Fernando Peralta. La versión corta con enlaces está en ${site.url}/llms.txt.`,
    '',
  ];
  for (const entry of servicios) {
    blocks.push(
      entry.data.h1,
      entry.data.intro.trim(),
      '',
      plain(entry.body ?? ''),
      '',
      'Preguntas frecuentes',
      ...entry.data.faqs.flatMap((faq) => [faq.question, faq.answer, '']),
      `URL: ${site.url}/${entry.id}`,
      '',
      '---',
      '',
    );
  }
  for (const post of posts) {
    const author = team.find((member) => memberSlug(member.image) === post.data.author);
    if (!author) throw new Error(`Autor no encontrado: ${post.data.author}`);
    blocks.push(
      post.data.h1,
      `Autor: ${author.name}, ${author.role} en Devstoremx${authorPath(post.data.author) ? ` (${site.url}${authorPath(post.data.author)})` : ''}.`,
      `Publicado: ${formatDate(post.data.publishedAt)}.`,
      `Última actualización: ${formatDate(post.data.updatedAt)}.`,
      `Categoría: ${post.data.category}.`,
      post.data.intro.trim(),
      '',
    );
    blocks.push(
      plain(post.body ?? ''),
      '',
    );
    if (post.data.faqs.length) {
      blocks.push(
        'Preguntas frecuentes',
        ...post.data.faqs.flatMap((faq) => [faq.question, faq.answer, '']),
      );
    }
    blocks.push(
      post.data.cta.title,
      post.data.cta.description,
      `${post.data.cta.label}: ${site.url}/#contacto`,
      '',
      `URL: ${site.url}/blog/${post.id}`,
      '',
      '---',
      '',
    );
  }
  for (const project of authorProjects) {
    const content = project.content;
    blocks.push(
      content.title,
      'Contenido de Fernando Peralta, Technical Lead de Devstoremx.',
      content.intro,
      ...content.sections.flatMap((section) => [section.title, ...section.paragraphs]),
      'Qué puede incluir el proyecto', ...content.deliverables,
      'Preguntas frecuentes', ...content.faqs.flatMap((faq) => [faq.question, faq.answer]),
      'Experiencia relacionada', content.proof,
      `Ver proyecto completo: ${project.sourceUrl}`,
      content.cta.title, content.cta.text,
      `${content.cta.label}: ${site.url}/#contacto`,
      `URL: ${site.url}${projectPath(project)}`, '', '---', '',
    );
  }
  return new Response(blocks.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
