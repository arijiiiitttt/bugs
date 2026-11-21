import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeEqual } from '../src/safeEqual.js';

test('equal strings and buffers', () => {
  assert.equal(safeEqual('secret', 'secret'), true);
  assert.equal(safeEqual(Buffer.from('abc'), Buffer.from('abc')), true);
  assert.equal(safeEqual('abc', Buffer.from('abc')), true);
  assert.equal(safeEqual('', ''), true);
});
test('different values', () => {
  assert.equal(safeEqual('secret', 'secreT'), false);
  assert.equal(safeEqual(Buffer.from([1, 2, 3]), Buffer.from([1, 2, 4])), false);
});
test('different lengths never throw', () => {
  assert.equal(safeEqual('abc', 'abcd'), false);
  assert.equal(safeEqual('', 'a'), false);
  assert.equal(safeEqual(Buffer.alloc(3), Buffer.alloc(64)), false);
});
test('unicode is compared as utf-8 bytes', () => {
  assert.equal(safeEqual('héllo', 'héllo'), true);
  assert.equal(safeEqual('héllo', 'hello'), false);
});
test('non string/buffer inputs are false', () => {
  for (const v of [1, null, undefined, {}, [], true]) {
    assert.equal(safeEqual(v, v), false);
    assert.equal(safeEqual('1', v), false);
  }
});
