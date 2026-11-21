import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { etagJson } from '../src/etag.js';

async function start() {
  const state = { data: { id: 1, name: 'one' } };
  const app = express();
  app.get('/thing', (req, res) => etagJson(req, res, state.data));
  const server = await startServer(app);
  return { server, state };
}

test('first request: 200 with JSON, ETag and Cache-Control', async () => {
  const { server } = await start();
  try {
    const res = await call(server.base, 'GET', '/thing');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { id: 1, name: 'one' });
    assert.match(res.headers.get('etag'), /^W\/"[0-9a-f]{16}"$/);
    assert.equal(res.headers.get('cache-control'), 'no-cache');
    assert.match(res.headers.get('content-type'), /application\/json/);
  } finally { await server.close(); }
});

test('a matching If-None-Match gives an empty 304', async () => {
  const { server } = await start();
  try {
    const first = await call(server.base, 'GET', '/thing');
    const etag = first.headers.get('etag');
    const second = await call(server.base, 'GET', '/thing', { headers: { 'if-none-match': etag } });
    assert.equal(second.status, 304);
    assert.equal(second.text, '');
    assert.equal(second.headers.get('etag'), etag);
  } finally { await server.close(); }
});

test('same data -> same tag, changed data -> new tag and a fresh 200', async () => {
  const { server, state } = await start();
  try {
    const a = await call(server.base, 'GET', '/thing');
    const b = await call(server.base, 'GET', '/thing');
    assert.equal(a.headers.get('etag'), b.headers.get('etag'));
    state.data = { id: 1, name: 'two' };
    const c = await call(server.base, 'GET', '/thing', { headers: { 'if-none-match': a.headers.get('etag') } });
    assert.equal(c.status, 200);
    assert.notEqual(c.headers.get('etag'), a.headers.get('etag'));
    assert.deepEqual(c.body, { id: 1, name: 'two' });
  } finally { await server.close(); }
});

test('If-None-Match lists, wildcard and tags without the W/ prefix', async () => {
  const { server } = await start();
  try {
    const etag = (await call(server.base, 'GET', '/thing')).headers.get('etag');
    const strong = etag.replace(/^W\//, '');
    const inList = await call(server.base, 'GET', '/thing', { headers: { 'if-none-match': 'W/"nope", ' + etag } });
    assert.equal(inList.status, 304);
    const star = await call(server.base, 'GET', '/thing', { headers: { 'if-none-match': '*' } });
    assert.equal(star.status, 304);
    const noPrefix = await call(server.base, 'GET', '/thing', { headers: { 'if-none-match': strong } });
    assert.equal(noPrefix.status, 304);
    const other = await call(server.base, 'GET', '/thing', { headers: { 'if-none-match': 'W/"0000000000000000"' } });
    assert.equal(other.status, 200);
  } finally { await server.close(); }
});
