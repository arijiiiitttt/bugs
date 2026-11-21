import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retry } from '../src/retry.js';

function recorder() {
  const waits = [];
  return { waits, sleep: async (ms) => { waits.push(ms); } };
}

test('returns immediately on success without sleeping', async () => {
  const r = recorder();
  assert.equal(await retry(async () => 'ok', { sleep: r.sleep }), 'ok');
  assert.deepEqual(r.waits, []);
});

test('retries with exponential backoff and passes the attempt number', async () => {
  const r = recorder();
  const attempts = [];
  const res = await retry(async (n) => {
    attempts.push(n);
    if (n < 3) throw new Error('fail ' + n);
    return 'done';
  }, { sleep: r.sleep });
  assert.equal(res, 'done');
  assert.deepEqual(attempts, [1, 2, 3]);
  assert.deepEqual(r.waits, [10, 20]);
});

test('gives up after retries + 1 attempts and rethrows the last error', async () => {
  const r = recorder();
  let calls = 0;
  await assert.rejects(retry(async () => { throw new Error('fail ' + ++calls); }, { sleep: r.sleep }), { message: 'fail 4' });
  assert.equal(calls, 4);
  assert.deepEqual(r.waits, [10, 20, 40]);
});

test('supports custom delay, factor and retries', async () => {
  const r = recorder();
  let calls = 0;
  await assert.rejects(retry(async () => { calls++; throw new Error('x'); }, { retries: 2, delay: 5, factor: 3, sleep: r.sleep }));
  assert.equal(calls, 3);
  assert.deepEqual(r.waits, [5, 15]);
});

test('retries: 0 means a single attempt', async () => {
  let calls = 0;
  await assert.rejects(retry(async () => { calls++; throw new Error('x'); }, { retries: 0, sleep: async () => {} }));
  assert.equal(calls, 1);
});

test('shouldRetry can stop early', async () => {
  const r = recorder();
  let calls = 0;
  await assert.rejects(
    retry(async () => { calls++; throw new Error('fatal'); }, { shouldRetry: (e) => e.message !== 'fatal', sleep: r.sleep }),
    /fatal/,
  );
  assert.equal(calls, 1);
  assert.deepEqual(r.waits, []);
});

test('uses a real timer by default', async () => {
  let calls = 0;
  const res = await retry(async () => { if (++calls < 2) throw new Error('x'); return calls; }, { delay: 1 });
  assert.equal(res, 2);
});
