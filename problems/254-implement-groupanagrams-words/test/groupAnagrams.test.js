import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupAnagrams } from '../src/groupAnagrams.js';

test('groups in first-seen order', () => {
  assert.deepEqual(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']), [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]);
});
test('empty strings and duplicates', () => {
  assert.deepEqual(groupAnagrams(['', 'a', '', 'a']), [['', ''], ['a', 'a']]);
});
test('case sensitive', () => {
  assert.deepEqual(groupAnagrams(['Ab', 'ba']), [['Ab'], ['ba']]);
});
test('empty input', () => assert.deepEqual(groupAnagrams([]), []));
test('does not mutate input', () => {
  const w = ['b', 'a'];
  groupAnagrams(w);
  assert.deepEqual(w, ['b', 'a']);
});
