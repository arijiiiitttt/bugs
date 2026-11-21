import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginate } from '../src/paginate.js';

const items = Array.from({ length: 25 }, (_, i) => i + 1);

test('defaults to page 1 and limit 10', () => {
  const r = paginate(items, {});
  assert.deepEqual(r.data, items.slice(0, 10));
  assert.deepEqual({ page: r.page, limit: r.limit, total: r.total, totalPages: r.totalPages }, { page: 1, limit: 10, total: 25, totalPages: 3 });
});

test('accepts numeric strings and returns the right slice', () => {
  const r = paginate(items, { page: '2', limit: '10' });
  assert.deepEqual(r.data, items.slice(10, 20));
  assert.equal(r.page, 2);
  assert.deepEqual(paginate(items, { page: '3', limit: '10' }).data, [21, 22, 23, 24, 25]);
});

test('a page beyond the end is empty', () => {
  const r = paginate(items, { page: '9', limit: '10' });
  assert.deepEqual(r.data, []);
  assert.equal(r.totalPages, 3);
});

test('caps the limit at 50', () => {
  const many = Array.from({ length: 120 }, (_, i) => i);
  const r = paginate(many, { limit: '1000' });
  assert.equal(r.limit, 50);
  assert.equal(r.data.length, 50);
  assert.equal(r.totalPages, 3);
});

test('rejects invalid values with a 400 error', () => {
  for (const bad of [{ page: 'abc' }, { page: '0' }, { page: '-1' }, { page: '' }, { limit: '2.5' }, { limit: '0' }, { limit: 'x' }]) {
    assert.throws(() => paginate(items, bad), (e) => e.status === 400 && e.message === 'Invalid pagination parameters', JSON.stringify(bad));
  }
});

test('empty list gives totalPages 0 and does not mutate the input', () => {
  assert.equal(paginate([], {}).totalPages, 0);
  const copy = [...items];
  paginate(items, { page: '2', limit: '5' });
  assert.deepEqual(items, copy);
});
