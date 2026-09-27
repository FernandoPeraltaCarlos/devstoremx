export const CONTACT_EMAIL = 'hola@devstoremx.xyz';
export const FROM = 'devstoremx <hola@devstoremx.xyz>';

const LIMITS = { name: 200, email: 200, phone: 30, message: 5000 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type EmailContent = { subject: string; html: string; text: string };

export type ParseResult =
  | { ok: true; data: ContactData }
  | { ok: false; honeypot?: true };

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

function htmlText(value: string): string {
  return escapeHtml(value).replaceAll('\n', '<br>');
}

/** Missing optional values become ''; a wrong type or an empty required value is invalid. */
function readString(value: unknown, required: boolean): string | undefined {
  if (value == null || value === '') return required ? undefined : '';
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (required && trimmed === '') return undefined;
  return trimmed;
}

export function parseContact(input: unknown): ParseResult {
  if (input == null || typeof input !== 'object' || Array.isArray(input)) return { ok: false };
  const body = input as Record<string, unknown>;
  if (typeof body.company === 'string' && body.company.trim() !== '') return { ok: false, honeypot: true };

  const name = readString(body.name, true);
  const email = readString(body.email, true);
  const phone = readString(body.phone, false);
  const message = readString(body.message, true);
  if (name == null || email == null || phone == null || message == null) return { ok: false };
  if (
    name.length > LIMITS.name
    || email.length > LIMITS.email
    || phone.length > LIMITS.phone
    || message.length > LIMITS.message
  ) return { ok: false };
  if (!EMAIL.test(email)) return { ok: false };
  return { ok: true, data: { name, email, phone, message } };
}

export function notificationEmail(data: ContactData): EmailContent {
  const subject = `Nuevo mensaje de ${data.name.replace(/[\r\n]+/g, ' ')}`;
  const rows: Array<[string, string]> = [
    ['Nombre', data.name],
    ['Correo', data.email],
    ['Teléfono', data.phone],
    ['Mensaje', data.message],
  ];
  const html = `<table>${rows.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${htmlText(value)}</td></tr>`).join('')}</table>`;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  return { subject, html, text };
}

export function confirmationEmail(data: ContactData): EmailContent {
  const subject = 'Recibimos tu mensaje · devstoremx';
  const intro = `Hola ${data.name}, recibimos tu mensaje. Te escribimos en menos de 24 horas hábiles.`;
  const html = `<p>${htmlText(intro)}</p><p>${htmlText(data.message)}</p>`;
  const text = `${intro}\n\n${data.message}`;
  return { subject, html, text };
}
