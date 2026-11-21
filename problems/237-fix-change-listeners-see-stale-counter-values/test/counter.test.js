import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { Counter } from '../src/counter.js';

test('is an EventEmitter that starts at 0', () => {
  const c = new Counter();
  assert.ok(c instanceof EventEmitter);
  assert.equal(c.value, 0);
});

test('emits change with (new, old) after the value was updated', () => {
  const c = new Counter();
  const seen = [];
  c.on('change', (n, old) => seen.push([n, old, c.value]));
  c.increment();
  c.increment(5);
  c.increment(-2);
  assert.deepEqual(seen, [[1, 0, 1], [6, 1, 6], [4, 6, 4]]);
});

test('does not emit when nothing changes', () => {
  const c = new Counter();
  let n = 0;
  c.on('change', () => n++);
  c.increment(0);
  c.reset();
  assert.equal(n, 0);
});

test('reset emits once and sets the value to 0', () => {
  const c = new Counter();
  c.increment(3);
  const seen = [];
  c.on('change', (n, old) => seen.push([n, old, c.value]));
  c.reset();
  c.reset();
  assert.deepEqual(seen, [[0, 3, 0]]);
});
