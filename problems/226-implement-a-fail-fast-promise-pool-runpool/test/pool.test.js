import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runPool } from '../src/pool.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tick = () => new Promise((r) => setImmediate(r));

test('returns results in input order', async () => {
  const tasks = [30, 10, 20, 1].map((ms, i) => async () => { await sleep(ms / 5); return 'r' + i; });
  assert.deepEqual(await runPool(tasks, 2), ['r0', 'r1', 'r2', 'r3']);
});

test('never exceeds the limit', async () => {
  let running = 0;
  let max = 0;
  const tasks = Array.from({ length: 8 }, () => async () => {
    running++;
    max = Math.max(max, running);
    await sleep(3);
    running--;
  });
  await runPool(tasks, 3);
  assert.equal(max, 3);
});

test('works when limit is larger than the number of tasks and for no tasks', async () => {
  assert.deepEqual(await runPool([async () => 1, async () => 2], 10), [1, 2]);
  assert.deepEqual(await runPool([], 3), []);
});

test('fails fast and starts no further task', async () => {
  const started = [];
  let release;
  const gate = new Promise((r) => { release = r; });
  const tasks = [
    async () => { started.push(0); await gate; return 0; },
    async () => { started.push(1); throw new Error('bad'); },
    async () => { started.push(2); return 2; },
    async () => { started.push(3); return 3; },
  ];
  const p = runPool(tasks, 2);
  await assert.rejects(p, /bad/);
  release();
  await tick();
  await tick();
  assert.deepEqual(started, [0, 1]);
});

test('rejects with a TypeError for an invalid limit', async () => {
  await assert.rejects(runPool([], 0), TypeError);
});
