import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { envelope } from '../src/envelope.js';

async function start() {
  const app = express();
  app.use(envelope);
  app.get('/ok', (req, res) => res.ok({ id: 1 }));
  app.get('/ok-meta', (req, res) => res.ok([1, 2], { total: 2 }));
  app.get('/null', (req, res) => res.ok(null));
  app.post('/new', (req, res) => res.created({ id: 9 }));
  app.get('/bad', (req, res) => res.fail(400, 'Bad input'));
  app.get('/bad-details', (req, res) => res.fail(422, 'Invalid', [{ field: 'x' }]));
  return startServer(app);
}

test('res.ok wraps data (and optional meta)', async () => {
  const server = await start();
  try {
    let res = await call(server.base, 'GET', '/ok');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { success: true, data: { id: 1 } });
    res = await call(server.base, 'GET', '/ok-meta');
    assert.deepEqual(res.body, { success: true, data: [1, 2], meta: { total: 2 } });
    res = await call(server.base, 'GET', '/null');
    assert.deepEqual(res.body, { success: true, data: null });
  } finally { await server.close(); }
});

test('res.created answers 201', async () => {
  const server = await start();
  try {
    const res = await call(server.base, 'POST', '/new', { body: {} });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body, { success: true, data: { id: 9 } });
  } finally { await server.close(); }
});

test('res.fail uses the given status, with optional details', async () => {
  const server = await start();
  try {
    let res = await call(server.base, 'GET', '/bad');
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { success: false, error: { message: 'Bad input' } });
    res = await call(server.base, 'GET', '/bad-details');
    assert.equal(res.status, 422);
    assert.deepEqual(res.body, { success: false, error: { message: 'Invalid', details: [{ field: 'x' }] } });
  } finally { await server.close(); }
});
