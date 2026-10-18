"""Authorize this project's Google account when no browser can open automatically."""

import os
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow

root = Path(__file__).resolve().parent
credentials = root / 'credentials/client_secrets.json'
state = root / 'state'
os.umask(0o077)
state.mkdir(mode=0o700, exist_ok=True)

flow = InstalledAppFlow.from_client_secrets_file(
    str(credentials), ['https://www.googleapis.com/auth/webmasters']
)
try:
    token = flow.run_local_server(
        host='127.0.0.1',
        port=0,
        open_browser=False,
        timeout_seconds=300,
        authorization_prompt_message='Abre este enlace en el navegador de esta computadora:\n{url}',
        success_message='Autorización completada. Puedes cerrar esta pestaña.',
    )
except Exception as error:
    # Google responses may include tokens; report only the exception type.
    raise SystemExit(f'Autorización incompleta ({type(error).__name__}). Ejecuta de nuevo el comando.') from None

path = state / 'token.json'
descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
with os.fdopen(descriptor, 'w') as destination:
    destination.write(token.to_json())
path.chmod(0o600)
print('Autorización completada; token guardado dentro de este proyecto.', flush=True)
