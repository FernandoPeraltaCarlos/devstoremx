import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faq = z.object({
  question: z.string(),
  answer: z.string(),
});

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    h1: z.string(),
    keywords: z.array(z.string()),
    intro: z.string(),
    platforms: z.array(z.string()).default([]),
    faqs: z.array(faq),
    relatedServices: z.array(z.string()).default([]),
    order: z.number().default(50),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    h1: z.string(),
    intro: z.string(),
    author: z.enum(['fernando-peralta', 'miriam-medina', 'hazel-vazquez', 'janice-garcia']),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    heroImage: z.string().default('/devstore_mx.png'),
    relatedService: z.string(),
    howTo: z.object({
      name: z.string(),
      description: z.string(),
      steps: z.array(z.object({ name: z.string(), text: z.string() })),
    }).optional(),
  }),
});

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    service: z.string(),
    placeholder: z.boolean().default(true),
  }),
});

export const collections = { servicios, blog, proyectos };
