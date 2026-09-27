import type { APIRoute } from 'astro';
import { RESEND_API_KEY } from 'astro:env/server';
import { Resend } from 'resend';
import { handleContactRequest } from '../../lib/contact-delivery';

export const prerender = false;

export const POST: APIRoute = ({ request }) => handleContactRequest(request, () => {
  const resend = new Resend(RESEND_API_KEY);
  return resend.emails.send.bind(resend.emails);
});
