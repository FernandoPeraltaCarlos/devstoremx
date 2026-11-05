import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Read-only comparison of page exports from gscServer.get_advanced_search_analytics.
// Request WEB, dimensions=page, data_state=final, no filters, all rows, equal windows.
export function parseSnapshot(value) {
  const data = typeof value.result === 'string' ? JSON.parse(value.result) : value;
  if (data.site_url !== 'sc-domain:devstoremx.xyz' || data.search_type !== 'WEB' ||
      JSON.stringify(data.dimensions) !== '["page"]' || !Array.isArray(data.rows) ||
      data.filters_applied?.length !== 0 || data.pagination?.has_more !== false ||
      data.pagination?.start_row !== 0 || data.pagination?.row_count !== data.rows.length) {
    throw new Error('Exporta todas las filas de la propiedad devstoremx, tipo WEB, dimensión page y sin filtros. No se admiten exportaciones parciales.');
  }
  const start = Date.parse(data.date_range?.start);
  const end = Date.parse(data.date_range?.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) throw new Error('Periodo inválido.');
  const pages = new Set();
  for (const row of data.rows) {
    const url = new URL(row.page);
    if (!['devstoremx.xyz', 'www.devstoremx.xyz'].includes(url.hostname) || pages.has(row.page)) throw new Error('URL ajena o duplicada en la exportación.');
    pages.add(row.page);
    if (!['clicks', 'impressions', 'position'].every((key) => Number.isFinite(row[key]) && row[key] >= 0)) throw new Error('Métricas inválidas.');
  }
  return { ...data, days: (end - start) / 86400000 + 1 };
}

export function compareSnapshots(before, after) {
  const a = parseSnapshot(before);
  const b = parseSnapshot(after);
  if (a.days !== b.days) throw new Error('Compara periodos de igual duración.');
  const oldRows = new Map(a.rows.map((row) => [row.page, row]));
  const newRows = new Map(b.rows.map((row) => [row.page, row]));
  // Keep historical host variants separate: do not imply a canonical migration is lost traffic.
  return [...new Set([...oldRows.keys(), ...newRows.keys()])].sort().map((page) => {
    const old = oldRows.get(page);
    const current = newRows.get(page);
    return {
      page,
      before: old ?? null,
      after: current ?? null,
      clickChange: old && current ? current.clicks - old.clicks : null,
      // Positive means an improvement (a lower average position).
      positionImprovement: old?.impressions && current?.impressions ? old.position - current.position : null,
    };
  });
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const [file, baseline] = process.argv.slice(2).filter((arg) => arg !== '--');
  if (!file) {
    console.error('Uso: pnpm seo:compare <export-gsc.json> [baseline.json]\nExporta con GSC MCP: dimensions=page, search_type=WEB, data_state=final, sin filtros, row_limit=25000 y todas las páginas. Usa periodos completos de 28 días.');
    process.exitCode = 1;
  } else {
    try {
      const before = JSON.parse(readFileSync(baseline ?? new URL('../metrics/gsc-baseline-2026-11-02.json', import.meta.url), 'utf8'));
      const after = JSON.parse(readFileSync(file, 'utf8'));
      const a = parseSnapshot(before);
      const b = parseSnapshot(after);
      console.log(`${a.date_range.start}–${a.date_range.end} → ${b.date_range.start}–${b.date_range.end}`);
      console.table(compareSnapshots(before, after).map((row) => ({
        página: row.page.replace('https://www.devstoremx.xyz', ''),
        'clics antes': row.before?.clicks ?? 'sin fila',
        'clics después': row.after?.clicks ?? 'sin fila',
        'Δ clics': row.clickChange ?? '—',
        'impresiones después': row.after?.impressions ?? 'sin fila',
        'CTR después': row.after?.impressions ? `${(100 * row.after.clicks / row.after.impressions).toFixed(2)}%` : '—',
        'posición después': row.after?.impressions ? row.after.position : '—',
        'mejora posición (+)': row.positionImprovement === null ? '—' : Number(row.positionImprovement.toFixed(1)),
      })));
      console.log('Sin fila no significa cero. La suma por URL no equivale al total de la propiedad. GSC no mide leads ni citas en IA. Confirma datos finales al exportar; revisa contactos recibidos por separado.');
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    }
  }
}
