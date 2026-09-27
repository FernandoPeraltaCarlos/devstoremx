import type { APIRoute } from 'astro';
import { RESEND_API_KEY } from 'astro:env/server';
import { Resend } from 'resend';
import { handleContactRequest } from '../../lib/contact-delivery';

export const prerender = false;

// Optional in the schema so a missing key yields a JSON 502 instead of crashing the function.
export const POST: APIRoute = ({ request }) => handleContactRequest(request, () => {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  const resend = new Resend(RESEND_API_KEY);
  return resend.emails.send.bind(resend.emails);
});
