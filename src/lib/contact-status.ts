export type EmailStatus = 'sent' | 'failed' | 'unknown' | 'skipped';
export type ContactResponse = {
  ok: boolean;
  notification: EmailStatus;
  confirmation: EmailStatus;
  error?: string;
};
export type ContactNotice = { tone: 'success' | 'warning' | 'danger'; title: string; text: string };

export function contactNotices(result: ContactResponse): ContactNotice[] {
  const notification: ContactNotice = result.notification === 'sent'
    ? { tone: 'success', title: 'Mensaje enviado a devstoremx', text: 'Te escribimos en menos de 24 horas hábiles.' }
    : result.notification === 'unknown'
      ? { tone: 'warning', title: 'Envío a devstoremx sin confirmar', text: 'No pudimos comprobar el envío. Tus datos siguen aquí para que puedas reintentarlo.' }
      : { tone: 'danger', title: 'No pudimos enviar tu mensaje', text: 'Tus datos siguen aquí para que puedas intentarlo de nuevo.' };
  const confirmation: ContactNotice = result.confirmation === 'sent'
    ? { tone: 'success', title: 'Confirmación enviada a tu correo', text: 'Revisa tu bandeja de entrada y la carpeta de spam.' }
    : result.confirmation === 'failed'
      ? { tone: 'warning', title: 'No pudimos enviar la confirmación', text: 'Tu mensaje sí se envió a devstoremx; no necesitas enviarlo otra vez.' }
      : result.confirmation === 'unknown'
        ? { tone: 'warning', title: 'Confirmación por correo sin verificar', text: result.notification === 'sent' ? 'Tu mensaje sí se envió a devstoremx, pero no pudimos comprobar el envío de la confirmación.' : 'No pudimos comprobar si se envió la confirmación a tu correo.' }
        : { tone: 'warning', title: 'Confirmación no enviada', text: 'Primero necesitamos confirmar el envío de tu mensaje a devstoremx.' };
  return [notification, confirmation];
}

export function isContactResponse(value: unknown): value is ContactResponse {
  if (!value || typeof value !== 'object') return false;
  const body = value as Record<string, unknown>;
  const statuses = ['sent', 'failed', 'unknown', 'skipped'];
  return typeof body.ok === 'boolean'
    && statuses.includes(body.notification as string)
    && statuses.includes(body.confirmation as string)
    && body.ok === (body.notification === 'sent')
    && (body.notification === 'sent' || body.confirmation === 'skipped' || (body.notification === 'unknown' && body.confirmation === 'unknown'));
}
