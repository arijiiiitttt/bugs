import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCsrf } from '../src/csrf.js';

test('issued tokens verify for the same session', () => {
  const csrf = createCsrf('s3cret');
  const t = csrf.issue('sess-1');
  assert.match(t, /^[0-9a-f]{32}\.[0-9a-f]{64}$/);
  assert.equal(csrf.verify('sess-1', t), true);
});
test('tokens are unique', () => {
  const csrf = createCsrf('s3cret');
  const a = csrf.issue('s');
  const b = csrf.issue('s');
  assert.notEqual(a, b);
  assert.equal(csrf.verify('s', a), true);
  assert.equal(csrf.verify('s', b), true);
});
test('a token is bound to its session', () => {
  const csrf = createCsrf('s3cret');
  const t = csrf.issue('alice');
  assert.equal(csrf.verify('bob', t), false);
  assert.equal(csrf.verify('', t), false);
});
test('a token is bound to the secret', () => {
  const t = createCsrf('one').issue('sess');
  assert.equal(createCsrf('two').verify('sess', t), false);
});
test('altered or malformed tokens return false without throwing', () => {
  const csrf = createCsrf('s3cret');
  const t = csrf.issue('sess');
  const [nonce, mac] = t.split('.');
  const flipped = (mac[0] === 'a' ? 'b' : 'a') + mac.slice(1);
  const bad = [nonce + '.' + flipped, nonce + '.' + mac.slice(0, 20), nonce.slice(1) + '.' + mac, nonce, nonce + '.' + mac + '.x', '', '.', undefined, null, 5, {}];
  for (const b of bad) assert.equal(csrf.verify('sess', b), false, String(b));
  assert.equal(csrf.verify(undefined, t), false);
});
