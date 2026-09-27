import assert from 'node:assert/strict';
import { test } from 'node:test';
import { escapeHtml, notificationEmail, parseContact } from '../src/lib/contact.ts';
import { confirmationEmail } from '../src/lib/confirmation-email.ts';

const valid = { name: 'Ana López', email: 'ana@empresa.com', phone: '55 0000 0000', message: 'Hola, quiero un sitio.' };

test('parseContact accepts a trimmed valid payload', () => {
  const result = parseContact({ ...valid, name: '  Ana López  ', phone: '  55 0000 0000  ' });
  assert.deepEqual(result, { ok: true, data: valid });
});

test('parseContact accepts a missing phone', () => {
  const { phone: _phone, ...withoutPhone } = valid;
  assert.deepEqual(parseContact(withoutPhone), { ok: true, data: { ...valid, phone: '' } });
});

test('parseContact rejects missing or blank required fields', () => {
  assert.deepEqual(parseContact({}), { ok: false });
  assert.deepEqual(parseContact({ email: valid.email, message: valid.message }), { ok: false });
  assert.deepEqual(parseContact({ ...valid, name: '   ' }), { ok: false });
  assert.deepEqual(parseContact(null), { ok: false });
  assert.deepEqual(parseContact({ ...valid, message: 12 }), { ok: false });
});

test('parseContact rejects an invalid email', () => {
  for (const email of ['ana', 'ana@empresa', 'ana@empresa.', 'ana empresa.com', 'ana@empresa .com']) {
    assert.deepEqual(parseContact({ ...valid, email }), { ok: false });
  }
});

test('parseContact enforces the form length limits', () => {
  assert.equal(parseContact({ ...valid, name: 'a'.repeat(200) }).ok, true);
  assert.deepEqual(parseContact({ ...valid, name: 'a'.repeat(201) }), { ok: false });
  assert.equal(parseContact({ ...valid, email: `${'a'.repeat(188)}@empresa.com` }).ok, true);
  assert.deepEqual(parseContact({ ...valid, email: `${'a'.repeat(189)}@empresa.com` }), { ok: false });
  assert.equal(parseContact({ ...valid, phone: '1'.repeat(30) }).ok, true);
  assert.deepEqual(parseContact({ ...valid, phone: '1'.repeat(31) }), { ok: false });
  assert.equal(parseContact({ ...valid, message: 'm'.repeat(5000) }).ok, true);
  assert.deepEqual(parseContact({ ...valid, message: 'm'.repeat(5001) }), { ok: false });
});

test('parseContact treats a filled honeypot as a silent rejection', () => {
  assert.deepEqual(parseContact({ ...valid, company: 'Acme' }), { ok: false, honeypot: true });
  assert.deepEqual(parseContact({ company: '  bot  ' }), { ok: false, honeypot: true });
  assert.deepEqual(parseContact({ ...valid, company: '   ' }), { ok: true, data: valid });
});

test('escapeHtml neutralises markup', () => {
  assert.equal(escapeHtml('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  assert.equal(escapeHtml(`Tom & Jerry's`), 'Tom &amp; Jerry&#39;s');
});

test('email builders escape the message and keep their subjects', () => {
  const data = { ...valid, message: '<script>alert(1)</script>' };
  const notification = notificationEmail(data);
  const confirmation = confirmationEmail(data);
  assert.equal(notification.subject, 'Nuevo mensaje de Ana López');
  assert.equal(confirmation.subject, 'Recibimos tu mensaje · devstoremx');
  assert.equal(notification.html.includes('<script>'), false);
  assert.equal(confirmation.html.includes('<script>'), false);
  assert.match(notification.html, /&lt;script&gt;/);
  assert.match(confirmation.text, /<script>alert\(1\)<\/script>/);
});
