import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { requestId } from '../src/requestId.js';

async function start() {
  const app = express();
  app.use(requestId);
  app.get('/', (req, res) => res.json({ id: req.id }));
  return startServer(app);
}

test('reuses a valid incoming id', async () => {
  const server = await start();
  try {
    const res = await call(server.base, 'GET', '/', { headers: { 'x-request-id': 'abc-123_X.y' } });
    assert.equal(res.headers.get('x-request-id'), 'abc-123_X.y');
    assert.equal(res.body.id, 'abc-123_X.y');
  } finally { await server.close(); }
});

test('generates a unique id when none is sent', async () => {
  const server = await start();
  try {
    const a = await call(server.base, 'GET', '/');
    const b = await call(server.base, 'GET', '/');
    assert.ok(a.headers.get('x-request-id'));
    assert.equal(a.headers.get('x-request-id'), a.body.id);
    assert.notEqual(a.body.id, b.body.id);
  } finally { await server.close(); }
});

test('replaces invalid ids (spaces, too long, bad characters)', async () => {
  const server = await start();
  try {
    for (const bad of ['has space', 'x'.repeat(65), 'semi;colon', 'ünï']) {
      const res = await call(server.base, 'GET', '/', { headers: { 'x-request-id': bad } });
      assert.notEqual(res.body.id, bad, bad);
      assert.match(res.body.id, /^[A-Za-z0-9._-]{1,64}$/);
    }
  } finally { await server.close(); }
});

test('accepts exactly 64 characters', async () => {
  const server = await start();
  try {
    const id = 'a'.repeat(64);
    const res = await call(server.base, 'GET', '/', { headers: { 'x-request-id': id } });
    assert.equal(res.body.id, id);
  } finally { await server.close(); }
});
