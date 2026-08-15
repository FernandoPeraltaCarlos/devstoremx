import { waitUntil } from "@vercel/functions";
import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { z } from "astro/zod";
import { Resend } from "resend";

export const prerender = false;

const MAX_BODY_BYTES = 32 * 1024;
const CONTACT_INBOX = "hola@devstoremx.xyz";
const FROM_ADDRESS = "DevStoreMX <hola@devstoremx.xyz>";
const HONEYPOT_FIELD = "website";

const emailSchema = z
  .string()
  .trim()
  .pipe(
    z
      .email()
      .max(254)
      .refine((value) => !/[\r\n,<>]/.test(value)),
  );

const contactPayloadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(50),
  email: emailSchema,
  preferredContact: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(5000),
  source: z.string().trim().min(1).max(200),
  locale: z.enum(["es", "en"]),
  submissionId: z.uuid().optional(),
  [HONEYPOT_FIELD]: z.string().max(500).optional().default(""),
});

type ContactPayload = z.infer<typeof contactPayloadSchema>;
type Locale = ContactPayload["locale"];

class BodyTooLargeError extends Error {}
class UnsupportedMediaTypeError extends Error {}

const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...responseHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const htmlResponse = (locale: Locale, success: boolean, status = 200) => {
  const copy =
    locale === "es"
      ? {
          title: success ? "Mensaje enviado" : "No pudimos enviar tu mensaje",
          description: success
            ? "Recibimos tu mensaje. Te responderemos lo antes posible."
            : "Inténtalo de nuevo o escríbenos directamente.",
          back: "Volver al sitio",
        }
      : {
          title: success ? "Message sent" : "We couldn't send your message",
          description: success
            ? "We received your message. We'll get back to you as soon as possible."
            : "Please try again or email us directly.",
          back: "Return to the site",
        };
  const homeUrl = locale === "en" ? "/en/#contact" : "/#contact";
  const emailLink = success
    ? ""
    : `<p><a style="color:#93a9ff" href="mailto:${CONTACT_INBOX}">${CONTACT_INBOX}</a></p>`;

  return new Response(
    `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${copy.title} | DevStoreMX</title></head><body style="margin:0;background:#111827;color:#fff;font-family:Arial,sans-serif"><main style="max-width:640px;margin:10vh auto;padding:32px"><p style="color:#93a9ff;font-weight:700">DevStoreMX</p><h1>${copy.title}</h1><p style="line-height:1.6;color:#d1d5db">${copy.description}</p>${emailLink}<p><a style="display:inline-block;margin-top:16px;padding:12px 18px;border-radius:8px;background:#5271ff;color:#fff;text-decoration:none" href="${homeUrl}">${copy.back}</a></p></main></body></html>`,
    {
      status,
      headers: {
        ...responseHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
};

const prefersHtml = (request: Request) =>
  !request.headers.get("content-type")?.includes("application/json") &&
  request.headers.get("accept")?.includes("text/html");

const successResponse = (request: Request, locale: Locale) =>
  prefersHtml(request) ? htmlResponse(locale, true) : json({ ok: true });

const errorResponse = (
  request: Request,
  status = 500,
  locale: Locale = "es",
) =>
  prefersHtml(request)
    ? htmlResponse(locale, false, status)
    : json({ ok: false, error: "Unable to send message." }, status);

const normalizeOrigin = (raw: string) => {
  try {
    const value = raw.startsWith("http") ? raw : `https://${raw}`;
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const getAllowedOrigins = () => {
  const origins = new Set([
    "https://devstoremx.xyz",
    "https://www.devstoremx.xyz",
  ]);

  for (const raw of [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    if (!raw) continue;
    const origin = normalizeOrigin(raw);
    if (origin) origins.add(origin);
  }
  return origins;
};

const isLocalDevOrigin = (origin: string) => {
  if (!import.meta.env.DEV) return false;

  try {
    const url = new URL(origin);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
};

const isAllowedOrigin = (origin: string | null) => {
  if (!origin) return false;
  const normalized = normalizeOrigin(origin);
  if (!normalized) return false;
  return getAllowedOrigins().has(normalized) || isLocalDevOrigin(normalized);
};

const readBodyWithLimit = async (request: Request) => {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) throw new BodyTooLargeError();
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalLength += value.byteLength;
    if (totalLength > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
};

const parsePayload = async (request: Request) => {
  const contentType = request.headers.get("content-type") || "";
  const text = new TextDecoder().decode(await readBodyWithLimit(request));

  if (contentType.includes("application/json")) return JSON.parse(text);
  if (contentType.includes("application/x-www-form-urlencoded"))
    return Object.fromEntries(new URLSearchParams(text));
  throw new UnsupportedMediaTypeError();
};

const localeFrom = (value: unknown): Locale =>
  typeof value === "object" && value !== null && "locale" in value
    ? value.locale === "en"
      ? "en"
      : "es"
    : "es";

const hasHoneypotValue = (value: unknown) => {
  if (typeof value !== "object" || value === null) return false;
  const honeypot = Reflect.get(value, HONEYPOT_FIELD);
  return typeof honeypot === "string" && Boolean(honeypot.trim());
};

const fieldLabels: Record<Locale, Record<string, string>> = {
  es: {
    name: "Nombre",
    phone: "Teléfono o WhatsApp",
    email: "Correo electrónico",
    preferredContact: "Medio de contacto preferido",
    message: "Mensaje",
    source: "Cómo nos conoció",
  },
  en: {
    name: "Name",
    phone: "Phone or WhatsApp",
    email: "Email",
    preferredContact: "Preferred contact method",
    message: "Message",
    source: "How they heard about us",
  },
};

const buildInternalEmail = (payload: ContactPayload) => {
  const labels = fieldLabels[payload.locale];
  const rows: Array<[string, string]> = [
    [labels.name, payload.name],
    [labels.phone, payload.phone],
    [labels.email, payload.email],
    [labels.preferredContact, payload.preferredContact || "—"],
    [labels.source, payload.source],
    [labels.message, payload.message],
  ];

  return {
    subject:
      payload.locale === "es"
        ? "Nuevo mensaje del formulario de contacto"
        : "New contact form submission",
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: `<table style="border-collapse:collapse;width:100%;max-width:640px;font-family:Arial,sans-serif;font-size:14px;color:#111">${rows
      .map(
        ([label, value]) =>
          `<tr><th align="left" style="padding:8px;border-bottom:1px solid #eee;vertical-align:top;width:220px">${escapeHtml(label)}</th><td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
      )
      .join("")}</table>`,
  };
};

const buildAutoresponse = (payload: ContactPayload) => {
  const name = escapeHtml(payload.name);

  if (payload.locale === "es") {
    return {
      subject: "Recibimos tu mensaje | DevStoreMX",
      text: `Hola ${payload.name},\n\nRecibimos tu mensaje y te responderemos lo antes posible.\n\nSi quieres añadir información, responde a este mensaje o escribe a ${CONTACT_INBOX}.\n\nDevStoreMX`,
      html: `<p>Hola ${name},</p><p>Recibimos tu mensaje y te responderemos lo antes posible.</p><p>Si quieres añadir información, responde a este mensaje o escribe a <a href="mailto:${CONTACT_INBOX}">${CONTACT_INBOX}</a>.</p><p>DevStoreMX</p>`,
    };
  }

  return {
    subject: "We received your message | DevStoreMX",
    text: `Hi ${payload.name},\n\nWe received your message and will get back to you as soon as possible.\n\nIf you want to add more information, reply to this message or write to ${CONTACT_INBOX}.\n\nDevStoreMX`,
    html: `<p>Hi ${name},</p><p>We received your message and will get back to you as soon as possible.</p><p>If you want to add more information, reply to this message or write to <a href="mailto:${CONTACT_INBOX}">${CONTACT_INBOX}</a>.</p><p>DevStoreMX</p>`,
  };
};

const reportResendError = (
  stage: "internal" | "autoresponse",
  error: unknown,
) => {
  const name =
    typeof error === "object" && error !== null && "name" in error
      ? String(error.name)
      : "unknown";
  console.error(`[contact] Resend ${stage} failed`, { name });
};

const sendAutoresponse = async (
  resend: Resend,
  payload: ContactPayload,
  submissionId: string,
) => {
  const autoresponse = buildAutoresponse(payload);

  try {
    const { error } = await resend.emails.send(
      {
        from: FROM_ADDRESS,
        to: payload.email,
        replyTo: CONTACT_INBOX,
        subject: autoresponse.subject,
        html: autoresponse.html,
        text: autoresponse.text,
      },
      { idempotencyKey: `contact/autoresponse/${submissionId}` },
    );
    if (error) reportResendError("autoresponse", error);
  } catch (error) {
    reportResendError("autoresponse", error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAllowedOrigin(request.headers.get("origin")))
    return errorResponse(request, 403);

  let rawBody: unknown;
  try {
    rawBody = await parsePayload(request);
  } catch (error) {
    if (error instanceof BodyTooLargeError) return errorResponse(request, 413);
    if (error instanceof UnsupportedMediaTypeError)
      return errorResponse(request, 415);
    return errorResponse(request, 400);
  }

  const locale = localeFrom(rawBody);
  if (hasHoneypotValue(rawBody)) return successResponse(request, locale);

  const parsed = contactPayloadSchema.safeParse(rawBody);
  if (!parsed.success) return errorResponse(request, 400, locale);

  const payload = parsed.data;
  const apiKey = getSecret("RESEND_API_KEY");
  if (!apiKey) return errorResponse(request, 500, payload.locale);

  const submissionId = payload.submissionId || crypto.randomUUID();
  const resend = new Resend(apiKey);
  const internal = buildInternalEmail(payload);

  try {
    const { error } = await resend.emails.send(
      {
        from: FROM_ADDRESS,
        to: CONTACT_INBOX,
        replyTo: payload.email,
        subject: internal.subject,
        html: internal.html,
        text: internal.text,
      },
      { idempotencyKey: `contact/internal/${submissionId}` },
    );

    if (error) {
      reportResendError("internal", error);
      return errorResponse(request, 502, payload.locale);
    }
  } catch (error) {
    reportResendError("internal", error);
    return errorResponse(request, 502, payload.locale);
  }

  const autoresponseTask = sendAutoresponse(resend, payload, submissionId);
  if (import.meta.env.DEV) await autoresponseTask;
  else waitUntil(autoresponseTask);

  return successResponse(request, payload.locale);
};

export const ALL: APIRoute = () =>
  new Response(null, {
    status: 405,
    headers: { ...responseHeaders, Allow: "POST" },
  });
