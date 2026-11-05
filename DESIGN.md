---
name: Devstoremx
description: "Agencia de desarrollo web en México: precisión técnica, azul eléctrico y una retícula que se siente construida."
colors:
  paper: "#F6F8FC"
  ink: "#0A0F1C"
  night: "#05070D"
  panel: "#0D1321"
  brand: "#3B55E6"
  primary-hover: "#2F47CC"
  electric: "#5271FF"
  periwinkle: "#7B93FF"
  periwinkle-hover: "#9AB0FF"
  sky: "#51ADE5"
  muted: "#4A5570"
  muted-dark: "#98A4BD"
  line: "#DBE2EE"
  line-dark: "#1F2A3D"
  line-strong: "#77839B"
  line-strong-dark: "#56627A"
  placeholder: "#6B758A"
  surface-raised: "#FFFFFF"
  cloud: "#E9EEFB"
  surface-sunken: "#EEF2F8"
  primary-soft: "#E8EDFF"
  primary-soft-dark: "#1A2350"
  success: "#1D7A45"
  success-soft: "#E6F5EC"
  success-dark: "#4ADE80"
  success-soft-dark: "#0C2A1A"
  warning: "#8A5A00"
  warning-soft: "#FFF4DC"
  warning-dark: "#F5B544"
  warning-soft-dark: "#2E2108"
  danger: "#B42318"
  danger-soft: "#FDECEA"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "5rem"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Plus Jakarta Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.16
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Plus Jakarta Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: "1.75rem"
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Plus Jakarta Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Plus Jakarta Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.625rem"
    letterSpacing: "0em"
  label:
    fontFamily: "Plus Jakarta Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: "1rem"
    letterSpacing: "0.01em"
  eyebrow:
    fontFamily: "Plus Jakarta Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: "1.25rem"
    letterSpacing: "0.1em"
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  metadata:
    fontFamily: "Plus Jakarta Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.8
  reading:
    fontFamily: "Plus Jakarta Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.9
  editorial:
    fontFamily: "Plus Jakarta Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.5vw, 3.875rem)"
    fontWeight: 750
    lineHeight: 1.12
    letterSpacing: "-0.04em"
rounded:
  marker: "2px"
  sm: "4px"
  md: "6px"
  lg: "10px"
  full: "9999px"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-6: "24px"
  space-8: "32px"
  space-12: "48px"
  space-16: "64px"
  space-24: "96px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-hero:
    backgroundColor: "{colors.periwinkle}"
    textColor: "{colors.night}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
    height: "48px"
  button-hero-hover:
    backgroundColor: "{colors.periwinkle-hover}"
  button-outline:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
    height: "48px"
  button-dark-outline:
    backgroundColor: "transparent"
    textColor: "{colors.cloud}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    height: "44px"
  card:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  field:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "48px"
  badge:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.brand}"
    rounded: "{rounded.sm}"
    padding: "3px 8px"
  section-heading:
    textColor: "{colors.ink}"
  service-card:
    textColor: "{colors.ink}"
    padding: "32px 0"
  navigation:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cloud}"
  dashboard-preview:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cloud}"
    rounded: "{rounded.lg}"
  process-timeline:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cloud}"
---

# Design System: Devstoremx

## Overview

**Creative North Star: "La señal eléctrica"**

Devstoremx se lee como una señal precisa dentro de una retícula oscura: un sistema técnico y sereno donde el azul no decora, avisa. La página se construye con líneas de 1 px, números monoespaciados y superficies que cambian de papel bruma a tinta nocturna según lo que el visitante necesita entender. El movimiento existe, pero se concentra en el hero: pulsos que recorren la retícula, barras que se escriben y un caret que parpadea; fuera de ahí, el contenido entra una vez y se queda quieto.

