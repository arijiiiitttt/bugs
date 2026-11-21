import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scheduleAll } from '../src/schedule.js';

test('pushes labels in event-loop order', async () => {
  const log = [];
  const done = scheduleAll(log);
  assert.deepEqual(log, ['sync'], 'only "sync" may be there before the first await');
  await Promise.resolve();
  assert.deepEqual(log, ['sync', 'micro']);
  const result = await done;
  assert.equal(result, log);
  assert.deepEqual(log, ['sync', 'micro', 'immediate', 'timeout']);
});
