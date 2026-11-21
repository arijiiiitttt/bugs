import { test } from 'node:test';
import assert from 'node:assert/strict';
import { memoizeAsync } from '../src/memoizeAsync.js';

const tick = () => new Promise((r) => setImmediate(r));

test('shares one in-flight call between concurrent callers', async () => {
  let calls = 0;
  const f = memoizeAsync(async (x) => { calls++; await tick(); return x * 2; });
  const [a, b, c] = await Promise.all([f(2), f(2), f(2)]);
  assert.deepEqual([a, b, c], [4, 4, 4]);
  assert.equal(calls, 1);
});

test('caches successful results', async () => {
  let calls = 0;
  const f = memoizeAsync(async (x) => { calls++; return x + 1; });
  await f(1); await f(1); await f(2);
  assert.equal(calls, 2);
});

test('does not cache rejections', async () => {
  let calls = 0;
  const f = memoizeAsync(async () => { calls++; if (calls === 1) throw new Error('first fails'); return 'ok'; });
  await assert.rejects(f('k'), /first fails/);
  assert.equal(await f('k'), 'ok');
  assert.equal(calls, 2);
  assert.equal(await f('k'), 'ok');
  assert.equal(calls, 2);
});

test('supports a custom keyFn', async () => {
  let calls = 0;
  const f = memoizeAsync(async (a, b) => { calls++; return a + b; }, { keyFn: (a, b) => a + ':' + b });
  assert.equal(await f(1, 2), 3);
  assert.equal(await f(1, 3), 4);
  assert.equal(await f(1, 2), 3);
  assert.equal(calls, 2);
});

test('clear() empties the cache', async () => {
  let calls = 0;
  const f = memoizeAsync(async () => ++calls);
  await f('a');
  f.clear();
  await f('a');
  assert.equal(calls, 2);
});

test('turns synchronous throws into rejections', async () => {
  const f = memoizeAsync(() => { throw new Error('sync'); });
  await assert.rejects(f(1), /sync/);
});
