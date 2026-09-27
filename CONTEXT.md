# Contexto detallado de devstoremx

Última actualización: 26 de septiembre de 2026.

Este documento reúne el objetivo del proyecto, las decisiones solicitadas por el usuario, la implementación actual, las verificaciones realizadas y los recursos pendientes. Está pensado para retomar el trabajo sin depender del historial de la conversación. Describe el estado actual; no implica que las integraciones pendientes estén implementadas.

## 1. Objetivo y alcance

El proyecto es una landing page en español para **devstoremx**, una agencia de desarrollo web y soluciones digitales en México. Su objetivo es presentar los servicios, explicar el proceso de trabajo, mostrar al equipo y facilitar el contacto para cotizar proyectos.

La referencia entregada por el usuario es el archivo [Landing devstoremx.html](<Landing devstoremx.html>), ubicado en la raíz del repositorio. El trabajo consistió en convertir esa referencia a Astro, manteniendo su identidad visual, textos y organización, y añadir una adaptación móvil e interacciones discretas.

El mensaje principal de la portada es:

> Sitios que venden. Código que dura.

El alcance implementado es una landing prerenderizada con componentes interactivos en Preact y un único endpoint de servidor, `POST /api/contact`, que envía el formulario con Resend. No hay base de datos, autenticación, CMS ni integración con un sistema real de gestión de proyectos.

## 2. Requisitos y preferencias expresadas por el usuario

1. Replicar el HTML de referencia en Astro.
2. Crear la versión móvil.
3. Usar Tailwind para los estilos.
4. Usar Preact donde la interacción lo requiera; ya estaba instalado al iniciar el trabajo.
5. Mantener placeholders para las imágenes.
6. Separar las secciones en componentes Astro o Preact para facilitar el mantenimiento y la escalabilidad.
7. Crear componentes pequeños reutilizables para botones, textos y otros elementos donde corresponda.
8. Corregir el marcado HTML que apareció dentro de las descripciones de servicios y revisar los SVG.
9. Hacer que las animaciones se disparen al entrar al viewport y se repitan tanto al subir como al bajar por el sitio.
10. Mantener las animaciones suaves, sin efectos exagerados ni una carga visual elevada.
11. Cambiar la etapa resaltada de “Flujo de desarrollo” en función del scroll.
12. Crear este archivo `CONTEXT.md` con el contexto detallado del proyecto.
13. Mantener todo el sitio como una sola landing page. No crear una página por servicio.

**El usuario indicó explícitamente que la revisión en navegador la realiza él. No abrir, controlar ni revisar la página en un navegador por iniciativa propia.** Las verificaciones realizadas después de esa instrucción se limitaron a tipos, compilación, pruebas en Node y análisis del HTML generado.

## 3. Instrucciones de desarrollo aplicables

El proyecto está ubicado en `/home/fermx95/proyectos/devstoremx`.

[AGENTS.md](AGENTS.md) indica que el servidor de desarrollo debe iniciarse en segundo plano:

```sh
rtk proxy pnpm exec astro dev --background
```

Administración del servidor:

```sh
rtk proxy pnpm exec astro dev status
rtk proxy pnpm exec astro dev logs
rtk proxy pnpm exec astro dev stop
```

La dirección habitual de desarrollo es `http://localhost:4321`. No asumir que el servidor sigue ejecutándose: consultar su estado si se necesita usarlo.

La instrucción de la sesión también referencia `/home/fermx95/.codex/RTK.md`, que pide prefijar los comandos de shell con `rtk`. Para comandos que no requieren transformación de salida se utiliza `rtk proxy`.

Antes de trabajar en áreas relacionadas, consultar las guías que enumera `AGENTS.md`:

