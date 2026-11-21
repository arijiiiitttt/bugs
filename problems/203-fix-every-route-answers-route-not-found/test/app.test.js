import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { createApp } from '../src/app.js';

test('known routes work', async () => {
  const server = await startServer(createApp());
  try {
    const root = await call(server.base, 'GET', '/');
    assert.equal(root.status, 200);
    assert.deepEqual(root.body, { name: 'api' });
    const ping = await call(server.base, 'GET', '/ping');
    assert.equal(ping.status, 200);
    assert.equal(ping.text, 'pong');
    const items = await call(server.base, 'GET', '/api/items');
    assert.deepEqual(items.body, [1, 2, 3]);
  } finally { await server.close(); }
});

test('unknown routes get the JSON 404', async () => {
  const server = await startServer(createApp());
  try {
    for (const [method, path] of [['GET', '/missing'], ['GET', '/api/nothing'], ['POST', '/ping']]) {
      const res = await call(server.base, method, path);
      assert.equal(res.status, 404, method + ' ' + path);
      assert.deepEqual(res.body, { message: 'Route not found' });
    }
  } finally { await server.close(); }
});
