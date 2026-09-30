export const services = [
  {
    number: '01',
    slug: 'desarrollo-web',
    title: 'Desarrollo web',
    description: 'Sitios corporativos rápidos, seguros y fáciles de actualizar, hechos a la medida de tu negocio.',
    icon: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
  },
  {
    number: '02',
    slug: 'landing-pages',
    title: 'Landing pages',
    description: 'Páginas enfocadas en una sola acción: que tu visitante cotice, compre o se registre.',
    icon: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18M9 21V9"></path>',
  },
  {
    number: '03',
    slug: 'ecommerce',
    title: 'Ecommerce',
    description: 'Tiendas en línea con pagos, inventario y envíos integrados, listas para vender desde el primer día.',
    icon: '<circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>',
  },
  {
    number: '04',
    slug: 'email-templates',
    title: 'Email templates',
    description: 'Plantillas de correo que se ven bien en Gmail, Outlook y el celular, con tu marca en cada envío.',
    icon: '<rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>',
  },
  {
    number: '05',
    slug: 'automatizaciones',
    title: 'Automatizaciones',
    description: 'Conectamos tus herramientas para que las tareas repetitivas se hagan solas y tu equipo gane tiempo.',
    icon: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path>',
  },
  {
    number: '06',
    slug: 'apps-moviles',
    title: 'Apps móviles',
    description: 'Aplicaciones para iOS y Android con la experiencia fluida que tus usuarios esperan.',
    icon: '<rect x="5" y="2" width="14" height="20" rx="2"></rect><path d="M12 18h.01"></path>',
  },
  {
    number: '07',
    slug: 'administracion-de-sitios-web',
    title: 'Administración de sitios web',
    description: 'Actualizaciones, respaldos, seguridad y cambios de contenido: nos encargamos de que tu sitio siga funcionando.',
    icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
  },
  {
    number: '08',
    slug: 'apps-web',
    title: 'Apps web',
    description: 'Plataformas y sistemas que funcionan desde el navegador: portales de clientes, dashboards y reservas.',
    icon: '<rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M10 4v4M2 8h20M6 4v4"></path>',
  },
  {
    number: '09',
    slug: 'soluciones-digitales',
    title: 'Integraciones',
    description: 'Integraciones con IA, APIs y herramientas a la medida para los retos que no se resuelven con software de caja.',
    icon: '<path d="m12 2 10 5-10 5L2 7z"></path><path d="m2 17 10 5 10-5"></path><path d="m2 12 10 5 10-5"></path>',
  },
] as const;

export const footerServiceSlugs = ['desarrollo-web', 'ecommerce', 'apps-moviles', 'automatizaciones'] as const;

export const steps = [
  {
    number: '01',
    title: 'Llamada de acercamiento',
    description: 'Escuchamos tu negocio, tus objetivos y lo que necesitas resolver.',
  },
  {
    number: '02',
    title: 'Planeación y cotización',
    description: 'Definimos alcance, tiempos y costo por escrito, antes de escribir una línea de código.',
  },
  {
    number: '03',
    title: 'Desarrollo',
    description: 'Diseñamos y construimos tu proyecto, y te mantenemos informado en todo momento.',
  },
  {
    number: '04',
    title: 'Llamada de revisión',
    description: 'Revisamos juntos el resultado y ajustamos los detalles contigo.',
  },
  {
    number: '05',
    title: 'Entrega',
    description: 'Publicamos tu proyecto y te entregamos accesos y todo lo necesario para operarlo.',
  },
] as const;

export const technologies = ['Shopify', 'WordPress', 'React', 'Next.js', 'OpenAI', 'Anthropic', 'AWS', 'Figma'] as const;

export const team = [
  { name: 'Fernando Peralta', role: 'Technical Lead', image: '/team/fernando-peralta.jpg', tone: 'light', linkedin: 'https://www.linkedin.com/in/fernandodperaltac/', portfolio: 'https://fernandoperalta.xyz' },
  { name: 'Miriam Medina', role: 'Full Stack Developer', image: '/team/miriam-medina.jpg', tone: 'light', linkedin: '', portfolio: '' },
  { name: 'Hazel Vázquez', role: 'Full Stack Developer', image: '/team/hazel-vazquez.jpg', tone: 'light', linkedin: '', portfolio: '' },
  { name: 'Janice García', role: 'Full Stack Developer', image: '/team/janice-garcia.jpg', tone: 'light', linkedin: '', portfolio: '' },
] as const;

