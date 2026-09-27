import { CONTACT_EMAIL, escapeHtml, htmlText, type ContactData, type EmailContent } from './contact.ts';

const SITE_URL = 'https://devstoremx.com';

// Design system tokens (src/styles/global.css). Email clients need them inline.
const C = {
  paper: '#f6f8fc',
  ink: '#0a0f1c',
  night: '#05070d',
  panel: '#0d1321',
  brand: '#3b55e6',
  electric: '#5271ff',
  periwinkle: '#7b93ff',
  sky: '#51ade5',
  muted: '#4a5570',
  mutedDark: '#98a4bd',
  line: '#dbe2ee',
  lineDark: '#1f2a3d',
  cloud: '#e9eefb',
} as const;

const SANS = "'Plus Jakarta Sans', 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'IBM Plex Mono', 'SFMono-Regular', Consolas, 'Courier New', monospace";

const NEXT_STEPS: Array<[string, string]> = [
  ['Revisamos tu mensaje', 'Te respondemos en menos de 24 horas hábiles, desde este mismo correo.'],
  ['Llamada de acercamiento', 'Escuchamos tu negocio, tus objetivos y lo que necesitas resolver.'],
  ['Planeación y cotización', 'Definimos alcance, tiempos y costo por escrito, antes de escribir una línea de código.'],
];

function eyebrow(label: string, color: string, className = ''): string {
  return `<p class="${className}" style="margin:0 0 12px;font-family:${MONO};font-size:12px;line-height:16px;letter-spacing:0.1em;text-transform:uppercase;color:${color};">${label}</p>`;
}

function stepRow(index: number, [title, description]: [string, string]): string {
  const number = String(index + 1).padStart(2, '0');
  const border = index === 0 ? '' : `border-top:1px solid ${C.line};`;
  return `<tr>
  <td valign="top" width="44" class="line ${index === 0 ? 't-brand' : 't-muted'}" style="${border}padding:16px 0;font-family:${MONO};font-size:13px;line-height:22px;color:${index === 0 ? C.brand : C.muted};">${number}</td>
  <td valign="top" class="line" style="${border}padding:16px 0;font-family:${SANS};">
    <p class="t-ink" style="margin:0;font-size:16px;line-height:22px;font-weight:700;color:${C.ink};">${title}</p>
    <p class="t-muted" style="margin:4px 0 0;font-size:14px;line-height:22px;color:${C.muted};">${description}</p>
  </td>
</tr>`;
}

function summaryRow(label: string, value: string): string {
  return `<tr>
  <td valign="top" width="96" style="padding:6px 0;font-family:${MONO};font-size:12px;line-height:20px;letter-spacing:0.06em;text-transform:uppercase;color:${C.mutedDark};">${label}</td>
  <td valign="top" style="padding:6px 0;font-family:${SANS};font-size:14px;line-height:20px;color:${C.cloud};word-break:break-word;">${htmlText(value)}</td>
</tr>`;
}

/** Dark overrides for the light surfaces; `prefixes` target Outlook.com's forced dark mode. */
function darkRules(...prefixes: string[]): string {
  const rules: Array<[string, string]> = [
    ['.bg-page', `background-color:${C.night} !important;`],
    ['.bg-card', `background-color:${C.panel} !important;border-color:${C.lineDark} !important;`],
    ['.line', `border-color:${C.lineDark} !important;`],
    ['.t-ink', `color:${C.cloud} !important;`],
    ['.t-muted', `color:${C.mutedDark} !important;`],
    ['.t-brand', `color:${C.periwinkle} !important;`],
    ['.btn', `background-color:${C.periwinkle} !important;`],
    ['.btn-text', `color:${C.night} !important;`],
  ];
  return rules.map(([selector, declarations]) => `${prefixes.map((prefix) => prefix + selector).join(', ')} { ${declarations} }`).join('\n    ');
}

