import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pLimit } from '../src/pLimit.js';

const tick = () => new Promise((r) => setImmediate(r));
function deferred() {
  let resolve, reject;
  const promise = new Promise((a, b) => { resolve = a; reject = b; });
  return { promise, resolve, reject };
}

test('never runs more than N at once and starts in FIFO order', async () => {
  const limit = pLimit(2);
  const ds = [deferred(), deferred(), deferred(), deferred()];
  const started = [];
  const results = ds.map((d, i) => limit(async () => { started.push(i); return d.promise; }));
  await tick();
  assert.deepEqual(started, [0, 1]);
  assert.equal(limit.activeCount, 2);
  assert.equal(limit.pendingCount, 2);

  ds[0].resolve('a');
  await tick();
  assert.deepEqual(started, [0, 1, 2]);

  ds[2].resolve('c');
  ds[1].resolve('b');
  await tick();
  assert.deepEqual(started, [0, 1, 2, 3]);

  ds[3].resolve('d');
  assert.deepEqual(await Promise.all(results), ['a', 'b', 'c', 'd']);
  await tick();
  assert.equal(limit.activeCount, 0);
  assert.equal(limit.pendingCount, 0);
});

test('passes the extra arguments to fn', async () => {
  const limit = pLimit(1);
  assert.equal(await limit((a, b) => a * b, 6, 7), 42);
});

test('a rejection frees the slot and only rejects its own call', async () => {
  const limit = pLimit(1);
  const bad = limit(async () => { throw new Error('boom'); });
  const good = limit(async () => 'fine');
  await assert.rejects(bad, /boom/);
  assert.equal(await good, 'fine');
});

test('a synchronous throw rejects the promise', async () => {
  const limit = pLimit(1);
  await assert.rejects(limit(() => { throw new RangeError('sync'); }), RangeError);
  assert.equal(await limit(() => 1), 1);
});

test('rejects invalid concurrency values', () => {
  for (const bad of [0, -1, 1.5, '2', undefined]) assert.throws(() => pLimit(bad), TypeError);
});
