# Handoff: formulario de contacto con Resend

El formulario ya no depende de un endpoint vacío. `POST /api/contact` envía el aviso a `hola@devstoremx.xyz` y una confirmación a quien escribió. El resto del sitio sigue prerenderizado.

## Qué quedó implementado

- Dependencias `resend` y `@astrojs/vercel`. `astro.config.mjs` usa `adapter: vercel()` y declara `RESEND_API_KEY` como secreto de servidor (`context: 'server'`, `access: 'secret'`). `output` sigue en el valor por defecto, estático.
- `src/lib/contact.ts`: `CONTACT_EMAIL`, `FROM` (`devstoremx <hola@devstoremx.xyz>`), `parseContact`, `escapeHtml`, `notificationEmail` y `confirmationEmail`.
- `src/pages/api/contact.ts`: `prerender = false` y `POST`. JSON ilegible → 400. Validación fallida → 422. Honeypot `company` con texto → 200 sin enviar. El aviso sale primero (`replyTo` = correo de quien escribió); si Resend devuelve error, la respuesta es 502. La confirmación va después (`replyTo` = `hola@devstoremx.xyz`); si falla o supera 8 segundos, la respuesta sigue siendo 200 y conserva el éxito del aviso, pero devuelve el estado de la confirmación por separado. La lógica está en `src/lib/contact-delivery.ts`.
- `site.formEndpoint` es `/api/contact` y `site.email` es `hola@devstoremx.xyz`, así que el footer, el aviso de privacidad y el JSON-LD publican ese correo.
- El formulario tiene un campo oculto `company` (`tabIndex={-1}`, `autoComplete="off"`, `aria-hidden`, `sr-only`). Muestra dos alertas independientes: envío a devstoremx y confirmación al visitante. El fallo de la confirmación muestra una advertencia junto al éxito del aviso. Un resultado incierto no se anuncia como enviado ni fallido.
- Cada petición a Resend tiene un límite de 8 segundos con cancelación; el cliente espera hasta 25 segundos. El formulario conserva el UUID `Idempotency-Key` en reintentos sin cambios. Cada correo tiene una clave distinta en Resend, que evita duplicados durante 24 horas. El UUID cambia al modificar los datos o completar el envío.
- La respuesta JSON incluye `{ ok, notification, confirmation, error? }`, con estados `sent`, `failed`, `unknown` y `skipped`. Los campos se limpian únicamente cuando el aviso fue aceptado.
- Pruebas en `tests/contact.test.mjs` y `tests/contact-delivery.test.mjs`, importadas desde `tests/run.mjs`. `.env.example` documenta la clave. `CONTEXT.md`, `README.md` y `public/llms.txt` describen el endpoint y el correo. `.vercel/` quedó en `.gitignore`.

## Validación

`parseContact` recorta los valores. Nombre, correo y mensaje son obligatorios; el teléfono no. El correo usa una expresión regular simple. Los topes coinciden con el formulario: 200 (nombre), 200 (correo), 30 (teléfono) y 5000 (mensaje). Un `company` con texto devuelve `{ ok: false, honeypot: true }` y el endpoint lo traduce a éxito silencioso.

El HTML de ambos correos escapa `<`, `>`, `&`, `"` y `'`. El asunto del aviso es `Nuevo mensaje de {name}` y el de la confirmación es `Recibimos tu mensaje · devstoremx`.

## Verificación

- `pnpm test`: 30 pruebas aprobadas, incluidos éxito parcial, timeout, reintentos y cancelación real del fetch del SDK con transporte simulado.
- `pnpm check`: 43 archivos, sin errores, warnings ni hints.
- `pnpm build`: salida `static` con adaptador Vercel. Se prerenderizan `/` y `/aviso-de-privacidad/`. `.vercel/output/config.json` manda `^/api/contact/?$` a la función `_render`. No hay HTML estático de esa ruta.
- No hay `.env` en el repo, así que no se hizo un envío real. Con una clave inválida solo en el proceso de prueba, el endpoint respondió 400, 422, 200 (honeypot) y 502 (Resend rechazó la clave).
- No se revisó la alerta en el navegador. Esa revisión queda de tu lado, como indica `CONTEXT.md`.

## Pendiente para que los correos salgan

1. Crear `.env` con `RESEND_API_KEY` (el ejemplo está en `.env.example`) y reiniciar el servidor de desarrollo.
2. En Vercel, definir la misma variable en el proyecto.
3. En Resend, verificar el dominio `devstoremx.xyz` para poder enviar desde `hola@devstoremx.xyz`.

Hasta que exista `RESEND_API_KEY`, un `POST` real no puede completar el envío. La revisión de las correcciones usó transporte simulado; no inició ni detuvo el servidor de desarrollo.

La sección de preguntas frecuentes usa fondo oscuro, textos claros y bordes y controles del tema oscuro. Todos los cambios se incluyen en el commit solicitado por el usuario; no se realizó despliegue.
