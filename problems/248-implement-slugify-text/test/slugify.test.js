import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../src/slugify.js';

test('basic', () => {
  assert.equal(slugify('Hello, World!'), 'hello-world');
  assert.equal(slugify('Node.js 22 Release Notes'), 'node-js-22-release-notes');
});
test('accents are stripped', () => {
  assert.equal(slugify('Crème Brûlée'), 'creme-brulee');
  assert.equal(slugify('Ünïcödé Ñandú'), 'unicode-nandu');
});
test('runs collapse and edges are trimmed', () => {
  assert.equal(slugify('  --Already -- slugged__  '), 'already-slugged');
  assert.equal(slugify('a   b\t\nc'), 'a-b-c');
});
test('empty results', () => {
  assert.equal(slugify(''), '');
  assert.equal(slugify('  '), '');
  assert.equal(slugify('!!!'), '');
});
test('non-strings throw TypeError', () => {
  assert.throws(() => slugify(42), TypeError);
  assert.throws(() => slugify(undefined), TypeError);
});
