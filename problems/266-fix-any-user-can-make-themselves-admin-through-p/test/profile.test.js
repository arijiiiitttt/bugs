import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateProfile } from '../src/profile.js';

const base = () => ({ id: 7, name: 'Ann', email: 'ann@x.io', bio: '', role: 'user' });

test('allowed fields are updated', () => {
  const u = updateProfile(base(), { name: 'Anna', bio: 'hi', email: '  ANNA@X.IO ' });
  assert.deepEqual(u, { id: 7, name: 'Anna', email: 'anna@x.io', bio: 'hi', role: 'user' });
});
test('privileged and unknown fields are ignored', () => {
  const u = updateProfile(base(), { role: 'admin', id: 1, isAdmin: true, name: 'Zed' });
  assert.equal(u.role, 'user');
  assert.equal(u.id, 7);
  assert.equal(u.isAdmin, undefined);
  assert.equal(u.name, 'Zed');
});
test('__proto__ payloads do not leak in', () => {
  const body = JSON.parse('{"__proto__": {"isAdmin": true}, "name": "Eve"}');
  const u = updateProfile(base(), body);
  assert.equal(u.isAdmin, undefined);
  assert.equal(Object.getPrototypeOf(u), Object.prototype);
  assert.equal(u.name, 'Eve');
});
test('input user is not mutated, result is a new object', () => {
  const user = base();
  const u = updateProfile(user, { name: 'Changed' });
  assert.notEqual(u, user);
  assert.equal(user.name, 'Ann');
});
test('validation', () => {
  assert.throws(() => updateProfile(base(), { name: 42 }), TypeError);
  assert.throws(() => updateProfile(base(), { bio: {} }), TypeError);
  assert.throws(() => updateProfile(base(), { email: 'nope' }), TypeError);
  assert.throws(() => updateProfile(base(), { email: null }), TypeError);
});
test('empty body changes nothing', () => {
  assert.deepEqual(updateProfile(base(), {}), base());
  assert.deepEqual(updateProfile(base(), undefined), base());
});
