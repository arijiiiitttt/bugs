import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';

import http from 'node:http';
function rq(base, method, path, headers = {}, chunks = []) {
  return new Promise((resolve, reject) => {
    const u = new URL(base);
    const req = http.request({ hostname: u.hostname, port: u.port, method, path, headers, agent: false }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    for (const c of chunks) req.write(c);
    req.end();
  });
}
import { limitBody } from '../src/limitBody.js';

async function start(max = 20) {
  const app = express();
  app.use(limitBody(max));
  app.use(express.json());
  app.post('/echo', (req, res) => res.status(201).json(req.body));
  app.get('/', (req, res) => res.send('hi'));
  app.delete('/', (req, res) => res.send('deleted'));
  return startServer(app);
}

test('small bodies pass, exactly maxBytes passes', async () => {
  const server = await start(20);
  try {
    const small = await call(server.base, 'POST', '/echo', { body: { a: 1 } });
    assert.equal(small.status, 201);
    const exact = JSON.stringify({ k: 'x'.repeat(12) });
    assert.equal(Buffer.byteLength(exact), 20);
    const res = await call(server.base, 'POST', '/echo', { raw: exact });
    assert.equal(res.status, 201);
  } finally { await server.close(); }
});

test('one byte over the limit gives 413', async () => {
  const server = await start(20);
  try {
    const res = await call(server.base, 'POST', '/echo', { raw: JSON.stringify({ k: 'x'.repeat(13) }) });
    assert.equal(res.status, 413);
    assert.deepEqual(res.body, { message: 'Payload Too Large' });
  } finally { await server.close(); }
});

test('a chunked POST without Content-Length gets 411', async () => {
  const server = await start();
  try {
    const res = await rq(server.base, 'POST', '/echo', { 'content-type': 'application/json' }, ['{"a":', '1}']);
    assert.equal(res.status, 411);
    assert.deepEqual(JSON.parse(res.body), { message: 'Length Required' });
  } finally { await server.close(); }
});

test('an invalid Content-Length gets 400 (middleware called directly)', () => {
  for (const bad of ['abc', '-5', '1.5', '']) {
    let status, body, nexted = false;
    const res = { status(c) { status = c; return this; }, json(b) { body = b; return this; } };
    limitBody(20)({ method: 'POST', headers: { 'content-length': bad } }, res, () => { nexted = true; });
    assert.equal(nexted, false, JSON.stringify(bad));
    assert.equal(status, 400, JSON.stringify(bad));
    assert.deepEqual(body, { message: 'Invalid Content-Length' });
  }
});

test('GET and DELETE without a body are not affected', async () => {
  const server = await start(1);
  try {
    assert.equal((await rq(server.base, 'GET', '/')).body, 'hi');
    assert.equal((await rq(server.base, 'DELETE', '/')).body, 'deleted');
  } finally { await server.close(); }
});
