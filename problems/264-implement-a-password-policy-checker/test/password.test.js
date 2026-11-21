import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validatePassword } from '../src/password.js';

test('strong password passes', () => {
  assert.deepEqual(validatePassword('Tr1cky-Horse-Battery'), []);
});
test('length and classes', () => {
  assert.deepEqual(validatePassword('Ab1!'), ['too_short']);
  assert.deepEqual(validatePassword('ABCDEFGH1JKL!'), ['no_lower']);
  assert.deepEqual(validatePassword('abcdefgh1jkl!'), ['no_upper']);
  assert.deepEqual(validatePassword('Abcdefgh-jkl!'), ['no_digit']);
  assert.deepEqual(validatePassword('Abcdefgh1jklm'), ['no_symbol']);
});
test('a space counts as a symbol', () => {
  assert.deepEqual(validatePassword('Abcdefgh 1jkl'), []);
});
test('username check is case-insensitive and ignores short names', () => {
  assert.deepEqual(validatePassword('Xx-ALICE-9-yz-Qw', { username: 'alice' }), ['contains_username']);
  assert.deepEqual(validatePassword('Xx-al-9-yz-Qwerty!', { username: 'al' }), ['common']);
  assert.deepEqual(validatePassword('Xx-ALICE-9-yz-Qw', {}), []);
});
test('repeated characters and common words', () => {
  assert.deepEqual(validatePassword('Abc-1-zzz-Defgh'), ['repeated']);
  assert.deepEqual(validatePassword('Abc-1-zz-Defgh-zz'), []);
  assert.deepEqual(validatePassword('My-PassWord-9x!'), ['common']);
  assert.deepEqual(validatePassword('Zq-123456-Wvut'), ['common']);
});
test('multiple violations keep the documented order', () => {
  assert.deepEqual(validatePassword('aaa', { username: 'aaa' }), ['too_short', 'no_upper', 'no_digit', 'no_symbol', 'contains_username', 'repeated']);
});
test('non-string', () => {
  assert.deepEqual(validatePassword(undefined), ['invalid']);
  assert.deepEqual(validatePassword(123456789012), ['invalid']);
});
