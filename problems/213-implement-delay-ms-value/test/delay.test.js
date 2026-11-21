import { test } from 'node:test';
import assert from 'node:assert/strict';
import { delay } from '../src/delay.js';

test('resolves with the value after about ms', async () => {
  const t0 = performance.now();
  const v = await delay(20, 'hi');
  assert.equal(v, 'hi');
  assert.ok(performance.now() - t0 >= 18, 'resolved too early');
});

test('resolves with undefined when no value is given', async () => {
  assert.equal(await delay(1), undefined);
});

test('returns a promise', () => {
  assert.ok(delay(0) instanceof Promise);
});

test('throws a RangeError synchronously for invalid durations', () => {
  for (const bad of [-1, 1.5, NaN, '5', undefined]) {
    assert.throws(() => delay(bad), RangeError, 'value ' + String(bad));
  }
});
