import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keepValid } from '../src/validate.js';

const isEven = async (n) => {
  await new Promise((r) => setImmediate(r));
  return n % 2 === 0;
};

test('removes the items rejected by the async predicate', async () => {
  assert.deepEqual(await keepValid([1, 2, 3, 4, 5, 6], isEven), [2, 4, 6]);
});

test('keeps the input order', async () => {
  assert.deepEqual(await keepValid([8, 3, 6, 1, 4], isEven), [8, 6, 4]);
});

test('returns [] when nothing is valid and for empty input', async () => {
  assert.deepEqual(await keepValid([1, 3], isEven), []);
  assert.deepEqual(await keepValid([], isEven), []);
});

test('propagates predicate errors', async () => {
  await assert.rejects(keepValid([1], async () => { throw new Error('bad'); }), /bad/);
});
