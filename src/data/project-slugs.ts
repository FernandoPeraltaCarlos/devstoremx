/** Nombre anterior, slug abreviado anterior y frase descriptiva del problema resuelto. */
const projectRoutes = [
  ['charlottes-web', 'actualizacion-tema-shopify', 'como-actualizar-un-tema-shopify-sin-perder-personalizaciones'],
  ['hsbc-innovation-banking', 'desarrollo-sitios-sitecore', 'como-desarrollar-y-publicar-sitios-web-en-sitecore'],
  ['hsbc-extension-chromium', 'extension-chromium-control-calidad', 'como-automatizar-el-control-de-calidad-con-una-extension-chromium'],
  ['cream-right', 'desarrollo-tema-shopify-productos', 'como-personalizar-el-inicio-y-las-paginas-de-producto-en-shopify'],
  ['palmers', 'landing-pages-promocionales-shopify', 'como-crear-landing-pages-promocionales-en-shopify'],
  ['exclusive-iron-doors', 'filtros-metafields-shopify', 'como-crear-filtros-de-productos-con-metafields-en-shopify'],
  ['laerdal', 'formularios-navegacion-shopify', 'como-personalizar-el-menu-y-los-formularios-de-una-tienda-shopify'],
  ['lerato', 'integracion-favoritos-shopify', 'como-integrar-una-lista-de-favoritos-en-shopify'],
  ['rivka', 'componentes-liquid-aplicacion-descuentos', 'como-desarrollar-componentes-liquid-y-una-app-de-descuentos-para-shopify'],
  ['structurall', 'desarrollo-tema-wordpress-personalizado', 'como-desarrollar-un-tema-wordpress-personalizado'],
  ['original-penguin', 'componentes-shopify-plantillas-email', 'como-personalizar-shopify-y-renovar-plantillas-de-email-html'],
  ['mezcal-viviente', 'sitio-web-bilingue-wordpress', 'como-crear-un-sitio-web-bilingue-con-wordpress-y-elementor'],
  ['rca', 'formularios-api-shopify-devoluciones', 'como-conectar-formularios-de-devolucion-con-la-api-de-shopify'],
  ['de-lena-pizzas', 'pagina-web-restaurante-menu-dinamico', 'como-crear-una-pagina-web-de-restaurante-con-menu-dinamico'],
  ['nutriandreaa', 'automatizacion-pagos-cursos-online', 'como-automatizar-el-acceso-a-cursos-con-stripe-zapier-y-teachable'],
  ['groovepro', 'plugins-woocommerce-envios-paquetes', 'como-personalizar-envios-y-paquetes-con-plugins-de-woocommerce'],
  ['grupo-aga', 'sitio-web-corporativo-wordpress', 'como-desarrollar-un-sitio-web-corporativo-con-wordpress'],
  ['stitchers-space', 'integracion-anuncios-javascript-typescript', 'como-integrar-anuncios-en-una-pagina-web-con-javascript-y-typescript'],
  ['10bet-latam', 'landing-pages-plantillas-email-cumplimiento', 'como-desarrollar-landing-pages-y-plantillas-de-email-para-casinos-online'],
  ['cofaa-sitio-institucional', 'migracion-sitio-web-modx', 'como-migrar-un-sitio-web-institucional-a-modx'],
  ['cofaa-gestion-tickets', 'sistema-web-gestion-tickets', 'como-centralizar-las-solicitudes-de-soporte-con-un-sistema-de-tickets'],
  ['cofaa-acuses', 'aplicacion-web-acuses-digitales', 'como-registrar-y-consultar-acuses-digitales-en-una-aplicacion-web'],
  ['cofaa-transparencia', 'portal-transparencia-notificaciones-correo', 'como-crear-un-portal-de-transparencia-con-avisos-por-correo'],
] as const;

/** Única fuente de slugs canónicos para la importación de proyectos. */
export const projectSlugs: Record<string, string> = Object.fromEntries(
  projectRoutes.map(([oldSlug, , slug]) => [oldSlug, slug]),
);

/** Compatibilidad con las rutas previas, sin cadenas de redirecciones. */
export const projectRedirects: Record<string, string> = Object.fromEntries(
  projectRoutes.flatMap(([oldSlug, shortSlug, slug]) => [oldSlug, shortSlug].map((previous) => [
    `/equipo/fernando-peralta/${previous}`,
    `/equipo/fernando-peralta/${slug}`,
  ])),
);
