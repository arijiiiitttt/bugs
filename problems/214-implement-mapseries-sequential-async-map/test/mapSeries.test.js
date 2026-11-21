import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapSeries } from '../src/mapSeries.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('runs the calls one at a time, in order', async () => {
  const events = [];
  const res = await mapSeries([15, 5, 1], async (ms, i) => {
    events.push('start' + i);
    await sleep(ms);
    events.push('end' + i);
    return ms * 2;
  });
  assert.deepEqual(res, [30, 10, 2]);
  assert.deepEqual(events, ['start0', 'end0', 'start1', 'end1', 'start2', 'end2']);
});

test('passes the index as second argument and accepts sync functions', async () => {
  assert.deepEqual(await mapSeries(['a', 'b'], (x, i) => x + i), ['a0', 'b1']);
});

test('empty input resolves to []', async () => {
  assert.deepEqual(await mapSeries([], () => 1), []);
});

test('stops at the first rejection', async () => {
  const seen = [];
  await assert.rejects(
    mapSeries([1, 2, 3, 4], async (x) => {
      seen.push(x);
      if (x === 2) throw new Error('boom');
      return x;
    }),
    /boom/,
  );
  assert.deepEqual(seen, [1, 2]);
});
