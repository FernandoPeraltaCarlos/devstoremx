// Datos ficticios para la página de ejemplo /dashboard-cliente.
// Los títulos de las etapas salen de `steps` en landing.ts.

export type TaskStatus = 'aprobado' | 'en-progreso' | 'pendiente';

export const project = {
  name: 'Tienda en línea · Café Altura',
  service: 'Ecommerce',
  client: 'Café Altura',
  startDate: '1 sep 2026',
  deliveryDate: '30 oct 2026',
  progress: 62,
  // Índice de la etapa actual en `steps` (2 → "Desarrollo") y cuánto lleva de ella.
  currentStage: 2,
  stageProgress: 0.6,
  nextReview: '19 oct 2026',
} as const;

/** Fecha o nota de cada etapa, en el mismo orden que `steps`. */
export const stageNotes = ['3 sep', '8 sep', 'En curso', '19 oct', '30 oct'] as const;

export const deliverables: readonly { name: string; detail: string; status: TaskStatus; progress?: number }[] = [
  { name: 'Diseño de pantallas', detail: 'Aprobado el 14 sep', status: 'aprobado' },
  { name: 'Catálogo de productos', detail: 'Aprobado el 22 sep', status: 'aprobado' },
  { name: 'Desarrollo de páginas', detail: '70 %', status: 'en-progreso', progress: 70 },
  { name: 'Carrito y checkout', detail: '40 %', status: 'en-progreso', progress: 40 },
  { name: 'Integración de pagos', detail: 'Inicia el 5 oct', status: 'pendiente' },
  { name: 'Cálculo de envíos', detail: 'Inicia el 9 oct', status: 'pendiente' },
  { name: 'Pruebas en celular y navegadores', detail: 'Inicia el 14 oct', status: 'pendiente' },
  { name: 'Capacitación y entrega de accesos', detail: 'Semana del 26 oct', status: 'pendiente' },
];

export const activity = [
  { date: '29 sep', author: 'Miriam Medina', text: 'Terminó la página de producto con galería de fotos y selector de presentación.' },
  { date: '26 sep', author: 'Fernando Peralta', text: 'Publicamos una vista previa del sitio para que revises el avance desde tu celular.' },
  { date: '22 sep', author: 'Hazel Vázquez', text: 'Cargamos los primeros 40 productos del catálogo y quedaron aprobados.' },
  { date: '18 sep', author: 'Janice García', text: 'Empezó el desarrollo del carrito de compra y el resumen del pedido.' },
  { date: '14 sep', author: 'Fernando Peralta', text: 'Aprobaste el diseño de pantallas. Arranca la etapa de desarrollo.' },
] as const;

export const milestones = [
  { title: 'Integración de pagos', date: '5 oct 2026', icon: 'calendar' },
  { title: 'Llamada de revisión', date: '19 oct 2026', icon: 'message' },
  { title: 'Entrega del proyecto', date: '30 oct 2026', icon: 'check' },
] as const;

export const resources = [
  { label: 'Vista previa del sitio', hint: 'Se actualiza con cada avance' },
  { label: 'Diseño de pantallas', hint: 'Archivo de Figma' },
  { label: 'Propuesta y cotización', hint: 'PDF firmado' },
] as const;
