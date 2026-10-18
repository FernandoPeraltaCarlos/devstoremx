# Google Search Console MCP de este proyecto

Servidor: [AminForou/mcp-gsc](https://github.com/AminForou/mcp-gsc), paquete
`mcp-search-console==0.4.1`. Instalado en `.mcp/gsc/.venv`, sin registro global.

Los cuatro clientes usan el mismo arranque y el mismo token de este proyecto:

| Cliente | Configuración del proyecto |
| --- | --- |
| Cursor | `.cursor/mcp.json` |
| Claude Code | `.mcp.json` |
| Codex | `.codex/config.toml` |
| OpenCode | `opencode.json` |

El nombre del servidor es `gscServer`. Las rutas de los clientes corresponden a
`/home/fermx95/proyectos/devstoremx`; si mueves el repositorio,
actualiza esas rutas y reinstala el entorno virtual.

## Completar las credenciales

Habilita Google Search Console API en tu proyecto de Google Cloud y usa una de
estas opciones:

- **OAuth, aplicación de escritorio:** guarda el JSON descargado como
  `.mcp/gsc/credentials/client_secrets.json`. En la primera consulta se abrirá el
  navegador para iniciar sesión con tu cuenta de Google con acceso a la propiedad.
- **Cuenta de servicio:** guarda su clave JSON como
  `.mcp/gsc/credentials/service_account.json` y concede a su correo acceso a la
  propiedad en Search Console.

Si existen ambos archivos, se utiliza OAuth. El token se guarda en
`.mcp/gsc/state/token.json` y se comparte únicamente entre los clientes de este
proyecto. Credenciales, tokens, caché y entorno virtual están excluidos de Git.

Reinicia el cliente después de la configuración. Claude Code puede solicitar
habilitar el servidor del proyecto y Codex requiere confiar en el proyecto para
cargar `.codex/config.toml`.

Si el entorno no puede abrir el navegador automáticamente, ejecuta desde la raíz:

```bash
.mcp/gsc/.venv/bin/python -u .mcp/gsc/authenticate.py
```

Abre el enlace que imprime en un navegador de esta misma computadora y autoriza
tu cuenta. El enlace caduca al terminar el comando (espera hasta cinco minutos).
Los cuatro clientes utilizarán el token guardado sin repetir este paso.

Solicita `get_capabilities` para comprobar autenticación y `list_properties` para
conocer el identificador exacto de la propiedad. Para DevStore MX puede ser
`sc-domain:devstoremx.xyz` o `https://devstoremx.xyz/`, según cómo esté
registrada en Google. Configurarlo por proyecto limita dónde se carga el MCP;
los datos accesibles dependen de los permisos de la cuenta de Google.

## Reinstalar

Desde la raíz del repositorio, con `uv` y Python 3.11 o superior disponibles:

```bash
uv --cache-dir .mcp/gsc/cache venv .mcp/gsc/.venv
uv --cache-dir .mcp/gsc/cache pip install --python .mcp/gsc/.venv/bin/python -r .mcp/gsc/requirements.txt
```

El arranque usa `stdio` y mantiene deshabilitadas las operaciones destructivas
según la configuración predeterminada del servidor.

La instalación inicial reutiliza una copia de la autorización de Google del
portfolio. Este proyecto conserva sus propias credenciales y su propio token.
Para reproducir también las versiones de todas las dependencias, instala
`requirements.lock.txt` en lugar de `requirements.txt`.
