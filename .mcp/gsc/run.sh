#!/usr/bin/env bash
set -euo pipefail
umask 077

GSC_PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd -- "$GSC_PROJECT_DIR"

if [[ ! -x "$GSC_PROJECT_DIR/.venv/bin/mcp-search-console" ]]; then
	printf '%s\n' 'GSC MCP: falta la instalación local. Consulta .mcp/gsc/README.md.' >&2
	exit 1
fi

mkdir -p "$GSC_PROJECT_DIR/credentials" "$GSC_PROJECT_DIR/state"
export GSC_CONFIG_DIR="$GSC_PROJECT_DIR/state"
export MCP_TRANSPORT=stdio
export GSC_ALLOW_DESTRUCTIVE=false
unset GSC_CREDENTIALS_PATH GSC_OAUTH_CLIENT_SECRETS_FILE

if [[ -f "$GSC_PROJECT_DIR/credentials/client_secrets.json" ]]; then
	export GSC_OAUTH_CLIENT_SECRETS_FILE="$GSC_PROJECT_DIR/credentials/client_secrets.json"
	export GSC_SKIP_OAUTH=false
elif [[ -f "$GSC_PROJECT_DIR/credentials/service_account.json" ]]; then
	export GSC_CREDENTIALS_PATH="$GSC_PROJECT_DIR/credentials/service_account.json"
	export GSC_SKIP_OAUTH=true
else
	# El servidor puede anunciar sus herramientas sin credenciales; las consultas
	# explicarán qué archivo falta hasta completar la configuración de Google.
	export GSC_OAUTH_CLIENT_SECRETS_FILE="$GSC_PROJECT_DIR/credentials/client_secrets.json"
	export GSC_SKIP_OAUTH=false
fi

exec "$GSC_PROJECT_DIR/.venv/bin/mcp-search-console"
