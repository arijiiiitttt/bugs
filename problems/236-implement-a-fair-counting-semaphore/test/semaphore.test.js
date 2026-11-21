import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Semaphore } from '../src/semaphore.js';

const tick = () => new Promise((r) => setImmediate(r));

test('validates max', () => {
  for (const bad of [0, -1, 1.5, '2', undefined]) assert.throws(() => new Semaphore(bad), RangeError);
});

test('hands out max permits and then makes callers wait, FIFO', async () => {
  const s = new Semaphore(2);
  const order = [];
  const r1 = await s.acquire();
  const r2 = await s.acquire();
  assert.equal(s.available, 0);
  const w3 = s.acquire().then((r) => { order.push(3); return r; });
  const w4 = s.acquire().then((r) => { order.push(4); return r; });
  await tick();
  assert.deepEqual(order, []);
  r1();
  await tick();
  assert.deepEqual(order, [3]);
  assert.equal(s.available, 0, 'the permit goes straight to the waiter');
  r2();
  await tick();
  assert.deepEqual(order, [3, 4]);
  (await w3)();
  (await w4)();
  assert.equal(s.available, 2);
});

test('release is idempotent', async () => {
  const s = new Semaphore(1);
  const r = await s.acquire();
  r();
  r();
  r();
  assert.equal(s.available, 1);
  const a = await s.acquire();
  let got = false;
  s.acquire().then(() => { got = true; });
  await tick();
  assert.equal(got, false, 'only one permit may exist');
  a();
});

test('withPermit limits concurrency and returns the result', async () => {
  const s = new Semaphore(2);
  let running = 0;
  let max = 0;
  const job = (n) => s.withPermit(async () => {
    running++;
    max = Math.max(max, running);
    await tick();
    running--;
    return n;
  });
  const res = await Promise.all([1, 2, 3, 4, 5].map(job));
  assert.deepEqual(res, [1, 2, 3, 4, 5]);
  assert.equal(max, 2);
  assert.equal(s.available, 2);
});

test('withPermit releases when fn rejects', async () => {
  const s = new Semaphore(1);
  await assert.rejects(s.withPermit(async () => { throw new Error('x'); }), /x/);
  assert.equal(s.available, 1);
  assert.equal(await s.withPermit(() => 'next'), 'next');
});
