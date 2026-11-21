import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBatcher } from '../src/batcher.js';

const tick = () => new Promise((r) => setImmediate(r));

test('batches calls of the same turn into one batchFn call', async () => {
  const calls = [];
  const load = createBatcher(async (keys) => { calls.push(keys); return keys.map((k) => k * 10); });
  const res = await Promise.all([load(1), load(2), load(3)]);
  assert.deepEqual(res, [10, 20, 30]);
  assert.deepEqual(calls, [[1, 2, 3]]);
});

test('de-duplicates keys', async () => {
  const calls = [];
  const load = createBatcher(async (keys) => { calls.push(keys); return keys.map((k) => 'v' + k); });
  const res = await Promise.all([load('a'), load('b'), load('a')]);
  assert.deepEqual(res, ['va', 'vb', 'va']);
  assert.deepEqual(calls, [['a', 'b']]);
});

test('calls of a later turn form a new batch', async () => {
  const calls = [];
  const load = createBatcher(async (keys) => { calls.push(keys); return keys; });
  const a = load(1);
  await tick();
  const b = load(2);
  assert.deepEqual([await a, await b], [1, 2]);
  assert.deepEqual(calls, [[1], [2]]);
});

test('Error values reject only their own key', async () => {
  const load = createBatcher(async (keys) => keys.map((k) => (k === 2 ? new Error('bad ' + k) : k)));
  const res = await Promise.allSettled([load(1), load(2), load(3)]);
  assert.equal(res[0].value, 1);
  assert.equal(res[1].status, 'rejected');
  assert.equal(res[1].reason.message, 'bad 2');
  assert.equal(res[2].value, 3);
});

test('a failing batchFn rejects every promise of the batch', async () => {
  const load = createBatcher(async () => { throw new Error('db down'); });
  const res = await Promise.allSettled([load(1), load(2)]);
  assert.deepEqual(res.map((r) => r.status), ['rejected', 'rejected']);
  assert.equal(res[0].reason.message, 'db down');
});

test('a result array of the wrong length rejects the batch', async () => {
  const load = createBatcher(async () => [1]);
  const res = await Promise.allSettled([load('a'), load('b')]);
  assert.deepEqual(res.map((r) => r.reason?.message), ['batchFn must return an array of the same length', 'batchFn must return an array of the same length']);
});

test('maxBatchSize splits big batches', async () => {
  const calls = [];
  const load = createBatcher(async (keys) => { calls.push(keys); return keys.map((k) => k + 1); }, { maxBatchSize: 2 });
  const res = await Promise.all([1, 2, 3, 4, 5].map(load));
  assert.deepEqual(res, [2, 3, 4, 5, 6]);
  assert.deepEqual(calls, [[1, 2], [3, 4], [5]]);
});
