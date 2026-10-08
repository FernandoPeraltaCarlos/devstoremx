import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(new URL('../src/lib/indexnow-key.ts', import.meta.url), 'utf8');
const key = source.match(/indexnowKey = '([a-f0-9]+)'/)?.[1];
if (!key) {
  console.error('IndexNow: no se encontró la clave.');
  process.exit(0);
}

if (process.env.VERCEL_ENV !== 'production') {
  console.log('IndexNow: omitido fuera de un deploy de producción.');
  process.exit(0);
}

function walk(dir, found = []) {
  if (!existsSync(dir)) return found;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, found);
    else if (/^sitemap.*\.xml$/.test(name)) found.push(path);
  }
  return found;
}

const files = [...walk('dist'), ...walk('.vercel/output/static')];
const urls = [...new Set(files.flatMap((file) => [...readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])))]
  .filter((url) => url.startsWith('https://www.devstoremx.xyz'));

if (!urls.length) {
  console.log('IndexNow: no hay URLs en el sitemap.');
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'www.devstoremx.xyz',
    key,
    keyLocation: `https://www.devstoremx.xyz/${key}.txt`,
    urlList: urls.slice(0, 10000),
  }),
}).catch((error) => {
  console.warn(`IndexNow: no se pudo notificar (${error instanceof Error ? error.message : error}).`);
  return undefined;
});

if (response) console.log(`IndexNow: ${response.status} para ${Math.min(urls.length, 10000)} URLs.`);
process.exit(0);
