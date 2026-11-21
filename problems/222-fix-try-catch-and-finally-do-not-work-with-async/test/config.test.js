import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, withCleanup } from '../src/config.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('loadConfig returns the fetched value', async () => {
  assert.deepEqual(await loadConfig(async () => ({ a: 1 }), {}), { a: 1 });
});

test('loadConfig returns the fallback when the fetch rejects', async () => {
  const fallback = { safe: true };
  const res = await loadConfig(async () => { await sleep(1); throw new Error('net'); }, fallback);
  assert.equal(res, fallback);
});

test('withCleanup calls cleanup only after the task finished', async () => {
  const events = [];
  const res = await withCleanup(
    async () => { events.push('start'); await sleep(10); events.push('end'); return 7; },
    () => events.push('cleanup'),
  );
  assert.equal(res, 7);
  assert.deepEqual(events, ['start', 'end', 'cleanup']);
});

test('withCleanup cleans up after a failure and rethrows', async () => {
  const events = [];
  await assert.rejects(
    withCleanup(async () => { await sleep(1); events.push('task'); throw new Error('bad'); }, () => events.push('cleanup')),
    /bad/,
  );
  assert.deepEqual(events, ['task', 'cleanup']);
});