- [Routing de Astro](https://docs.astro.build/en/guides/routing/).
- [Componentes Astro](https://docs.astro.build/en/basics/astro-components/).
- [Componentes de frameworks](https://docs.astro.build/en/guides/framework-components/).
- [Content collections](https://docs.astro.build/en/guides/content-collections/).
- [Estilos y Tailwind](https://docs.astro.build/en/guides/styling/).
- [Internacionalización](https://docs.astro.build/en/guides/internationalization/).

Durante la implementación se consultaron las guías de componentes, frameworks y estilos. El idioma actual es español de México; no se implementó un sistema de múltiples idiomas.

Al iniciar el trabajo ya existían modificaciones en `astro.config.mjs`, `package.json`, `pnpm-lock.yaml` y `tsconfig.json`, además del HTML de referencia sin seguimiento. Preservar el trabajo existente y revisar el diff antes de modificar esos archivos. No se creó un commit, PR ni despliegue durante esta sesión.

## 4. Stack y configuración

Las versiones siguientes son los rangos declarados en [package.json](package.json). El lockfile registra la resolución de dependencias.

| Herramienta | Versión declarada | Uso |
| --- | --- | --- |
| Astro | `^7.3.5` | Página, layouts y componentes estáticos |
| Preact | `^10.29.8` | Estado e interacciones de las islas |
| `@astrojs/preact` | `^6.0.5` | Integración y renderizado de Preact |
| Tailwind CSS | `^4.3.3` | Utilidades y tokens de diseño |
| `@tailwindcss/vite` | `^4.3.3` | Compilación de Tailwind mediante Vite |
| `@astrojs/check` | `^0.9.10` | Verificación de tipos y componentes |
| TypeScript | `^6.0.3` | Tipado y compatibilidad con `astro check` |
| `@astrojs/vercel` | `11.0.11` | Adaptador de despliegue; el endpoint de contacto sale como función |
| Resend | `6.30.0` | Envío del aviso interno y de la confirmación al visitante |

`package.json` exige Node `>=22.12.0`. En la sesión se observó Node `v24.15.0` y pnpm `11.1.1`.

[astro.config.mjs](astro.config.mjs) registra `preact()` y `sitemap()` en `integrations`, `vercel()` como adaptador y `tailwindcss()` en `vite.plugins`. El esquema `env` declara `RESEND_API_KEY` con `context: 'server'` y `access: 'secret'`. La salida sigue siendo estática: solo `src/pages/api/contact.ts` usa `prerender = false`. Tailwind usa su integración con Vite y `@import "tailwindcss"`; no se creó una configuración clásica `tailwind.config.js`.

[tsconfig.json](tsconfig.json) extiende `astro/tsconfigs/strict`, utiliza `jsx: "react-jsx"` y `jsxImportSource: "preact"`. Excluye `dist`.

[pnpm-workspace.yaml](pnpm-workspace.yaml) permite los builds de `esbuild` y `sharp`. `package.json` también contiene la autorización de scripts de `esbuild` existente en el proyecto.

La salida de las páginas sigue siendo estática y se genera en `dist/`. El adaptador de Vercel publica además `/api/contact` como función. La clave `RESEND_API_KEY` no entra en el cliente; en local vive en `.env` (ver `.env.example`) y en Vercel debe configurarse como variable de entorno del proyecto. El dominio `devstoremx.xyz` tiene que estar verificado en Resend para que `hola@devstoremx.xyz` pueda enviar.

### Compatibilidad de TypeScript

La instalación inicial del verificador resolvió TypeScript 7. `astro check` informó que todavía no era compatible con esa versión y se ajustó a TypeScript 6. Con la configuración actual el verificador pasa sin errores, warnings ni hints. No subir a TypeScript 7 sin comprobar primero la compatibilidad del verificador.

## 5. Comandos disponibles

| Comando | Función |
| --- | --- |
| `rtk proxy pnpm install` | Instalar las dependencias del proyecto |
| `rtk proxy pnpm exec astro dev --background` | Iniciar desarrollo en segundo plano |
| `rtk proxy pnpm exec astro dev status` | Consultar el estado del servidor |
| `rtk proxy pnpm exec astro dev logs` | Consultar sus logs |
| `rtk proxy pnpm exec astro dev stop` | Detener el servidor |
| `rtk proxy pnpm check` | Ejecutar `astro check` |
| `rtk proxy pnpm build` | Compilar la página para producción |
| `rtk proxy pnpm test` | Ejecutar las pruebas de lógica en Node |
| `rtk proxy pnpm preview` | Servir la compilación para una revisión autorizada |

Existe el script `dev: astro dev`, pero la instrucción del proyecto es utilizar el modo `--background` al iniciar el servidor.

El script de pruebas es `node --experimental-strip-types tests/run.mjs`. Utiliza el runner `node:test` y el soporte de Node para importar los módulos TypeScript de lógica, sin levantar un navegador.

## 6. Estructura de archivos

```text
devstoremx/
├── AGENTS.md
├── CONTEXT.md
├── Landing devstoremx.html
├── README.md
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── devstoremx.svg
│   ├── devstoremx.png
│   ├── devstore_mx.png
│   ├── team/
│   │   ├── fernando-peralta.jpg
│   │   ├── hazel-vazquez.jpg
│   │   ├── janice-garcia.jpg
│   │   └── miriam-medina.jpg
│   └── fonts/
│       ├── ibm-plex-mono-latin.woff2
│       ├── plus-jakarta-sans-latin-ext.woff2
│       └── plus-jakarta-sans-latin.woff2
├── src/
│   ├── pages/
│   │   └── index.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── data/
│   │   └── landing.ts
│   ├── styles/
│   │   └── global.css
│   ├── scripts/
│   │   └── viewport-reveal.ts
│   ├── lib/
│   │   └── process-progress.ts
│   └── components/
│       ├── sections/
│       │   ├── Header.astro
│       │   ├── Hero.astro
│       │   ├── Services.astro
│       │   ├── Technologies.astro
│       │   ├── Process.astro
│       │   ├── About.astro
│       │   ├── Video.astro
│       │   ├── Contact.astro
│       │   └── Footer.astro
│       ├── ui/
│       │   ├── BrandMark.astro
│       │   ├── Logo.astro
│       │   ├── Button.astro
│       │   ├── Icon.astro
│       │   ├── SectionHeading.astro
│       │   ├── ImagePlaceholder.astro
│       │   ├── ServiceCard.astro
│       │   ├── TeamCard.astro
│       │   └── ProjectStatus.astro
│       └── interactive/
│           ├── Navigation.tsx
│           ├── ProcessTimeline.tsx
│           ├── ProcessStep.tsx
│           ├── VideoPlayer.tsx
│           ├── ContactForm.tsx
│           └── ui.tsx
└── tests/
    ├── run.mjs
    ├── viewport-reveal.test.mjs
    └── process-progress.test.mjs
```

`public/images/` es una ubicación sugerida para los recursos futuros; todavía no contiene las fotografías reales. `dist/`, `.astro/` y `node_modules/` son directorios generados e ignorados por Git.

## 7. Arquitectura y renderizado

[src/pages/index.astro](src/pages/index.astro) compone la página. Dentro de `main#contenido` se renderizan, en orden: `Hero`, `Services`, `Technologies`, `Process`, `About`, `Video` y `Contact`. `Footer` queda fuera del `main`. `Header` se monta dentro del hero.

[src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) contiene el documento HTML, los metadatos, la importación de estilos y la inicialización de las animaciones de viewport.

Los componentes Astro producen el contenido estático. Preact se reserva para interacciones con estado. Actualmente hay **cuatro islas hidratadas**:

| Isla | Directiva | Motivo |
| --- | --- | --- |
| `Navigation` | `client:load` | El menú debe estar listo desde el inicio |
| `ProcessTimeline` | `client:load` | Calcular la etapa según la posición actual del scroll |
| `VideoPlayer` | `client:visible` | Activar el reproductor cuando su bloque sea visible |
| `ContactForm` | `client:visible` | Activar el formulario cuando llegue al viewport |

`ProcessStep` y los controles de `interactive/ui.tsx` son componentes hijos de esas islas, no islas independientes.

Las animaciones generales usan un módulo TypeScript y CSS. No se añadió GSAP, Framer Motion ni otra biblioteca de animación.

## 8. Referencia HTML y decisiones de migración

El HTML original es un export empaquetado: contiene un manifest de recursos y una plantilla JSON en scripts con tipos `__bundler/manifest` y `__bundler/template`. No es un documento simple con el diseño directamente expuesto en el primer bloque HTML.

Para interpretar la referencia se extrajo la plantilla. El diseño original estaba planteado para un lienzo de 1440 px de ancho y 6380 px de alto. La landing nueva conserva proporciones y alturas mínimas de escritorio en varias secciones, pero usa ancho adaptable y flujo natural del contenido. No se trasladó el lienzo fijo al sitio móvil.

Las tipografías WOFF2 se recuperaron de los recursos empaquetados y se guardaron localmente. El sitio implementado no depende del runtime del export original, sus etiquetas `x-dc`, su clase `DCLogic` ni sus URLs temporales.

El archivo de referencia sigue en la raíz y no se usa como página de producción. Preservarlo como fuente de comparación.

## 9. Secciones y contenido

| Sección | Ancla | Descripción |
| --- | --- | --- |
| Portada | `#inicio` | Mensaje principal, descripción, CTA y fondo de cuadrícula |
| Servicios | `#servicios` | Nueve servicios con icono, número, título y descripción |
| Tecnologías | Sin ID; `aria-label="Tecnologías"` | Herramientas y plataformas presentadas por la agencia |
| Proceso | `#proceso` | Cinco etapas, resaltado por scroll y tarjeta ilustrativa de estado |
| Equipo | `#nosotros` | Cuatro integrantes con fotografías reales y tarjetas del mismo tamaño |
| Video | `#video` | Se publica solo cuando `site.videoSrc` tiene un recurso. Hoy no se renderiza ni aparece en la navegación |
| Preguntas | `#preguntas` | Ocho preguntas visibles en `<details>`, alineadas con el FAQPage |
| Contacto | `#contacto` | Formulario, enlaces directos e imagen placeholder |
| Footer | Sin ID | Marca, navegación, datos de contacto y copyright |

### Portada

Fondo oscuro con cuadrícula de 160 × 150 px, tres barras azules decorativas y un bloque translúcido. Puede reemplazarse o acompañarse con una fotografía de fondo mediante `site.heroImage`.

El CTA “Cotiza tu proyecto” apunta a `#contacto`; “Ver cómo trabajamos” apunta a `#proceso`. La navegación del header enlaza a servicios, proceso, equipo, preguntas y contacto. El enlace de video solo aparece cuando hay `videoSrc`.

### Servicios

Los nueve servicios están centralizados en `services` de [src/data/landing.ts](src/data/landing.ts):

1. Desarrollo web.
2. Landing pages.
3. Ecommerce.
4. Email templates.
5. Automatizaciones.
6. Apps móviles.
7. Administración de sitios web.
8. Apps web.
9. Soluciones digitales.

Cada registro contiene `number`, `title`, `description` e `icon`. `icon` guarda únicamente la geometría interna del SVG; `Icon.astro` crea el elemento `<svg>` exterior.

### Tecnologías

El arreglo `technologies` muestra Shopify, WordPress, React, Next.js, OpenAI, Anthropic, AWS y Figma. Estos nombres son contenido comercial de la referencia; no significan que todas esas plataformas formen parte del stack de esta landing.

### Equipo

El arreglo `team` contiene cuatro integrantes, correspondientes a las fotografías proporcionadas en `public/team/`:

| Nombre | Fotografía | Cargo |
| --- | --- | --- |
| Fernando Peralta | `/team/fernando-peralta.jpg` | Technical Lead |
| Miriam Medina | `/team/miriam-medina.jpg` | Full Stack Developer |
| Hazel Vázquez | `/team/hazel-vazquez.jpg` | Full Stack Developer |
| Janice García | `/team/janice-garcia.jpg` | Full Stack Developer |

Los nombres se obtuvieron de los nombres de archivo. Cada integrante tiene `name`, `role`, `image`, `tone`, `linkedin` y `portfolio` (el botón “Ver portafolio” solo aparece si `portfolio` tiene URL); ya no se usa `featured` para dar un tamaño diferente a una persona. Los cargos indicados por el usuario son Technical Lead para Fernando Peralta y Full Stack Developer para Hazel Vázquez, Janice García y Miriam Medina.

Todas las fotografías proporcionadas tienen 400 × 400 px. Las tarjetas usan `aspect-square` y captions compactos con fondo `brand` azul y texto blanco. El cuadro se ajusta al ancho del contenido, tiene padding de 10 px horizontal y 6 px vertical, y muestra el nombre a 13 px y el cargo a 11 px debajo; ya no tiene una altura mínima de 76 px. Se distribuyen en una columna en móvil, dos desde `sm` y cuatro desde `lg`. No hay spans de filas o columnas ni una altura mínima de 1000 px en la sección. Se conservan las animaciones actuales de las tarjetas.

### Footer

El copyright usa el año calculado durante el renderizado de Astro. En una salida estática se actualiza al recompilar. “Aviso de privacidad” enlaza a `/aviso-de-privacidad`. Los cuatro servicios del footer apuntan al ancla de cada tarjeta (`/#desarrollo-web`, `/#ecommerce`, `/#apps-moviles`, `/#automatizaciones`). Correo, teléfono y ciudad solo se muestran si `publicValue` los considera reales; hoy el bloque de contacto muestra el formulario y omite los placeholders.

## 10. Componentes reutilizables

| Componente | Responsabilidad y API relevante |
| --- | --- |
| `BrandMark.astro` | Icono real: SVG `/devstoremx.svg` con PNG `/devstoremx.png` como fallback; permite `class` |
| `Logo.astro` | Marca y nombre; enlace a `#inicio`; permite `class` |
| `Button.astro` | Enlace de navegación con apariencia de botón; `href`, `variant`, `arrow`, `class` y slot |
| `Icon.astro` | SVG de 24 × 24; recibe `name` o `markup`, además de `size` y `class` |
| `SectionHeading.astro` | Etiqueta, `h2` y descripción opcional; admite `dark`, `centered` y `class` |
| `ImagePlaceholder.astro` | Imagen o placeholder; `src`, `alt`, `label`, `person`, `featured`, `reveal`, `class` y slot |
| `ServiceCard.astro` | Presentación de un servicio; permite un desfase `delay` |
| `TeamCard.astro` | Retrato y caption de un integrante; controla tamaño, tono y desfase |
| `ProjectStatus.astro` | Ejemplo estático del estado de un proyecto |
| `ProcessStep.tsx` | Etapa individual; número, textos, `active` y `delay` |
| `interactive/ui.tsx` | `Button`, `Field` y `ArrowIcon` reutilizables dentro de Preact |

`Button.astro` genera un `<a>` para navegación; `Button` de Preact genera un `<button>` para acciones. Mantener esa diferencia semántica.

Los iconos por nombre actualmente disponibles son `arrow`, `person`, `image`, `check`, `progress` y `circle`.

## 11. Datos y configuración pendiente

[src/data/landing.ts](src/data/landing.ts) exporta `services`, `steps`, `navigation`, `technologies`, `team` y `site`.

Los textos repetidos y registros de tarjetas están en ese archivo. Parte del copy principal permanece directamente en los componentes de sección; no existe un CMS ni una centralización absoluta de todo el texto.

Configuración actual de `site`:

| Campo | Estado actual | Uso |
| --- | --- | --- |
| `url` | `https://www.devstoremx.xyz` | Dominio canónico, alineado con `site` en `astro.config.mjs` |
| `ogImage` | `/devstore_mx.png` | Imagen Open Graph de 1200 × 630 |
| `sameAs` | Arreglo vacío | Perfiles públicos de la organización |
| `heroImage` | Cadena vacía | Fotografía de portada |
| `contactImage` | Cadena vacía | Fotografía de reunión con cliente |
| `videoSrc` | Cadena vacía | Archivo o URL directa del video |
| `videoPoster` | Cadena vacía | Portada del reproductor |
| `videoDuration` | `[Duración]` | Texto de duración en la sección de video |
| `formEndpoint` | `/api/contact` | Destino de `POST` JSON del formulario |
| `whatsappUrl` | Cadena vacía | Enlace real de WhatsApp |
| `linkedinUrl` | Cadena vacía | Perfil real de LinkedIn |
| `email` | `hola@devstoremx.xyz` | Se publica en el footer, el aviso y los datos estructurados vía `publicValue` |
| `phone` | `[Teléfono / WhatsApp]` | No se publica ni entra en el schema mientras siga entre corchetes |
| `location` | `[Ciudad], México` | Igual que el teléfono. Cuando sea real, se añade a la meta description y a `address` |

Las fotografías, nombres y cargos de los cuatro integrantes ya están configurados. No inventar puestos, teléfonos, perfiles o direcciones comerciales al completar los datos restantes.

## 12. Estilos y sistema visual

[src/styles/global.css](src/styles/global.css) contiene Tailwind, las fuentes, los tokens `@theme`, los estilos base, utilidades compartidas y keyframes.

### Colores

| Token | Valor | Uso general |
| --- | --- | --- |
| `paper` | `#f6f8fc` | Secciones claras |
| `ink` | `#0a0f1c` | Texto principal sobre claro |
| `night` | `#05070d` | Secciones oscuras |
| `panel` | `#0d1321` | Tarjetas y placeholders oscuros |
| `brand` | `#3b55e6` | CTA y acentos sobre claro |
| `electric` | `#5271ff` | Azul de marca y etapa activa |
| `periwinkle` | `#7b93ff` | CTA y títulos activos sobre oscuro |
| `sky` | `#51ade5` | Acento secundario |
| `muted` | `#4a5570` | Texto secundario sobre claro |
| `muted-dark` | `#98a4bd` | Texto secundario sobre oscuro |
| `line` | `#dbe2ee` | Bordes claros |
| `line-dark` | `#1f2a3d` | Bordes oscuros y cuadrícula |
| `cloud` | `#e9eefb` | Texto principal sobre oscuro |

### Tipografía

`Plus Jakarta Sans` es la fuente principal y declara pesos de 200 a 800. `IBM Plex Mono` se usa para numeración, labels técnicos y placeholders, con peso 400. Ambas se sirven desde `public/fonts/` con `font-display: swap`.

Se incluyeron archivos latino y latino extendido de Plus Jakarta Sans. La fuente principal latina se precarga desde el layout. No se requieren peticiones a Google Fonts para la implementación actual.

### Clases compartidas

- `.container-page`: ancho máximo de 1440 px, centrado y padding horizontal adaptable.
- `.section-space`: padding vertical de 64 px, 80 px desde `sm` y 96 px desde `lg`.
- `.grid-background`: cuadrícula decorativa del hero.
- `.button` y sus variantes: tamaños, alineación, hover, estados activos y disabled.
- `.field`: estilo compartido de inputs y textarea.
- `.eyebrow`: etiquetas superiores en mayúsculas con tracking.

La mayoría de los estilos de cada sección se expresan con utilidades Tailwind. Las propiedades CSS específicas de los keyframes y la cuadrícula permanecen en CSS global.

## 13. Comportamiento responsive

Se usan los breakpoints estándar de Tailwind. El cambio principal a escritorio se produce en `lg`, a partir de 1024 px; el cálculo del proceso usa ese mismo límite.

- Hero: título de 44 px en móvil, 64 px desde `sm` y 80 px desde `lg`; CTA apilados en pantallas pequeñas.
- Header: navegación horizontal desde `lg`; menú desplegable en anchos menores.
- Servicios: una columna en móvil, dos desde `sm` y tres desde `lg`.
- Tecnologías: dos columnas en móvil, cuatro desde `sm` y distribución flexible desde `lg`.
- Proceso: lista vertical en móvil y cinco columnas horizontales en escritorio.
- Equipo: una columna en móvil, dos desde `sm` y cuatro desde `lg`. Todas las tarjetas tienen la misma proporción cuadrada y caption uniforme, sin un integrante destacado por tamaño.
- Video: relación de aspecto 16:9 y ancho máximo de 1040 px.
- Contacto: formulario primero e imagen después en móvil; imagen izquierda y formulario derecha desde `lg`.
- Campos de contacto: correo y teléfono apilados en móvil y en dos columnas desde `sm`.
- Footer: columnas y textos se reorganizan para pantallas pequeñas.

Las alturas de escritorio son mínimas, no contenedores rígidos que recorten el contenido móvil.

## 14. Animaciones generales activadas por viewport

El usuario pidió animaciones repetibles al subir y bajar, con movimiento moderado. La implementación está dividida entre [src/scripts/viewport-reveal.ts](src/scripts/viewport-reveal.ts) y `global.css`.

### Activación

1. `BaseLayout.astro` importa y ejecuta `setupViewportReveals()`.
2. Se seleccionan los elementos existentes con `data-reveal`.
3. Un `IntersectionObserver` los observa con thresholds `[0, 0.12]`.
4. La animación se activa cuando el callback indica que el elemento intersecta y tiene al menos un 12% visible o una altura visible de 48 px.
5. Se añade la clase `reveal-visible`.
6. Mientras el elemento siga parcialmente visible, la clase se conserva y la animación no se vuelve a disparar.
7. Cuando sale completamente del viewport, se retira la clase.
8. Al volver a entrar, se ejecuta nuevamente la entrada, en cualquiera de las dos direcciones.

El offset es `12px` cuando el elemento entra desde abajo y `-12px` cuando su borde superior está fuera de la pantalla al activarse. El efecto combina `opacity` de 0.35 a 1 con la propiedad CSS `translate` hasta cero.

### Parámetros visuales

- Duración: 480 ms.
- Curva: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Desplazamiento: 12 px.
- Desfase: `data-reveal-delay`, acotado entre 0 y 120 ms.
- `animation-fill-mode`: `backwards`, para respetar el estado inicial durante el desfase sin dejar transformaciones persistentes después de la entrada.

Los desfases actuales son 0/45/90 ms por grupo de servicios, 0/40/80 ms por grupo de integrantes, incrementos de 25 ms para el proceso y hasta 120 ms para los elementos del hero.

Hay animaciones en los ocho bloques principales, incluido el footer. Se verificaron 47 elementos marcados en el HTML generado.

### Accesibilidad y fallback

- Si `prefers-reduced-motion: reduce` está activo, no se inicia el observer de entradas.
- El cambio de preferencia durante la sesión desconecta o vuelve a crear el observer.
- El CSS de movimiento reducido desactiva animaciones, transiciones y scroll suave.
- Los elementos con `:focus-within` no ejecutan la animación de entrada.
- Sin JavaScript o sin `IntersectionObserver`, el contenido permanece visible: no depende de un estado global oculto.
- La función devuelve un cleanup que desconecta el observer y elimina el listener de la preferencia de movimiento.

La inicialización actual corresponde a una sola página. No hay View Transitions ni reinicialización automática de elementos añadidos dinámicamente después de la selección inicial. Si se introduce navegación que sustituya el DOM, deberá integrarse el ciclo de inicialización y cleanup.

### Otras interacciones visuales

El menú móvil conserva `.hero-enter`, una entrada de 300 ms y 12 px. `.signal` aplica un cambio suave de opacidad en un ciclo de tres segundos a la decoración de portada. Los botones, iconos y captions tienen hover discretos.

No convertir estas entradas en animaciones continuas de grandes secciones ni ocultar contenido al cambiar la dirección del scroll.

## 15. Flujo de desarrollo: etapa activa según el scroll

Las cinco etapas están en `steps`:

1. Llamada de acercamiento.
2. Planeación y cotización.
3. Desarrollo.
4. Llamada de revisión.
5. Entrega.

El HTML original dejaba resaltada siempre la tercera etapa. El usuario pidió que el cuadro que indica la etapa cambiara con el scroll. Se reemplazó la lista estática de `Process.astro` por [ProcessTimeline.tsx](src/components/interactive/ProcessTimeline.tsx), hidratado con `client:load`.

### Presentación

- `ProcessTimeline` mantiene un índice `active`, inicialmente 0.
- Renderiza cada registro mediante [ProcessStep.tsx](src/components/interactive/ProcessStep.tsx).
- La etapa activa tiene cuadro y borde `electric`, número blanco, título `periwinkle` y descripción `cloud`.
- Las demás conservan fondo oscuro, borde neutro y descripción atenuada.
- Los cambios de color duran 300 ms y respetan el CSS de movimiento reducido.
- Solo una etapa lleva `aria-current="step"`.
- Se conservan `data-reveal` y los desfases de entrada en cada `<li>`.

### Cálculo de escritorio

La lógica pura está en [src/lib/process-progress.ts](src/lib/process-progress.ts).

`getHorizontalProcessStep(top, viewportHeight, count)` calcula:

```text
progress = (viewportHeight × 0.78 − top) / (viewportHeight × 0.56)
active = clamp(floor(progress × count), 0, count − 1)
```

`top` es la posición de la lista respecto al viewport. Como las cinco etapas comparten una fila, su avance se distribuye en el recorrido vertical de esa fila por la pantalla. Antes del recorrido queda activa la primera; después, la última. El mismo cálculo devuelve índices descendentes al subir.

### Cálculo móvil

`getVerticalProcessStep(tops, viewportHeight)` usa una línea de lectura en el 45% de la altura del viewport. La etapa se activa cuando el centro de su número de 48 px, `top + 24`, alcanza o sobrepasa esa línea. Se elige la última etapa que ya cruzó el punto.

Las posiciones se obtienen con el `top` de la lista más `offsetTop` de cada elemento. Esto evita que los desplazamientos temporales de las animaciones de entrada alteren el cálculo de la etapa.

### Actualización y rendimiento

- Listener pasivo de `scroll`.
- Listener de `resize`.
- `ResizeObserver` para cambios de tamaño del contenido, cuando está disponible.
- `requestAnimationFrame` agrupa los eventos en una actualización por frame.
- El estado solo cambia cuando cambia el índice calculado.
- Al desmontar, se eliminan listeners, se desconecta el observer y se cancela el frame pendiente.

No se utiliza scroll horizontal, bloqueo de scroll, autoavance por temporizador, sección sticky ni una longitud artificial de múltiples pantallas.

### Tarjeta “Estado de tu proyecto”

`ProjectStatus.astro` sigue siendo una ilustración estática de la referencia, con “Diseño de pantallas / Aprobado”, “Desarrollo de páginas / En progreso” e “Integración de pagos / Pendiente”. No recibe el índice activo ni datos de un proyecto real.

El comportamiento vinculado al scroll corresponde a los cuadros numerados y textos de las cinco etapas. No confundirlo con un dashboard conectado a un backend.

## 16. Navegación interactiva

[Navigation.tsx](src/components/interactive/Navigation.tsx) mantiene el estado `open` del menú móvil.

- El botón alterna las etiquetas “Abrir menú” y “Cerrar menú”.
- Usa `aria-expanded` y `aria-controls="mobile-menu"`.
- El menú se cierra al seleccionar un enlace.
- Se cierra con Escape y devuelve el foco al botón.
- Se cierra al pulsar fuera del menú y del botón.
- Se cierra al cambiar a un viewport de escritorio de 1024 px o más.
- Los listeners se registran mientras está abierto y se eliminan en el cleanup.

No se implementó un modal con focus trap ni bloqueo del scroll de la página. Es un desplegable anclado al header.

## 17. Formulario de contacto

[ContactForm.tsx](src/components/interactive/ContactForm.tsx) recibe `endpoint`, `whatsappUrl` y `linkedinUrl`.

Campos:

| Campo visible | Nombre enviado | Requerido |
| --- | --- | --- |
| Nombre | `name` | Sí |
| Correo electrónico | `email` | Sí |
| Teléfono | `phone` | No |
| Mensaje | `message` | Sí |
| Empresa (oculto) | `company` | No; honeypot |

`Field` aplica labels, `autocomplete`, tipos nativos y límites de longitud: 200 caracteres para nombre/correo, 30 para teléfono y 5000 para mensaje. El textarea permite redimensionar verticalmente. El honeypot usa `name="company"`, `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden` y la clase `sr-only`. Si llega con texto, el endpoint responde 200 y no envía correos.

El botón de envío está deshabilitado hasta que se hidrata el componente, y durante el envío. Se usa `reportValidity()` para la validación nativa.

### Contrato de integración

Si `site.formEndpoint` se configura, el componente envía un `POST` con `Content-Type: application/json`:

```json
{
  "name": "Nombre del contacto",
  "email": "contacto@empresa.com",
  "phone": "55 0000 0000",
  "message": "Descripción del proyecto",
  "company": ""
}
```

`POST /api/contact` valida el JSON con `parseContact`. JSON ilegible responde 400. Datos inválidos responden 422 con `{ ok: false, error }`. Un honeypot con valor simula éxito en ambos estados sin llamar a Resend. Si la validación pasa, Resend envía primero el aviso desde `devstoremx <hola@devstoremx.xyz>` hacia `hola@devstoremx.xyz`, con `replyTo` igual al correo de quien escribió. Un error de ese envío responde 502. Después envía la confirmación a quien escribió, con `replyTo` `hola@devstoremx.xyz`. Si esa confirmación falla o supera 8 segundos, la respuesta sigue siendo 200 y mantiene el aviso como enviado; devuelve el estado de cada correo por separado. `src/lib/contact-delivery.ts` contiene esta lógica y cancela cada petición al vencer su límite.

El componente interpreta `{ ok, notification, confirmation, error? }` y muestra dos alertas según los estados `sent`, `failed`, `unknown` y `skipped`. Usa `AbortSignal.timeout(25000)`, por encima de los 16 segundos máximos de los dos envíos. Conserva el mismo UUID `Idempotency-Key` en reintentos sin cambios y usa claves distintas para cada correo en Resend, cuya ventana de deduplicación dura 24 horas.

- Aviso enviado: alerta de éxito «Mensaje enviado a devstoremx» y limpia el formulario. La segunda alerta indica si la confirmación fue enviada, falló o quedó sin verificar.
- Aviso rechazado: alerta de peligro y confirmación omitida. Error de red o timeout: alerta de advertencia, estado sin confirmar y conserva los campos para reintentar. Si se pierde la respuesta HTTP, ambos correos quedan sin confirmar en el cliente.
- Endpoint vacío: informa que el formulario aún no está conectado; no envía ni simula un envío exitoso. Hoy el endpoint está configurado.

### Contacto directo

Con URLs configuradas, WhatsApp y LinkedIn se renderizan como enlaces externos con `target="_blank"` y `rel="noopener noreferrer"`. Con URLs vacías son botones que informan que el enlace está pendiente. No se inventaron destinos funcionales.

Los mensajes se anuncian con `role="status"` y `aria-live="polite"`; el formulario marca `aria-busy` durante el envío.

## 18. Video

[VideoPlayer.tsx](src/components/interactive/VideoPlayer.tsx) recibe `src` y `poster`.

- Antes de reproducir, muestra la portada o una cuadrícula placeholder, más un botón de play.
- Si existe `src`, al pulsar crea un `<video>` nativo con `controls`, `autoPlay` y `playsInline`.
- Si no existe `src`, muestra un mensaje de disponibilidad futura.
- Si falla la carga, vuelve al estado inicial e informa del error.
- El video no se monta antes de la interacción de reproducción.

La implementación acepta archivos locales o URLs directas compatibles con `<video>`. Aunque el label heredado dice “YouTube o Vimeo”, un enlace de página de esas plataformas no es una fuente compatible con este reproductor. Si se elige alguna de ellas, deberá implementarse su embed.

Existe una etiqueta de captions sin un recurso de subtítulos configurado; los subtítulos reales siguen pendientes junto con el video.

## 19. Imágenes y placeholders

Las fotografías del equipo ya fueron proporcionadas e integradas desde `public/team/`. El hero y el contacto siguen usando placeholders hasta que se indiquen sus recursos reales. Los placeholders son superficies coloreadas con iconos SVG, labels opcionales y captions.

Para incorporar recursos reales:

1. Añadir los archivos a `public/images/` u otra carpeta pública apropiada.
2. Completar `site.heroImage` y `site.contactImage` con rutas como `/images/equipo.webp`. Para sustituir un retrato existente, actualizar `team[].image`.
3. Completar nombres y revisar los textos alternativos para que describan las fotografías reales.
4. Configurar `site.videoPoster` si corresponde.

Las fotografías de `ImagePlaceholder` usan `loading="lazy"`, `decoding="async"` y `object-cover`. La imagen del hero, si se configura, usa `fetchpriority="high"`, se trata como decorativa y conserva el overlay oscuro.

No se implementó una pipeline con `astro:assets` para estas imágenes. Las dimensiones visuales provienen de los contenedores y sus proporciones.

## 20. Accesibilidad y metadatos

El layout declara `lang="es-MX"`, charset, viewport, título, descripción, theme color, metadatos Open Graph y locale `es_MX`.

Hay un único `h1` en el hero, headings por sección, un enlace “Saltar al contenido” hacia `#contenido`, navegación con nombres accesibles, labels para el formulario y foco visible.

Los SVG decorativos se marcan con `aria-hidden="true"`. Los placeholders de personas e imágenes tienen una representación con `role="img"` y `aria-label`.

El dominio canónico configurado es `https://www.devstoremx.xyz`. El layout publica canonical, Open Graph, Twitter Card, favicons y el manifiesto. Los datos estructurados viven en `StructuredData.astro`. El detalle está en la sección 29.

`BrandMark.astro` usa `/devstoremx.svg` con respaldo `/devstoremx.png`. El documento enlaza `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` y `site.webmanifest`. `public/devstore_mx.png` (1200 × 630) es la imagen Open Graph. El H1 de portada no usa `data-reveal="blur"`; su animación solo desplaza el texto y lo deja opaco desde el primer frame.

## 21. Incidencia corregida: HTML dentro de las descripciones

Durante la primera extracción del HTML de referencia se usó una búsqueda de `<p...>` sin delimitar correctamente el nombre de la etiqueta. Coincidió con `<path>` y `<polyline>` dentro de los SVG. Como resultado, las nueve descripciones incluyeron cierres SVG, spans y headings del documento original.

Astro escapó ese contenido al renderizar `{description}`, por lo que aparecía literalmente en los párrafos. El SVG de cada tarjeta estaba correctamente incrustado; el problema principal era la contaminación del dato de texto.

Se corrigió mediante parseo de etiquetas reales para recuperar únicamente el contenido del párrafo. También se normalizaron los atributos SVG de Preact a `stroke-width`, `stroke-linecap` y `stroke-linejoin`.

El estado actual separa claramente:

- `description`: texto plano.
- `icon`: geometría SVG interna.
- `Icon.astro`: elemento `<svg>` con `viewBox="0 0 24 24"`, `stroke="currentColor"` y grosor de 1.5.

`Icon.astro` usa `set:html` para geometría local definida en el repositorio. No utilizar ese mecanismo para convertir descripciones contaminadas en HTML ni introducir markup remoto sin revisar su origen.

Si se vuelve a extraer contenido del export, usar un parser de HTML o delimitar los nombres de etiquetas correctamente. Evitar patrones que puedan confundir `<p>` con etiquetas SVG.

## 22. Pruebas y verificaciones realizadas

### Estado comprobado antes de crear este documento

- `pnpm check`: 34 archivos analizados, cero errores, warnings e hints.
- `pnpm build`: compilación estática exitosa de una página en `dist/`.
- `pnpm test`: diez pruebas aprobadas.

Estas verificaciones corresponden al último cambio de código, el resaltado del proceso por scroll. La creación de este documento no modifica el comportamiento de la landing.

### Pruebas de viewport: seis casos

[tests/viewport-reveal.test.mjs](tests/viewport-reveal.test.mjs) usa elementos, observer y media query simulados en Node. Verifica:

1. Repetición al salir y volver a entrar desde ambos extremos del viewport.
2. Activación con suficiente visibilidad, sin resetear al salir parcialmente.
3. Activación de elementos altos por altura visible.
4. Desactivación y restauración ante cambios de movimiento reducido.
5. Fallback cuando no hay `IntersectionObserver`.
6. Límites de los desfases para mantener entradas moderadas.

### Pruebas del proceso: cuatro casos

[tests/process-progress.test.mjs](tests/process-progress.test.mjs) verifica:

1. Las cinco etapas de escritorio al avanzar y retroceder, con alturas de viewport de 480, 800 y 1200 px.
2. Primera y última etapa fuera del recorrido, y límites básicos del cálculo.
3. Posiciones móviles de altura variable en ambas direcciones.
4. Cruce del centro del número por la línea de lectura móvil.

[tests/contact.test.mjs](tests/contact.test.mjs) verifica `parseContact` y `escapeHtml`: payload válido, campos faltantes, correo inválido, límites de 200 / 200 / 30 / 5000, honeypot `company` y el escape de `<script>` en el HTML de los correos.

[tests/run.mjs](tests/run.mjs) importa las tres suites.

### Análisis del HTML generado

También se realizaron comprobaciones puntuales del build sin navegador:

- Un único `h1`.
- IDs sin duplicados y anclas con destinos existentes.
- Nueve descripciones de servicios con texto limpio.
- Nueve SVG de servicios con geometría válida y atributos correctos.
- Ausencia de atributos SVG camelCase incorrectos en el HTML generado revisado.
- Animaciones distribuidas en los ocho bloques principales.
- Cinco etapas del proceso, una sola con `aria-current="step"`.
- Hidratación de `ProcessTimeline` y conservación de los hooks de entrada.

Las comprobaciones puntuales del HTML no se agregaron como suites permanentes. Las pruebas permanentes cubren la lógica de animaciones, la selección de etapas y la validación del contacto. No son pruebas end-to-end de navegación, formulario o video.

**No se realizó revisión visual ni funcional en navegador.** La adaptación responsive está implementada y la revisión visual final queda a cargo del usuario, conforme a su instrucción.

## 23. Recursos pendientes y límites actuales

| Pendiente | Lugar de configuración o implementación |
| --- | --- |
| Foto del hero | `site.heroImage` |
| Foto de contacto | `site.contactImage` |
| Video y duración reales | `site.videoSrc`, `site.videoPoster`, `site.videoDuration` |
| Embed de YouTube/Vimeo, si se elige | `VideoPlayer.tsx` |
| Subtítulos | Recursos y configuración del reproductor |
| Variable `RESEND_API_KEY` en Vercel y dominio verificado en Resend | Entorno del proyecto y panel de Resend |
| WhatsApp y LinkedIn reales | `site.whatsappUrl`, `site.linkedinUrl` |
| Teléfono y ciudad definitivos | `site.phone`, `site.location`; el correo ya es `hola@devstoremx.xyz` |
| Revisión legal del aviso de privacidad | `/aviso-de-privacidad` ya existe como borrador |
| Teléfono, ciudad y perfiles reales | `site.phone`, `site.location`, `site.sameAs`, `team[].linkedin`; el correo ya es `hola@devstoremx.xyz` |
| Revisión visual en escritorio/móvil | A cargo del usuario |
| Despliegue en Vercel | Adaptador configurado; el despliegue en sí no se ha ejecutado |

No hay una integración real de estados de proyecto. La etapa activa es una representación del recorrido del visitante por la landing. El formulario entrega mensajes cuando `RESEND_API_KEY` está definida y el dominio de envío está verificado en Resend.

## 24. Guía para continuar el trabajo

- Para cambiar servicios, etapas, tecnologías o integrantes, revisar primero `src/data/landing.ts`.
- Para modificar la disposición de un bloque, trabajar en su componente de `sections/`.
- Para cambiar controles visuales compartidos, usar `ui/` o `interactive/ui.tsx`, según el entorno de renderizado.
- Para ajustar duración, distancia o estilo de entradas, modificar `global.css`.
- Para cambiar activación y repetición de entradas, modificar `viewport-reveal.ts` y sus pruebas.
- Para ajustar cuándo se activa una etapa, modificar `process-progress.ts` y sus pruebas.
- Para cambiar el aspecto de la etapa activa, modificar `ProcessStep.tsx`.
- Para cambiar listeners, mediciones o actualización del proceso, modificar `ProcessTimeline.tsx`.
- Al añadir más etapas, revisar la cuadrícula de escritorio, que actualmente está fijada a cinco columnas.
- Evitar animar simultáneamente un contenedor completo y todos sus hijos si eso duplica el movimiento; actualmente se usan bloques de contenido y tarjetas para conservar un efecto discreto.
- Mantener las descripciones como texto plano y la geometría SVG en su campo específico.
- Mantener el comportamiento accesible, el fallback visible y el soporte de movimiento reducido.
- No añadir datos comerciales ficticios para rellenar los placeholders.
- No realizar revisión en navegador salvo que el usuario cambie expresamente esa instrucción.
- Ejecutar verificaciones apropiadas a los cambios de código; un cambio únicamente documental no requiere recompilar la aplicación.
- Actualizar este archivo cuando cambien decisiones, estructura, contratos de integración, comportamiento o estado de los pendientes.

## 25. Secuencia de trabajo completada

1. Lectura de la referencia empaquetada y del proyecto Astro inicial.
2. Migración a componentes Astro, integración de Tailwind y reutilización de Preact existente.
3. Adaptación móvil y placeholders conservados.
4. Recuperación local de las tipografías del export.
5. Implementación de menú, formulario y reproductor configurables.
6. Documentación operativa en `README.md`.
7. Corrección del HTML contaminado en las descripciones y revisión de los SVG.
8. Sustitución de las entradas de una sola ejecución por animaciones repetibles al entrar al viewport desde ambas direcciones.
9. Incorporación de pruebas de la lógica de animaciones.
10. Sustitución del resaltado fijo de la etapa 03 por el resaltado dinámico según scroll, con cálculo distinto para escritorio y móvil.
11. Incorporación de pruebas del avance y retroceso del proceso.
12. Creación de `CONTEXT.md` para conservar el contexto detallado y el estado del proyecto.
13. Endpoint `POST /api/contact` con Resend, honeypot y confirmación al visitante. El detalle está en la sección 30.

No hay una tarea de implementación anterior interrumpida pendiente de completar. Los pendientes de la tabla son recursos e integraciones todavía no proporcionados o solicitados, además de la revisión visual que el usuario decidió hacer personalmente.

## 26. Actualización: recursos de marca y fotografías del equipo

El usuario añadió `public/devstoremx.svg`, `public/devstoremx.png` y las cuatro fotografías en `public/team/`, y pidió sustituir el icono anterior y uniformar el tamaño de todas las tarjetas. También existe `public/devstore_mx.png`, una pieza gráfica de marca distinta del icono transparente.

Se sustituyeron las barras de `BrandMark.astro` por el SVG real con respaldo PNG, y se actualizaron los favicon del layout. Se configuraron los cuatro retratos y los nombres derivados de sus archivos. Se retiró la quinta tarjeta de ejemplo sin fotografía y el tratamiento de fundador destacado. Todas las tarjetas son cuadradas, con el mismo estilo y captions compactos azules; la cuadrícula es de una, dos o cuatro columnas según el viewport. Las animaciones de escala y asentamiento de imagen presentes antes de esta actualización se conservaron.

Los cargos se solicitaron inicialmente al usuario y después se definieron como Technical Lead para Fernando Peralta y Full Stack Developer para los otros tres integrantes. No se hizo revisión en navegador. La documentación previa sobre un equipo de cinco placeholders o un fundador de mayor tamaño queda sustituida por esta configuración.

## 27. Actualización: cuadros de nombre y cargos del equipo

El usuario pidió reducir los cuadros de nombre, ponerles fondo azul y mostrar Full Stack Developer debajo de todos los nombres, salvo su propia tarjeta, que debe indicar Technical Lead. Se interpretó que la tarjeta del usuario corresponde a Fernando Peralta.

`TeamCard.astro` usa un caption de ancho ajustado al contenido, fondo `brand` (`#3b55e6`), texto blanco, nombre de 13 px y cargo de 11 px. El padding es de 10 px horizontal y 6 px vertical, con 2 px de separación entre líneas. Se retiró el bloque anterior de ancho completo y altura mínima de 76 px. Los cuatro retratos mantienen las mismas dimensiones y proporción cuadrada.

Los cargos están definidos en `src/data/landing.ts`: Fernando Peralta / Technical Lead; Hazel Vázquez, Janice García y Miriam Medina / Full Stack Developer. Se mantienen las animaciones actuales y la instrucción de no revisar en navegador.

## 28. Actualización: fotografías del equipo ligeramente más grandes

El usuario pidió ampliar un poco las imágenes. La cuadrícula de `About.astro` se extiende a ambos lados del contenedor interior mediante márgenes de -8 px en móvil, -16 px desde `sm`, -24 px desde `lg` y -48 px desde `xl`. Esto aumenta el tamaño real de las tarjetas cuadradas sin cambiar la distribución de una, dos o cuatro columnas ni ampliar el resto de las secciones. A 1440 px de viewport, cada tarjeta pasa aproximadamente de 282 × 282 px a 306 × 306 px. Se mantienen los captions azules compactos y las animaciones actuales.

## 29. Actualización: SEO y GEO de la landing

Se aplicó la fase técnica y de entidad sobre la landing, con dominio `https://www.devstoremx.xyz`. No se inventaron correo, teléfono, ciudad, precios ni perfiles.

- `astro.config.mjs` define `site` e incluye `@astrojs/sitemap`. El build genera `dist/sitemap-index.xml` y `dist/sitemap-0.xml` con `/` y `/aviso-de-privacidad/`.
- `BaseLayout.astro` publica canonical, Open Graph, Twitter Card, favicon, apple touch icon y manifiesto. Ya no incluye `<meta name="generator">`. La descripción añade la ciudad solo cuando `site.location` deja de ser un placeholder.
- `StructuredData.astro` emite un `@graph` con Organization y ProfessionalService, WebSite, WebPage, nueve Service, OfferCatalog, cuatro Person y FAQPage. En el aviso de privacidad el grafo se limita a organización, sitio y página. No se emiten `telephone`, `address`, `email` ni `sameAs` vacíos.
- La sección Preguntas frecuentes está antes de Contacto, con ocho respuestas en `<details>`. La navegación enlaza a `/#preguntas`.
- Cada servicio tiene `slug` y un `id` en su tarjeta. El footer enlaza Desarrollo web, Ecommerce, Apps móviles y Automatizaciones a esas anclas.
- Si `videoSrc` está vacío, no se renderiza la sección Video ni su enlace. Las etiquetas entre corchetes del hero, el contacto y el reproductor no se publican. Los alt de placeholders vacíos quedan decorativos.
- `public/robots.txt` permite el rastreo general y, de forma explícita, GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot y Google-Extended. `public/llms.txt` resume servicios, proceso, preguntas y contacto. `public/apple-touch-icon.png` es un PNG de 180 × 180 generado desde `devstoremx.svg`.
- `/aviso-de-privacidad` existe como borrador visible, pendiente de revisión legal.
- El H1 usa la clase `hero-title`: la animación solo traslada 12 px y no parte de opacidad 0. Las fotografías del equipo declaran 400 × 400. Un `linkedin` no vacío en `team` convierte el nombre en enlace y en `sameAs` de esa persona.
- El sitio permanece en una sola landing. Los servicios se enlazan con anclas (`/#desarrollo-web` y el resto) dentro de esa página. No habrá rutas `/servicios/[slug]` ni una página por servicio.

Verificación de esta actualización, sin navegador: `pnpm check` sin diagnósticos, `pnpm test` con 13 pruebas aprobadas y `pnpm build` estático de dos páginas. En `dist/index.html` hay un solo H1, canonical y Open Graph absolutos, un JSON-LD parseable, ocho preguntas y ningún placeholder entre corchetes. La revisión visual sigue a cargo del usuario.

## 30. Actualización: formulario de contacto con Resend

El formulario deja de depender de un endpoint externo. `site.formEndpoint` es `/api/contact` y `site.email` es `hola@devstoremx.xyz`, así que el footer, el aviso de privacidad y el JSON-LD publican ese correo mediante `publicValue`.

- `astro.config.mjs` usa `adapter: vercel()` y declara `RESEND_API_KEY` como secreto de servidor. `output` permanece en el valor por defecto, estático. Solo el endpoint desactiva el prerender.
- `src/lib/contact.ts` concentra la validación y las plantillas. `parseContact` recorta los valores, exige nombre, correo y mensaje, aplica el mismo tope que el formulario (200, 200, 30 y 5000) y usa una expresión regular simple para el correo. Si `company` trae texto, devuelve `{ ok: false, honeypot: true }` y no hay envío.
- `notificationEmail` arma el asunto `Nuevo mensaje de {name}` y una tabla con nombre, correo, teléfono y mensaje. `confirmationEmail` usa el asunto `Recibimos tu mensaje · devstoremx`, un texto breve y una copia del mensaje. Ambos devuelven `{ subject, html, text }` con el HTML escapado.
- `src/pages/api/contact.ts` exporta `prerender = false` y `POST`. Lee `RESEND_API_KEY` desde `astro:env/server`. El aviso sale de `devstoremx <hola@devstoremx.xyz>` hacia ese mismo correo, con `replyTo` del visitante. La confirmación invierte destinatario y `replyTo`. Un fallo del aviso responde 502; un fallo o timeout de la confirmación mantiene HTTP 200 y devuelve `{ ok: true, notification: "sent", confirmation }`. El estado de cada correo se informa por separado.
- `ContactForm.tsx` incluye el honeypot oculto. Muestra dos alertas independientes para aviso y confirmación. Solo muestra éxito para un correo aceptado por Resend; fallos y resultados inciertos tienen mensajes diferentes.
- `.env.example` documenta `RESEND_API_KEY`. No hay clave en el repositorio.

En Vercel hay que definir `RESEND_API_KEY`. En Resend, `devstoremx.xyz` debe estar verificado. La revisión visual de la alerta queda a cargo del usuario.

Verificación de esta actualización, sin navegador: `pnpm test` con 21 pruebas aprobadas, `pnpm check` sin diagnósticos y `pnpm build` con salida estática. El build prerenderiza `/` y `/aviso-de-privacidad/`; `.vercel/output/config.json` enruta `^/api/contact/?$` a la función `_render`. No existía `.env`, así que no se comprobó un envío real. Con una clave inválida solo para la prueba local, `POST /api/contact` respondió 400 ante JSON ilegible, 422 ante datos inválidos, 200 ante el honeypot y 502 cuando Resend rechazó la clave.

## Correcciones de la revisión del formulario

Se añadió `src/lib/contact-delivery.ts` con límites de 8 segundos por correo y cancelación del fetch de Resend. `src/lib/contact-status.ts` define los estados y las dos alertas. El cliente espera 25 segundos y mantiene el UUID de idempotencia al reintentar los mismos datos; cada correo usa una clave distinta. Las claves de Resend deduplican durante 24 horas. El formulario se limpia solo tras confirmar la aceptación del aviso. Las pruebas adicionales cubren fallo y lentitud de la confirmación, resultados inciertos, reintentos, validación y propagación del AbortSignal por el SDK instalado, sin correos reales ni navegador.

## Tema oscuro de preguntas frecuentes

La sección `#preguntas` usa `bg-night` y `text-cloud`, al igual que el proceso. El encabezado activa la variante `dark`; números y respuestas usan `text-muted-dark`, y los controles y estados abiertos usan `text-periwinkle`, `bg-panel` y `border-line-dark`. Las líneas animadas respetan el color oscuro mediante `--scroll-line-color`. El usuario solicitó registrar todos los cambios del repositorio en un commit al terminar este ajuste.
