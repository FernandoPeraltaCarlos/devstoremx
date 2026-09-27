# devstoremx

Landing page en Astro, Preact y Tailwind CSS 4, basada en `Landing devstoremx.html`.

## Desarrollo

```sh
pnpm install
pnpm exec astro dev --background
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
```

El sitio se sirve en http://localhost:4321. El servidor se administra en segundo plano según las instrucciones del proyecto.

```sh
pnpm check
pnpm build
```

## Organización

- `src/pages/index.astro`: composición de la landing.
- `src/pages/aviso-de-privacidad.astro`: aviso de privacidad, marcado como borrador legal.
- `src/layouts/BaseLayout.astro`: documento, metadatos, canonical, Open Graph y animaciones al entrar en pantalla.
- `src/components/seo/StructuredData.astro`: datos estructurados de la organización, servicios, equipo y preguntas frecuentes.
- `src/components/sections/`: portada, servicios, tecnologías, proceso, equipo, video, preguntas, contacto y footer.
- `src/components/ui/`: botones, logo, iconos, títulos, tarjetas, placeholders y estado del proyecto.
- `src/components/interactive/`: islas Preact para el menú responsive, las etapas del proceso, video y formulario, con controles reutilizables.
- `src/data/landing.ts`: textos, servicios, integrantes y configuración de recursos externos.
- `src/styles/global.css`: Tailwind, tokens de diseño, tipografías y animaciones.
- `src/scripts/viewport-reveal.ts`: animaciones repetibles al entrar en el viewport, en ambas direcciones.
- `public/fonts/`: tipografías recuperadas del HTML de referencia, servidas localmente.

## Sustituir placeholders

El icono real de la marca se sirve desde `public/devstoremx.svg`, con `public/devstoremx.png` como respaldo. El favicon del documento usa `public/favicon.svg` y `public/favicon.ico`; `public/apple-touch-icon.png` sale del logo y `public/devstore_mx.png` es la imagen Open Graph. Las cuatro fotografías de `public/team/` ya están configuradas en `src/data/landing.ts`. Las tarjetas del equipo son cuadradas y del mismo tamaño: una columna en móvil, dos desde `sm` y cuatro desde `lg`. Los captions son compactos, con fondo azul, nombre y cargo: Technical Lead para Fernando Peralta y Full Stack Developer para el resto. Si un integrante tiene `linkedin`, el nombre enlaza a ese perfil.

Para el hero y contacto, coloca las fotografías en `public/images/` y completa `heroImage` y `contactImage` con rutas como `/images/equipo.webp`. Para cambiar un retrato, actualiza `team[].image`. Los componentes usan `object-cover`.

Los cargos del equipo ya están configurados. Completa los datos de contacto y la duración del video en el mismo archivo.

### Video

`site.videoSrc` acepta un archivo o una URL directa de video; `site.videoPoster` permite añadir una portada. Para YouTube o Vimeo, sustituye el reproductor nativo en `VideoPlayer.tsx` por el embed correspondiente, manteniendo la carga bajo interacción. Sin `videoSrc`, la sección de video y su enlace de navegación no se publican.

### Formulario y enlaces

`site.formEndpoint` apunta a `/api/contact`. Ese endpoint acepta `POST` JSON con `name`, `email`, `phone`, `message` y el campo oculto `company`. Responde 2xx cuando Resend acepta el aviso a `hola@devstoremx.xyz` (también simula éxito ante el honeypot). Devuelve `notification` y `confirmation` por separado y muestra dos alertas. Cada envío tiene un límite de 8 segundos; el cliente espera hasta 25 segundos. Los reintentos sin cambios conservan `Idempotency-Key` para evitar duplicados dentro de la ventana de 24 horas de Resend. El formulario conserva los datos si el aviso falla o no se puede confirmar.

La clave `RESEND_API_KEY` se define en `.env` en local y en las variables de entorno del proyecto en Vercel. Completa `site.whatsappUrl` y `site.linkedinUrl` con los enlaces reales. El aviso de privacidad está en `/aviso-de-privacidad` y sigue marcado como borrador para revisión legal.

El correo `hola@devstoremx.xyz` se publica en el footer y en los datos estructurados. Teléfono y ciudad siguen entre corchetes y no se muestran. `public/robots.txt`, `public/llms.txt` y el sitemap se generan con el dominio `https://www.devstoremx.xyz`.

## Responsive y movimiento

La landing usa cuadrículas adaptables, menú móvil con cierre por Escape y navegación por anclas. Los títulos, tarjetas, etapas, video, contacto y footer se animan al entrar en el viewport al subir o bajar: 12 px de desplazamiento, 480 ms y desfases de hasta 120 ms. La animación se rearma solo cuando el elemento sale completamente de pantalla, evitando parpadeos al cambiar de dirección. Respeta `prefers-reduced-motion`, incluso si la preferencia cambia con la página abierta. Los campos con foco no se animan y el contenido permanece visible sin JavaScript.

Los elementos se activan con `data-reveal`; `data-reveal-delay` permite escalonar sus entradas (milisegundos, limitado a 120). Usa `pnpm test` para comprobar la lógica del viewport sin abrir un navegador.

### Etapas del proceso y scroll

`ProcessTimeline.tsx` actualiza la etapa activa al bajar y subir, con transiciones de color de 300 ms. En escritorio, distribuye las cinco etapas durante el recorrido de la fila por el viewport. En móvil, usa la posición real de cada etapa y activa su número cuando llega al 45% de la altura de la pantalla. Conserva las animaciones de entrada y marca la etapa actual con `aria-current="step"`.

`src/lib/process-progress.ts` contiene los cálculos. Los eventos de scroll son pasivos y las actualizaciones se agrupan con `requestAnimationFrame`. Se recalcula al redimensionar la pantalla o cambiar el tamaño del contenido. `pnpm test` comprueba el avance, el retroceso y los límites en ambos formatos sin abrir un navegador.
