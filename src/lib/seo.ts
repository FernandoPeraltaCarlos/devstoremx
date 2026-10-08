import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PRIVATE_PATHS = new Set(['/dashboard-cliente', '/llms.txt', '/llms-full.txt', '/rss.xml']);

/** Public path without `.html` and without a trailing slash, except the site root. */
export function canonicalPathname(pathname: string): string {
  let path = pathname.split('?')[0]?.split('#')[0] || '/';
  if (path.endsWith('/index.html')) path = path.slice(0, -'index.html'.length);
  else if (path.endsWith('.html')) path = path.slice(0, -'.html'.length);
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path || '/';
}

export function absoluteUrl(origin: string, pathname: string): string {
  const base = origin.endsWith('/') ? origin : `${origin}/`;
  return new URL(canonicalPathname(pathname), base).href;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** True when at least one portfolio entry is a real, publishable case. */
export function portfolioIsPublic(): boolean {
  try {
    const dir = fileURLToPath(new URL('../content/proyectos/', import.meta.url));
    return readdirSync(dir)
      .filter((name) => name.endsWith('.md'))
      .some((name) => /^placeholder:\s*false\s*$/m.test(readFileSync(`${dir}/${name}`, 'utf8')));
  } catch {
    return false;
  }
}

export function isIndexableUrl(url: string): boolean {
  let pathname: string;
  try {
    pathname = canonicalPathname(new URL(url, 'https://www.devstoremx.xyz').pathname);
  } catch {
    return false;
  }
  if (PRIVATE_PATHS.has(pathname) || pathname.startsWith('/api/')) return false;
  if (pathname === '/equipo' || pathname.startsWith('/equipo/')) return false;
  if (pathname === '/portafolio' && !portfolioIsPublic()) return false;
  return true;
}
