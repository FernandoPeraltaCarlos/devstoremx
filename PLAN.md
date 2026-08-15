# PLAN — Conectar el formulario de contacto con Resend

Documento de trabajo. Describe el plan completo acordado para migrar el formulario
de contacto desde FormSubmit hacia un endpoint propio que envía correos con Resend,
convirtiendo el formulario a un componente React.

---

## 1. Contexto y diagnóstico

### 1.1 Estado actual del proyecto

| Aspecto              | Estado                                                                      |
| :------------------- | :-------------------------------------------------------------------------- |
| Framework            | Astro 7.1.5                                                                 |
| Salida del build     | 100% estática (`output: "static"`, sin adapter)                             |
| Páginas generadas    | 25 (todas prerenderizadas)                                                  |
| React                | No instalado                                                                |
| Resend               | No instalado                                                                |
| Endpoints API        | No existe ninguno (`src/pages` solo tiene `.astro` y `robots.txt.ts`)       |
| Despliegue           | Vercel (confirmado por el usuario; README líneas 11 y 54)                   |
| `trailingSlash`      | `true` en `config.toml` → Astro `trailingSlash: "always"`                   |
| Variables de entorno | No existe `.env` ni `.env.example`. Cero usos de `process.env` o `PUBLIC_*` |

### 1.2 Cómo funciona el formulario hoy

- **Componente:** `src/layouts/components/widgets/ContactForm.astro` (674 líneas).
- **Sección contenedora:** `src/layouts/components/sections/ContactSection.astro`
  (import línea 3, `getEntryCTM` línea 20, render `<ContactForm form={form} />` línea 92).
- **Utilidades de envío:** `src/lib/utils/FormHandle.ts` (301 líneas).
- **Botón:** `src/layouts/components/Button.astro` (línea 102).
- **Estilos:** `src/styles/safe.css` (líneas 4-191).

Páginas que montan `<ContactSection />`:

- `src/pages/[...lang]/index.astro` — import línea 6, uso línea 41
- `src/pages/[...lang]/[page].astro` — import línea 3, uso línea 68
- `src/pages/[...lang]/services/index.astro` — import línea 5, uso línea 33
- `src/pages/[...lang]/services/[single].astro` — import línea 9, uso línea 78

**Mecanismo de envío actual:** `fetch` POST con JSON contra
`https://formsubmit.co/ajax/hola@devstoremx.xyz`, con `e.preventDefault()`.
Todo ocurre en cliente. El `switch` de providers está en `ContactForm.astro:607-623`.

Configuración en `src/config/config.toml` (líneas 69-74):

```toml
contactFormAction = "https://formsubmit.co/hola@devstoremx.xyz"
contactFormProvider = "formsubmit.co"
```

Estos valores se compilan a `.astro/config.generated.json` mediante
`scripts/toml-watcher.mjs` y terminan embebidos en el HTML estático como
`data-action` y `data-provider`.

### 1.3 Problemas detectados en el código actual

1. **Sin fallback sin JavaScript.** El `<form>` solo emite atributo `action` cuando el
   provider es `netlify` (`ContactForm.astro:133`). Con FormSubmit no hay `action`,
   así que sin JS el envío no hace nada.
2. **Correo expuesto en el bundle.** `hola@devstoremx.xyz` viaja en `data-action`
   dentro del HTML estático.
3. **Sin protección anti-spam propia.** Cero honeypot, cero captcha, cero rate limiting.
4. **Formspree con URL ajena hardcodeada** (`FormHandle.ts:257` →
   `https://formspree.io/f/xwpkvjaa`). Si alguien cambiara el provider, los datos
   irían a un formulario que no pertenece al proyecto.
5. **La colección `sections` no valida schema** (`src/content.config.ts:118-120`).
   Los schemas de `src/sections.schema.ts` solo se usan como tipos TypeScript.
6. **Mensajes internos en inglés hardcodeados** mezclados con contenido localizado
   (`FormHandle.ts:196, 203, 267, 298` y `ContactForm.astro:589, 627`).
