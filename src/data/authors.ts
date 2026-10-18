const caseStudies = 'https://fernandoperalta.xyz/es/casos-de-estudio';

export interface AuthorLink {
  label: string;
  href: string;
}

export interface AuthorRole {
  role: string;
  company: string;
  period: string;
  summary: string;
  links: AuthorLink[];
}

export interface AuthorProfile {
  slug: string;
  metaDescription: string;
  headline: string;
  lede: string;
  about: string[];
  highlights: { label: string; value: string }[];
  specialties: { title: string; description: string; stack: string[] }[];
  roles: AuthorRole[];
  knowsAbout: string[];
  links: { linkedin: string; github: string; portfolio: string; cv: string };
}

/** Perfiles con página propia en /equipo/{slug}. Los datos salen del portafolio de cada persona. */
export const authorProfiles: Record<string, AuthorProfile> = {
  'fernando-peralta': {
    slug: 'fernando-peralta',
    metaDescription: 'Fernando Peralta, Technical Lead de Devstoremx: más de 7 años desarrollando sitios, tiendas Shopify y plataformas web. Experiencia, proyectos y artículos.',
    headline: 'Desarrollador web senior especializado en front-end, full stack y Shopify.',
    lede: 'Dirige la parte técnica de Devstoremx. Tiene más de 7 años de experiencia construyendo sitios, tiendas y plataformas, con Shopify como especialidad.',
    about: [
      'Fernando Peralta es desarrollador web senior con más de 7 años de experiencia. Trabaja tanto en el front-end (React, Next.js, Astro) como en el back-end (Node.js, PHP, SQL), y Shopify es su especialidad.',
      'En HSBC México implementó y revisó la calidad de unos 60 tickets al mes en más de 30 sitios de banca empresarial e Innovation Banking, y desarrolló una extensión de Chromium que redujo los errores un 80 % en un equipo de más de 20 desarrolladores, según auditorías mensuales.',
      'Antes lideró un equipo de desarrollo y diseño de tres personas en una agencia digital: 9 proyectos entregados y 3 cuentas continuas. En el camino ha construido temas de Shopify desde cero con enfoque en rendimiento y SEO técnico.',
      'En Devstoremx es Technical Lead: decide cómo se construye cada proyecto, revisa el trabajo técnico del equipo y escribe las entradas del blog.',
    ],
    highlights: [
      { label: 'Experiencia', value: 'Más de 7 años desarrollando sitios y tiendas' },
      { label: 'Especialidad', value: 'Shopify: temas desde cero con Liquid' },
      { label: 'En Devstoremx', value: 'Technical Lead y fundador' },
    ],
    specialties: [
      {
        title: 'Front-end',
        description: 'Interfaces, componentes y landing pages rápidas y fáciles de actualizar.',
        stack: ['React', 'Next.js', 'Astro', 'TypeScript', 'Tailwind'],
      },
      {
        title: 'Full stack',
        description: 'Back-ends, bases de datos, integraciones y despliegue detrás de las interfaces que construye.',
        stack: ['Node.js', 'PHP', 'Laravel', 'MySQL', 'AWS'],
      },
      {
        title: 'Shopify',
        description: 'Temas desde cero, funcionalidad de tienda y landing pages para marcas de ecommerce.',
        stack: ['Liquid', 'Online Store 2.0', 'Metafields', 'JavaScript', 'Tailwind'],
      },
      {
        title: 'WordPress',
        description: 'Sitios y WooCommerce, funcionalidad a medida en PHP, mantenimiento y mejoras de rendimiento.',
        stack: ['WordPress', 'WooCommerce', 'PHP', 'Core Web Vitals'],
      },
    ],
    roles: [
      {
        role: 'Shopify Developer',
        company: "Charlotte's Web",
        period: 'Feb 2026 – Ago 2026',
        summary: 'Actualizó el tema comercial de Shopify a una nueva versión: revisó las secciones de todas las páginas, migró settings y código custom en Liquid, CSS y JavaScript, y entregó el tema en staging para probar el flujo completo.',
        links: [{ label: "Caso de estudio: Charlotte's Web", href: `${caseStudies}/actualizacion-sitio-web-tema-shopify/` }],
      },
      {
        role: 'Web Production Manager',
        company: 'HSBC México',
        period: 'Nov 2024 – Ago 2026',
        summary: 'Coordinó entregables de desarrollo, contenido y cumplimiento regulatorio en más de 30 plataformas de banca empresarial e innovación, y participó en el lanzamiento de Innovation Banking para Singapur, India e Indonesia.',
        links: [
          { label: 'Caso de estudio: lanzamiento de Innovation Banking', href: `${caseStudies}/desarrollo-lanzamiento-sitio-web-sitecore/` },
          { label: 'Caso de estudio: extensión de Chromium para control de calidad', href: `${caseStudies}/desarrollo-extension-chromium-control-calidad-tickets/` },
        ],
      },
      {
        role: 'Shopify Developer',
        company: 'Applabmx',
        period: 'Jun 2024 – Abr 2025',
        summary: 'Desarrolló temas de Shopify para cinco tiendas: secciones del inicio, productos, colecciones, filtros con metafields, formularios e integración de favoritos.',
        links: [
          { label: 'Cream Right', href: `${caseStudies}/desarrollo-sitio-web-tema-shopify-inicio-producto/` },
          { label: 'Palmers', href: `${caseStudies}/landing-pages-promocionales-sitio-web-tema-shopify/` },
          { label: 'Exclusive Iron Doors', href: `${caseStudies}/filtros-colecciones-sitio-web-tema-shopify/` },
          { label: 'Lerato', href: `${caseStudies}/integracion-favoritos-sitio-web-tema-shopify/` },
          { label: 'Laerdal', href: `${caseStudies}/menu-formularios-sitio-web-tema-shopify/` },
        ],
      },
      {
        role: 'Shopify Developer',
        company: 'Rivka',
        period: 'Ene 2024 – Nov 2024',
        summary: 'Construyó componentes Liquid personalizados y temas desde cero para dos tiendas Shopify, integró apps de reseñas, suscripciones y envíos, y participó en una app de promo codes con Remix y React.',
        links: [{ label: 'Caso de estudio: componentes Liquid y app de promo codes', href: `${caseStudies}/componentes-liquid-shopify-y-app-promo-codes-remix/` }],
      },
      {
        role: 'Lead Web Developer',
        company: 'Industria Social',
        period: 'Dic 2021 – Feb 2025',
        summary: 'Lideró equipos, arquitectura y despliegues de sitios y apps con Astro, Next.js, TypeScript, PHP y Shopify para marcas como Original Penguin.',
        links: [
          { label: 'Original Penguin', href: `${caseStudies}/componentes-web-shopify-liquid-plantillas-email-html/` },
          { label: 'RCA', href: `${caseStudies}/formularios-web-shopify-api-devoluciones/` },
          { label: 'GroovePro', href: `${caseStudies}/plugins-woocommerce-envios-bundles-personalizados/` },
          { label: 'De Leña Pizzas', href: `${caseStudies}/sitio-web-restaurante-astro-menu-dinamico/` },
          { label: 'Mezcal Viviente', href: `${caseStudies}/desarrollo-sitio-web-bilingue-wordpress-elementor/` },
          { label: 'Structurall', href: `${caseStudies}/desarrollo-tema-personalizado-sitio-web-wordpress/` },
          { label: 'Nutriandreaa', href: `${caseStudies}/sitio-web-webflow-stripe-zapier-teachable/` },
        ],
      },
      {
        role: 'WordPress Developer',
        company: 'Brainfood Marketing',
        period: 'Oct 2023 – Jul 2024',
        summary: 'Desarrolló y mantuvo sitios WordPress con PHP, Elementor y WooCommerce, mejoró los tiempos de carga y los Core Web Vitals, e implementó analítica y SEO técnico.',
        links: [{ label: 'Caso de estudio: sitio de Grupo AGA', href: `${caseStudies}/desarrollo-sitio-web-corporativo-wordpress/` }],
      },
    ],
    knowsAbout: ['Shopify', 'Liquid', 'WordPress', 'WooCommerce', 'React', 'Next.js', 'Astro', 'TypeScript', 'Node.js', 'PHP', 'SEO técnico'],
    links: {
      linkedin: 'https://www.linkedin.com/in/fernandodperaltac/',
      github: 'https://github.com/fernandoperaltacarlos',
      portfolio: 'https://fernandoperalta.xyz/es/',
      cv: 'https://fernandoperalta.xyz/cv_es_fernandoperalta.pdf',
    },
  },
};

export function authorPath(slug: string): string | undefined {
  return Object.hasOwn(authorProfiles, slug) ? `/equipo/${slug}` : undefined;
}
