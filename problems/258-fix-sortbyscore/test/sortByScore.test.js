import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sortByScore } from '../src/sortByScore.js';

const mk = (name, score) => ({ name, score });
test('orders by score desc then name asc', () => {
  const r = sortByScore([mk('bob', 5), mk('al', 9), mk('cy', 5), mk('di', 12), mk('ed', 5), mk('abe', 5)]);
  assert.deepEqual(r.map((p) => p.name), ['di', 'al', 'abe', 'bob', 'cy', 'ed']);
});
test('does not mutate the input', () => {
  const input = [mk('a', 1), mk('b', 2)];
  const r = sortByScore(input);
  assert.deepEqual(input.map((p) => p.name), ['a', 'b']);
  assert.notEqual(r, input);
});
test('handles empty and single', () => {
  assert.deepEqual(sortByScore([]), []);
  assert.deepEqual(sortByScore([mk('x', 1)]), [mk('x', 1)]);
});
test('works with many items', () => {
  const input = Array.from({ length: 500 }, (_, i) => mk('n' + String(i).padStart(3, '0'), i % 7));
  const r = sortByScore(input);
  for (let i = 1; i < r.length; i++) {
    assert.ok(r[i - 1].score > r[i].score || (r[i - 1].score === r[i].score && r[i - 1].name < r[i].name));
  }
});