7. **Los `name` de campo son etiquetas localizadas** con espacios y acentos
   (`"Correo electrónico"`, `"Cómo nos conoció"`), y difieren entre idiomas.
   El servidor no puede identificar de forma fiable cuál campo es el correo.
8. **`submitButton.enable` se ignora** (`ContactForm.astro:299` solo comprueba
   la existencia del objeto).
9. **`contactFormSchema.action`** (`sections.schema.ts:340`) es campo muerto.
10. **Un solo `id="contact-form"` global**: dos instancias en una página romperían el script.

### 1.4 El bloqueo real

Resend requiere `RESEND_API_KEY` en servidor. Llamarlo desde el navegador expondría
la clave. Como el sitio es 100% estático, **hace falta un endpoint server-side**.

### 1.5 Riesgo detectado en el pipeline de build

El adapter `@astrojs/vercel` cambia la salida de `dist/` a `.vercel/output/static/`.
Dos scripts de post-build tienen la ruta fija y romperían `pnpm build`:

- `scripts/check-seo.mjs:9` → `path.join(projectRoot, "dist")`
- `scripts/remove-draft-from-sitemap.mjs:15` → `path.resolve(PROJECT_ROOT, "dist")`

---

## 2. Decisiones acordadas

| Tema             | Decisión                                                                 |
| :--------------- | :----------------------------------------------------------------------- |
| Plataforma       | **Vercel**                                                               |
| React            | **Sí**, convertir el formulario (petición explícita del usuario)         |
| Remitente `from` | `hola@devstoremx.xyz`                                                    |
| Destino `to`     | `hola@devstoremx.xyz`                                                    |
| Autorespuesta    | **Sí**, bilingüe según el idioma del sitio, plantilla genérica por ahora |
| `RESEND_API_KEY` | Ya configurada en Vercel (Production, Preview y Development)             |

### 2.1 Sobre el buzón del remitente

Se usa `hola@devstoremx.xyz`, un buzón real y monitoreado, para reforzar la
confianza y la entregabilidad de las autorespuestas ante proveedores como Outlook.

- Aviso interno → `replyTo` = correo del visitante
- Autorespuesta → `replyTo` = `hola@devstoremx.xyz`

Así, cualquier respuesta del visitante llega al buzón real.

### 2.2 Sobre la preocupación de hidratación con React

El usuario reportó que en ocasiones las últimas versiones de React no hidratan
correctamente en Astro y el componente desaparece.

**Verificación realizada contra documentación oficial (agosto 2026):**

- Astro 7 mantiene soporte completo para React 19 vía `@astrojs/react`.
- `@astrojs/react@6.0.2` declara peer: `react: ^17.0.2 || ^18.0.0 || ^19.0.0`.

**Estrategia de mitigación adoptada:**

- Usar `client:load`, **nunca** `client:only`. Con `client:load` Astro renderiza el
  componente a HTML en el servidor; el formulario existe en el HTML inicial aunque
  la hidratación falle. Con `client:only` el componente no existe en el HTML y un
  fallo deja un hueco vacío — exactamente el síntoma descrito.
- El primer render no usará `window`, `document`, `Date.now()`, `Math.random()` ni
  estado dependiente del navegador. Estas son las causas documentadas de mismatch.
- IDs y valores iniciales deterministas.

**Fallback si se comprueba un fallo real:** bajar a `react@18.3.1` y
`react-dom@18.3.1`. `@astrojs/react@6.0.2` soporta ambas ramas.
**No se bajará preventivamente.**

---

## 3. Arquitectura

Adapter `@astrojs/vercel` + `src/pages/api/contact.ts` con `export const prerender = false`.

- Las 25 páginas siguen prerenderizadas y estáticas.
- Solo `/api/contact/` se convierte en función serverless.
- Permite probar el flujo completo con `pnpm dev` (no requiere `vercel dev`).
- Permite reutilizar tipos, utilidades y alias `@/*`.

