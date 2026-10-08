// @ts-check
import { defineConfig, envField } from 'astro/config';

import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { canonicalPathname, isIndexableUrl } from './src/lib/seo.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.devstoremx.xyz',
  // @astrojs/vercel fuerza build.format = 'directory'. trailingSlash: 'never'
  // hace que el deploy responda 308 desde la URL con barra hacia la canónica.
  trailingSlash: 'never',
  adapter: vercel(),
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  integrations: [
    preact(),
    sitemap({
      filter: (page) => isIndexableUrl(page),
      serialize(item) {
        const url = new URL(item.url);
        url.pathname = canonicalPathname(url.pathname);
        return { ...item, url: url.href };
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] }
});
