import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSelect } from '../src/sql.js';

const schema = { users: ['id', 'name', 'email', 'age'], posts: ['id', 'title'] };

test('plain select all', () => {
  assert.deepEqual(buildSelect({ table: 'users' }, schema), { text: 'SELECT * FROM users', values: [] });
  assert.deepEqual(buildSelect({ table: 'users', columns: ['*'] }, schema), { text: 'SELECT * FROM users', values: [] });
});
test('columns and where with scalars', () => {
  const q = buildSelect({ table: 'users', columns: ['id', 'name'], where: { email: 'a@b.c', age: 30 } }, schema);
  assert.deepEqual(q, { text: 'SELECT id, name FROM users WHERE email = $1 AND age = $2', values: ['a@b.c', 30] });
});
test('arrays and null', () => {
  const q = buildSelect({ table: 'users', where: { id: [1, 2, 3], age: null, name: 'x' } }, schema);
  assert.deepEqual(q, { text: 'SELECT * FROM users WHERE id = ANY($1) AND age IS NULL AND name = $2', values: [[1, 2, 3], 'x'] });
});
test('order by and limit', () => {
  const q = buildSelect({ table: 'users', columns: ['id', 'name'], where: { email: 'e' }, orderBy: { column: 'name', dir: 'desc' }, limit: 10 }, schema);
  assert.equal(q.text, 'SELECT id, name FROM users WHERE email = $1 ORDER BY name DESC LIMIT $2');
  assert.deepEqual(q.values, ['e', 10]);
  assert.equal(buildSelect({ table: 'posts', orderBy: { column: 'id' } }, schema).text, 'SELECT * FROM posts ORDER BY id ASC');
});
test('injection attempts in values stay out of the text', () => {
  const evil = "x'; DROP TABLE users; --";
  const q = buildSelect({ table: 'users', where: { name: evil } }, schema);
  assert.ok(!q.text.includes('DROP'));
  assert.deepEqual(q.values, [evil]);
});
test('identifiers are whitelisted', () => {
  assert.throws(() => buildSelect({ table: 'users; DROP TABLE x' }, schema));
  assert.throws(() => buildSelect({ table: 'secrets' }, schema));
  assert.throws(() => buildSelect({ table: 'toString' }, schema));
  assert.throws(() => buildSelect({ table: 'users', columns: ['id', 'password'] }, schema));
  assert.throws(() => buildSelect({ table: 'users', where: { 'id = 1 OR 1': 1 } }, schema));
  assert.throws(() => buildSelect({ table: 'users', orderBy: { column: 'id; --' } }, schema));
});
test('direction and limit validation', () => {
  assert.throws(() => buildSelect({ table: 'users', orderBy: { column: 'id', dir: 'sideways' } }, schema));
  for (const limit of [0, -1, 1.5, '5', NaN]) assert.throws(() => buildSelect({ table: 'users', limit }, schema), String(limit));
});
