/** Reading estimate for the visible article, excluding Markdown markup. */
export function readingMinutes(body = ''): number {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#>*_~`|]/g, ' ');
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 220));
}
