import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Mutex } from '../src/mutex.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('runs functions one at a time in submission order', async () => {
  const m = new Mutex();
  const events = [];
  const job = (name, ms) => m.runExclusive(async () => {
    events.push('start ' + name);
    await sleep(ms);
    events.push('end ' + name);
    return name;
  });
  const res = await Promise.all([job('a', 15), job('b', 1), job('c', 5)]);
  assert.deepEqual(res, ['a', 'b', 'c']);
  assert.deepEqual(events, ['start a', 'end a', 'start b', 'end b', 'start c', 'end c']);
});

test('accepts synchronous functions', async () => {
  const m = new Mutex();
  assert.equal(await m.runExclusive(() => 5), 5);
});

test('a failing function rejects but does not block the queue', async () => {
  const m = new Mutex();
  const a = m.runExclusive(async () => { await sleep(1); throw new Error('boom'); });
  const b = m.runExclusive(() => 'next');
  await assert.rejects(a, /boom/);
  assert.equal(await b, 'next');
});

test('isLocked reflects running and waiting work', async () => {
  const m = new Mutex();
  assert.equal(m.isLocked, false);
  const p = m.runExclusive(() => sleep(5));
  assert.equal(m.isLocked, true);
  await p;
  assert.equal(m.isLocked, false);
});

test('protects a read-modify-write sequence', async () => {
  const m = new Mutex();
  let value = 0;
  const inc = () => m.runExclusive(async () => {
    const v = value;
    await sleep(0);
    value = v + 1;
  });
  await Promise.all(Array.from({ length: 10 }, inc));
  assert.equal(value, 10);
});
