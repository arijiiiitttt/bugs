import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { createApp, stats } from '../src/app.js';

test('unauthorized requests get 401 and never reach the handler', async () => {
  const server = await startServer(createApp());
  try {
    const res = await call(server.base, 'POST', '/orders', { headers: { 'accept-language': 'de-DE' }, body: {}, timeout: 800 });
    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { message: 'Unauthorized' });
    await sleep(30);
    assert.equal(stats.handled, 0, 'the handler must not run for unauthorized requests');
  } finally { await server.close(); }
});

test('authorized requests with Accept-Language use its first tag, lower-cased', async () => {
  const server = await startServer(createApp());
  try {
    const res = await call(server.base, 'POST', '/orders', { headers: { 'x-token': 'secret', 'accept-language': 'DE-de, en;q=0.5' }, body: {}, timeout: 800 });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body, { lang: 'de-de' });
    assert.equal(stats.handled, 1);
  } finally { await server.close(); }
});

test('authorized requests without Accept-Language default to "en" (and do not hang)', async () => {
  const server = await startServer(createApp());
  try {
    const res = await call(server.base, 'POST', '/orders', { headers: { 'x-token': 'secret', 'accept-language': '' }, body: {}, timeout: 800 });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body, { lang: 'en' });
  } finally { await server.close(); }
});

test('unauthorized requests without Accept-Language get 401 immediately', async () => {
  const server = await startServer(createApp());
  try {
    const res = await call(server.base, 'POST', '/orders', { body: {}, timeout: 800 });
    assert.equal(res.status, 401);
    assert.equal(stats.handled, 0);
  } finally { await server.close(); }
});
