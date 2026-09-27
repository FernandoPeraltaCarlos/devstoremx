import { randomUUID } from 'node:crypto';
import type { Resend } from 'resend';
import { CONTACT_EMAIL, FROM, confirmationEmail, notificationEmail, parseContact } from './contact.ts';
import type { ContactResponse, EmailStatus } from './contact-status.ts';

type SendEmail = Resend['emails']['send'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const EMAIL_TIMEOUT_MS = 8000;

function json(body: ContactResponse, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

async function sendWithDeadline(
  send: SendEmail, payload: Parameters<SendEmail>[0], idempotencyKey: string, timeoutMs: number,
): Promise<EmailStatus> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<EmailStatus>((resolve) => {
    timer = setTimeout(() => { controller.abort(); resolve('unknown'); }, timeoutMs);
  });
  const options = { idempotencyKey, signal: controller.signal };
  // The installed SDK forwards request options to fetch, including this signal.
  const attempt = (async (): Promise<EmailStatus> => {
    try {
      const result = await send(payload, options);
      if (controller.signal.aborted) return 'unknown';
      if (result.error) {
        console.error('Contact email rejected', result.error);
        return result.error.statusCode == null || result.error.statusCode >= 500
          || result.error.name === 'concurrent_idempotent_requests' ? 'unknown' : 'failed';
      }
      return result.data?.id ? 'sent' : 'unknown';
    } catch (error) {
      console.error('Contact email request failed', error);
      return 'unknown';
    }
  })();
  try { return await Promise.race([attempt, deadline]); }
  finally { clearTimeout(timer); }
}

export async function handleContactRequest(request: Request, getSend: () => SendEmail, timeoutMs = EMAIL_TIMEOUT_MS) {
  let input: unknown;
  try { input = await request.json(); }
  catch { return json({ ok: false, notification: 'skipped', confirmation: 'skipped', error: 'JSON inválido' }, 400); }

  const parsed = parseContact(input);
  if (!parsed.ok) {
    if (parsed.honeypot) return json({ ok: true, notification: 'sent', confirmation: 'sent' });
    return json({ ok: false, notification: 'skipped', confirmation: 'skipped', error: 'Datos inválidos' }, 422);
  }
  const requestId = request.headers.get('Idempotency-Key') ?? randomUUID();
  if (!UUID.test(requestId)) {
    return json({ ok: false, notification: 'skipped', confirmation: 'skipped', error: 'Identificador inválido' }, 400);
  }

  let send: SendEmail;
  try { send = getSend(); }
  catch (error) {
    console.error('Contact email configuration failed', error);
    return json({ ok: false, notification: 'failed', confirmation: 'skipped', error: 'No se pudo enviar el mensaje' }, 502);
  }
  const notification = await sendWithDeadline(send, {
    from: FROM, to: CONTACT_EMAIL, replyTo: parsed.data.email, ...notificationEmail(parsed.data),
  }, `contact/notification/${requestId}`, timeoutMs);
  if (notification !== 'sent') {
    return json({ ok: false, notification, confirmation: 'skipped', error: 'No se pudo confirmar el envío' }, 502);
  }
  const confirmation = await sendWithDeadline(send, {
    from: FROM, to: parsed.data.email, replyTo: CONTACT_EMAIL, ...confirmationEmail(parsed.data),
  }, `contact/confirmation/${requestId}`, timeoutMs);
  return json({ ok: true, notification, confirmation });
}
