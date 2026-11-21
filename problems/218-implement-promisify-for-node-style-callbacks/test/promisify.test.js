import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promisify } from '../src/promisify.js';

test('resolves with the callback value', async () => {
  const add = (a, b, cb) => setImmediate(() => cb(null, a + b));
  assert.equal(await promisify(add)(2, 3), 5);
});

test('rejects with the callback error', async () => {
  const fail = (cb) => setImmediate(() => cb(new Error('nope')));
  await assert.rejects(promisify(fail)(), /nope/);
});

test('keeps this', async () => {
  const obj = {
    n: 10,
    plus(x, cb) {
      cb(null, this.n + x);
    },
  };
  obj.plusAsync = promisify(obj.plus);
  assert.equal(await obj.plusAsync(5), 15);
});

test('rejects when the wrapped function throws synchronously', async () => {
  const bad = () => { throw new TypeError('sync'); };
  await assert.rejects(promisify(bad)(), TypeError);
});

test('returns a function', () => {
  assert.equal(typeof promisify((cb) => cb()), 'function');
});
