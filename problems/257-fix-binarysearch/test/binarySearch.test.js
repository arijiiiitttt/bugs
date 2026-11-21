import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binarySearch } from '../src/binarySearch.js';

test('finds every element of various sizes', () => {
  for (let n = 0; n <= 20; n++) {
    const arr = Array.from({ length: n }, (_, i) => i * 3);
    for (let i = 0; i < n; i++) assert.equal(binarySearch(arr, arr[i]), i, 'n=' + n + ' i=' + i);
  }
});
test('missing values', () => {
  assert.equal(binarySearch([], 1), -1);
  assert.equal(binarySearch([1, 3, 5], 4), -1);
  assert.equal(binarySearch([1, 3, 5], 0), -1);
  assert.equal(binarySearch([1, 3, 5], 6), -1);
});
