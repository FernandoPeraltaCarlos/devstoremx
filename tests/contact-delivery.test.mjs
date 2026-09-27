import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Resend } from 'resend';
import { handleContactRequest } from '../src/lib/contact-delivery.ts';
import { contactNotices, isContactResponse } from '../src/lib/contact-status.ts';

const valid = { name: 'Ana', email: 'ana@example.com', message: 'Hola' };
const id = 'ba959738-4f1e-468a-b9e7-a6e5b6298ef0';
const success = { data: { id: 'email-1' }, error: null };
const rejected = { data: null, error: { name: 'validation_error', statusCode: 422, message: 'Rejected' } };
function request(body = valid) {
  return new Request('https://devstoremx.com/api/contact', {
    method: 'POST', headers: { 'Idempotency-Key': id },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
function sender(results) {
  const calls = [];
  return {
    calls,
    getSend: () => async (payload, options) => {
      calls.push({ payload, options });
      const result = results.shift();
      if (result instanceof Error) throw result;
      return result;
    },
  };
}

test('contact endpoint rejects malformed input and silently accepts the honeypot without creating a sender', async () => {
  const getSend = () => { throw new Error('Sender must not be created'); };
  for (const [body, status] of [['{', 400], [{}, 422], [{ company: 'bot' }, 200]]) {
    const response = await handleContactRequest(request(body), getSend);
    assert.equal(response.status, status);
    assert.equal(isContactResponse(await response.json()), true);
  }
});

test('successful contact sends both emails in order with distinct keys and two success alerts', async () => {
  const mock = sender([success, success]);
  const response = await handleContactRequest(request(), mock.getSend);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(body, { ok: true, notification: 'sent', confirmation: 'sent' });
  assert.equal(mock.calls[0].payload.to, 'hola@devstoremx.xyz');
  assert.equal(mock.calls[0].payload.replyTo, valid.email);
  assert.equal(mock.calls[1].payload.to, valid.email);
  assert.equal(mock.calls[1].payload.replyTo, 'hola@devstoremx.xyz');
  assert.notEqual(mock.calls[0].options.idempotencyKey, mock.calls[1].options.idempotencyKey);
  assert.deepEqual(contactNotices(body).map((item) => item.tone), ['success', 'success']);
});

test('confirmation rejection preserves notification success and shows a separate warning', async (t) => {
  t.mock.method(console, 'error', () => {});
  const mock = sender([success, rejected]);
  const response = await handleContactRequest(request(), mock.getSend);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(body, { ok: true, notification: 'sent', confirmation: 'failed' });
  const notices = contactNotices(body);
  assert.deepEqual(notices.map((item) => item.tone), ['success', 'warning']);
  assert.match(notices[1].text, /no necesitas enviarlo otra vez/);
});

test('a stalled confirmation is aborted without losing the accepted notification', async () => {
  let confirmationSignal;
  let calls = 0;
  const send = async (_payload, options) => {
    if (++calls === 1) return success;
    confirmationSignal = options.signal;
    return new Promise(() => {});
  };
  const response = await handleContactRequest(request(), () => send, 5);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(body, { ok: true, notification: 'sent', confirmation: 'unknown' });
  assert.equal(confirmationSignal.aborted, true);
  assert.deepEqual(contactNotices(body).map((item) => item.tone), ['success', 'warning']);
});

test('notification rejection skips confirmation and shows failure independently', async (t) => {
  t.mock.method(console, 'error', () => {});
  const mock = sender([rejected]);
  const response = await handleContactRequest(request(), mock.getSend);
  const body = await response.json();
  assert.equal(response.status, 502);
  assert.equal(mock.calls.length, 1);
  assert.deepEqual(body.notification, 'failed');
  assert.deepEqual(body.confirmation, 'skipped');
  assert.deepEqual(contactNotices(body).map((item) => item.tone), ['danger', 'warning']);
});

test('network failure and notification timeout remain unconfirmed instead of claiming failure', async (t) => {
  t.mock.method(console, 'error', () => {});
  for (const send of [async () => { throw new Error('Connection lost'); }, async () => new Promise(() => {})]) {
    const response = await handleContactRequest(request(), () => send, 5);
    const body = await response.json();
    assert.equal(response.status, 502);
    assert.equal(body.notification, 'unknown');
    assert.equal(body.confirmation, 'skipped');
    assert.equal(contactNotices(body)[0].tone, 'warning');
  }
});

test('retries reuse both Resend keys so accepted emails are not sent twice', async () => {
  const sent = new Map();
  let deliveries = 0;
  const send = async (payload, options) => {
    if (sent.has(options.idempotencyKey)) {
      assert.deepEqual(payload, sent.get(options.idempotencyKey));
      return success;
    }
    sent.set(options.idempotencyKey, payload);
    deliveries++;
    return success;
  };
  await handleContactRequest(request(), () => send);
  await handleContactRequest(request(), () => send);
  assert.equal(deliveries, 2);
});

test('installed Resend SDK forwards the cancellation signal and idempotency header to fetch', async (t) => {
  t.mock.method(console, 'error', () => {});
  let signal;
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    signal = options.signal;
    assert.equal(new Headers(options.headers).get('Idempotency-Key'), `contact/notification/${id}`);
    return new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('Aborted')), { once: true });
    });
  });
  const resend = new Resend('test-key');
  const response = await handleContactRequest(request(), () => resend.emails.send.bind(resend.emails), 5);
  assert.equal(signal.aborted, true);
  assert.equal((await response.json()).notification, 'unknown');
});

test('frontend rejects incomplete or contradictory email statuses', () => {
  for (const value of [null, { ok: true }, { ok: true, notification: 'failed', confirmation: 'sent' }, { ok: false, notification: 'unknown', confirmation: 'sent' }]) {
    assert.equal(isContactResponse(value), false);
  }
  const lostResponse = { ok: false, notification: 'unknown', confirmation: 'unknown' };
  assert.equal(isContactResponse(lostResponse), true);
  assert.deepEqual(contactNotices(lostResponse).map((item) => item.tone), ['warning', 'warning']);
  assert.doesNotMatch(contactNotices(lostResponse)[1].text, /sí se envió/);
});
