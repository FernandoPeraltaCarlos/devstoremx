import { useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { ArrowIcon, Button, Field } from './ui';
import { contactNotices, isContactResponse, type ContactNotice } from '../../lib/contact-status';

type Props = { endpoint?: string; whatsappUrl?: string; linkedinUrl?: string; };
type Notice = ContactNotice;

// DS Alert: glyph and title so the state never depends on colour alone.
const alertTones = {
  success: { box: 'border-success bg-success-soft', accent: 'text-success', glyph: 'bg-success', mark: '✓' },
  warning: { box: 'border-warning bg-warning-soft', accent: 'text-warning', glyph: 'bg-warning', mark: '!' },
  danger: { box: 'border-danger bg-danger-soft', accent: 'text-danger', glyph: 'bg-danger', mark: '×' },
};

export default function ContactForm({ endpoint, whatsappUrl, linkedinUrl }: Props) {
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [emailNotices, setEmailNotices] = useState<Notice[]>([]);
  const attempt = useRef<{ body: string; id: string } | null>(null);
  useEffect(() => { setReady(true); }, []);

  const submit: JSX.IntrinsicElements['form']['onSubmit'] = async (event) => {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!endpoint) {
      setNotice({ tone: 'warning', title: 'Formulario aún no disponible', text: 'Próximamente podrás enviarnos tu proyecto desde aquí.' });
      return;
    }
    setNotice(null);
    setEmailNotices([]);
    setSending(true);
    const data = new FormData(form);
    const body = JSON.stringify(Object.fromEntries(data));
    try {
      if (attempt.current?.body !== body) attempt.current = { body, id: crypto.randomUUID() };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': attempt.current.id },
        body,
        signal: AbortSignal.timeout(25000),
      });
      const result: unknown = await response.json();
      if (!isContactResponse(result)) throw new Error('Respuesta inválida');
      setEmailNotices(contactNotices(result));
      if (result.notification === 'sent') {
        form.reset();
        attempt.current = null;
      }
    } catch {
      setEmailNotices(contactNotices({ ok: false, notification: 'unknown', confirmation: 'unknown' }));
    } finally { setSending(false); }
  };

  const directIcon = (kind: 'whatsapp' | 'linkedin') => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="shrink-0" aria-hidden="true">{kind === 'whatsapp'
    ? <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.15 1.6 5.96L0 24l6.24-1.64a11.94 11.94 0 0 0 5.81 1.48h.01c6.59 0 11.94-5.36 11.94-11.95a11.87 11.87 0 0 0-3.48-8.41ZM12.05 21.82a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.48 4.46-9.94 9.95-9.94a9.87 9.87 0 0 1 7.03 2.91 9.87 9.87 0 0 1 2.9 7.03c0 5.48-4.46 9.87-10.03 9.87Zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.39-1.47-.88-.78-1.48-1.75-1.65-2.05-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51H7.8c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.48.71.31 1.27.49 1.7.62.71.22 1.36.19 1.87.12.57-.09 1.77-.73 2.02-1.44.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z" />
    : <path d="M20.45 0H3.55A3.55 3.55 0 0 0 0 3.55v16.9A3.55 3.55 0 0 0 3.55 24h16.9A3.55 3.55 0 0 0 24 20.45V3.55A3.55 3.55 0 0 0 20.45 0ZM7.12 20.45H3.56V9h3.56ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM20.45 20.45H16.9v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45Z" />}</svg>;
  const directLink = (label: string, url: string | undefined, kind: 'whatsapp' | 'linkedin') => {
    const className = `button button-${kind} px-3`;
    return url
      ? <a href={url} target="_blank" rel="noopener noreferrer" class={className}>{directIcon(kind)}{label}</a>
      : <button type="button" class={className} onClick={() => setNotice({ tone: 'warning', title: `${label} aún no disponible`, text: `El enlace de ${label} estará disponible próximamente.` })}>{directIcon(kind)}{label}</button>;
  };

  return <div class="flex flex-col gap-8">
    <form onSubmit={submit} class="flex flex-col gap-5" aria-label="Cuéntanos de tu proyecto" aria-busy={sending}>
      <input class="sr-only" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <Field id="c-nombre" name="name" label="Nombre" placeholder="Tu nombre completo" autoComplete="name" required />
      <div class="grid gap-5 sm:grid-cols-2 sm:gap-4">
        <Field id="c-correo" name="email" label="Correo electrónico" placeholder="tu@empresa.com" type="email" autoComplete="email" required />
        <Field id="c-tel" name="phone" label="Teléfono" placeholder="55 0000 0000" type="tel" autoComplete="tel" />
      </div>
      <Field id="c-msg" name="message" label="Mensaje" placeholder="¿Qué necesitas construir?" multiline required />
      <Button type="submit" disabled={!ready || sending} class="min-h-[52px] w-full">{sending ? 'Enviando…' : 'Enviar mensaje'}{!sending && <ArrowIcon />}</Button>
      <noscript><p class="text-sm text-muted">Activa JavaScript para utilizar el formulario de contacto.</p></noscript>
    </form>
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4"><span class="h-px flex-1 bg-line" /><span class="text-sm text-muted">o escríbenos directo</span><span class="h-px flex-1 bg-line" /></div>
      <div class="grid grid-cols-2 gap-4">{directLink('WhatsApp', whatsappUrl, 'whatsapp')}{directLink('LinkedIn', linkedinUrl, 'linkedin')}</div>
    </div>
    <div role="status" aria-live="polite" class="flex flex-col gap-3">{[...emailNotices, ...(notice ? [notice] : [])].map((item) => {
      const tone = alertTones[item.tone];
      return <div key={item.title} class={`hero-enter flex gap-3 rounded-md border p-4 ${tone.box}`}>
        <span aria-hidden="true" class={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${tone.glyph}`}>{tone.mark}</span>
        <div><p class={`font-semibold ${tone.accent}`}>{item.title}</p><p class="text-sm leading-5 text-ink">{item.text}</p></div>
      </div>;
    })}</div>
  </div>;
}
