import { test } from 'node:test';
import assert from 'node:assert/strict';
import { throttle } from '../src/throttle.js';

function clock(start = 1000) {
  let t = start;
  return { now: () => t, advance: (ms) => { t += ms; } };
}

test('runs the first call immediately and ignores calls inside the window', () => {
  const c = clock();
  const calls = [];
  const f = throttle((x) => { calls.push(x); return 'r' + x; }, 100, c.now);
  assert.equal(f(1), 'r1');
  c.advance(50);
  assert.equal(f(2), 'r1');
  c.advance(49);
  assert.equal(f(3), 'r1');
  assert.deepEqual(calls, [1]);
});

test('runs again once wait ms have passed since the last execution', () => {
  const c = clock();
  const calls = [];
  const f = throttle((x) => calls.push(x), 100, c.now);
  f('a');
  c.advance(100);
  f('b');
  c.advance(99);
  f('c');
  c.advance(1);
  f('d');
  assert.deepEqual(calls, ['a', 'b', 'd']);
});

test('keeps this', () => {
  const c = clock();
  const o = { v: 5, get: throttle(function () { return this.v; }, 10, c.now) };
  assert.equal(o.get(), 5);
});

test('works with Date.now by default', () => {
  let n = 0;
  const f = throttle(() => ++n, 1000);
  f(); f(); f();
  assert.equal(n, 1);
});
