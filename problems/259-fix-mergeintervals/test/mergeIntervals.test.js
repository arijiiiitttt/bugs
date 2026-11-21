import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeIntervals } from '../src/mergeIntervals.js';

test('basic merge', () => {
  assert.deepEqual(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
});
test('unsorted input', () => {
  assert.deepEqual(mergeIntervals([[8, 10], [1, 3], [2, 6]]), [[1, 6], [8, 10]]);
});
test('contained interval keeps the larger end', () => {
  assert.deepEqual(mergeIntervals([[1, 4], [2, 3]]), [[1, 4]]);
});
test('touching intervals merge', () => {
  assert.deepEqual(mergeIntervals([[1, 2], [2, 3]]), [[1, 3]]);
});
test('empty and single', () => {
  assert.deepEqual(mergeIntervals([]), []);
  assert.deepEqual(mergeIntervals([[5, 5]]), [[5, 5]]);
});
test('does not mutate input', () => {
  const input = [[8, 10], [1, 3], [2, 6]];
  mergeIntervals(input);
  assert.deepEqual(input, [[8, 10], [1, 3], [2, 6]]);
});
test('output does not alias input arrays', () => {
  const input = [[1, 2], [5, 6]];
  const out = mergeIntervals(input);
  out[0][1] = 99;
  assert.deepEqual(input, [[1, 2], [5, 6]]);
});
test('large input', () => {
  const input = Array.from({ length: 100000 }, (_, i) => [(99999 - i) * 3, (99999 - i) * 3 + 2]);
  assert.equal(mergeIntervals(input).length, 100000);
});
