# devstoremx

Proyecto web construido con Astro, Tailwind CSS y contenido en Markdown/MDX.

## Características

- Disponible en español (`/`) e inglés (`/en/`).
- Diseño responsivo y accesible.
- Metadatos SEO, Open Graph y datos estructurados.
- Navegación, formularios de contacto y contenido editable.
- Generación estática preparada para despliegue en Vercel, con un endpoint serverless para el formulario de contacto.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

El servidor local estará disponible en `http://localhost:4321`.

Copia `.env.example` a `.env` y define `RESEND_API_KEY` para probar el envío de correos. Esa clave es solo de servidor: no uses el prefijo `PUBLIC_`.

Cuando alguien envía el formulario, Resend entrega un aviso interno a `hola@devstoremx.xyz` y una autorespuesta al visitante. La autorespuesta usa español o inglés según el idioma de la página.

## Comandos

| Comando            | Acción                                                                               |
| :----------------- | :----------------------------------------------------------------------------------- |
| `pnpm dev`         | Inicia el servidor de desarrollo                                                     |
| `pnpm build`       | Genera el sitio de producción (estático + función `/api/contact/`)                   |
| `pnpm preview`     | Alias de `pnpm dev`; el artefacto real se valida con un Preview Deployment de Vercel |
| `pnpm astro-check` | Valida los componentes y tipos de Astro                                              |
| `pnpm format`      | Formatea los archivos dentro de `src/`                                               |

## Estructura principal

```text
.
├── public/
├── scripts/
├── src/
│   ├── assets/
│   ├── config/
│   ├── content/
│   ├── i18n/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Despliegue

El repositorio se conecta directamente a Vercel desde GitHub. `RESEND_API_KEY` ya está configurada en Production, Preview y Development; se aplica en el siguiente despliegue.

## Autor

Fernando Peralta