Confirmado en documentación oficial de Astro: por defecto todo el sitio se
prerenderiza; `export const prerender = false` opta por render bajo demanda ruta a ruta.

**Nota sobre la URL:** con `trailingSlash: "always"` el endpoint debe invocarse como
`/api/contact/` (con barra final) para evitar una redirección en el POST.

### Alternativa descartada

Función nativa de Vercel en `/api/contact.ts` fuera de Astro. No toca el build
(`dist/` intacto), pero no funciona con `astro dev`, no comparte alias ni tipos, y
supone dos modelos mentales separados.

---

## 4. Dependencias a instalar

| Paquete            | Versión           | Tipo |
| :----------------- | :---------------- | :--- |
| `@astrojs/react`   | `6.0.2`           | dev  |
| `react`            | `19.2.8` (exacta) | prod |
| `react-dom`        | `19.2.8` (exacta) | prod |
| `@types/react`     | `19.x`            | dev  |
| `@types/react-dom` | `19.x`            | dev  |
| `@astrojs/vercel`  | `11.0.5`          | dev  |
| `resend`           | `6.20.0`          | prod |

`@astrojs/vercel@11.0.5` declara peer `astro: ^7.0.0` — compatible con el 7.1.5 instalado.

React y React DOM se fijarán **exactamente** (sin `^`) para evitar actualizaciones
inesperadas que reintroduzcan el problema de hidratación.

---

## 5. Endpoint Resend

**Archivo nuevo:** `src/pages/api/contact.ts`

### 5.1 Características

- `export const prerender = false`
- Solo método `POST` (cualquier otro → `405`)
- API key desde `astro:env/server` (nunca `PUBLIC_*`, nunca en el bundle cliente)
- Validación server-side con Zod (no confiar en el cliente)
- Límite de tamaño del payload
- Verificación de cabecera `Origin` contra los hosts permitidos
- Honeypot anti-spam (rechazo silencioso si viene relleno)
- Escape de contenido antes de generar el HTML del correo
- Sanitizado de `replyTo` para evitar inyección de cabeceras
- Respuestas de error genéricas, sin filtrar detalles internos ni trazas
- Identificador de envío (`submissionId`) usado como `idempotencyKey` de Resend
  para prevenir duplicados en reintentos

### 5.2 Configuración de envío

```
from: DevStoreMX <hola@devstoremx.xyz>
to:   hola@devstoremx.xyz
```

Aviso interno:

```
replyTo: <correo del visitante>
```

Autorespuesta:

```
replyTo: hola@devstoremx.xyz
```

### 5.3 Manejo de errores del SDK

El SDK de Resend devuelve `{ data, error }` y **no lanza excepciones**.
Se comprobará `error` explícitamente. Solo se usará `try/catch` para fallos de red.
Todos los parámetros en camelCase (`replyTo`, no `reply_to`).

---

## 6. Flujo de correos

1. Se envía **primero** el aviso interno a `hola@devstoremx.xyz`.
2. Si ese envío funciona:
   - Se devuelve éxito al formulario.
   - Se envía la autorespuesta al visitante.
   - La autorespuesta será en español o inglés según el idioma activo del sitio.
   - Por ahora usará HTML y texto plano genéricos.
3. Si la autorespuesta falla pero el aviso interno llegó, **el formulario sigue
   mostrando éxito** para evitar que el visitante duplique el contacto.
4. Si falla el aviso interno, se devuelve error genérico al formulario.

El endpoint quedará preparado para sustituir las plantillas por React Email más
adelante sin cambiar su lógica.

---

## 7. Campos estables

### 7.1 Problema

Hoy los `name` son etiquetas localizadas y distintas por idioma:

| Español                       | Inglés                     |
| :---------------------------- | :------------------------- |
| `Nombre`                      | `Name`                     |
| `Teléfono o WhatsApp`         | `Phone or WhatsApp`        |
| `Correo electrónico`          | `Email Address`            |
| `Medio de contacto preferido` | `Preferred contact method` |
| `Mensaje`                     | `Message`                  |
| `Cómo nos conoció`            | `User Source`              |

