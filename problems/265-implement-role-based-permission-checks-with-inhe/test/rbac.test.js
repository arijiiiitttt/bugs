import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRbac } from '../src/rbac.js';

const config = {
  roles: {
    viewer: { can: ['posts:read', 'comments:read'] },
    editor: { inherits: ['viewer'], can: ['posts:write'] },
    moderator: { can: ['comments:*'] },
    admin: { inherits: ['editor', 'moderator'], can: ['users:manage'] },
    root: { can: ['*'] },
  },
};

test('direct and inherited permissions', () => {
  const rbac = createRbac(config);
  assert.equal(rbac.can(['viewer'], 'posts:read'), true);
  assert.equal(rbac.can(['viewer'], 'posts:write'), false);
  assert.equal(rbac.can(['editor'], 'posts:read'), true);
  assert.equal(rbac.can(['editor'], 'posts:write'), true);
  assert.equal(rbac.can(['editor'], 'users:manage'), false);
});
test('transitive inheritance across several roles', () => {
  const rbac = createRbac(config);
  assert.equal(rbac.can(['admin'], 'posts:read'), true);
  assert.equal(rbac.can(['admin'], 'comments:delete'), true);
  assert.equal(rbac.can(['admin'], 'users:manage'), true);
  assert.equal(rbac.can(['admin'], 'billing:read'), false);
});
test('wildcards', () => {
  const rbac = createRbac(config);
  assert.equal(rbac.can(['root'], 'anything:at:all'), true);
  assert.equal(rbac.can(['moderator'], 'comments:read'), true);
  assert.equal(rbac.can(['moderator'], 'commentsx:read'), false);
  assert.equal(rbac.can(['moderator'], 'posts:read'), false);
});
test('multiple roles, a single string and missing roles', () => {
  const rbac = createRbac(config);
  assert.equal(rbac.can(['viewer', 'moderator'], 'comments:ban'), true);
  assert.equal(rbac.can('editor', 'posts:write'), true);
  assert.equal(rbac.can(undefined, 'posts:read'), false);
  assert.equal(rbac.can([], 'posts:read'), false);
});
test('unknown roles grant nothing, even prototype names', () => {
  const rbac = createRbac(config);
  assert.equal(rbac.can(['ghost', 'constructor', '__proto__', 'toString'], 'posts:read'), false);
});
test('inheritance cycles terminate', () => {
  const rbac = createRbac({ roles: { a: { inherits: ['b'], can: ['x:1'] }, b: { inherits: ['a'], can: ['y:1'] } } });
  assert.equal(rbac.can(['a'], 'y:1'), true);
  assert.equal(rbac.can(['a'], 'z:1'), false);
});
