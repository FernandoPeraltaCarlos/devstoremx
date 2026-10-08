import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../data/landing';

export const prerender = true;

function plain(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const GET: APIRoute = async () => {
  const servicios = (await getCollection('servicios')).sort((a, b) => a.data.order - b.data.order);
  const blocks = [
    'Devstoremx — texto de los servicios',
    '',
    'Agencia de desarrollo web en México. Trabajo remoto en todo el país. No hay precios publicados. Este archivo resume cada servicio para buscadores y asistentes. La versión corta con enlaces está en /llms.txt.',
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
  return new Response(blocks.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
