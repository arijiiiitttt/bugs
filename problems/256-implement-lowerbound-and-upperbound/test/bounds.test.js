import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lowerBound, upperBound } from '../src/bounds.js';

const a = [1, 2, 2, 2, 5, 8, 8];
test('lowerBound', () => {
  assert.equal(lowerBound(a, 2), 1);
  assert.equal(lowerBound(a, 3), 4);
  assert.equal(lowerBound(a, 0), 0);
  assert.equal(lowerBound(a, 9), 7);
  assert.equal(lowerBound(a, 8), 5);
});
test('upperBound', () => {
  assert.equal(upperBound(a, 2), 4);
  assert.equal(upperBound(a, 3), 4);
  assert.equal(upperBound(a, 0), 0);
  assert.equal(upperBound(a, 8), 7);
});
test('empty array', () => {
  assert.equal(lowerBound([], 1), 0);
  assert.equal(upperBound([], 1), 0);
});
test('count of a value', () => {
  assert.equal(upperBound(a, 2) - lowerBound(a, 2), 3);
});
test('huge array uses log steps', () => {
  let reads = 0;
  const arr = new Proxy({ length: 1e9 }, { get: (t, k) => { if (k === 'length') return t.length; reads++; return Number(k); } });
  assert.equal(lowerBound(arr, 123456789), 123456789);
  assert.ok(reads < 100, 'too many reads: ' + reads);
});
