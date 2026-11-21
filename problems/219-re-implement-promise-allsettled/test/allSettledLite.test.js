import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { allSettledLite } from '../src/allSettledLite.js';

const original = Promise.allSettled;
beforeEach(() => {
  Promise.allSettled = () => {
    throw new Error('Promise.allSettled is not allowed');
  };
});
afterEach(() => {
  Promise.allSettled = original;
});

test('mixes fulfilled and rejected results in input order', async () => {
  const err = new Error('x');
  const slow = new Promise((r) => setTimeout(r, 10, 'slow'));
  const res = await allSettledLite([slow, Promise.reject(err), 42, Promise.resolve('ok')]);
  assert.deepEqual(res, [
    { status: 'fulfilled', value: 'slow' },
    { status: 'rejected', reason: err },
    { status: 'fulfilled', value: 42 },
    { status: 'fulfilled', value: 'ok' },
  ]);
});

test('never rejects', async () => {
  const res = await allSettledLite([Promise.reject(1), Promise.reject(2)]);
  assert.deepEqual(res.map((r) => r.status), ['rejected', 'rejected']);
});

test('accepts any iterable and empty input', async () => {
  assert.deepEqual(await allSettledLite([]), []);
  assert.deepEqual(await allSettledLite(new Set([1])), [{ status: 'fulfilled', value: 1 }]);
});
