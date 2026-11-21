import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promiseTimeout, TimeoutError } from '../src/timeout.js';

const later = (ms, v, fail = false) => new Promise((res, rej) => setTimeout(() => (fail ? rej(v) : res(v)), ms));

test('passes the value through when fast enough', async () => {
  assert.equal(await promiseTimeout(later(5, 'ok'), 100), 'ok');
});

test('passes the rejection through when fast enough', async () => {
  const err = new Error('inner');
  await assert.rejects(promiseTimeout(later(5, err, true), 100), (e) => e === err);
});

test('rejects with TimeoutError when too slow', async () => {
  await assert.rejects(promiseTimeout(later(100, 'late'), 15), (e) => {
    assert.ok(e instanceof TimeoutError);
    assert.ok(e instanceof Error);
    assert.equal(e.name, 'TimeoutError');
    assert.equal(e.message, 'Timed out after 15ms');
    return true;
  });
});

test('works with plain values', async () => {
  assert.equal(await promiseTimeout(5, 10), 5);
});

test('clears its timer once settled', async () => {
  const before = process.getActiveResourcesInfo().filter((r) => r === 'Timeout').length;
  await promiseTimeout(Promise.resolve(1), 5000);
  const after = process.getActiveResourcesInfo().filter((r) => r === 'Timeout').length;
  assert.ok(after <= before, 'a timer is still pending');
});
