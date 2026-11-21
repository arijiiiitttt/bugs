import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pick, omit } from '../src/pickOmit.js';

test('pick copies listed keys only', () => {
  assert.deepEqual(pick({ a: 1, b: 2, c: 3 }, ['a', 'c']), { a: 1, c: 3 });
});
test('pick skips missing keys but keeps undefined values', () => {
  const r = pick({ a: undefined, b: 2 }, ['a', 'zzz']);
  assert.deepEqual(Object.keys(r), ['a']);
});
test('pick ignores inherited keys', () => {
  const o = Object.create({ inherited: 1 });
  o.own = 2;
  assert.deepEqual(pick(o, ['inherited', 'own']), { own: 2 });
});
test('omit removes listed keys', () => {
  assert.deepEqual(omit({ a: 1, b: 2, c: 3 }, ['b', 'nope']), { a: 1, c: 3 });
  assert.deepEqual(omit({ a: 1 }, []), { a: 1 });
});
test('inputs are not mutated, results are new objects', () => {
  const src = { a: 1, b: 2 };
  const p = pick(src, ['a', 'b']);
  const o = omit(src, []);
  assert.notEqual(p, src);
  assert.notEqual(o, src);
  assert.deepEqual(src, { a: 1, b: 2 });
});
