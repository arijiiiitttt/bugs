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
import { cors } from '../src/cors.js';

async function start(opts) {
  const app = express();
  app.use(cors(opts));
  app.get('/', (req, res) => res.send('get'));
  app.options('/', (req, res) => res.send('options-route'));
  return startServer(app);
}

test('echoes an allowed origin and sets Vary', async () => {
  const server = await start({ origins: ['https://a.example'] });
  try {
    const res = await rq(server.base, 'GET', '/', { origin: 'https://a.example' });
    assert.equal(res.headers['access-control-allow-origin'], 'https://a.example');
    assert.match(res.headers['vary'], /Origin/i);
    assert.equal(res.body, 'get');
  } finally { await server.close(); }
});

test('does not add CORS headers for other origins or when no Origin is sent', async () => {
  const server = await start({ origins: ['https://a.example'] });
  try {
    const bad = await rq(server.base, 'GET', '/', { origin: 'https://evil.example' });
    assert.equal(bad.headers['access-control-allow-origin'], undefined);
    assert.equal(bad.status, 200);
    const none = await rq(server.base, 'GET', '/');
    assert.equal(none.headers['access-control-allow-origin'], undefined);
  } finally { await server.close(); }
});

test('wildcard allows any origin but still echoes it', async () => {
  const server = await start({ origins: ['*'] });
  try {
    const res = await rq(server.base, 'GET', '/', { origin: 'https://whatever.example' });
    assert.equal(res.headers['access-control-allow-origin'], 'https://whatever.example');
  } finally { await server.close(); }
});

test('answers an allowed preflight with 204 and the allow-* headers', async () => {
  const server = await start({ origins: ['https://a.example'], methods: ['GET', 'PATCH'], headers: ['X-Token'], maxAge: 90 });
  try {
    const res = await rq(server.base, 'OPTIONS', '/', { origin: 'https://a.example', 'access-control-request-method': 'PATCH' });
    assert.equal(res.status, 204);
    assert.equal(res.body, '');
    assert.equal(res.headers['access-control-allow-origin'], 'https://a.example');
    assert.equal(res.headers['access-control-allow-methods'], 'GET, PATCH');
    assert.equal(res.headers['access-control-allow-headers'], 'X-Token');
    assert.equal(res.headers['access-control-max-age'], '90');
  } finally { await server.close(); }
});

test('uses the documented defaults', async () => {
  const server = await start({ origins: ['https://a.example'] });
  try {
    const res = await rq(server.base, 'OPTIONS', '/', { origin: 'https://a.example', 'access-control-request-method': 'GET' });
    assert.equal(res.headers['access-control-allow-methods'], 'GET, POST, PUT, DELETE');
    assert.equal(res.headers['access-control-allow-headers'], 'Content-Type, Authorization');
    assert.equal(res.headers['access-control-max-age'], '600');
  } finally { await server.close(); }
});

test('a preflight from a disallowed origin gets 204 without any allow-* header', async () => {
  const server = await start({ origins: ['https://a.example'] });
  try {
    const res = await rq(server.base, 'OPTIONS', '/', { origin: 'https://evil.example', 'access-control-request-method': 'GET' });
    assert.equal(res.status, 204);
    assert.equal(res.headers['access-control-allow-origin'], undefined);
    assert.equal(res.headers['access-control-allow-methods'], undefined);
  } finally { await server.close(); }
});

test('a plain OPTIONS request (no Access-Control-Request-Method) reaches the route', async () => {
  const server = await start({ origins: ['https://a.example'] });
  try {
    const res = await rq(server.base, 'OPTIONS', '/', { origin: 'https://a.example' });
    assert.equal(res.status, 200);
    assert.equal(res.body, 'options-route');
  } finally { await server.close(); }
});