El servidor no puede identificar de forma fiable cuál es el correo para el `replyTo`.

### 7.2 Solución

Actualizar ambos `src/content/sections/{spanish,english}/contact-section.md` para
usar nombres técnicos independientes del idioma:

- `name`
- `phone`
- `email`
- `preferredContact`
- `message`
- `source`

Las etiquetas (`label`), placeholders y textos de mensajes **siguen traducidos**.
Esto también resuelve el hallazgo 1.3.7.

### 7.3 Campos adicionales enviados por el cliente

- `locale`: `es` o `en`
- `submissionId`: identificador único del envío
- Campo honeypot oculto (no visible, `tabindex="-1"`, `autocomplete="off"`,
  `aria-hidden="true"`)

---

## 8. Componente React

**Archivo nuevo:** `ContactForm.tsx`
**Archivo eliminado:** `ContactForm.astro`

`ContactSection.astro` **se mantiene como componente Astro estático** y monta el
formulario con `client:load`.

### 8.1 Se conserva

- Apariencia y clases CSS actuales (`safe.css` sin cambios)
- Campos configurados desde Markdown
- Agrupación de radios (`combineRadio`) y checkbox
- Validación HTML nativa (`required`)
- Validación adicional antes del envío (campos vacíos, grupos sin selección, formato de email)
- Estados `pending`, `success` y `error`
- Botón deshabilitado mientras se envía
- Reset del formulario tras el éxito
- Enlace alternativo a `hola@devstoremx.xyz` ante errores

### 8.2 Código a eliminar

| Elemento                        | Ubicación                                          |
| :------------------------------ | :------------------------------------------------- |
| Componente Astro del formulario | `src/layouts/components/widgets/ContactForm.astro` |
| Utilidades de envío             | `src/lib/utils/FormHandle.ts`                      |
| Provider FormSubmit             | `FormHandle.ts:142-212`                            |
| Provider Formspree (URL ajena)  | `FormHandle.ts:250-273`                            |
| Provider Netlify                | `FormHandle.ts:281-301`                            |
| `contactFormAction`             | `config.toml:71`                                   |
| `contactFormProvider`           | `config.toml:74`                                   |

---

## 9. Astro y Vercel

### 9.1 `astro.config.mjs`

Añadir:

- Integración `react()`
- `adapter: vercel()`
- `output` estático por defecto (sin cambios explícitos)
- Schema de entorno con `RESEND_API_KEY` como `context: 'server'`, `access: 'secret'`

### 9.2 `tsconfig.json`

Añadir según documentación oficial de `@astrojs/react`:

```json
"jsx": "react-jsx",
"jsxImportSource": "react"
```

### 9.3 Residuos de Cloudflare a eliminar

Confirmados como no utilizados (el despliegue es Vercel):

- `wrangler.toml`
- Script `deploy:cf` en `package.json`

---

## 10. Ajustes al build

El adapter genera archivos en `.vercel/output/static/`, no en `dist/`.

Actualizar para que detecten primero `.vercel/output/static/` y usen `dist/` como fallback:

- `scripts/check-seo.mjs`
- `scripts/remove-draft-from-sitemap.mjs`

Así el build funciona con y sin adapter.

---

## 11. Documentación

- Crear `.env.example` con `RESEND_API_KEY`
- Actualizar `README.md`:
  - Documentar `RESEND_API_KEY`
  - Explicar la autorespuesta bilingüe
  - Actualizar la tabla de comandos si cambia algo

La API key ya está configurada en Vercel y se aplicará en el siguiente despliegue.

---

## 12. Verificación

### 12.1 Comandos

- `pnpm install --frozen-lockfile`
- `pnpm audit`
- `pnpm astro-check`
- `pnpm build`

### 12.2 Comprobaciones de build

- Validación SEO pasa
- Sitemap generado correctamente
- Las 23 páginas siguen prerenderizadas
- La API key **no aparece** en HTML ni en bundles cliente

### 12.3 Comprobaciones funcionales

