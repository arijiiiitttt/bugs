import { test } from 'node:test';
import assert from 'node:assert/strict';
import { debounce } from '../src/debounce.js';

function fakeScheduler() {
  let id = 0;
  const timers = new Map();
  return {
    setTimeout(fn, ms) { timers.set(++id, { fn, ms }); return id; },
    clearTimeout(i) { timers.delete(i); },
    get pending() { return timers.size; },
    get lastDelay() { return [...timers.values()].at(-1)?.ms; },
    fireAll() { for (const [i, t] of [...timers]) { timers.delete(i); t.fn(); } },
  };
}

test('calls fn once, with the latest arguments, when the timer fires', () => {
  const s = fakeScheduler();
  const calls = [];
  const d = debounce((...a) => calls.push(a), 100, s);
  d(1); d(2); d(3);
  assert.deepEqual(calls, []);
  assert.equal(s.pending, 1);
  assert.equal(s.lastDelay, 100);
  s.fireAll();
  assert.deepEqual(calls, [[3]]);
});

test('can be used again after firing', () => {
  const s = fakeScheduler();
  const calls = [];
  const d = debounce((x) => calls.push(x), 10, s);
  d('a'); s.fireAll();
  d('b'); s.fireAll();
  assert.deepEqual(calls, ['a', 'b']);
});

test('cancel drops the pending call', () => {
  const s = fakeScheduler();
  let n = 0;
  const d = debounce(() => n++, 10, s);
  d();
  d.cancel();
  assert.equal(s.pending, 0);
  s.fireAll();
  assert.equal(n, 0);
});

test('flush runs the pending call immediately and returns its result', () => {
  const s = fakeScheduler();
  const d = debounce((x) => x * 2, 10, s);
  d(21);
  assert.equal(d.flush(), 42);
  assert.equal(s.pending, 0);
});

test('flush without a pending call does nothing', () => {
  const s = fakeScheduler();
  let n = 0;
  const d = debounce(() => ++n, 10, s);
  assert.equal(d.flush(), undefined);
  assert.equal(n, 0);
});

test('keeps this of the latest call', () => {
  const s = fakeScheduler();
  const seen = [];
  const obj = { name: 'o', run: debounce(function () { seen.push(this.name); }, 5, s) };
  obj.run();
  s.fireAll();
  assert.deepEqual(seen, ['o']);
});

test('works with the real timers by default', async () => {
  let n = 0;
  const d = debounce(() => n++, 5);
  d(); d();
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(n, 1);
});
