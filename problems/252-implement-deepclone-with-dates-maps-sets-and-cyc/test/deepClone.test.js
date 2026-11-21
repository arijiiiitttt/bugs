import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deepClone } from '../src/deepClone.js';

test('primitives and functions are returned as is', () => {
  const f = () => 1;
  assert.equal(deepClone(5), 5);
  assert.equal(deepClone(null), null);
  assert.equal(deepClone(f), f);
});
test('nested objects and arrays are independent', () => {
  const src = { a: [1, { b: 2 }], c: { d: 3 } };
  const c = deepClone(src);
  assert.deepEqual(c, src);
  assert.notEqual(c.a, src.a);
  assert.notEqual(c.a[1], src.a[1]);
  c.a[1].b = 99;
  assert.equal(src.a[1].b, 2);
});
test('Date and RegExp', () => {
  const d = new Date(1700000000000);
  const c = deepClone({ d, r: /ab+/gi });
  assert.ok(c.d instanceof Date);
  assert.notEqual(c.d, d);
  assert.equal(c.d.getTime(), d.getTime());
  assert.ok(c.r instanceof RegExp);
  assert.equal(c.r.source, 'ab+');
  assert.equal(c.r.flags, 'gi');
});
test('Map and Set are cloned deeply', () => {
  const inner = { x: 1 };
  const src = { m: new Map([['k', inner]]), s: new Set([inner]) };
  const c = deepClone(src);
  assert.ok(c.m instanceof Map && c.s instanceof Set);
  assert.notEqual(c.m.get('k'), inner);
  assert.deepEqual(c.m.get('k'), { x: 1 });
  assert.notEqual([...c.s][0], inner);
});
test('cycles are preserved', () => {
  const a = { name: 'a' };
  a.self = a;
  a.list = [a];
  const c = deepClone(a);
  assert.notEqual(c, a);
  assert.equal(c.self, c);
  assert.equal(c.list[0], c);
});
test('shared references stay shared', () => {
  const shared = { v: 1 };
  const c = deepClone({ p: shared, q: shared });
  assert.equal(c.p, c.q);
  assert.notEqual(c.p, shared);
});
