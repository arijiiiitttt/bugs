import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { requestLogger } from '../src/logger.js';

async function setup() {
  const lines = [];
  const app = express();
  app.use(requestLogger((l) => lines.push(l)));
  const api = express.Router();
  api.get('/x', (req, res) => res.status(201).json({ ok: true }));
  app.use('/api', api);
  app.get('/boom', (req, res) => res.status(500).send('no'));
  app.get('/slow', async (req, res) => { await sleep(60); res.send('late'); });
  const server = await startServer(app);
  return { lines, server };
}

test('logs method, original url (with mount path and query) and status', async () => {
  const { lines, server } = await setup();
  try {
    const res = await call(server.base, 'GET', '/api/x?y=1');
    assert.equal(res.status, 201);
    await sleep(30);
    assert.deepEqual(lines, ['GET /api/x?y=1 201']);
  } finally { await server.close(); }
});

test('logs 404 and 500 responses too, one line per request', async () => {
  const { lines, server } = await setup();
  try {
    await call(server.base, 'GET', '/nope');
    await call(server.base, 'GET', '/boom');
    await call(server.base, 'POST', '/api/x', { body: { a: 1 } });
    await sleep(30);
    assert.deepEqual(lines, ['GET /nope 404', 'GET /boom 500', 'POST /api/x 404']);
  } finally { await server.close(); }
});

test('does not log before the response is finished and does not block it', async () => {
  const { lines, server } = await setup();
  try {
    const pending = call(server.base, 'GET', '/slow');
    await sleep(15);
    assert.equal(lines.length, 0, 'nothing may be logged while the handler is still working');
    const res = await pending;
    assert.equal(res.text, 'late');
    await sleep(30);
    assert.deepEqual(lines, ['GET /slow 200']);
  } finally { await server.close(); }
});
