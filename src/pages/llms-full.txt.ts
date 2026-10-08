import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { memberSlug, site, team } from '../data/landing';
import { formatDate } from '../lib/seo';

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
    'Devstoremx — servicios y entradas de blog',
    '',
    `Agencia de desarrollo web en México. Trabajo remoto en todo el país. No hay precios publicados. Este archivo contiene los servicios y las entradas de blog para buscadores y asistentes. La versión corta con enlaces está en ${site.url}/llms.txt.`,
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
      `Autor: ${author.name}, ${author.role} en Devstoremx.`,
      `Publicado: ${formatDate(post.data.publishedAt)}.`,
      `Última actualización: ${formatDate(post.data.updatedAt)}.`,
      `Categoría: ${post.data.category}.`,
      post.data.intro.trim(),
      '',
    );
    if (post.data.howTo) {
      blocks.push(
        post.data.howTo.name,
        post.data.howTo.description,
        ...post.data.howTo.steps.map((step, index) => `${index + 1}. ${step.name}. ${step.text}`),
        '',
      );
    }
    blocks.push(
      plain(post.body ?? ''),
      '',
      `URL: ${site.url}/blog/${post.id}`,
      '',
      '---',
      '',
    );
  }
  return new Response(blocks.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
