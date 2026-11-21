import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { createApp } from '../src/app.js';

async function start() { return startServer(createApp()); }

test('GET /users/me returns the profile marker', async () => {
  const server = await start();
  try {
    const res = await call(server.base, 'GET', '/users/me');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { me: true });
  } finally { await server.close(); }
});

test('GET /users/:id still works', async () => {
  const server = await start();
  try {
    const res = await call(server.base, 'GET', '/users/42');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { id: 42 });
  } finally { await server.close(); }
});

test('GET /users/abc is an invalid id', async () => {
  const server = await start();
  try {
    const res = await call(server.base, 'GET', '/users/abc');
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { message: 'Invalid id' });
  } finally { await server.close(); }
});

test('GET /users/:id/posts works', async () => {
  const server = await start();
  try {
    const res = await call(server.base, 'GET', '/users/7/posts');
    assert.deepEqual(res.body, { userId: 7, posts: [] });
  } finally { await server.close(); }
});
