import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sendAll } from '../src/sendAll.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('resolves with the ids in input order after every send finished', async () => {
  const done = [];
  const users = [{ id: 'a', ms: 20 }, { id: 'b', ms: 10 }, { id: 'c', ms: 1 }];
  const res = await sendAll(users, async (u) => {
    await sleep(u.ms);
    done.push(u.id);
  });
  assert.deepEqual(done, ['c', 'b', 'a']);
  assert.deepEqual(res, ['a', 'b', 'c']);
});

test('rejects when a send fails', async () => {
  await assert.rejects(
    sendAll([{ id: 1 }, { id: 2 }], async (u) => {
      await sleep(1);
      if (u.id === 2) throw new Error('smtp down');
    }),
    /smtp down/,
  );
});

test('empty input resolves to []', async () => {
  assert.deepEqual(await sendAll([], async () => {}), []);
});
