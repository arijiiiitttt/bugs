import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupBy } from '../src/groupBy.js';

test('groups by function', () => {
  assert.deepEqual(groupBy([1.2, 1.9, 2.5], Math.floor), { 1: [1.2, 1.9], 2: [2.5] });
});
test('groups by property name', () => {
  const users = [{ n: 'a', r: 'admin' }, { n: 'b', r: 'user' }, { n: 'c', r: 'admin' }];
  const g = groupBy(users, 'r');
  assert.deepEqual(g.admin.map((u) => u.n), ['a', 'c']);
  assert.deepEqual(g.user.map((u) => u.n), ['b']);
});
test('function receives the index', () => {
  assert.deepEqual(groupBy(['a', 'b', 'c', 'd'], (_, i) => (i % 2 ? 'odd' : 'even')), { even: ['a', 'c'], odd: ['b', 'd'] });
});
test('empty input and no mutation', () => {
  assert.deepEqual(groupBy([], 'x'), {});
  const a = [3, 1, 2];
  groupBy(a, (x) => x % 2);
  assert.deepEqual(a, [3, 1, 2]);
});
