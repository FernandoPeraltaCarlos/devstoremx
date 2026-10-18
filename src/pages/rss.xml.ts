import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { site } from '../data/landing';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  return rss({
    title: 'Blog de Devstoremx',
    description: 'El blog de Fernando Peralta sobre los problemas de sitios, tiendas y sistemas que resolvemos en Devstoremx para negocios en México.',
    site: site.url,
    items: posts.map((post) => ({
      title: post.data.h1,
      description: post.data.metaDescription,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id}`,
    })),
    customData: '<language>es-mx</language>',
    trailingSlash: false,
  });
};
