import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { createRateLimiter } from '../src/rateLimiter.js';

async function start(opts) {
  const clock = { t: 1_000_000 };
  const app = express();
  app.use(createRateLimiter({ now: () => clock.t, keyFn: (req) => req.headers['x-client'] || 'anon', ...opts }));
  app.get('/', (req, res) => res.json({ ok: true }));
  const server = await startServer(app);
  const hit = (client = 'a') => call(server.base, 'GET', '/', { headers: { 'x-client': client } });
  return { clock, server, hit };
}

test('allows a burst up to capacity and reports the remaining tokens', async () => {
  const { server, hit } = await start({ capacity: 3, refillPerSec: 1 });
  try {
    for (const remaining of ['2', '1', '0']) {
      const res = await hit();
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('x-ratelimit-limit'), '3');
      assert.equal(res.headers.get('x-ratelimit-remaining'), remaining);
    }
  } finally { await server.close(); }
});

test('rejects with 429, Retry-After and the documented body when empty', async () => {
  const { server, hit } = await start({ capacity: 2, refillPerSec: 1 });
  try {
    await hit(); await hit();
    const res = await hit();
    assert.equal(res.status, 429);
    assert.deepEqual(res.body, { message: 'Too Many Requests' });
    assert.equal(res.headers.get('retry-after'), '1');
    assert.equal(res.headers.get('x-ratelimit-remaining'), '0');
  } finally { await server.close(); }
});

test('refills continuously: half a second is not enough for 1 token/sec, one second is', async () => {
  const { clock, server, hit } = await start({ capacity: 1, refillPerSec: 1 });
  try {
    assert.equal((await hit()).status, 200);
    assert.equal((await hit()).status, 429);
    clock.t += 500;
    const half = await hit();
    assert.equal(half.status, 429);
    assert.equal(half.headers.get('retry-after'), '1');
    clock.t += 500;
    assert.equal((await hit()).status, 200);
  } finally { await server.close(); }
});

test('rejected requests do not consume tokens and Retry-After is rounded up', async () => {
  const { clock, server, hit } = await start({ capacity: 1, refillPerSec: 0.25 });
  try {
    await hit();
    for (let i = 0; i < 5; i++) assert.equal((await hit()).status, 429);
    const res = await hit();
    assert.equal(res.headers.get('retry-after'), '4');
    clock.t += 4000;
    assert.equal((await hit()).status, 200);
  } finally { await server.close(); }
});

test('never refills beyond capacity', async () => {
  const { clock, server, hit } = await start({ capacity: 3, refillPerSec: 1 });
  try {
    await hit(); await hit(); await hit();
    clock.t += 3_600_000;
    const res = await hit();
    assert.equal(res.headers.get('x-ratelimit-remaining'), '2');
  } finally { await server.close(); }
});

test('clients have independent buckets', async () => {
  const { server, hit } = await start({ capacity: 1, refillPerSec: 1 });
  try {
    assert.equal((await hit('alice')).status, 200);
    assert.equal((await hit('alice')).status, 429);
    assert.equal((await hit('bob')).status, 200);
  } finally { await server.close(); }
});