function confirmationHtml(data: ContactData, preheader: string): string {
  const name = htmlText(data.name);
  const summary = [
    summaryRow('Nombre', data.name),
    summaryRow('Correo', data.email),
    data.phone ? summaryRow('Teléfono', data.phone) : '',
  ].join('');

  return `<!doctype html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Recibimos tu mensaje · devstoremx</title>
<style>
  @font-face { font-family: 'Plus Jakarta Sans'; font-style: normal; font-weight: 200 800; src: url('${SITE_URL}/fonts/plus-jakarta-sans-latin.woff2') format('woff2'); }
  @font-face { font-family: 'IBM Plex Mono'; font-style: normal; font-weight: 400; src: url('${SITE_URL}/fonts/ibm-plex-mono-latin.woff2') format('woff2'); }
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  body { margin: 0; padding: 0; }
  a { color: ${C.brand}; }
  @media (max-width: 620px) {
    .px { padding-left: 24px !important; padding-right: 24px !important; }
    .h1 { font-size: 32px !important; line-height: 38px !important; }
  }
  /* Dark theme: the header and hero are already dark; only the light surfaces switch. */
  @media (prefers-color-scheme: dark) {
    ${darkRules('')}
  }
  ${darkRules('[data-ogsc] ', '[data-ogsb] ')}
</style>
</head>
<body class="bg-page" style="margin:0;padding:0;background-color:${C.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-page" style="background-color:${C.paper};">
<tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

    <!-- Header -->
    <tr><td class="px" style="background-color:${C.night};padding:28px 40px;border-bottom:1px solid ${C.lineDark};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle" style="padding-right:12px;"><a href="${SITE_URL}" style="text-decoration:none;"><img src="${SITE_URL}/devstoremx.png" width="30" height="36" alt="" style="display:block;border:0;width:30px;height:36px;"></a></td>
        <td valign="middle" style="font-family:${SANS};font-size:18px;line-height:24px;font-weight:700;letter-spacing:-0.01em;"><a href="${SITE_URL}" style="color:${C.cloud};text-decoration:none;">devstoremx</a></td>
      </tr></table>
    </td></tr>

    <!-- Hero -->
    <tr><td class="px" style="background-color:${C.night};padding:44px 40px 40px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr>
        <td style="border:1px solid ${C.lineDark};background-color:${C.panel};border-radius:4px;padding:7px 12px;">
          <span style="display:inline-block;width:8px;height:8px;background-color:${C.sky};vertical-align:middle;"></span>
          <span style="font-family:${SANS};font-size:11px;line-height:16px;font-weight:700;letter-spacing:0.1em;color:${C.mutedDark};vertical-align:middle;">&nbsp;MENSAJE RECIBIDO</span>
        </td>
      </tr></table>
      <h1 class="h1" style="margin:0;font-family:${SANS};font-size:40px;line-height:46px;font-weight:700;letter-spacing:-0.035em;color:${C.cloud};">Hola ${name},<br><span style="color:${C.electric};">ya tenemos tu mensaje.</span></h1>
      <p style="margin:20px 0 0;font-family:${SANS};font-size:16px;line-height:26px;color:${C.mutedDark};">Gracias por escribirnos. Un integrante del equipo revisará tu proyecto y te responderá en menos de <strong style="color:${C.cloud};font-weight:700;">24&nbsp;horas hábiles</strong>.</p>
    </td></tr>

    <!-- Message copy -->
    <tr><td class="px" style="background-color:${C.night};padding:0 40px 44px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.panel};border:1px solid ${C.lineDark};border-radius:6px;">
        <tr><td style="padding:24px;">
          ${eyebrow('Tu mensaje', C.periwinkle)}
          <p style="margin:0 0 20px;font-family:${SANS};font-size:15px;line-height:24px;color:${C.cloud};word-break:break-word;">${htmlText(data.message)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.lineDark};">
            <tr><td style="height:10px;line-height:10px;font-size:0;">&nbsp;</td></tr>
            ${summary}
          </table>
        </td></tr>
      </table>
    </td></tr>

    <!-- Next steps -->
    <tr><td class="px bg-card" style="background-color:#ffffff;padding:40px 40px 8px;border-left:1px solid ${C.line};border-right:1px solid ${C.line};">
      ${eyebrow('Qué sigue', C.brand, 't-brand')}
      <h2 class="t-ink" style="margin:0 0 8px;font-family:${SANS};font-size:24px;line-height:30px;font-weight:700;letter-spacing:-0.02em;color:${C.ink};">Así empieza tu proyecto</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${NEXT_STEPS.map((step, index) => stepRow(index, step)).join('')}
      </table>
    </td></tr>

    <!-- CTA -->
    <tr><td class="px bg-card" style="background-color:#ffffff;padding:16px 40px 44px;border-left:1px solid ${C.line};border-right:1px solid ${C.line};border-bottom:1px solid ${C.line};">
      <p class="t-muted" style="margin:0 0 20px;font-family:${SANS};font-size:15px;line-height:24px;color:${C.muted};">¿Olvidaste algún detalle? Responde a este correo y lo sumamos a tu solicitud.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="btn" style="background-color:${C.brand};border-radius:4px;">
          <a class="btn-text" href="mailto:${CONTACT_EMAIL}" style="display:inline-block;padding:14px 24px;font-family:${SANS};font-size:15px;line-height:20px;font-weight:700;color:#ffffff;text-decoration:none;">Escribir a devstoremx &rarr;</a>
        </td>
      </tr></table>
    </td></tr>

    <!-- Footer -->
    <tr><td class="px t-muted" style="padding:28px 40px 8px;font-family:${SANS};font-size:12px;line-height:20px;color:${C.muted};text-align:center;">
      <p style="margin:0;">Recibiste este correo porque enviaste el formulario de contacto en <a class="t-brand" href="${SITE_URL}" style="color:${C.brand};text-decoration:underline;">devstoremx.com</a>.</p>
      <p class="t-muted" style="margin:4px 0 0;font-family:${MONO};color:${C.muted};">${CONTACT_EMAIL}</p>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}

export function confirmationEmail(data: ContactData): EmailContent {
  const subject = 'Recibimos tu mensaje · devstoremx';
  const preheader = 'Te respondemos en menos de 24 horas hábiles.';
  const steps = NEXT_STEPS.map(([title, description], index) => `${String(index + 1).padStart(2, '0')}. ${title}: ${description}`);
  const text = [
    `Hola ${data.name}, ya tenemos tu mensaje.`,
    'Gracias por escribirnos. Un integrante del equipo revisará tu proyecto y te responderá en menos de 24 horas hábiles.',
    '— Tu mensaje —',
    data.message,
    '— Qué sigue —',
    ...steps,
    '¿Olvidaste algún detalle? Responde a este correo y lo sumamos a tu solicitud.',
    `devstoremx · ${SITE_URL} · ${CONTACT_EMAIL}`,
  ].join('\n\n');
  return { subject, html: confirmationHtml(data, preheader), text };
}
