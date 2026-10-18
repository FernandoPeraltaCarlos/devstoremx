import { projectSlugs } from './project-slugs.ts';

export interface ProjectContent {
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  sections: { title: string; paragraphs: string[] }[];
  deliverables: string[];
  faqs: { question: string; answer: string }[];
  proof: string;
  cta: { title: string; text: string; label: string };
}

/** Contenido editorial comercial. El detalle del caso permanece en el portafolio personal. */
const content: Record<string, ProjectContent> = {
  'charlottes-web': {
    title: 'Cómo actualizar un tema Shopify sin perder tus personalizaciones',
    metaTitle: 'Actualizar tema Shopify sin perder cambios | Devstoremx',
    description: 'Actualizamos temas Shopify con secciones y código personalizados. Revisamos qué conservar, migramos los cambios y probamos la tienda antes de publicar.',
    intro: 'Actualizar un tema Shopify personalizado requiere trasladar sus secciones, configuraciones y código a la nueva versión, y comprobar que la tienda siga funcionando. En Devstoremx podemos encargarnos de esa migración para que tu equipo no tenga que reconstruir la tienda por su cuenta.',
    sections: [
      { title: 'Cuando actualizar deja de ser un botón', paragraphs: ['El tema recibe mejoras, pero tu tienda ya tiene bloques propios, estilos y funciones que no venían con la compra. Instalar la versión nueva no significa que esas modificaciones viajen con ella. El riesgo es aprobar una portada que se ve bien y descubrir después que faltan funciones en productos o colecciones.', 'Revisamos el tema actual y la versión de destino para identificar qué pertenece al proveedor y qué se desarrolló para tu negocio. Esa separación define la migración y evita empezar de cero por una actualización.'] },
      { title: 'Conservar la operación, no solo la apariencia', paragraphs: ['Trabajamos sobre una copia del tema, trasladamos las configuraciones acordadas y adaptamos Liquid, CSS y JavaScript cuando cambia la estructura. No sustituimos la tienda activa mientras se está construyendo.', 'La revisión contempla las páginas y los recorridos definidos en el alcance: navegación, producto, carrito y comportamiento de las integraciones que se hayan incluido. La publicación se acuerda después de esa validación, no como parte de una prueba sobre tus clientes.'] },
    ],
    deliverables: ['Inventario de personalizaciones que deben conservarse.', 'Migración de secciones y configuraciones acordadas.', 'Adaptación del código a la versión nueva.', 'Tema de prueba y revisión conjunta antes de publicar.'],
    faqs: [
      { question: '¿Se puede actualizar un tema Shopify modificado?', answer: 'Sí, pero primero hay que revisar qué cambió respecto al tema original. La propuesta distingue lo que se puede migrar y lo que necesita adaptarse o rehacerse.' },
      { question: '¿Necesitan trabajar sobre la tienda publicada?', answer: 'La migración del tema se prepara en una copia para revisión. Los accesos y cualquier intervención sobre la tienda activa se acuerdan contigo.' },
      { question: '¿Pueden conservar todas mis apps?', answer: 'Revisamos las apps incluidas en el proyecto y su compatibilidad. No prometemos que cualquier integración externa funcione sin ajustes con una versión nueva.' },
    ],
    proof: 'Fernando migró configuraciones y secciones personalizadas de un tema comercial de Shopify para Charlotte’s Web, con adaptación de código y entrega en staging.',
    cta: { title: 'Actualiza tu tema sin convertirlo en otro proyecto pendiente', text: 'Compártenos tu tienda, el tema que utiliza y lo que necesitas conservar. Evaluamos la migración y te presentamos el alcance por escrito.', label: 'Quiero actualizar mi tema Shopify' },
  },
  'hsbc-innovation-banking': {
    title: 'Cómo desarrollar y publicar sitios web en Sitecore con revisión de calidad',
    metaTitle: 'Desarrollo y publicación web en Sitecore | Devstoremx',
    description: 'Desarrollo, revisión y publicación de páginas en Sitecore para equipos empresariales. Coordinamos contenido, componentes y validación del lanzamiento.',
    intro: 'Un lanzamiento en Sitecore combina desarrollo de páginas, contenido aprobado, control de calidad y un despliegue coordinado. Devstoremx puede apoyar a tu equipo en esas tareas, con un alcance definido y respetando los procesos de acceso y publicación de tu organización.',
    sections: [
      { title: 'El lanzamiento necesita algo más que páginas terminadas', paragraphs: ['Una página puede estar construida y seguir sin estar lista: falta una aprobación, el contenido regional no coincide o un enlace lleva a otra versión del sitio. En un CMS empresarial esas dependencias deben verse antes de la fecha de publicación.', 'Definimos con tu equipo las páginas que se van a intervenir, quién aprueba el contenido y qué entornos están disponibles. Así el desarrollo puede avanzar sin confundir una entrega técnica con una autorización para salir a producción.'] },
      { title: 'Implementación y control de calidad dentro de tu flujo', paragraphs: ['Podemos trabajar sobre páginas y componentes existentes con Sitecore y HTML, revisar la implementación y dar seguimiento a las observaciones. Si el encargo requiere arquitectura o capacidades que no están en el sitio, se evalúan por separado.', 'La revisión se organiza por entregables y entornos, para que contenido, desarrollo y aprobación compartan el mismo estado. El apoyo al despliegue se ajusta a los permisos y al procedimiento de publicación de tu empresa.'] },
    ],
    deliverables: ['Relación de páginas y responsabilidades del lanzamiento.', 'Implementación sobre el CMS y componentes acordados.', 'Revisión de contenido, enlaces y presentación.', 'Seguimiento de observaciones y apoyo a la publicación.'],
    faqs: [
      { question: '¿Pueden apoyar a un equipo que ya utiliza Sitecore?', answer: 'Sí. Revisamos la versión, los componentes disponibles, los entornos y el alcance solicitado antes de confirmar cómo incorporarnos al trabajo.' },
      { question: '¿Se encargan de aprobar el contenido regulatorio?', answer: 'No sustituimos la aprobación legal o regulatoria de tu organización. Implementamos el contenido autorizado y coordinamos las revisiones que correspondan al proyecto.' },
      { question: '¿Pueden trabajar con varios sitios regionales?', answer: 'Podemos revisar un encargo con varias regiones. Se definen las páginas, las variantes de contenido y los responsables de aprobación de cada sitio.' },
    ],
    proof: 'Fernando participó en desarrollo, QC y despliegue de sitios regionales de HSBC Innovation Banking, utilizando Sitecore, HTML y seguimiento en Monday.com.',
    cta: { title: 'Refuerza el equipo de tu próximo lanzamiento', text: 'Cuéntanos qué páginas necesitas publicar, qué entornos tienes y cómo funciona tu aprobación. Revisamos qué apoyo de desarrollo tiene sentido.', label: 'Hablemos de mi proyecto en Sitecore' },
  },
  'hsbc-extension-chromium': {
    title: 'Cómo automatizar el control de calidad con una extensión de Chromium',
    metaTitle: 'Extensiones Chromium para control de calidad | Devstoremx',
    description: 'Desarrollamos extensiones de Chromium para revisar tareas y reducir trabajo manual en el navegador. Definimos controles, permisos y distribución interna.',
    intro: 'Una extensión de Chromium puede reunir comprobaciones y datos que tu equipo hoy revisa manualmente en el navegador. En Devstoremx desarrollamos herramientas internas para flujos concretos: entender el proceso y sus permisos es más importante que sumar botones a una extensión.',
    sections: [
      { title: 'Cuando la misma revisión ocupa parte de cada ticket', paragraphs: ['Cambian las personas y los proyectos, pero se repiten las mismas comprobaciones: localizar un identificador, copiar un dato, revisar una lista y dejar constancia. Cuando todo depende de la memoria, resulta difícil saber qué se revisó y qué quedó pendiente.', 'Analizamos qué controles son repetibles y qué decisiones necesitan criterio humano. Una herramienta útil ayuda a revisar mejor; no debe marcar como aprobado algo que no puede comprobar.'] },
      { title: 'Una herramienta adaptada al navegador de tu equipo', paragraphs: ['El desarrollo puede leer elementos de páginas autorizadas, reunir información y mostrar estados o listas de control. Cada función se diseña alrededor de los sitios que utiliza tu equipo, no como un producto genérico que después debes adaptar.', 'Los permisos, el manejo de datos y la distribución forman parte del encargo. Si cambia la interfaz del sistema que se revisa, también puede hacer falta mantenimiento; ese escenario se considera antes de entregar la herramienta.'] },
    ],
    deliverables: ['Mapa del proceso y controles que pueden automatizarse.', 'Extensión con permisos definidos para los sitios acordados.', 'Interfaz de revisión y estados comprensibles.', 'Pruebas con usuarios y documentación de distribución.'],
    faqs: [
      { question: '¿Puede una extensión revisar nuestro sistema interno?', answer: 'Depende de los accesos, las políticas de la empresa y la información disponible en el navegador. Lo confirmamos antes de proponer funciones.' },
      { question: '¿La extensión reemplaza a quien hace QA?', answer: 'No. Puede automatizar comprobaciones repetidas y apoyar el registro de la revisión. Las decisiones que requieren interpretación siguen teniendo una persona responsable.' },
      { question: '¿Garantizan una reducción específica de errores?', answer: 'No prometemos un porcentaje sin medir tu proceso. Los resultados de otro equipo sirven como referencia de experiencia, no como garantía para una operación distinta.' },
    ],
    proof: 'Fernando desarrolló una extensión interna de control de tickets en HSBC México. En ese contexto se documentó una reducción del 80 % de errores según auditorías mensuales.',
    cta: { title: 'Convierte una revisión repetitiva en una herramienta de trabajo', text: 'Descríbenos qué revisa tu equipo y en qué sitios lo hace. Evaluamos si una extensión es la solución adecuada.', label: 'Quiero automatizar las revisiones de mi equipo' },
  },
  'cream-right': {
    title: 'Cómo personalizar el inicio y las páginas de producto en Shopify',
    metaTitle: 'Personalizar inicio y producto en Shopify | Devstoremx',
    description: 'Personalizamos el inicio y las fichas de producto de tu tienda Shopify con Liquid. Diseño para tu catálogo y secciones que tu equipo pueda operar.',
    intro: 'Personalizar Shopify significa adaptar el tema al contenido y a la compra de tu catálogo, no solo cambiar sus colores. Devstoremx puede desarrollar secciones del inicio y páginas de producto cuando el tema actual ya no explica bien lo que vendes.',
    sections: [
      { title: 'La información del producto no cabe en el tema', paragraphs: ['Una ficha que funciona para un artículo sencillo puede quedarse corta con accesorios, variantes o condiciones importantes. Si cada cliente necesita preguntar por chat lo que falta, el sitio está dejando parte de la explicación fuera de la compra.', 'Revisamos un grupo representativo de productos y el contenido que realmente necesita el visitante. Esa muestra permite definir componentes reutilizables en lugar de diseñar una página distinta para cada SKU.'] },
      { title: 'Diseño propio sin perder la edición del catálogo', paragraphs: ['Podemos construir secciones con Liquid, HTML, CSS y JavaScript, conectadas a los datos disponibles en Shopify. La propuesta distingue qué podrá cambiar tu equipo desde el editor y qué requiere intervención técnica.', 'También revisamos cómo conviven las secciones con variantes, imágenes y apps incluidas en el alcance. La aprobación considera el uso en celular y el contenido real, no únicamente una maqueta con textos cortos.'] },
    ],
    deliverables: ['Definición de las secciones del inicio y la ficha.', 'Componentes Liquid para el catálogo acordado.', 'Campos editables y comportamiento responsive.', 'Revisión de variantes, contenido y apps incluidas.'],
    faqs: [
      { question: '¿Es necesario cambiar todo el tema?', answer: 'No siempre. Primero revisamos si el tema existente permite incorporar las secciones necesarias sin una sustitución completa.' },
      { question: '¿El equipo podrá editar las secciones nuevas?', answer: 'Definimos los campos editables durante el proyecto. No todas las reglas de una sección deben quedar abiertas, pero el contenido habitual puede prepararse para el editor.' },
      { question: '¿Pueden trabajar con productos que tienen muchas variantes?', answer: 'Sí, previa revisión del catálogo y de las restricciones del tema y la plataforma. La propuesta describe qué casos se contemplan.' },
    ],
    proof: 'En Applabmx, Fernando desarrolló el inicio y la pantalla de producto del tema Shopify de Cream Right con Liquid, HTML, CSS y JavaScript.',
    cta: { title: 'Haz que tu tienda explique mejor tu producto', text: 'Muéstranos una ficha que no funciona y el contenido que debería presentar. Podemos convertirlo en un encargo de diseño y desarrollo.', label: 'Quiero personalizar mi tienda Shopify' },
  },
  'palmers': {
    title: 'Cómo crear landing pages promocionales dentro de Shopify',
    metaTitle: 'Landing pages promocionales en Shopify | Devstoremx',
    description: 'Creamos landing pages y secciones de campaña en Shopify. Conectamos mensajes, colecciones y promociones sin sacar al visitante de tu tienda.',
    intro: 'Una landing promocional en Shopify debe llevar al visitante desde la campaña hasta los productos y las condiciones correctas. En Devstoremx construimos esas páginas dentro de tu tienda para que una promoción no dependa de enviar a todos al mismo inicio.',
    sections: [
      { title: 'El anuncio promete una campaña, el sitio muestra otra cosa', paragraphs: ['Enviar tráfico de una promoción a una portada genérica obliga al visitante a buscar productos, descuentos y condiciones por su cuenta. La campaña pierde continuidad aunque el tema sea atractivo.', 'Definimos el mensaje, el catálogo de la promoción y la acción principal. A partir de ahí diseñamos la página, las secciones necesarias y el recorrido hacia la colección o el producto correspondiente.'] },
      { title: 'Una campaña que el equipo pueda publicar y retirar', paragraphs: ['El desarrollo puede incluir bloques promocionales, páginas de colección y un popup cuando tenga una función clara. No proponemos un popup por costumbre: primero se decide qué debe comunicar y en qué momento.', 'El alcance también contempla cómo actualizar el contenido y qué ocurrirá al terminar la campaña. Las reglas comerciales del descuento se revisan con las opciones de Shopify y las apps que ya utiliza el negocio.'] },
    ],
    deliverables: ['Estructura de la landing y contenido de campaña.', 'Secciones promocionales conectadas al catálogo.', 'Popup o ajustes de colección cuando se acuerden.', 'Revisión móvil y pautas para cambiar o retirar la campaña.'],
    faqs: [
      { question: '¿La landing puede vivir dentro de mi tienda Shopify?', answer: 'Sí. Revisamos el tema y la estructura de navegación para integrarla en la tienda, con una URL y un recorrido propios.' },
      { question: '¿El desarrollo incluye administrar los anuncios?', answer: 'No de forma implícita. Este encargo se centra en la página y su recorrido; cualquier trabajo de campañas publicitarias debe acordarse por separado.' },
      { question: '¿Se puede reutilizar la página en otra promoción?', answer: 'Podemos preparar secciones editables para campañas recurrentes. La reutilización depende de qué parte del diseño y las reglas cambie entre promociones.' },
    ],
    proof: 'Fernando desarrolló landing pages promocionales, un popup de inicio y la pantalla de colecciones de Palmer’s México durante su trabajo en Applabmx.',
    cta: { title: 'Dale a tu campaña una página preparada para recibirla', text: 'Cuéntanos qué vas a promocionar y qué necesita hacer el visitante. Acordamos la landing y sus entregables antes de construir.', label: 'Hablemos de mi campaña en Shopify' },
  },
  'exclusive-iron-doors': {
    title: 'Cómo crear filtros de productos con metafields en Shopify',
    metaTitle: 'Filtros con metafields para tiendas Shopify | Devstoremx',
    description: 'Desarrollamos filtros de colecciones Shopify con metafields. Organizamos atributos y opciones para que el cliente encuentre el producto adecuado.',
    intro: 'Los filtros con metafields permiten organizar una colección por atributos del producto que el tema no siempre presenta de forma útil. Devstoremx puede ayudarte a estructurar esos datos y desarrollar una experiencia de búsqueda adecuada a tu catálogo.',
    sections: [
      { title: 'Un catálogo grande no se resuelve mostrando más tarjetas', paragraphs: ['Cuando importan medidas, materiales o características específicas, recorrer toda la colección se vuelve trabajo del comprador. Un filtro mal planteado tampoco ayuda: muestra opciones vacías o utiliza nombres que solo entiende el equipo interno.', 'Revisamos qué atributos cambian la elección y cómo están guardados en Shopify. Antes de desarrollar la interfaz se define qué datos faltan, cuáles deben normalizarse y quién los mantendrá.'] },
      { title: 'Datos consistentes y una interfaz que responda', paragraphs: ['Diseñamos los controles y el comportamiento sobre el tema y las capacidades de la tienda. La propuesta separa la carga o limpieza de atributos del desarrollo de filtros, porque son trabajos distintos.', 'También revisamos el resultado al combinar opciones y la experiencia móvil. Si hay integraciones como favoritos o galerías que afectan a la colección, se evalúan dentro del alcance para evitar comportamientos contradictorios.'] },
    ],
    deliverables: ['Definición de atributos y metafields del catálogo.', 'Diseño y desarrollo de controles de filtrado.', 'Estados de resultados y combinaciones acordadas.', 'Validación con productos reales en móvil y escritorio.'],
    faqs: [
      { question: '¿Sirve si mis productos todavía no tienen metafields?', answer: 'Sí, pero habrá que definir y completar los atributos necesarios. La preparación del catálogo se contempla como una responsabilidad concreta del proyecto.' },
      { question: '¿Necesito instalar una app de filtros?', answer: 'No necesariamente. Se revisan las capacidades de Shopify, el tema y el catálogo antes de recomendar una app o desarrollo adicional.' },
      { question: '¿Pueden corregir filtros que ya existen?', answer: 'Podemos revisar su lógica y sus datos. A veces el problema está en los atributos del catálogo y no solo en la interfaz.' },
    ],
    proof: 'Fernando implementó filtros con metafields y secciones de colecciones para Exclusive Iron Doors como Shopify Developer en Applabmx.',
    cta: { title: 'Ayuda a tus clientes a encontrar el producto correcto', text: 'Comparte una colección y las características por las que compra tu cliente. Definimos qué filtros necesita realmente.', label: 'Quiero mejorar los filtros de mi tienda' },
  },
  'laerdal': {
    title: 'Cómo personalizar el menú y los formularios de una tienda Shopify',
    metaTitle: 'Menús y formularios personalizados en Shopify | Devstoremx',
    description: 'Personalizamos navegación, submenús y formularios en Shopify. Organizamos el catálogo y las solicitudes para que la tienda sea más fácil de usar.',
    intro: 'Un menú claro y formularios bien definidos ayudan a encontrar productos y enviar la solicitud correcta. En Devstoremx adaptamos esas partes del tema Shopify cuando la navegación actual o los campos disponibles ya no responden a tu operación.',
    sections: [
      { title: 'El visitante no debería conocer tu organización interna', paragraphs: ['Las categorías de un almacén no siempre son las categorías que reconoce quien compra. Un menú con demasiados niveles puede esconder el producto; uno demasiado corto puede obligar a usar el buscador para todo.', 'Revisamos el catálogo y las consultas que recibe tu equipo. Esa información sirve para ordenar accesos, submenús y páginas de ayuda sin convertir el encabezado en un directorio interminable.'] },
      { title: 'Solicitudes con los datos que tu equipo necesita', paragraphs: ['Los formularios pueden recoger información específica para una consulta, una solicitud comercial o atención posventa. Se acuerdan los campos, el destino y la confirmación que recibirá el visitante.', 'El trabajo incluye el comportamiento del menú y los formularios en celular. Si una solicitud debe entrar a un sistema externo, esa integración se define explícitamente y no se da por resuelta al añadir el formulario.'] },
    ],
    deliverables: ['Propuesta de navegación y submenús.', 'Componentes del tema adaptados a móvil.', 'Formularios con campos, validaciones y destino definidos.', 'Revisión del recorrido y páginas de ayuda incluidas.'],
    faqs: [
      { question: '¿Pueden cambiar el menú sin rediseñar toda la tienda?', answer: 'Sí, si el tema lo permite. Revisamos su estructura y las modificaciones existentes antes de delimitar la intervención.' },
      { question: '¿Los formularios pueden tener campos distintos?', answer: 'Sí. Definimos qué información necesita cada solicitud y evitamos pedir datos que no se van a utilizar.' },
      { question: '¿Pueden conectar el formulario con mi CRM?', answer: 'Podemos evaluar la integración si el CRM ofrece una vía de conexión. Los accesos, campos y reglas de envío se cotizan como parte del alcance acordado.' },
    ],
    proof: 'Fernando desarrolló el menú, submenús y formularios de Laerdal en Shopify durante su trabajo en Applabmx, además de páginas de producto y ayuda.',
    cta: { title: 'Haz más fácil encontrar y preguntar', text: 'Cuéntanos dónde se pierden los visitantes y qué solicitudes necesita atender tu equipo. Revisamos navegación y formularios como un mismo recorrido.', label: 'Quiero mejorar la navegación de mi Shopify' },
  },
  'lerato': {
    title: 'Cómo integrar una lista de favoritos en Shopify',
    metaTitle: 'Integrar favoritos en tu tienda Shopify | Devstoremx',
    description: 'Integramos listas de favoritos en Shopify y adaptamos sus botones al tema. Revisamos productos, colecciones y experiencia móvil antes de entregar.',
    intro: 'Una lista de favoritos debe funcionar como parte de la tienda, no como un botón añadido que rompe el diseño. Devstoremx puede integrar una app de favoritos con el tema Shopify y revisar cómo se guardan y consultan los productos.',
    sections: [
      { title: 'Instalar la app no termina la integración', paragraphs: ['La herramienta puede traer botones, mensajes y una página propia que no coinciden con el tema. También puede convivir mal con tarjetas dinámicas, variantes o secciones que cargan después de abrir la página.', 'Revisamos la app elegida y los lugares donde debe aparecer la función. Antes de modificar el tema se acuerda qué comportamiento ofrece realmente la herramienta y cuáles son sus límites.'] },
      { title: 'Favoritos coherentes entre colección y producto', paragraphs: ['Adaptamos la presentación y los puntos de acceso para que el visitante reconozca dónde guardar y recuperar artículos. La revisión se hace con el catálogo real y con los componentes de la tienda incluidos en el encargo.', 'El guardado entre dispositivos, las cuentas de cliente y las automatizaciones dependen de las capacidades de la app. No los anunciamos como incluidos sin comprobar su disponibilidad y acordar la configuración.'] },
    ],
    deliverables: ['Revisión de la app y compatibilidad con el tema.', 'Integración visual de botones y estados.', 'Accesos a favoritos en las vistas acordadas.', 'Pruebas de guardado y consulta en celular y escritorio.'],
    faqs: [
      { question: '¿Pueden integrar la app que ya tengo contratada?', answer: 'Podemos revisarla. La solución depende de sus opciones de integración y de las restricciones del tema.' },
      { question: '¿Los favoritos se conservan entre dispositivos?', answer: 'Depende de cómo guarda la información la app y de si utiliza cuentas de cliente. Confirmamos ese comportamiento antes de comprometerlo.' },
      { question: '¿También pueden adaptar las tarjetas del catálogo?', answer: 'Sí, cuando sea necesario para la integración. Las vistas y componentes que se van a modificar quedan definidos en la propuesta.' },
    ],
    proof: 'Fernando integró una app de favoritos en el tema Shopify de Lerato y desarrolló secciones del inicio en su etapa en Applabmx.',
    cta: { title: 'Integra favoritos sin dejar otra función a medias', text: 'Muéstranos la app y el tema que utilizas. Revisamos qué hace falta para incorporarla a la experiencia de tu tienda.', label: 'Quiero integrar favoritos en Shopify' },
  },
  'rivka': {
    title: 'Cómo desarrollar componentes Liquid y una app de descuentos para Shopify',
    metaTitle: 'Componentes Liquid y apps para Shopify | Devstoremx',
    description: 'Desarrollo Liquid y evaluación de apps de descuentos para Shopify. Definimos si tu necesidad se resuelve en el tema o requiere una aplicación propia.',
    intro: 'No todas las funciones de Shopify pertenecen al tema: una sección visual puede resolverse con Liquid, mientras que una herramienta de descuentos puede requerir una app y APIs. En Devstoremx te ayudamos a distinguir esos trabajos antes de empezar a desarrollar.',
    sections: [
      { title: 'El tema y la lógica comercial no son lo mismo', paragraphs: ['Un componente puede presentar información o cambiar la interacción del catálogo sin alterar las reglas de descuentos. Prometer una promoción solo porque se puede dibujar su botón deja sin resolver la parte más importante.', 'Revisamos qué debe ocurrir para el comprador, quién configura la promoción y qué límites impone Shopify. A partir de ahí se define si conviene adaptar el tema, utilizar una app disponible o evaluar una aplicación propia.'] },
      { title: 'Desarrollo a medida con límites claros', paragraphs: ['Podemos construir componentes Liquid y estudiar funcionalidades de aplicación que requieran React, Remix u otras herramientas compatibles. Son encargos distintos y no se presenta una sección del tema como equivalente a una app completa.', 'La propuesta de una aplicación debe incluir permisos, datos, mantenimiento y condiciones de operación. La compatibilidad de un descuento o de una función de checkout se confirma con el plan y las capacidades vigentes de Shopify.'] },
    ],
    deliverables: ['Evaluación de la función y las restricciones de Shopify.', 'Separación entre interfaz del tema y lógica de aplicación.', 'Desarrollo de componentes o funcionalidades acordadas.', 'Pruebas, accesos y documentación de la entrega.'],
    faqs: [
      { question: '¿Todo se puede resolver con Liquid?', answer: 'No. Liquid forma parte de los temas y no sustituye las capacidades de una aplicación ni las reglas que controla Shopify.' },
      { question: '¿Pueden desarrollar una app de descuentos desde cero?', answer: 'Podemos evaluar el encargo y su viabilidad. El alcance se define después de conocer las reglas, los usuarios, los permisos y las restricciones de plataforma.' },
      { question: '¿Ser Shopify Partner permite modificar cualquier checkout?', answer: 'No. Las posibilidades dependen del plan y de las APIs disponibles; pertenecer al programa de Partners no elimina esos límites.' },
    ],
    proof: 'En Rivka, Fernando desarrolló componentes Liquid para tiendas Shopify y participó en una app de promo codes con Remix y React. El caso describe el alcance de esa participación.',
    cta: { title: 'Define qué necesita tu función antes de construirla', text: 'Cuéntanos qué promoción o comportamiento quieres ofrecer. Te proponemos una ruta técnica acorde con Shopify.', label: 'Hablemos de mi desarrollo Shopify' },
  },
  'structurall': {
    title: 'Cómo desarrollar un tema WordPress personalizado para tu negocio',
    metaTitle: 'Desarrollo de temas WordPress personalizados | Devstoremx',
    description: 'Desarrollamos temas WordPress a medida para tu contenido y tu equipo. Diseño propio, campos de edición y una entrega que puedas administrar.',
    intro: 'Un tema WordPress personalizado permite construir las páginas que tu negocio necesita y definir cómo se editan. Devstoremx puede encargarse del desarrollo cuando adaptar una plantilla comercial empieza a limitar el contenido o a complicar cada cambio.',
    sections: [
      { title: 'Cuando la plantilla obliga a cambiar tu mensaje', paragraphs: ['Si cada sección necesita un ajuste especial o el panel tiene opciones que nadie entiende, la plantilla dejó de ahorrar trabajo. El problema no es solo visual: también afecta a quien tiene que publicar contenido después.', 'Partimos de las páginas y contenidos reales para definir plantillas, componentes y campos editables. El diseño propio debe convivir con una administración comprensible para el equipo.'] },
      { title: 'Un tema a medida también necesita mantenimiento', paragraphs: ['El desarrollo contempla la interfaz y la lógica necesaria en WordPress con PHP, HTML, CSS y JavaScript. Se decide qué funciones pertenecen al tema y cuáles conviene mantener separadas para no perderlas si el diseño cambia.', 'Antes de entregar revisamos las plantillas acordadas, el comportamiento móvil y las tareas habituales de edición. Las actualizaciones y mejoras posteriores tienen un alcance propio; no desaparecen por usar un tema personalizado.'] },
    ],
    deliverables: ['Mapa de plantillas y componentes del sitio.', 'Tema personalizado con campos de edición acordados.', 'Adaptación responsive y revisión de contenido real.', 'Entrega de accesos e indicaciones de administración.'],
    faqs: [
      { question: '¿Un tema a medida requiere un constructor visual?', answer: 'No necesariamente. La forma de editar se decide según el contenido y las tareas del equipo, no por añadir un constructor por defecto.' },
      { question: '¿Podré cambiar textos e imágenes?', answer: 'Sí, en los campos que se definan para edición. Revisamos contigo qué cambios hace el equipo y cuáles deben mantenerse controlados.' },
      { question: '¿Pueden reemplazar mi tema sin perder el contenido?', answer: 'Podemos evaluar la migración. Primero revisamos dónde están guardados los contenidos y qué dependencias tiene el tema actual.' },
    ],
    proof: 'Fernando desarrolló un tema WordPress personalizado para Structurall en Industria Social, con interfaz propia y lógica en PHP para que el cliente pudiera personalizarlo.',
    cta: { title: 'Tu contenido no debería pelear con la plantilla', text: 'Muéstranos las páginas que necesitas y quién las va a actualizar. Definimos el tema y sus campos antes de construir.', label: 'Quiero un tema WordPress a medida' },
  },
  'original-penguin': {
    title: 'Cómo personalizar Shopify y renovar tus plantillas de email HTML',
    metaTitle: 'Personalización Shopify y email HTML | Devstoremx',
    description: 'Personalizamos componentes Shopify y plantillas de correo HTML para tu marca. Tienda y campañas con desarrollo y revisiones acordes a cada canal.',
    intro: 'La tienda y los correos pueden compartir identidad sin compartir la misma implementación. En Devstoremx desarrollamos componentes Shopify y plantillas de email HTML como piezas distintas de una experiencia comercial coherente.',
    sections: [
      { title: 'Una marca que cambia al salir de la tienda', paragraphs: ['Una campaña puede llevar a una tienda renovada y seguir enviando correos con diseños antiguos. También puede ocurrir lo contrario: el correo presenta una promoción que el tema no sabe mostrar.', 'Revisamos qué componentes de la tienda y qué tipos de mensaje necesitan actualizarse. El alcance separa esas piezas para que cada una tenga contenido, responsable y criterios de revisión propios.'] },
      { title: 'El correo no se construye como una página web', paragraphs: ['Los componentes de Shopify se desarrollan con las herramientas del tema; las plantillas de correo deben adaptarse al comportamiento de los clientes de email y a la plataforma de envío. Reutilizar el HTML de la tienda sin ajustes no resuelve esa compatibilidad.', 'Acordamos los módulos del correo, los campos variables y los clientes donde se revisará. Si las plantillas deben cargarse en una herramienta de marketing, se confirma su formato antes de diseñar la entrega.'] },
    ],
    deliverables: ['Inventario de componentes y correos que se renovarán.', 'Componentes Liquid ajustados a la tienda.', 'Plantillas HTML para la plataforma de correo acordada.', 'Revisión de enlaces, variables y visualización.'],
    faqs: [
      { question: '¿Pueden trabajar solo las plantillas de correo?', answer: 'Sí. Tienda y email pueden contratarse como encargos separados cuando no necesitas cambiar ambos canales.' },
      { question: '¿Una plantilla web funciona igual en Outlook?', answer: 'No. Los clientes de correo tienen restricciones propias; las plantillas se desarrollan y revisan pensando en esos lectores.' },
      { question: '¿Las plantillas incluirán textos de campañas futuras?', answer: 'Podemos preparar módulos reutilizables. La redacción y la operación de nuevas campañas no quedan incluidas salvo que se acuerden.' },
    ],
    proof: 'Fernando desarrolló componentes Liquid y renovó plantillas de email HTML para Original Penguin durante su trabajo en Industria Social.',
    cta: { title: 'Conecta la tienda y el correo con la misma marca', text: 'Comparte los componentes y mensajes que necesitas renovar. Definimos el desarrollo de cada canal por escrito.', label: 'Quiero renovar mi tienda y mis correos' },
  },
  'mezcal-viviente': {
    title: 'Cómo crear un sitio web bilingüe con WordPress y Elementor',
    metaTitle: 'Sitios bilingües con WordPress y Elementor | Devstoremx',
    description: 'Creamos sitios bilingües en WordPress y Elementor. Páginas, navegación y formularios coherentes entre idiomas, con responsabilidades de contenido claras.',
    intro: 'Un sitio bilingüe necesita páginas, navegación y acciones coherentes en ambos idiomas; un selector no resuelve por sí solo la experiencia. En Devstoremx podemos diseñar y desarrollar esa estructura con WordPress y Elementor para tu negocio.',
    sections: [
      { title: 'Traducir el menú no completa la segunda versión', paragraphs: ['El visitante puede cambiar de idioma y encontrar botones sin traducir, enlaces que regresan a la versión anterior o formularios con mensajes distintos. Esas inconsistencias suelen aparecer cuando los idiomas se añaden al final.', 'Definimos qué páginas tendrán versión equivalente, qué contenido cambia por mercado y quién produce o aprueba las traducciones. Así el segundo idioma forma parte del sitio desde su planeación.'] },
      { title: 'Una estructura que puedas mantener en dos idiomas', paragraphs: ['El desarrollo organiza plantillas, contenidos y navegación para que el equipo sepa qué debe actualizar en cada versión. Revisamos también los elementos que suelen quedar fuera del texto principal, como enlaces y confirmaciones de formularios.', 'La solución multidioma depende de la instalación y de las herramientas elegidas. Se contemplan sus licencias y limitaciones antes de comprometer una forma concreta de edición o traducción automática.'] },
    ],
    deliverables: ['Mapa de páginas y equivalencias entre idiomas.', 'Implementación en WordPress y Elementor.', 'Navegación y componentes adaptados a cada versión.', 'Revisión de enlaces y formularios en los idiomas acordados.'],
    faqs: [
      { question: '¿Ustedes traducen todo el contenido?', answer: 'La traducción y su revisión se asignan en la propuesta. No se da por hecho que desarrollar el sitio incluye producir o certificar las traducciones.' },
      { question: '¿Se puede añadir otro idioma a un sitio existente?', answer: 'Podemos revisar la instalación actual y proponer cómo incorporarlo, incluyendo las páginas que necesitan adaptación.' },
      { question: '¿Cada idioma puede tener URLs propias?', answer: 'Sí. La estructura de URLs y las relaciones entre versiones se definen como parte del proyecto, según la solución multidioma elegida.' },
    ],
    proof: 'Fernando desarrolló el sitio de Mezcal Viviente con WordPress y Elementor e implementó soporte para español e inglés en Industria Social.',
    cta: { title: 'Presenta tu negocio en ambos idiomas sin recorridos incompletos', text: 'Cuéntanos qué idiomas y mercados atiendes. Revisamos la estructura y el contenido que necesita cada versión.', label: 'Quiero un sitio web bilingüe' },
  },
  'rca': {
    title: 'Cómo conectar formularios de devolución con la API de Shopify',
    metaTitle: 'Formularios de devolución y API Shopify | Devstoremx',
    description: 'Desarrollamos formularios conectados a Shopify para devoluciones y solicitudes. Definimos datos, validaciones, destino y correos de seguimiento.',
    intro: 'Un formulario conectado a Shopify puede organizar una solicitud de devolución y relacionarla con la información que tu equipo necesita revisar. Devstoremx puede desarrollar ese recorrido con las validaciones, accesos y mensajes acordados para tu operación.',
    sections: [
      { title: 'Cada devolución empieza pidiendo los mismos datos', paragraphs: ['Si los mensajes llegan incompletos y hay que volver a preguntar por el pedido o el producto, parte del trabajo de atención consiste en reconstruir la solicitud. Un formulario genérico solo cambia el lugar donde se recibe el problema.', 'Definimos qué información necesita el proceso, qué puede consultarse en Shopify y qué debe aportar la persona. Las reglas de devolución siguen siendo del negocio; la integración ayuda a aplicarlas con datos más completos.'] },
      { title: 'Conectar no significa aprobar automáticamente', paragraphs: ['Diseñamos la recepción, la validación y el destino de las solicitudes según las APIs y permisos disponibles. También se establece qué confirmación recibe el cliente y quién da seguimiento al caso.', 'Un formulario de devolución no equivale a un reembolso automático. Si el proyecto necesita operaciones adicionales sobre pedidos o pagos, se revisan su viabilidad, permisos y controles de forma explícita.'] },
    ],
    deliverables: ['Campos y reglas para cada tipo de solicitud.', 'Integración con los datos de Shopify acordados.', 'Confirmaciones y plantillas de correo necesarias.', 'Pruebas de envío y manejo de respuestas o errores.'],
    faqs: [
      { question: '¿El formulario puede buscar información de un pedido?', answer: 'Podemos evaluarlo según los permisos y las APIs disponibles. La consulta debe diseñarse sin exponer datos personales de otros pedidos.' },
      { question: '¿Se procesan reembolsos automáticamente?', answer: 'No de forma implícita. Esa es una función distinta, que requiere reglas comerciales, permisos y controles específicos.' },
      { question: '¿Pueden incluir otros formularios de atención?', answer: 'Sí. Podemos definir recorridos para consultas u otras solicitudes, separando campos, destinatarios y mensajes de cada una.' },
    ],
    proof: 'Fernando desarrolló formularios conectados a la API de Shopify y plantillas de respuesta para RCA durante su trabajo en Industria Social.',
    cta: { title: 'Recibe solicitudes que tu equipo sí pueda atender', text: 'Descríbenos tu proceso de devolución y dónde se pierde información. Definimos el formulario y la conexión necesarios.', label: 'Quiero conectar mis formularios con Shopify' },
  },
  'de-lena-pizzas': {
    title: 'Cómo crear una página web de restaurante con menú dinámico',
    metaTitle: 'Página web de restaurante con menú dinámico | Devstoremx',
    description: 'Desarrollamos páginas web de restaurantes con menú dinámico. Información clara para el cliente y un modo de actualizar la carta definido desde el inicio.',
    intro: 'Una página de restaurante con menú dinámico permite consultar la carta sin depender de una imagen difícil de leer o un archivo desactualizado. Devstoremx puede construir ese sitio y definir contigo cómo se cambiarán productos, categorías y disponibilidad.',
    sections: [
      { title: 'La carta debe poder consultarse desde el celular', paragraphs: ['Una fotografía de varias hojas puede servir para compartir por chat, pero obliga a ampliar y buscar cada categoría. Si el menú cambia seguido, también es fácil que circulen versiones distintas.', 'Organizamos el contenido según la consulta real: categorías, descripción de platillos, indicaciones relevantes y datos del restaurante. El objetivo es que la persona encuentre qué pedir y cómo contactar, sin explorar publicaciones antiguas.'] },
      { title: 'Un menú que cambia necesita un responsable de edición', paragraphs: ['Podemos desarrollar el sitio con Astro y definir de dónde saldrá la información del menú. La forma de actualizarlo se acuerda según quién hará esos cambios y con qué frecuencia.', 'Reservas, pedidos y cobro son funciones diferentes a mostrar la carta. Si las necesitas, se evalúan como parte del encargo, sin presentar un catálogo dinámico como un sistema completo de operación del restaurante.'] },
    ],
    deliverables: ['Estructura del sitio y categorías del menú.', 'Presentación de platillos adaptable a celular.', 'Fuente de datos y forma de actualización acordadas.', 'Datos de contacto y enlaces necesarios para el restaurante.'],
    faqs: [
      { question: '¿Menú dinámico significa que podré editarlo yo?', answer: 'La edición depende de la solución acordada. Definimos desde el inicio quién cambia la carta y qué interfaz o proceso utilizará.' },
      { question: '¿La página incluye pedidos y pagos?', answer: 'No necesariamente. Mostrar el menú, tomar pedidos y cobrar son alcances distintos que se definen según la operación.' },
      { question: '¿Se puede abrir desde un código QR?', answer: 'Sí. La página puede consultarse mediante su enlace y un QR que apunte a ella; no hace falta convertir el menú en una imagen para compartirlo.' },
    ],
    proof: 'Fernando desarrolló el sitio de De Leña Pizzas con Astro y una sección de menú dinámico durante su trabajo en Industria Social.',
    cta: { title: 'Tu carta, consultable y al día', text: 'Comparte tu menú actual y cuéntanos cómo cambia. Proponemos el sitio y una forma de mantener la información.', label: 'Quiero una página para mi restaurante' },
  },
  'nutriandreaa': {
    title: 'Cómo automatizar el acceso a cursos con Stripe, Zapier y Teachable',
    metaTitle: 'Automatizar pagos y acceso a cursos online | Devstoremx',
    description: 'Conectamos pagos Stripe y altas en Teachable con Zapier. Revisamos el recorrido de compra, los datos y el manejo de incidencias antes de automatizar.',
    intro: 'Automatizar el alta de un alumno después del pago evita que tu equipo copie datos de una herramienta a otra. Devstoremx puede evaluar la conexión entre Stripe, Zapier y Teachable y desarrollar el recorrido que necesite tu venta de cursos.',
    sections: [
      { title: 'El pago llegó, pero el alumno sigue esperando', paragraphs: ['Cuando la compra y el acceso viven en sistemas distintos, confirmar el pago se convierte en otra tarea manual. El alumno ya pagó y tu equipo tiene que localizarlo, comprobar el curso y completar su registro.', 'Revisamos el evento que debe iniciar el proceso y los datos que necesita Teachable. Crear un usuario y conceder acceso a un curso no siempre son la misma acción; la propuesta deja clara esa diferencia.'] },
      { title: 'También hay pagos repetidos y conexiones que fallan', paragraphs: ['La automatización necesita contemplar registros existentes, eventos duplicados y respuestas de las plataformas. No basta con que funcione una compra de prueba si una incidencia deja a la persona sin acceso y sin aviso.', 'Definimos qué debe ocurrir en cada estado y qué intervención humana queda disponible. Las posibilidades dependen de los planes y conectores de las herramientas, que se revisan antes de prometer una conexión concreta.'] },
    ],
    deliverables: ['Mapa del recorrido desde el pago hasta el alta.', 'Conexión entre los eventos y campos acordados.', 'Reglas de duplicados y manejo de incidencias.', 'Pruebas y pautas para dar seguimiento a la automatización.'],
    faqs: [
      { question: '¿Pueden conectar herramientas que ya tengo contratadas?', answer: 'Sí, previa revisión de sus planes, permisos y conectores. No todos los planes permiten las mismas automatizaciones.' },
      { question: '¿Crear el usuario garantiza acceso al curso?', answer: 'No siempre. Se debe definir y probar la acción exacta de inscripción o acceso que necesita tu plataforma.' },
      { question: '¿La automatización incluye reembolsos y cancelaciones?', answer: 'Solo cuando se acuerdan. El alta, la revocación de acceso y los reembolsos son recorridos que necesitan reglas propias.' },
    ],
    proof: 'Fernando conectó Stripe y una automatización en Zapier para crear usuarios en Teachable al detectar pagos de cursos en el proyecto de Nutriandreaa, en Industria Social.',
    cta: { title: 'Que una compra no se convierta en trabajo de captura', text: 'Cuéntanos dónde cobras, dónde están los cursos y qué hace hoy tu equipo. Evaluamos el recorrido completo.', label: 'Quiero automatizar las altas de mis cursos' },
  },
  'groovepro': {
    title: 'Cómo personalizar envíos y paquetes con plugins de WooCommerce',
    metaTitle: 'Plugins WooCommerce para envíos y paquetes | Devstoremx',
    description: 'Desarrollamos plugins WooCommerce para reglas de envío y paquetes de productos. Traducimos tu operación a cálculos y validaciones del carrito.',
    intro: 'Cuando el envío depende de combinaciones, dimensiones o cantidades, una tarifa fija puede dejar de representar la operación. Devstoremx puede desarrollar plugins de WooCommerce para reglas de envío y paquetes que necesitan una lógica propia.',
    sections: [
      { title: 'Las reglas del negocio ya no caben en la configuración', paragraphs: ['La tienda combina productos y calcula un cobro que luego alguien tiene que corregir. El problema puede estar en cómo se agrupan artículos, se interpretan las dimensiones o se aplican las cantidades de un paquete.', 'Trabajamos con ejemplos concretos del carrito: qué debería cobrarse, cuándo cambia y qué excepciones existen. Esos ejemplos permiten construir reglas comprobables, no una lista de condiciones que cada persona interpreta diferente.'] },
      { title: 'La función debe sobrevivir a un cambio de diseño', paragraphs: ['La lógica comercial que no pertenece a la presentación puede desarrollarse en un plugin separado del tema. Así se distingue el diseño de la tienda de las reglas que calculan los paquetes o el envío.', 'La revisión contempla las extensiones y modalidades de compra incluidas en el proyecto. Si la tarifa requiere consultar una transportista, esa conexión se evalúa aparte; un cálculo personalizado no implica una integración logística completa.'] },
    ],
    deliverables: ['Documento de reglas con ejemplos de carrito.', 'Plugin para las funciones comerciales acordadas.', 'Pruebas de cantidades, combinaciones y excepciones.', 'Documentación de configuración y mantenimiento.'],
    faqs: [
      { question: '¿Pueden adaptar un plugin que ya uso?', answer: 'Podemos revisar sus opciones y puntos de extensión. Si modificarlo compromete las actualizaciones, proponemos otra forma de integrar la función.' },
      { question: '¿El desarrollo incluye tarifas de transportistas?', answer: 'Solo si esa conexión forma parte del alcance. Calcular una regla propia y obtener una cotización externa son trabajos distintos.' },
      { question: '¿Se pueden ajustar precios por cantidad de productos?', answer: 'Sí, cuando se definen las reglas de combinación, los límites y su interacción con descuentos u otras funciones del carrito.' },
    ],
    proof: 'Fernando desarrolló plugins PHP de envíos y bundles para GroovePro en Industria Social, con reglas basadas en productos, dimensiones y cantidades.',
    cta: { title: 'Haz que el carrito refleje cómo vende tu negocio', text: 'Compártenos las combinaciones que hoy requieren correcciones manuales. Traducimos esas reglas a un desarrollo con pruebas.', label: 'Quiero personalizar mi WooCommerce' },
  },
  'grupo-aga': {
    title: 'Cómo desarrollar un sitio web corporativo con WordPress',
    metaTitle: 'Sitios web corporativos en WordPress | Devstoremx',
    description: 'Creamos sitios corporativos WordPress para presentar servicios, productos y contacto. Estructura, edición de contenidos y desarrollo para tu empresa.',
    intro: 'Un sitio corporativo debe explicar qué hace tu empresa y facilitar el siguiente contacto, sin obligar al visitante a interpretar tu organigrama. En Devstoremx desarrollamos sitios WordPress con estructura y edición acordes al contenido del negocio.',
    sections: [
      { title: 'La empresa tiene mucho que contar, el visitante busca algo concreto', paragraphs: ['Historia, marcas, servicios y datos institucionales compiten por la misma portada. Si todo tiene la misma importancia, es difícil entender qué ofrece la empresa y a qué área escribir.', 'Ordenamos el sitio a partir de sus públicos y de la información que cada uno necesita. La estructura se acuerda antes del diseño para no convertir el desarrollo en una sucesión de páginas sin relación.'] },
      { title: 'Publicar también debe ser fácil para tu equipo', paragraphs: ['Definimos qué contenidos se actualizan con frecuencia y cómo se administrarán en WordPress. Si se utiliza Elementor u otra herramienta, su papel se decide según el contenido y la instalación, no como requisito automático.', 'El alcance distingue diseño, desarrollo, carga inicial y producción de materiales. También identifica los formularios y sus responsables para que el sitio entregue contactos a un canal que alguien atienda.'] },
    ],
    deliverables: ['Arquitectura de páginas y navegación corporativa.', 'Plantillas adaptadas a los contenidos de la empresa.', 'Edición de las secciones acordadas en WordPress.', 'Revisión móvil, enlaces y formularios antes de publicar.'],
    faqs: [
      { question: '¿Necesitamos entregar todos los textos antes de hablar?', answer: 'No. Podemos empezar entendiendo el negocio y revisar qué materiales existen. La producción y aprobación de contenido se asignan en el alcance.' },
      { question: '¿El sitio puede presentar varias marcas o unidades?', answer: 'Sí. Se define la relación entre ellas y qué información necesita cada una, en lugar de duplicar páginas sin una estructura compartida.' },
      { question: '¿Pueden renovar un sitio corporativo existente?', answer: 'Podemos revisar sus páginas, contenidos y accesos para proponer qué conservar y qué desarrollar de nuevo.' },
    ],
    proof: 'Fernando desarrolló un sitio corporativo WordPress y Elementor para Grupo AGA durante su trabajo en Brainfood Marketing, que participó como proveedor terciario.',
    cta: { title: 'Presenta tu empresa con un sitio que se entienda', text: 'Cuéntanos a quién atiende tu negocio y qué necesita conocer antes de escribirte. Definimos las páginas que cumplen ese trabajo.', label: 'Quiero un sitio corporativo en WordPress' },
  },
  'stitchers-space': {
    title: 'Cómo integrar anuncios en una página web con JavaScript y TypeScript',
    metaTitle: 'Integración de anuncios con JavaScript | Devstoremx',
    description: 'Integramos scripts publicitarios en sitios web con JavaScript y TypeScript. Revisamos posiciones, carga dinámica y presentación en distintos dispositivos.',
    intro: 'Integrar anuncios requiere ubicar los espacios correctos y coordinar sus scripts con la carga de la página. Devstoremx puede desarrollar esa integración técnica cuando las posiciones dinámicas o los cambios de interfaz complican la implementación.',
    sections: [
      { title: 'El anuncio aparece, pero no donde debería', paragraphs: ['Un selector puede dejar de encontrar el contenedor después de un cambio de diseño. También puede ejecutarse antes de que exista la sección o duplicar una inserción al actualizar contenido sin recargar la página.', 'Revisamos la estructura del sitio, los eventos de carga y las posiciones autorizadas. Definir esas condiciones evita añadir scripts que funcionan en una prueba y fallan en otras rutas o tamaños de pantalla.'] },
      { title: 'Integración técnica con validación real', paragraphs: ['Podemos adaptar el código a contenido asíncrono y comportamientos del DOM con JavaScript o TypeScript, según la arquitectura del sitio. La revisión incluye colocación, duplicados y convivencia con los componentes acordados.', 'Trabajamos con sitios y proveedores autorizados. La integración del anuncio no sustituye las decisiones de consentimiento, privacidad o política publicitaria que debe cumplir el negocio.'] },
    ],
    deliverables: ['Definición de posiciones y condiciones de carga.', 'Scripts de inserción para las vistas acordadas.', 'Manejo de cambios dinámicos del contenido.', 'QA de colocación en navegadores y dispositivos incluidos.'],
    faqs: [
      { question: '¿Pueden integrar anuncios en un sitio con carga dinámica?', answer: 'Sí, previa revisión de su arquitectura. Se identifican los eventos y cambios de interfaz que afectan a la inserción.' },
      { question: '¿El trabajo incluye conseguir anunciantes?', answer: 'No. Este encargo se centra en la implementación técnica de espacios y scripts de proveedores autorizados.' },
      { question: '¿Pueden corregir anuncios duplicados o mal colocados?', answer: 'Podemos revisar el código y las condiciones de ejecución para identificar el origen y proponer una corrección.' },
    ],
    proof: 'Fernando desarrolló e insertó scripts publicitarios con JavaScript y TypeScript en Stitchers.Space, con análisis del DOM y QA de colocación.',
    cta: { title: 'Integra los anuncios sin improvisar sobre la página publicada', text: 'Comparte tu sitio, el proveedor y las posiciones que necesitas. Revisamos el código y sus condiciones de carga.', label: 'Necesito una integración publicitaria web' },
  },
  '10bet-latam': {
    title: 'Cómo desarrollar landing pages y plantillas de email para casinos online',
    metaTitle: 'Landing pages y email para casinos online | Devstoremx',
    description: 'Desarrollo de landing pages, páginas informativas y email HTML para operaciones de juego autorizadas. Implementación con contenido aprobado y revisión técnica.',
    intro: 'Una operación de juego autorizada necesita separar campañas, información normativa y mensajes al usuario. Devstoremx puede evaluar el desarrollo de páginas y correos con contenido aprobado por tu equipo, sin sustituir la revisión legal de la operación.',
    sections: [
      { title: 'Campañas y páginas informativas tienen trabajos distintos', paragraphs: ['Una landing de campaña debe presentar una oferta con condiciones claras. Las reglas de juego y el aviso de privacidad necesitan una estructura estable y contenido autorizado, no el mismo tratamiento de una pieza promocional.', 'Definimos las páginas y módulos que requiere el equipo, quién aprueba los textos y qué variantes cambian por mercado. No se mezclan la implementación técnica y la responsabilidad de autorizar una promoción.'] },
      { title: 'Mensajes y páginas que puedan revisarse antes del lanzamiento', paragraphs: ['El desarrollo puede incluir componentes web, landings y plantillas HTML para la plataforma de correo acordada. Se especifican las vistas, los enlaces y los clientes de email donde se hará la revisión.', 'La propuesta se limita a operadores y contenidos permitidos en su jurisdicción. La programación no certifica licencias, cumplimiento regulatorio ni resultados de una campaña.'] },
    ],
    deliverables: ['Inventario de páginas, módulos y plantillas.', 'Implementación del contenido aprobado.', 'Variantes de campaña o mercado acordadas.', 'Revisión de enlaces, visualización y observaciones técnicas.'],
    faqs: [
      { question: '¿Desarrollar las páginas garantiza cumplimiento legal?', answer: 'No. El contenido, las licencias y las aprobaciones regulatorias corresponden al operador y a sus asesores. Nuestro alcance es técnico.' },
      { question: '¿Pueden construir solo las plantillas de correo?', answer: 'Sí. Se revisan los tipos de mensaje, las variables y la plataforma de envío para definir una entrega específica.' },
      { question: '¿Se pueden preparar páginas distintas por mercado?', answer: 'Podemos evaluar variantes autorizadas por tu equipo, con los textos, condiciones y aprobaciones de cada mercado.' },
    ],
    proof: 'Fernando desarrolló páginas de compliance, landing pages y plantillas de email en su puesto de Mid Front-End Developer en 10Bet Latam.',
    cta: { title: 'Refuerza la implementación de tus páginas y mensajes', text: 'Comparte el alcance y el flujo de aprobación de tu operación autorizada. Revisamos qué desarrollo podemos asumir.', label: 'Hablemos del desarrollo de mis páginas' },
  },
  'cofaa-sitio-institucional': {
    title: 'Cómo migrar un sitio web institucional a MODX',
    metaTitle: 'Migración de sitios institucionales a MODX | Devstoremx',
    description: 'Migramos contenido y estructura de sitios institucionales a MODX. Revisamos documentos, componentes y URLs para preparar una transición ordenada.',
    intro: 'Migrar un sitio institucional a MODX implica trasladar contenido, documentos y componentes sin perder la relación entre ellos. Devstoremx puede evaluar esa transición y preparar un alcance de migración con responsables y criterios de revisión claros.',
    sections: [
      { title: 'Mover el diseño no basta cuando existen años de documentos', paragraphs: ['Un sitio institucional puede acumular enlaces públicos, archivos y secciones que distintas áreas necesitan mantener. Empezar con una portada nueva sin inventariar ese contenido deja decisiones importantes para el final.', 'Revisamos qué información debe conservarse, cómo se organizará en MODX y qué URLs requieren continuidad. La migración se plantea sobre un inventario acordado, no sobre una copia indiscriminada de archivos.'] },
      { title: 'Plantillas nuevas y contenido que siga localizable', paragraphs: ['El trabajo puede incluir componentes HTML, CSS y JavaScript, adaptación de una biblioteca institucional y traslado de materiales. Se distingue la migración de contenido de su actualización editorial o validación jurídica.', 'Antes de publicar se revisan los enlaces, las rutas y las secciones incluidas. Si la plataforma anterior tiene restricciones de acceso o exportación, se consideran en la evaluación inicial.'] },
    ],
    deliverables: ['Inventario de páginas y documentos incluidos.', 'Estructura y componentes del sitio en MODX.', 'Traslado de materiales y relación de URLs.', 'Revisión de navegación y enlaces de descarga.'],
    faqs: [
      { question: '¿Pueden conservar las URLs actuales?', answer: 'Se revisa cada ruta dentro del inventario. Cuando cambia, se plantea la redirección correspondiente si el entorno permite implementarla.' },
      { question: '¿Incluye corregir todos los documentos antiguos?', answer: 'No de forma implícita. Trasladar archivos y revisar o actualizar su contenido son responsabilidades diferentes.' },
      { question: '¿Pueden utilizar la biblioteca visual de la institución?', answer: 'Sí, cuando se proporciona y está autorizada para el proyecto. Revisamos cómo adaptarla a las plantillas necesarias.' },
    ],
    proof: 'Fernando migró el sitio institucional de COFAA-IPN a MODX, trasladó información y documentos y desarrolló componentes con la biblioteca visual institucional.',
    cta: { title: 'Planea la migración antes de mover la primera página', text: 'Cuéntanos qué sitio tienes, qué debe conservarse y quién administra sus materiales. Evaluamos la transición.', label: 'Quiero migrar mi sitio institucional' },
  },
  'cofaa-gestion-tickets': {
    title: 'Cómo centralizar las solicitudes de soporte con un sistema de tickets',
    metaTitle: 'Sistemas web de tickets y soporte interno | Devstoremx',
    description: 'Desarrollamos sistemas web de tickets para registrar solicitudes, dar seguimiento y consultar historial. Un flujo de soporte definido para tu equipo.',
    intro: 'Un sistema de tickets reúne solicitudes, responsables, estados e historial en un mismo lugar. Devstoremx puede desarrollar una aplicación web para tu proceso de soporte cuando las libretas, los chats o las hojas separadas ya no permiten dar seguimiento.',
    sections: [
      { title: 'El problema no es abrir un ticket, es saber qué pasó después', paragraphs: ['La solicitud entra por un canal, se asigna por otro y la solución termina en una conversación privada. Al buscar el historial de un equipo o preparar un reporte, hay que volver a reconstruir lo que ocurrió.', 'Revisamos cómo se reciben las solicitudes, quién puede atenderlas y qué significa cada estado. Una aplicación propia tiene sentido cuando ese flujo necesita reglas que el equipo pueda compartir y consultar.'] },
      { title: 'Historial, inventario y reportes dentro del mismo proceso', paragraphs: ['El desarrollo puede relacionar tickets con equipos, personas o áreas, y presentar consultas y reportes acordados. Esos vínculos se definen con los datos que existen, no con un panel lleno de métricas sin uso.', 'También se revisan los permisos y la información que debe conservarse. La implementación se entrega con un recorrido de prueba: registrar, asignar, actualizar y cerrar, según las responsabilidades del negocio.'] },
    ],
    deliverables: ['Definición del flujo de atención y sus estados.', 'Registro, asignación y consulta de tickets.', 'Historial y vínculos con inventario cuando se acuerden.', 'Permisos y reportes definidos para cada rol.'],
    faqs: [
      { question: '¿Conviene desarrollar un sistema o usar uno existente?', answer: 'Primero se revisa el proceso. Si una herramienta disponible cubre tus necesidades, no hace falta desarrollar todo desde cero.' },
      { question: '¿Pueden migrar el historial de mis hojas de cálculo?', answer: 'Podemos evaluar su estructura y calidad. La limpieza, correspondencia de campos y carga inicial se definen como parte del alcance.' },
      { question: '¿El sistema puede relacionar tickets con equipos?', answer: 'Sí, si el inventario y sus identificadores forman parte del proyecto. Se definen las relaciones y los permisos de consulta.' },
    ],
    proof: 'Fernando desarrolló una bitácora de servicio para COFAA-IPN que centralizó tickets, historial de soporte, inventario y reportes antes gestionados por separado.',
    cta: { title: 'Que cada solicitud tenga un estado y un responsable', text: 'Descríbenos cómo llega y se resuelve una solicitud hoy. Revisamos qué sistema necesita tu equipo.', label: 'Quiero centralizar mi soporte interno' },
  },
  'cofaa-acuses': {
    title: 'Cómo registrar y consultar acuses digitales en una aplicación web',
    metaTitle: 'Aplicaciones web para acuses digitales | Devstoremx',
    description: 'Desarrollamos aplicaciones web para registrar acuses y consultar evidencias de recepción. Definimos usuarios, documentos y reportes según tu proceso.',
    intro: 'Una aplicación de acuses puede registrar qué persona consultó o confirmó un documento y permitir que administración consulte esa información. Devstoremx desarrolla ese flujo cuando los correos y las listas separadas ya no permiten controlar las respuestas.',
    sections: [
      { title: 'Enviar un documento no demuestra que se confirmó', paragraphs: ['El correo sale, pero las respuestas llegan con formatos diferentes o quedan repartidas entre responsables. Cuando hace falta consultar quién respondió, el control depende de revisar conversaciones una por una.', 'Definimos qué acción debe registrar el sistema, cómo se identifica a la persona y qué versión del documento se presenta. Consultar, confirmar recepción y aceptar condiciones son eventos distintos que no conviene mezclar.'] },
      { title: 'Un registro consultable no equivale a una firma electrónica', paragraphs: ['Podemos construir el acceso al documento, el registro del evento y una consulta administrativa con las exportaciones acordadas. Los campos y las fechas se plantean según lo que el proceso necesita comprobar.', 'Si se requiere una firma con efectos legales específicos, se revisa una solución adecuada con tus asesores. No presentamos un clic de confirmación como equivalente a una firma electrónica certificada.'] },
    ],
    deliverables: ['Definición de documentos, versiones y eventos.', 'Flujo de consulta y confirmación de la persona.', 'Panel administrativo con filtros y exportaciones acordadas.', 'Permisos y revisión del tratamiento de datos.'],
    faqs: [
      { question: '¿El acuse digital sustituye una firma electrónica?', answer: 'No necesariamente. Su alcance depende del mecanismo y del marco legal aplicable. La validez requerida se revisa con asesoría especializada.' },
      { question: '¿Puedo saber quién todavía no confirma?', answer: 'Podemos desarrollar esa consulta cuando exista un padrón definido de destinatarios y se acuerden las reglas de identificación.' },
      { question: '¿Pueden generar archivos para una auditoría?', answer: 'Podemos incluir exportaciones y reportes. Su formato y los datos que contienen se definen con quienes los van a utilizar.' },
    ],
    proof: 'Fernando desarrolló una aplicación de acuses del Código de Conducta para COFAA-IPN, con registro de confirmaciones y consulta y descarga administrativa.',
    cta: { title: 'Controla las confirmaciones sin perseguir correos', text: 'Cuéntanos qué documento compartes, con quién y qué necesitas acreditar. Definimos el registro que corresponde.', label: 'Quiero un sistema web de acuses' },
  },
  'cofaa-transparencia': {
    title: 'Cómo crear un portal de transparencia con avisos por correo',
    metaTitle: 'Portales de documentos con avisos por correo | Devstoremx',
    description: 'Desarrollamos portales de documentos públicos con consulta y avisos por correo. Definimos publicación, actualización y acceso a la información.',
    intro: 'Un portal de transparencia debe facilitar la consulta de documentos y comunicar cuándo cambian. Devstoremx puede desarrollar el sitio y los avisos por correo para que las personas consulten la información desde un punto compartido, no desde archivos dispersos.',
    sections: [
      { title: 'El documento existe, pero cuesta encontrar su versión vigente', paragraphs: ['Publicar enlaces en distintas páginas o enviar cada archivo por correo dificulta saber cuál es la referencia actual. Un cambio puede llegar a algunos usuarios y pasar inadvertido para otros.', 'Ordenamos los documentos por los criterios que necesitan quienes los consultan y definimos quién puede publicar y actualizar. El contenido público y sus fechas deben tener una gestión reconocible para el equipo.'] },
      { title: 'Notificar el cambio sin sustituir el portal por el buzón', paragraphs: ['Los avisos pueden enlazar al documento o a la sección correspondiente para mantener una referencia común. Se acuerda qué evento dispara el mensaje y quiénes deben recibirlo.', 'La integración de correo también requiere revisar destinatarios, autorizaciones y seguimiento de envíos. La plataforma no certifica por sí misma el cumplimiento de obligaciones de transparencia: implementa el proceso aprobado por la institución.'] },
    ],
    deliverables: ['Estructura de consulta y clasificación de documentos.', 'Flujo de publicación y actualización acordado.', 'Avisos por correo con enlaces de consulta.', 'Permisos, pruebas de enlaces y revisión de envíos.'],
    faqs: [
      { question: '¿El portal garantiza cumplimiento de transparencia?', answer: 'No por sí solo. La institución define los contenidos y obligaciones con sus responsables legales; el desarrollo implementa las funciones acordadas.' },
      { question: '¿Se pueden avisar solo ciertos cambios?', answer: 'Sí. Se definen los eventos de actualización y los grupos destinatarios para no enviar mensajes por cualquier modificación.' },
      { question: '¿Los avisos deben llevar archivos adjuntos?', answer: 'No necesariamente. Podemos diseñarlos con enlaces a los documentos publicados para mantener un punto de consulta común.' },
    ],
    proof: 'Fernando desarrolló un portal de transparencia para COFAA-IPN con consulta de oficios públicos y notificaciones por correo al actualizar documentos.',
    cta: { title: 'Haz localizable la información y comunica sus cambios', text: 'Muéstranos cómo publicas documentos hoy. Revisamos el portal y los avisos que necesita tu equipo.', label: 'Quiero un portal con avisos por correo' },
  },
};

export const projectContentBySlug: Record<string, ProjectContent> = Object.fromEntries(
  Object.entries(content).map(([key, value]) => {
    const slug = projectSlugs[key];
    if (!slug) throw new Error(`Falta el slug del contenido comercial: ${key}`);
    return [slug, value];
  }),
);
