import { test } from 'node:test';
import assert from 'node:assert/strict';
import { topKFrequent } from '../src/topK.js';

test('basic', () => {
  assert.deepEqual(topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2]);
});
test('ties prefer smaller value', () => {
  assert.deepEqual(topKFrequent([5, 3, 5, 3, 9, 9, 1], 2), [3, 5]);
  assert.deepEqual(topKFrequent([4, 2, 3], 2), [2, 3]);
});
test('numeric not lexicographic ordering', () => {
  assert.deepEqual(topKFrequent([10, 9, 10, 9], 2), [9, 10]);
});
test('edge cases', () => {
  assert.deepEqual(topKFrequent([1, 2], 5), [1, 2]);
  assert.deepEqual(topKFrequent([1, 2], 0), []);
  assert.deepEqual(topKFrequent([], 3), []);
  assert.deepEqual(topKFrequent([-1, -1, -2], 1), [-1]);
});
test('performance', () => {
  const nums = Array.from({ length: 100000 }, (_, i) => (i * 7919) % 5000);
  const r = topKFrequent(nums, 3);
  assert.equal(r.length, 3);
});
