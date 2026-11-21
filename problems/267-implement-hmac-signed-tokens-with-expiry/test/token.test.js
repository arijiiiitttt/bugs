import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signToken, verifyToken } from '../src/token.js';

const SECRET = 'top-secret';
const t0 = 1_700_000_000_000;
const clock = (ms) => () => ms;
const code = (c) => (e) => e.code === c;
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');

test('round trip adds iat and exp', () => {
  const token = signToken({ sub: 'u1', role: 'admin' }, SECRET, { ttlSeconds: 60, now: clock(t0) });
  assert.equal(token.split('.').length, 2);
  const claims = verifyToken(token, SECRET, { now: clock(t0 + 1000) });
  assert.deepEqual(claims, { sub: 'u1', role: 'admin', iat: 1_700_000_000, exp: 1_700_000_060 });
});
test('does not mutate the payload', () => {
  const p = { sub: 'u1' };
  signToken(p, SECRET, { ttlSeconds: 5, now: clock(t0) });
  assert.deepEqual(p, { sub: 'u1' });
});
test('expires exactly at exp', () => {
  const token = signToken({ sub: 'u1' }, SECRET, { ttlSeconds: 60, now: clock(t0) });
  assert.doesNotThrow(() => verifyToken(token, SECRET, { now: clock(t0 + 59_999) }));
  assert.throws(() => verifyToken(token, SECRET, { now: clock(t0 + 60_000) }), code('EXPIRED'));
});
test('wrong secret is rejected', () => {
  const token = signToken({ sub: 'u1' }, SECRET, { ttlSeconds: 60, now: clock(t0) });
  assert.throws(() => verifyToken(token, 'other', { now: clock(t0) }), code('BAD_SIGNATURE'));
});
test('tampered payload keeps the old signature and fails', () => {
  const token = signToken({ sub: 'u1', role: 'user' }, SECRET, { ttlSeconds: 60, now: clock(t0) });
  const sig = token.split('.')[1];
  const forged = b64({ sub: 'u1', role: 'admin', iat: 1_700_000_000, exp: 9_999_999_999 }) + '.' + sig;
  assert.throws(() => verifyToken(forged, SECRET, { now: clock(t0) }), code('BAD_SIGNATURE'));
});
test('tampered or truncated signature fails', () => {
  const token = signToken({ sub: 'u1' }, SECRET, { ttlSeconds: 60, now: clock(t0) });
  const [body, sig] = token.split('.');
  const flipped = sig[0] === 'A' ? 'B' + sig.slice(1) : 'A' + sig.slice(1);
  assert.throws(() => verifyToken(body + '.' + flipped, SECRET, { now: clock(t0) }), code('BAD_SIGNATURE'));
  assert.throws(() => verifyToken(body + '.' + sig.slice(0, 10), SECRET, { now: clock(t0) }), code('BAD_SIGNATURE'));
  assert.throws(() => verifyToken(body + '.', SECRET, { now: clock(t0) }), code('BAD_SIGNATURE'));
});
test('malformed tokens', () => {
  for (const bad of [undefined, null, 42, '', 'abc', 'a.b.c', {}]) {
    assert.throws(() => verifyToken(bad, SECRET, { now: clock(t0) }), code('MALFORMED'), String(bad));
  }
});
