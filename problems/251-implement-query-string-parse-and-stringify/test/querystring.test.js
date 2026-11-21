import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse, stringify } from '../src/querystring.js';

test('parse basics and leading question mark', () => {
  assert.deepEqual(parse('?a=1&b=2'), { a: '1', b: '2' });
  assert.deepEqual(parse(''), {});
});
test('parse decodes percent escapes and plus', () => {
  assert.deepEqual(parse('q=hello+world%21&na%20me=caf%C3%A9'), { q: 'hello world!', 'na me': 'café' });
});
test('parse keys without value, empty segments, extra equals', () => {
  assert.deepEqual(parse('flag&&a=b=c&e='), { flag: '', a: 'b=c', e: '' });
});
test('parse repeated keys become arrays', () => {
  assert.deepEqual(parse('t=a&t=b&t=c&x=1'), { t: ['a', 'b', 'c'], x: '1' });
});
test('stringify encodes and repeats array keys', () => {
  assert.equal(stringify({ q: 'a b&c', t: ['x', 'y'] }), 'q=a%20b%26c&t=x&t=y');
  assert.equal(stringify({ ['k y']: 'é' }), 'k%20y=%C3%A9');
});
test('stringify skips null and undefined, converts primitives', () => {
  assert.equal(stringify({ a: undefined, b: null, c: 0, d: false, e: [1, null, 2] }), 'c=0&d=false&e=1&e=2');
  assert.equal(stringify({}), '');
});
test('round trip', () => {
  const s = 'a=1&b=x%20y&b=z';
  assert.equal(stringify(parse(s)), s);
});
