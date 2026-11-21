import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toCamel, toSnake, toKebab } from '../src/caseConvert.js';

test('toCamel', () => {
  assert.equal(toCamel('user_id'), 'userId');
  assert.equal(toCamel('some-long name'), 'someLongName');
  assert.equal(toCamel('XMLHttpRequest'), 'xmlHttpRequest');
  assert.equal(toCamel('HTTPServer'), 'httpServer');
  assert.equal(toCamel('already'), 'already');
});
test('toSnake', () => {
  assert.equal(toSnake('userId'), 'user_id');
  assert.equal(toSnake('Some Title Here'), 'some_title_here');
  assert.equal(toSnake('HTTPServer'), 'http_server');
  assert.equal(toSnake('get2Items'), 'get2_items');
});
test('toKebab', () => {
  assert.equal(toKebab('backgroundColor'), 'background-color');
  assert.equal(toKebab('__a__b--c.d'), 'a-b-c-d');
});
test('empty and symbol-only inputs', () => {
  for (const f of [toCamel, toSnake, toKebab]) {
    assert.equal(f(''), '');
    assert.equal(f('---'), '');
  }
});
