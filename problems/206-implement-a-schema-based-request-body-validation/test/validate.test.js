import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { validate } from '../src/validate.js';

const schema = {
  name: { type: 'string', required: true, minLength: 2, maxLength: 5 },
  age: { type: 'number', min: 0, max: 120 },
  role: { type: 'string', enum: ['admin', 'user'] },
  active: { type: 'boolean' },
};

async function start() {
  const app = express();
  app.use(express.json());
  app.post('/', validate(schema), (req, res) => res.status(201).json({ ok: true }));
  return startServer(app);
}
const post = (server, body) => call(server.base, 'POST', '/', { body });

test('valid bodies pass, optional fields may be missing or null', async () => {
  const server = await start();
  try {
    assert.equal((await post(server, { name: 'Ann' })).status, 201);
    assert.equal((await post(server, { name: 'Ann', age: null, role: null })).status, 201);
    assert.equal((await post(server, { name: 'Ann', age: 0, role: 'admin', active: false })).status, 201);
  } finally { await server.close(); }
});

test('missing required field and wrong types', async () => {
  const server = await start();
  try {
    let res = await post(server, {});
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { message: 'Validation failed', errors: [{ field: 'name', message: 'is required' }] });
    res = await post(server, { name: 42, age: '5', active: 'yes' });
    assert.deepEqual(res.body.errors, [
      { field: 'name', message: 'must be a string' },
      { field: 'age', message: 'must be a number' },
      { field: 'active', message: 'must be a boolean' },
    ]);
  } finally { await server.close(); }
});

test('length, range and enum messages', async () => {
  const server = await start();
  try {
    let res = await post(server, { name: 'A' });
    assert.deepEqual(res.body.errors, [{ field: 'name', message: 'must have at least 2 characters' }]);
    res = await post(server, { name: 'Abcdef', age: 121, role: 'root' });
    assert.deepEqual(res.body.errors, [
      { field: 'name', message: 'must have at most 5 characters' },
      { field: 'age', message: 'must be <= 120' },
      { field: 'role', message: 'must be one of: admin, user' },
    ]);
    res = await post(server, { name: 'Ann', age: -1 });
    assert.deepEqual(res.body.errors, [{ field: 'age', message: 'must be >= 0' }]);
  } finally { await server.close(); }
});

test('only the first failing check of a field is reported', async () => {
  const server = await start();
  try {
    const res = await post(server, { name: 7, role: 5 });
    assert.deepEqual(res.body.errors, [
      { field: 'name', message: 'must be a string' },
      { field: 'role', message: 'must be a string' },
    ]);
  } finally { await server.close(); }
});

test('a missing body is treated as an empty object', async () => {
  const server = await start();
  try {
    const res = await call(server.base, 'POST', '/');
    assert.equal(res.status, 400);
    assert.equal(res.body.errors[0].field, 'name');
  } finally { await server.close(); }
});

test('falsy but present values (0, false, empty string) are values, not missing', async () => {
  const server = await start();
  try {
    const res = await post(server, { name: '', age: 0, active: false });
    assert.deepEqual(res.body.errors, [{ field: 'name', message: 'must have at least 2 characters' }]);
  } finally { await server.close(); }
});
