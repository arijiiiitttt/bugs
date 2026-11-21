import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { Router } from 'express';
import { versionRouter } from '../src/versionRouter.js';

async function start() {
  const v1 = Router();
  v1.get('/users', (req, res) => res.json([{ name: 'Ann Lee' }]));
  v1.get('/', (req, res) => res.json({ version: 1 }));
  const v2 = Router();
  v2.get('/users', (req, res) => res.json([{ firstName: 'Ann', lastName: 'Lee' }]));
  const app = express();
  app.use('/api', versionRouter({ v1, v2 }));
  app.use((req, res) => res.status(404).json({ message: 'fallthrough' }));
  return startServer(app);
}

test('routes to the right version', async () => {
  const server = await start();
  try {
    assert.deepEqual((await call(server.base, 'GET', '/api/v1/users')).body, [{ name: 'Ann Lee' }]);
    assert.deepEqual((await call(server.base, 'GET', '/api/v2/users')).body, [{ firstName: 'Ann', lastName: 'Lee' }]);
    assert.deepEqual((await call(server.base, 'GET', '/api/v1')).body, { version: 1 });
  } finally { await server.close(); }
});

test('unknown versions answer 404 "Unsupported API version"', async () => {
  const server = await start();
  try {
    for (const v of ['v3', 'constructor', '__proto__', 'toString']) {
      const res = await call(server.base, 'GET', '/api/' + v + '/users');
      assert.equal(res.status, 404, v);
      assert.deepEqual(res.body, { message: 'Unsupported API version' }, v);
    }
  } finally { await server.close(); }
});

test('unknown paths inside a valid version fall through to the app', async () => {
  const server = await start();
  try {
    const res = await call(server.base, 'GET', '/api/v2/nothing');
    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { message: 'fallthrough' });
  } finally { await server.close(); }
});
