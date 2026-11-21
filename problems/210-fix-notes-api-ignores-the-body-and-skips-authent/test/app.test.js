import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { createApp } from '../src/app.js';

const AUTH = { authorization: 'Bearer secret-token' };

test('health is public', async () => {
  const server = await startServer(createApp());
  try {
    const res = await call(server.base, 'GET', '/health');
    assert.equal(res.status, 200);
    assert.equal(res.text, 'ok');
  } finally { await server.close(); }
});

test('the API requires the bearer token', async () => {
  const server = await startServer(createApp());
  try {
    for (const headers of [{}, { authorization: 'Bearer wrong' }]) {
      const res = await call(server.base, 'GET', '/api/notes', { headers });
      assert.equal(res.status, 401);
      assert.deepEqual(res.body, { message: 'Unauthorized' });
    }
    const post = await call(server.base, 'POST', '/api/notes', { body: { text: 'x' } });
    assert.equal(post.status, 401);
  } finally { await server.close(); }
});

test('authorized clients can create and list notes', async () => {
  const server = await startServer(createApp());
  try {
    const created = await call(server.base, 'POST', '/api/notes', { headers: AUTH, body: { text: 'hi' } });
    assert.equal(created.status, 201);
    assert.deepEqual(created.body, { id: 1, text: 'hi', by: 'ann' });
    const list = await call(server.base, 'GET', '/api/notes', { headers: AUTH });
    assert.deepEqual(list.body, [{ id: 1, text: 'hi', by: 'ann' }]);
  } finally { await server.close(); }
});

test('validation still works and unauthorized posts store nothing', async () => {
  const server = await startServer(createApp());
  try {
    await call(server.base, 'POST', '/api/notes', { body: { text: 'sneaky' } });
    const bad = await call(server.base, 'POST', '/api/notes', { headers: AUTH, body: {} });
    assert.equal(bad.status, 400);
    assert.deepEqual(bad.body, { message: 'text is required' });
    const list = await call(server.base, 'GET', '/api/notes', { headers: AUTH });
    assert.deepEqual(list.body, []);
  } finally { await server.close(); }
});
