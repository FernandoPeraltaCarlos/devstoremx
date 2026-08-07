export function absoluteUrl(url: string, Astro: any) {
  const absoluteURL = new URL(url, Astro.site || Astro.url.origin).href;

  return absoluteURL;
}