- Probar el formulario en español y en inglés
- Revisar la consola por errores de hidratación
- Confirmar que el HTML del formulario existe **antes** de ejecutar JavaScript
  (deshabilitar JS y verificar que el markup está presente)
- Probar en desktop y móvil
- Probar validación de campos
- Probar el honeypot
- Probar errores del endpoint
- Verificar recepción del aviso interno en `hola@devstoremx.xyz`
- Verificar recepción de la autorespuesta en ambos idiomas
- Verificar que `replyTo` funciona en ambos correos

---

## 13. Limitaciones conocidas

### 13.1 Rate limiting

Vercel serverless es stateless. Sin Vercel KV o Upstash **no hay rate limiting fiable**.

El honeypot y la validación server-side frenan bots básicos, **no un ataque dirigido**.
Si se requiere protección seria, lo natural es Cloudflare Turnstile en una segunda fase.

### 13.2 Límites de Resend

- Límite por defecto: 10 peticiones por segundo por equipo. Excederlo devuelve `429`.
- Las claves de idempotencia expiran a las 24 horas y admiten máximo 256 caracteres.

---

## 14. Deuda técnica NO incluida

Los siguientes hallazgos quedan documentados pero **fuera del alcance** salvo
indicación contraria:

- La colección `sections` no valida schema en build (`src/content.config.ts:118-120`)
- `submitButton.enable` se ignora
- `contactFormSchema.action` es campo muerto (`sections.schema.ts:340`)
- `parentClass` de las notas `success`/`deprecated` quedó como residuo sin efecto
- Variantes CSS `--info`, `--warning`, `--hint` existen sin markup que las emita
- Un solo `id="contact-form"` global impide múltiples instancias por página

---

## 15. Resumen de archivos afectados

### Nuevos

- `src/pages/api/contact.ts`
- `ContactForm.tsx`
- `.env.example`

### Modificados

- `package.json`
- `pnpm-lock.yaml`
- `astro.config.mjs`
- `tsconfig.json`
- `src/config/config.toml`
- `src/layouts/components/sections/ContactSection.astro`
- `src/content/sections/spanish/contact-section.md`
- `src/content/sections/english/contact-section.md`
- `scripts/check-seo.mjs`
- `scripts/remove-draft-from-sitemap.mjs`
- `README.md`

### Eliminados

- `src/layouts/components/widgets/ContactForm.astro`
- `src/lib/utils/FormHandle.ts`
- `wrangler.toml`

---

## 16. Resumen de implementación

Implementado el 14 de agosto de 2026. El formulario de contacto ya no usa FormSubmit: envía a un endpoint propio con Resend.

### Qué quedó funcionando

- Sitio estático con adapter `@astrojs/vercel`. Las páginas siguen prerenderizadas.
- Solo `/api/contact/` es serverless (`prerender = false`).
- Formulario React hidratado con `client:load` (HTML presente sin JavaScript).
- Aviso interno a `hola@devstoremx.xyz` con `replyTo` del visitante.
- Autorespuesta bilingüe (es/en) con `replyTo` a `hola@devstoremx.xyz`.
- Si falla la autorespuesta pero el aviso interno llegó, el formulario muestra éxito.
- Campos técnicos estables: `name`, `phone`, `email`, `preferredContact`, `message`, `source`.
- Honeypot `website`, validación Zod, límite de payload, chequeo de `Origin`, escape HTML e `idempotencyKey`.
- `RESEND_API_KEY` vía `astro:env/server` (`context: "server"`, `access: "secret"`). No aparece en HTML ni en bundles cliente.

### Archivos nuevos

- `src/pages/api/contact.ts`
- `src/layouts/components/widgets/ContactForm.tsx`
- `.env.example`

### Archivos eliminados

- `src/layouts/components/widgets/ContactForm.astro`
- `src/lib/utils/FormHandle.ts`
- `wrangler.toml`
- Script `deploy:cf` de `package.json`

### Verificación ejecutada