export const defaultTitle = 'Devstoremx · Desarrollo web y soluciones digitales en México';
export const defaultDescription = 'Diseñamos, desarrollamos y mantenemos tu presencia digital. Sitios web, ecommerce, apps y automatizaciones a la medida de tu negocio.';
export const ogImageAlt = 'devstoremx, desarrollo web y soluciones digitales en México';

// Completar estos valores al conectar los recursos reales.
// Los textos entre corchetes no se muestran ni se envían en datos estructurados.
// formEndpoint acepta POST JSON: name, email, phone, message y el honeypot company.
export const site = {
  url: 'https://www.devstoremx.xyz',
  ogImage: '/devstore_mx.png',
  sameAs: [] as string[],
  heroImage: '',
  contactImage: '/devstoremx-contacto-9x16.png',
  videoSrc: '', // Archivo de video local o URL directa compatible con <video>.
  videoPoster: '',
  videoDuration: '[Duración]',
  formEndpoint: '/api/contact',
  whatsappUrl: '', // https://wa.me/52... con el número real.
  linkedinUrl: '',
  email: 'hola@devstoremx.xyz',
  phone: '[Teléfono / WhatsApp]',
  location: '[Ciudad], México',
};

export const faqs = [
  {
    question: '¿Cuánto cuesta mi proyecto?',
    answer: 'Depende de lo que necesitas resolver y del alcance del trabajo. Después de una primera llamada, te compartimos una propuesta con costo, tiempos y entregables antes de empezar.',
  },
  {
    question: '¿Cuánto tiempo toma desarrollar un proyecto?',
    answer: 'El plazo depende del alcance y la complejidad del proyecto. Acordamos un calendario contigo antes de comenzar, considerando también el contenido y las revisiones que se necesiten.',
  },
  {
    question: '¿Qué recibo al terminar el proyecto?',
    answer: 'Recibes los entregables acordados y los accesos e indicaciones necesarios para usar y administrar tu proyecto. Todo queda definido en la propuesta desde el inicio.',
  },
  {
    question: '¿Ofrecen mantenimiento después de la entrega?',
    answer: 'Sí. Podemos ayudarte con mantenimiento, actualizaciones y mejoras. El alcance de ese acompañamiento se acuerda según lo que necesite tu proyecto.',
  },
  {
    question: '¿Necesito tener mi idea completamente definida?',
    answer: 'No. Basta con contarnos qué quieres lograr o qué problema buscas resolver. Te ayudamos a aterrizar la idea y definir qué necesita el proyecto para empezar.',
  },
  {
    question: '¿Pueden mejorar un proyecto que ya tengo?',
    answer: 'Sí. Revisamos lo que tienes y los cambios que necesitas para proponerte cómo avanzar, ya sea con mejoras, nuevas funciones o una renovación.',
  },
  {
    question: '¿Cómo puedo revisar los avances de mi proyecto?',
    answer: 'Te mantenemos al tanto durante el desarrollo y revisamos contigo el resultado para recibir tus comentarios y ajustar los detalles antes de la entrega.',
  },
  {
    question: '¿Cómo empiezo?',
    answer: 'Cuéntanos brevemente qué necesitas en el formulario de contacto. A partir de ahí, coordinamos una primera llamada para conocer tu proyecto y definir los siguientes pasos.',
  },
] as const;

export const navigation = [
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#proceso', label: 'Proceso' },
  { href: '/#dashboard', label: 'Dashboard' },
  { href: '/#nosotros', label: 'Nosotros' },
  ...(site.videoSrc ? [{ href: '/#video', label: 'Video' }] : []),
  { href: '/#preguntas', label: 'Preguntas' },
];

/** Empty strings and bracket placeholders stay unpublished. */
export function publicValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? '';
  if (!trimmed || trimmed.includes('[')) return undefined;
  return trimmed;
}

export function metaDescription(): string {
  const location = publicValue(site.location);
  if (!location) return defaultDescription;
  return `${defaultDescription.replace(/\.$/, '')} en ${location}.`;
}

export function organizationSameAs(): string[] {
  return [...new Set([...site.sameAs, site.linkedinUrl, site.whatsappUrl].map((url) => url.trim()).filter(Boolean))];
}

export function postalAddress(location: string) {
  const locality = location.replace(/,?\s*méxico\s*$/i, '').trim();
  return {
    '@type': 'PostalAddress',
    ...(locality ? { addressLocality: locality } : {}),
    addressCountry: 'MX',
  };
}