La densidad es media. Las secciones respiran, las medidas de lectura se quedan entre 64 y 72 caracteres y las tarjetas se definen por bordes, no por sombras. La jerarquía se construye con tamaño y peso de una sola familia, Plus Jakarta Sans, apoyada por IBM Plex Mono para cifras, etapas y metadatos técnicos. La calidez viene del trato cercano y de la fotografía real del equipo; la autoridad, de la precisión.

El sistema rechaza explícitamente los degradados morados, los emojis decorativos, las ilustraciones genéricas, las sombras por defecto y cualquier animación en bucle fuera del hero.

**Key Characteristics:**
- Retícula de 160 × 150 px y líneas de 1 px como estructura visible.
- Azul escaso: acción, dato e identidad; nunca relleno decorativo.
- Una sola sans para todo, con IBM Plex Mono como instrumento para números.
- Tarjetas planas, radios contenidos (4/6/10 px) y bordes antes que sombras.
- Movimiento contenido: 150 ms en hover, 250 ms en paneles y bucles solo en el hero.

## Colors

Una paleta sobria de azules sobre dos superficies oficiales: papel bruma para leer y tinta nocturna para decidir. El contraste se verifica; el color nunca es la única señal de estado.

### Primary
- **Azul acción** (#3B55E6): acción principal, enlaces y estado activo. Es el azul para texto pequeño sobre claro (5.44:1 sobre papel). Hover y pressed: #2F47CC.
- **Azul eléctrico** (#5271FF): identidad y energía. Se usa en titulares de 24 px o más, iconos de servicio, barras del hero y pulsos de la retícula. No se usa en texto pequeño sobre claro (4.07:1 sobre blanco).
- **Azul periwinkle** (#7B93FF): primario del tema oscuro, enlaces y botón del hero sobre tinta nocturna. Hover: #9AB0FF.

### Secondary
- **Azul cielo** (#51ADE5): acento gráfico y relleno. Aparece en el degradado de progreso, checks sobre oscuro y el bloque que respira en el hero. El texto sobre sky es tinta (#0A0F1C, 7.7:1).

### Tertiary
- **Verde publicado** (#1D7A45) sobre **Verde suave** (#E6F5EC): éxito, aprobado, en línea. En oscuro, #4ADE80 sobre #0C2A1A.
- **Ámbar pendiente** (#8A5A00) sobre **Ámbar suave** (#FFF4DC): aviso, pendiente, en revisión. En oscuro, #F5B544 sobre #2E2108.
- **Rojo error** (#B42318) sobre **Rojo suave** (#FDECEA): error y acciones destructivas. En oscuro, #FF8A7A sobre #2F0F0C.

### Neutral
- **Tinta nocturna** (#05070D): fondo de las secciones oscuras, footer, proceso y preguntas. Es el negro oficial de la marca.
- **Panel nocturno** (#0D1321): tarjetas, menús y superficies elevadas dentro del modo oscuro.
- **Tinta** (#0A0F1C): texto principal y titulares sobre superficies claras.
- **Papel bruma** (#F6F8FC): fondo base del sitio claro.
- **Papel elevado** (#FFFFFF): tarjetas, campos, blog y contenedores que necesitan separarse del papel.
- **Papel hundido** (#EEF2F8): franjas alternas, fondo de bloques técnicos y superficies de descanso.
- **Nube** (#E9EEFB): texto principal sobre tinta nocturna.
- **Gris azulado** (#4A5570): texto secundario sobre claro (6.99:1). Es el color de párrafos, metadatos y ayudas.
- **Gris niebla** (#98A4BD): texto secundario sobre oscuro (8.04:1).
- **Línea** (#DBE2EE): bordes y divisores sobre claro.
- **Línea nocturna** (#1F2A3D): bordes y divisores sobre oscuro.
- **Línea fuerte / nocturna**: los tokens `line-strong` y `line-strong-dark` dibujan controles y bordes que deben distinguirse, no divisores decorativos. `placeholder` es exclusivo del texto de ayuda en campos.
- **Azul suave** (#E8EDFF): fondo tintado detrás de texto o iconos de acción.
- **Estados oscuros**: `success-dark` / `success-soft-dark`, `warning-dark` / `warning-soft-dark` y `primary-soft-dark` son las parejas usadas en badges y estados del dashboard; no duplicar sus valores en componentes.

### Named Rules
**La regla del azul escaso.** El azul se usa con moderación: fondos neutros y azul reservado para acción, dato e identidad. Su rareza es la señal; si todo es azul, nada es importante.

**La regla del texto pequeño.** El azul eléctrico no se usa para texto menor de 24 px sobre claro. Para enlaces, etiquetas y cuerpo, se usa azul acción.

**La regla del estado con palabra.** Éxito, aviso y error siempre llevan palabra o icono además del color. Nunca se comunican solo con un cambio de tono.

## Typography

**Display Font:** Plus Jakarta Sans (con Segoe UI, system-ui, sans-serif)
**Body Font:** Plus Jakarta Sans (misma pila)
**Label/Mono Font:** IBM Plex Mono (con ui-monospace, monospace)

**Character:** Una sola sans variable, geométrica y muy legible, con la jerarquía ganada por tamaño y peso. El mono aparece como instrumento de precisión: cifras, etapas, fechas y metadatos técnicos. La combinación se siente más de estudio de software que de agencia decorativa.

### Hierarchy
- **Display** (700, 36–80 px, 1.08, −0.035em): solo el H1 del hero. En móvil arranca en 36 px; en escritorio llega a 80 px.
- **Headline** (700, 28–48 px, 1.16, −0.025em): H2 de sección. En servicio llega a 32 px; en blog, a 28 px.
- **Title** (600, 22 px / 28 px, −0.01em): H3 de tarjeta, servicio y bloque.
- **Lead** (400, 18–20 px / 28–30 px): párrafo introductorio bajo el H1 y descripciones de sección.
- **Body** (400, 16 px / 26 px): texto corrido; máximo 64–72 caracteres por línea.
- **Label** (500, 13 px / 16 px, 0.01em): etiquetas de formulario y badges.
- **Eyebrow** (700, 13 px / 20 px, 0.1em, mayúsculas): antetítulo de sección.
- **Mono** (400, 13 px / 20 px): números de servicio, etapas, fechas, porcentajes y datos técnicos.
- **Metadata** (400, 0.75rem): mínimo para texto secundario, incluidos cargos y pies de foto.
- **Reading** (400, 1.1875rem / 1.9; 1.125rem / 1.85 en móvil): cuerpo de artículos, con una medida máxima de 720 px.
- **Editorial** (750, máximo 3.75rem en índice y 3.875rem en artículos, 1.12): variante establecida para títulos del blog, dentro de la misma familia variable. El peso se comparte como `--font-weight-editorial`.

Los tamaños de texto del sitio web se expresan en `rem` (base del navegador, no fijar el tamaño de `html`). Los valores en px de esta sección son equivalencias a 16 px de base. El hero usa pasos de 2.25/2.625/4/5rem; los títulos de sección, 1.75/1.875/2.5/3rem. Las variantes interiores y de lectura conservan su escala existente. Las plantillas de email mantienen px por compatibilidad con clientes de correo.

### Named Rules
**La regla de una sola voz.** No se añade una segunda familia para titulares ni para cuerpo. La jerarquía se gana con tamaño, peso y espacio.

**La regla del número instrumento.** Cifras, etapas, fechas y metadatos van en IBM Plex Mono; el resto, en Plus Jakarta Sans.

**La regla del sentence case.** Los titulares y botones usan mayúscula solo al inicio. Las versalitas se reservan para eyebrows y etiquetas de sección.

## Layout

El contenedor llega a 1440 px y, en ese ancho, el contenido se detiene en 1200 px: padding lateral de 24 px en móvil, 40 px desde sm, 64 px desde lg y 120 px desde xl. Las secciones usan un ritmo vertical de 64 px en móvil, 80 px en tablet y 96 px en escritorio.

Las cuadrículas principales son de 1/2/3 columnas para servicios, 1/2/4 para el equipo, 5fr/7fr para el bloque de dashboard y 3 columnas para entradas relacionadas. Las páginas de servicio usan una retícula editorial de dos columnas: título pegajoso a la izquierda (0.8fr) y cuerpo de 64ch a la derecha (1.2fr). El blog usa el contenedor compartido `container-reading` (marco de 1280 px, padding de 24/40 px y máximo efectivo de 1200 px), 225 px de índice pegajoso más 720 px de lectura, con 64 px de separación.

Los puntos de quiebre observados son 400 px para ajustes ópticos, 640 px para dos columnas, 900 px para el blog, 1024 px para escritorio y el menú completo, 1250 px para el aire del artículo y 1280 px para el contenedor ancho. En móvil todo colapsa a una columna; el menú se convierte en panel bajo el header y el proceso solo se fija cuando hay al menos 1024 × 780 px de viewport.

### Named Rules
**La regla del contenido 1200.** Aunque el marco llegue a 1440, la lectura y la composición se detienen en 1200. Nada de líneas de texto que crucen la pantalla.

**La regla del aire de sección.** Cada sección respira 64/80/96 px. La densidad se ajusta con el contenido, no con márgenes arbitrarios.

**La regla del pin honesto.** El timeline del proceso solo se fija en pantallas altas y anchas. Si no hay espacio, fluye con el documento.

## Elevation & Depth

El sistema es plano por defecto. La profundidad se lee en capas tonales y bordes de 1 px: papel bruma → papel elevado → papel hundido en claro; tinta nocturna → panel nocturno en oscuro. La sombra no es decoración: aparece solo en capas que flotan de verdad, como el menú móvil y el preview del dashboard.

### Shadow Vocabulary
- **Capa flotante** (`shadow-xl` de Tailwind: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)): menú móvil y preview del dashboard.
- **Anillo de estado eléctrico** (`0 0 0 4px rgba(82,113,255,0.18)`): etapa actual del timeline y pasos del dashboard.
- **Foco claro** (`0 0 0 2px #F6F8FC, 0 0 0 4px #3B55E6`): teclado sobre papel.
- **Foco oscuro** (`0 0 0 2px #05070D, 0 0 0 4px #7B93FF`): teclado sobre tinta nocturna.

### Motion
Las transiciones de hover y foco duran 150 ms con ease-out. Los paneles (FAQ) duran 250 ms. Los revelados de viewport usan 700–900 ms con `cubic-bezier(0.22, 1, 0.36, 1)` y un desplazamiento de 48 px. Las entradas generales usan solo opacidad y movimiento; el desenfoque de 16 px queda reservado a títulos con `data-reveal="blur"`, nunca bloques completos como el timeline. Los revelados pueden repetirse al reentrar al viewport, pero no son bucles ambientales. Los bucles viven solo en el hero: barras de 7 s, pulsos de 9–11 s, respiración de 6 s y caret de 1.1 s. `prefers-reduced-motion` apaga todo, incluidos los bucles y las transiciones de vista.

### Named Rules
**La regla del borde primero.** Si una superficie necesita separarse, primero se prueba un borde o un cambio de tono. La sombra es el último recurso.

**La regla de la capa que flota.** Solo el menú móvil y el preview del dashboard se levantan. Todo lo demás vive en el plano.

**La regla del bucle confinado.** Los bucles pertenecen al hero. Fuera de ahí, el movimiento entra una vez y se detiene.

**La regla de los 150/250.** Hover y foco en 150 ms; paneles en 250 ms. Sin rebotes, sin animaciones que se sientan pesadas.

## Shapes

La forma es contenida: radios de 4 px para badges, 6 px para botones y campos, y 10 px para tarjetas, imágenes y contenedores. Los marcadores de listas y los trazos cortos de servicio usan el radio `marker` de 2 px; no es un radio de contenedor. Los equivalentes CSS son `--radius-badge`, `--radius-control` y `--radius-card`. Las únicas formas completamente redondeadas son funcionales: barras de progreso, avatares y puntos de estado. Los bordes son de 1 px; no hay marcos gruesos ni decorativos.

La retícula de 160 × 150 px es la firma geométrica: aparece detrás del hero y de los héroes de servicio, y las líneas de 1 px separan tarjetas, filas de FAQ y secciones. Los iconos son de trazo, 24 px por defecto y 28 px en servicios, con extremos redondeados y sin relleno salvo en la marca y los iconos sociales.

### Named Rules
**La regla del radio contenido.** 4 px para badges, 6 px para controles, 10 px para tarjetas. Nada de 16/20 px salvo pills funcionales.

**La regla de la línea de 1 px.** La estructura se dibuja con líneas finas. Si una línea no separa información, se elimina.

## Components

### Buttons
- **Shape:** radio de 6 px, altura mínima de 48 px, padding de 10 px × 20–24 px, texto de 15–16 px en peso 600.
- **Primary:** fondo azul acción, texto blanco; hover #2F47CC. Es la acción principal de una pantalla, no la decoración.
- **Hero:** fondo periwinkle, texto tinta nocturna; hover #9AB0FF. Se usa sobre el hero oscuro y en el CTA móvil.
- **Outline:** fondo blanco, borde de 1 px #77839B, texto tinta; hover borde y texto azul acción.
- **Dark outline:** fondo transparente, borde de 1 px #56627A, texto nube; hover borde y texto periwinkle. Es el CTA secundario del header oscuro.
- **WhatsApp / LinkedIn:** usan sus colores de marca solo en contacto y equipo; no son parte de la paleta general.
- **Hover / Focus:** transición de 150 ms ease-out. El foco de teclado es un anillo de 2 px del color de la superficie más 2 px de azul acción (periwinkle en oscuro).

### Chips / Badges
- **Style:** radio de 4 px, padding de 3 px × 8 px, texto de 12–13 px en peso 500.
- **State:** aprobado en verde suave, en progreso en azul suave, pendiente en ámbar suave. En oscuro se usan los tonos profundos equivalentes.
- **Rule:** siempre incluyen palabra; el color acompaña, no sustituye.

### Cards / Containers
- **Corner Style:** 10 px.
- **Background:** blanco sobre papel; panel nocturno sobre tinta.
- **Shadow Strategy:** ninguna por defecto; ver Elevation & Depth.
- **Border:** 1 px línea (claro) o línea nocturna (oscuro).
- **Internal Padding:** 20–24 px; las tarjetas de dashboard, 20–24 px.

### Inputs / Fields
- **Style:** altura mínima de 48 px, radio de 6 px, fondo blanco, borde de 1 px #77839B, texto de 16 px, padding horizontal de 14 px. Placeholder #6B758A.
- **Focus:** borde azul acción más un outline de 2 px con offset de 2 px.
- **Error / Disabled:** las validaciones se muestran junto al campo, con `aria-invalid` y `aria-describedby`, y el foco pasa al primer campo inválido al enviar. El teléfono se identifica como opcional. Los resultados del envío conservan las alertas con icono, título y texto; los datos no se borran si falla. El estado deshabilitado baja la opacidad al 60 %.

### Navigation
- **Style:** header oscuro sobre el hero o sólido en páginas interiores. Enlaces de 15 px en peso 500, color nube, hover periwinkle. CTA “Escríbenos” con dark outline de 44 px.
- **Mobile:** botón cuadrado de 44 px, panel de 8 px de radio, fondo panel nocturno, borde línea nocturna y sombra flotante. Cierra con Escape, clic fuera o cambio a escritorio.

### Section Heading
- **Style:** eyebrow en azul acción o periwinkle, H2 de 28–48 px y descripción opcional de 16–18 px. En escritorio, el título y la descripción se separan a izquierda y derecha; la descripción ocupa un 35 % del ancho con máximo de 420 px.

### Service Card
- **Style:** borde superior de 1 px, icono de 28 px en azul acción, número mono, título de 22 px y cuerpo de 16 px / 26 px. El hover levanta el icono 4 px y cambia el título a azul acción. La línea superior se dibuja al entrar en viewport.

### Team Card
- **Style:** retrato cuadrado de 10 px de radio, caption azul de 6 px con nombre de 0.8125rem y cargo de 0.75rem. Los botones de LinkedIn y sitio personal viven debajo. Solo fotografías reales del equipo.

### Dashboard Preview (signature)
- **Style:** mini dashboard oscuro con barra de navegador, radio de 10 px, borde línea nocturna y sombra flotante. La barra de progreso va de azul eléctrico a azul cielo; la etapa actual lleva un anillo eléctrico de 4 px. Es la pieza que mejor resume la promesa de transparencia operativa.

### Process Timeline
- **Style:** cinco etapas numeradas sobre una línea de 1 px. La etapa actual usa relleno azul acción y número blanco (5.79:1), con un anillo eléctrico de 4 px; las completadas usan borde eléctrico y texto periwinkle. Un relleno degradado de eléctrico a cielo avanza con el scroll. En escritorio alto el bloque se fija; bajo 1024 px es vertical, y en escritorios bajos se mantiene horizontal sin fijarse. Las descripciones y fechas inactivas mantienen gris niebla sin opacidad (8.04:1 sobre noche); el título activo cambia a periwinkle en 300 ms. La hidratación comienza cuando el bloque está a 200 px del viewport.

### FAQ
- **Style:** banda de tinta nocturna, filas numeradas con línea de 1 px, botón “+” de 32 px y radio de 6 px. Abre y cierra en 250 ms; la respuesta usa gris niebla y un máximo de 720 px.

### Blog Card
- **Style:** imagen de 1200 × 630 con radio `card`, título de 1.375rem y metadatos de 0.75rem. El hover acerca la imagen un 2.5 % y el título cambia a azul acción. Los estilos editoriales permanecen locales, pero consumen los mismos colores, radios y contenedor compartido. En lectura, el artículo usa superficie elevada, cuerpo de 1.1875rem / 1.9 y medida de 720 px.

## Do's and Don'ts

### Do:
- **Do** usar papel bruma o tinta nocturna como base y reservar el azul para acción, dato e identidad.
- **Do** mantener el ritmo de 4 px y los radios 4/6/10.
- **Do** construir la jerarquía con una sola sans y usar IBM Plex Mono para números y metadatos.
- **Do** separar superficies con bordes de 1 px y cambios de tono antes de recurrir a sombras.
- **Do** mantener el foco de teclado visible y los objetivos táctiles de 44–48 px.
- **Do** usar 150 ms en hover/foco, 250 ms en paneles y 700–900 ms en revelados; los bucles solo en el hero.
- **Do** usar fotografías reales del equipo y evidencia autorizada.

### Don't:
- **Don't** usar degradados morados, emojis decorativos, ilustraciones genéricas ni iconos de relleno.
- **Don't** usar azul eléctrico (#5271FF) en texto pequeño sobre claro; para eso existe azul acción (#3B55E6).
- **Don't** usar sombras como tratamiento por defecto de tarjetas.
- **Don't** añadir una segunda familia tipográfica para titulares o cuerpo.
- **Don't** usar radios mayores a 10 px salvo en pills funcionales como progreso, avatares y puntos.
- **Don't** animar bucles fuera del hero ni usar rebotes.
- **Don't** inventar testimonios, logos, métricas o nombres de clientes para llenar una composición.
