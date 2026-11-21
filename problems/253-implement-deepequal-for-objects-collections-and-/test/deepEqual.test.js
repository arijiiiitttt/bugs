import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deepEqual } from '../src/deepEqual.js';

test('primitives', () => {
  assert.equal(deepEqual(1, 1), true);
  assert.equal(deepEqual(1, '1'), false);
  assert.equal(deepEqual(NaN, NaN), true);
  assert.equal(deepEqual(null, undefined), false);
  assert.equal(deepEqual(null, {}), false);
});
test('objects ignore key order but not missing keys', () => {
  assert.equal(deepEqual({ a: 1, b: { c: [1, 2] } }, { b: { c: [1, 2] }, a: 1 }), true);
  assert.equal(deepEqual({ a: 1 }, { a: 1, b: 2 }), false);
  assert.equal(deepEqual({ a: undefined }, { b: undefined }), false);
  assert.equal(deepEqual({ a: undefined }, {}), false);
});
test('arrays versus objects, and lengths', () => {
  assert.equal(deepEqual([1, 2], [1, 2, 3]), false);
  assert.equal(deepEqual([], {}), false);
  assert.equal(deepEqual([1, [2, [3]]], [1, [2, [3]]]), true);
});
test('dates', () => {
  assert.equal(deepEqual(new Date(5), new Date(5)), true);
  assert.equal(deepEqual(new Date(5), new Date(6)), false);
});
test('maps and sets', () => {
  assert.equal(deepEqual(new Map([['a', { x: 1 }]]), new Map([['a', { x: 1 }]])), true);
  assert.equal(deepEqual(new Map([['a', { x: 1 }]]), new Map([['a', { x: 2 }]])), false);
  assert.equal(deepEqual(new Map([['a', 1]]), new Map([['b', 1]])), false);
  assert.equal(deepEqual(new Set([1, 2]), new Set([2, 1])), true);
  assert.equal(deepEqual(new Set([1, 2]), new Set([1, 3])), false);
  assert.equal(deepEqual(new Set(), new Map()), false);
});
test('cyclic structures', () => {
  const a = { n: 1 }; a.self = a;
  const b = { n: 1 }; b.self = b;
  assert.equal(deepEqual(a, b), true);
  const c = { n: 2 }; c.self = c;
  assert.equal(deepEqual(a, c), false);
});
test('different prototypes are different', () => {
  class A { constructor() { this.x = 1; } }
  assert.equal(deepEqual(new A(), { x: 1 }), false);
});
