import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidBrackets } from '../src/brackets.js';

test('valid', () => {
  for (const s of ['', '()', '()[]{}', '{[()]}', 'a(b[c]{d})', '((()))']) assert.equal(isValidBrackets(s), true, s);
});
test('invalid', () => {
  for (const s of ['(]', '([)]', '((', ')(', '}', '{[}]', '(()']) assert.equal(isValidBrackets(s), false, s);
});
test('deep nesting is fine', () => {
  const n = 100000;
  assert.equal(isValidBrackets('('.repeat(n) + ')'.repeat(n)), true);
});
