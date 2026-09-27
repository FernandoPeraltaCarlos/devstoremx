# Contact form with Resend

## Context
The form (`src/components/interactive/ContactForm.tsx`) already sends a JSON `POST` to `site.formEndpoint`, but that value is empty and the site is 100% static, so today it only shows the "Formulario aún no disponible" notice. We need a server endpoint that uses Resend to:
1. Send the form content **from and to** `hola@devstoremx.xyz` (with `replyTo` = the user's email, so you can reply directly).
2. Send the user a confirmation email with `hola@devstoremx.xyz` as the sender.

The design system alert (`devstoremx-design-system.html:442-450`, `.ds-alert-*`) is already replicated in `ContactForm.tsx` (`alertTones`, glyph + title + text, `role="status"`). It is reused as is; only the success/error copy is adjusted.

Hosting: **Vercel**. API key: `RESEND_API_KEY`.

## Changes

### 1. Dependencies and config
- `pnpm add resend @astrojs/vercel`
- `astro.config.mjs`: `adapter: vercel()` and an `env` schema using `envField` from `astro/config`:
  - `RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' })`
  - `output` stays at its default (static); only the endpoint uses `prerender = false`, everything else stays prerendered.

### 2. `src/lib/contact.ts` (new, pure and testable logic)
- `CONTACT_EMAIL = 'hola@devstoremx.xyz'`, `FROM = 'devstoremx <hola@devstoremx.xyz>'`.
- `parseContact(input: unknown)` → `{ ok: true, data } | { ok: false }`: trim values; `name`, `email` and `message` are required; simple email regex; same length limits as the form (200 / 30 / 5000); honeypot field `company` (if it has a value → treat as a silent success without sending).
- `escapeHtml()` and two builders: `notificationEmail(data)` (subject `Nuevo mensaje de {name}`, table with name/email/phone/message) and `confirmationEmail(data)` (subject `Recibimos tu mensaje · devstoremx`, short text + a copy of the message). Each returns `{ subject, html, text }`.

### 3. `src/pages/api/contact.ts` (new)
- `export const prerender = false;` + `POST: APIRoute`.
- Reads JSON (400 if invalid), runs `parseContact` (422 if it fails), honeypot → 200.
- `new Resend(RESEND_API_KEY)` from `astro:env/server`.
- Sends the notification first (`from: FROM, to: CONTACT_EMAIL, replyTo: data.email`); if Resend returns an `error` → 502.
- Then sends the confirmation (`from: FROM, to: data.email, replyTo: CONTACT_EMAIL`); its status is returned separately. A confirmation failure or timeout preserves HTTP 200 and notification success.
- Bound each email request to 8 seconds and abort its fetch on timeout. Return `notification` and `confirmation` as `sent`, `failed`, `unknown`, or `skipped`. Network failures remain unconfirmed rather than claiming the email was not sent.
- Accept an optional UUID `Idempotency-Key` header and use distinct Resend keys for each email. The form retains the same UUID when retrying an unchanged payload; Resend deduplicates within its 24-hour window. Requests without the header receive a new UUID.
- JSON response `{ ok, notification, confirmation, error? }`. Honeypot returns simulated success for both emails without sending.

### 4. Frontend
- `src/data/landing.ts`: `formEndpoint: '/api/contact'`, `email: 'hola@devstoremx.xyz'` (so the footer/structured data publish it via `publicValue`).
- `ContactForm.tsx`:
  - Add a hidden honeypot field (`name="company"`, `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden`, `sr-only`/off-screen class).
  - Show two independent alerts: notification to devstoremx and confirmation to the visitor. Each reflects its own status.
  - Notification success: "Mensaje enviado a devstoremx — Te escribimos en menos de 24 horas hábiles." Confirmation success: "Confirmación enviada a tu correo".
  - A failed/unconfirmed confirmation shows a warning while notification remains successful. Lost responses show both sends as unconfirmed and keep the form values.
  - Client timeout is 25 seconds, above the combined server email deadlines (16 seconds). Reset fields only after notification success.

### 5. Tests and docs
- `tests/contact-delivery.test.mjs` for partial success, deadlines, SDK cancellation, idempotency, validation, and independent alert states; import it in `tests/run.mjs`.
- `tests/contact.test.mjs` for `parseContact` and `escapeHtml` (valid input, missing fields, invalid email, lengths, honeypot, escaping `<script>`); import it in `tests/run.mjs`.
- Update `CONTEXT.md` (endpoint, Vercel adapter, `RESEND_API_KEY`) and create `.env.example` with `RESEND_API_KEY=`.

## Verification
- `pnpm test`, `pnpm check`, `pnpm build` (confirm `/api/contact` is emitted as a function and everything else is prerendered).
- With a local `.env` containing `RESEND_API_KEY`: `astro dev --background` and
  `curl -X POST localhost:4321/api/contact -H 'Content-Type: application/json' -d '{"name":"Prueba","email":"<your email>","message":"Hola"}'` → 200, the email arrives at `hola@devstoremx.xyz` and the confirmation at the test address. Also an invalid case → 422.
- Visual review of the alert in the browser is done by you (per `CONTEXT.md`).
- Reminder: in Vercel, set `RESEND_API_KEY` in the project's environment variables; the `devstoremx.xyz` domain must be verified in Resend.
