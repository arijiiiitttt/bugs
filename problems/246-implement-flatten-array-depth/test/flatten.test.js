import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flatten, flattenDeep } from '../src/flatten.js';

test('default depth is one', () => {
  assert.deepEqual(flatten([1, [2, [3, [4]]]]), [1, 2, [3, [4]]]);
});
test('explicit depths', () => {
  const a = [1, [2, [3, [4]]]];
  assert.deepEqual(flatten(a, 2), [1, 2, 3, [4]]);
  assert.deepEqual(flatten(a, Infinity), [1, 2, 3, 4]);
  const z = flatten(a, 0);
  assert.deepEqual(z, a);
  assert.notEqual(z, a);
});
test('non-array containers are kept', () => {
  const o = { a: [1] };
  const s = new Set([1]);
  assert.deepEqual(flatten([[o], 'ab', [s]]), [o, 'ab', s]);
});
test('flattenDeep', () => {
  assert.deepEqual(flattenDeep([[[[1]], 2], [3, [[4, [5]]]]]), [1, 2, 3, 4, 5]);
  assert.deepEqual(flattenDeep([]), []);
});
test('input is untouched', () => {
  const a = [[1], [2]];
  flatten(a);
  assert.deepEqual(a, [[1], [2]]);
});
