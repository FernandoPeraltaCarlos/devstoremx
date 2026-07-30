# devstoremx

Proyecto web construido con Astro, Tailwind CSS y contenido en Markdown/MDX.

## Características

- Preparado para inglés y español; español permanece deshabilitado hasta que exista contenido traducido.
- Diseño responsivo y accesible.
- Metadatos SEO, Open Graph y datos estructurados.
- Navegación, formularios de contacto y contenido editable.
- Generación estática preparada para despliegue en Vercel.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

El servidor local estará disponible en `http://localhost:4321`.

## Comandos

| Comando               | Acción                                      |
| :-------------------- | :------------------------------------------ |
| `pnpm dev`         | Inicia el servidor de desarrollo            |
| `pnpm build`       | Genera el sitio de producción en `dist/`    |
| `pnpm preview`     | Genera y previsualiza el sitio localmente    |
| `pnpm astro-check` | Valida los componentes y tipos de Astro      |
| `pnpm format`      | Formatea los archivos dentro de `src/`       |

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

El repositorio se conecta directamente a Vercel desde GitHub. No requiere archivos de configuración específicos del proveedor.

## Autor

Fernando Peralta