| Comando                          | Resultado                                                                  |
| :------------------------------- | :------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile` | OK                                                                         |
| `pnpm astro-check`               | 0 errores, warnings o hints                                                |
| `pnpm build`                     | OK. Output `static`, modo `server`, adapter Vercel                         |
| SEO (`check-seo.mjs`)            | Pasó (22 páginas indexables; las páginas de privacidad fueron retiradas)   |
| Sitemap                          | Procesado desde `.vercel/output/static/`                                   |
| `pnpm audit`                     | 0 vulnerabilidades                                                         |
| Envío real con Resend            | `POST /api/contact/` → 200; aviso interno y autorespuesta aceptados        |
| Defensas del endpoint            | Honeypot 200, body excedido 413, media type inválido 415, origen ajeno 403 |

El build prerenderizó 23 HTML (22 indexables + 404) y `robots.txt`. En `.vercel/output/config.json`, `/api/contact/` apunta a la función `_render`.

La clave de Resend **no** está en `.vercel/output/static/` ni en `ContactForm.*.js`. El markup del `<form id="contact-form" action="/api/contact/">` sí está en el HTML estático.

### Pruebas funcionales completadas

1. La clave real se carga desde `.env` en desarrollo.
2. El formulario en español realizó un envío real y mostró éxito.
3. La versión inglesa hidrata correctamente en viewport móvil de 390 px.
4. No existen errores de hidratación en consola.
5. El formulario está presente en el HTML SSR y se hidrata con `client:load`.
6. Todos los controles tienen nombre accesible; los errores se anuncian y el primer campo inválido recibe foco.
7. No hay overflow horizontal en móvil.

### Notas

- La vulnerabilidad transitiva de `path-to-regexp` se resolvió mediante override a `6.3.0`; el adapter y sus rutas se validaron con build completo.
- El build local y la prueba real utilizaron la clave de `.env`; el valor nunca se imprimió ni se incluyó en bundles cliente.
- La deuda técnica de la sección 14 no se tocó.

---

## 17. Correcciones posteriores a la revisión

- Límite real de 32 KB leyendo el stream, sin confiar únicamente en `Content-Length`.
- Correo validado con Zod y protección adicional contra valores de cabecera inseguros.
- `submissionId` limitado a UUID y claves separadas `contact/internal/*` y `contact/autoresponse/*`.
- La autorespuesta se ejecuta con `waitUntil` en Vercel y su error se registra sin información personal.
- `localhost` solo se acepta como origen en desarrollo.
- Honeypot inspeccionado antes del schema completo para responder silenciosamente a bots.
- Fallback sin JavaScript con respuesta HTML bilingüe, en vez de mostrar JSON crudo.
- Labels programáticos para inputs, textarea y select; `fieldset/legend` para grupos.
- Estados `aria-invalid`, errores asociados con `aria-describedby` y foco al primer error.
- Límites `maxLength`, autocompletado semántico y fallback si `crypto.randomUUID` no existe.
- Agrupación de radios corregida para soportar más de un grupo.
- Dropdown normal conserva la opción inicial y dropdown de búsqueda usa `datalist` nativo.
- Valores iniciales y autofill sincronizados con el estado visual.
- Mensajes pending/success/error corregidos con clase y atributo `hidden`; antes quedaban visibles por una concatenación sin espacio.
- `submitButton.enable` ahora se respeta y `parentClass` vuelve a aplicarse.
- Configuración TOML generada antes de `dev`, `astro-check` y build; escritura atómica segura entre procesos.
- Scripts SEO y sitemap reciben explícitamente `.vercel/output/static`, sin seleccionar builds obsoletos.
- `validateSecrets: true` evita desplegar sin `RESEND_API_KEY`.
- `pnpm preview` ya no invoca el comando incompatible del adapter Vercel.
- Remitente cambiado a `DevStoreMX <hola@devstoremx.xyz>` para mejorar confianza y entregabilidad.
- El aviso, checkbox y páginas de privacidad fueron retirados por decisión del propietario; no se recrearon.
