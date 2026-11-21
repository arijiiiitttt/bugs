import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter } from '../src/rateLimiter.js';

function clock() {
  let t = 1000;
  return { now: () => t, tick: (ms) => { t += ms; } };
}

test('allows up to limit then rejects', () => {
  const c = clock();
  const rl = createRateLimiter({ limit: 3, windowMs: 1000, now: c.now });
  assert.deepEqual([1, 2, 3, 4].map(() => rl.allow('a')), [true, true, true, false]);
});
test('request exactly windowMs old is expired', () => {
  const c = clock();
  const rl = createRateLimiter({ limit: 1, windowMs: 1000, now: c.now });
  assert.equal(rl.allow('a'), true);
  c.tick(999);
  assert.equal(rl.allow('a'), false);
  c.tick(1);
  assert.equal(rl.allow('a'), true);
});
test('window slides rather than resetting', () => {
  const c = clock();
  const rl = createRateLimiter({ limit: 2, windowMs: 100, now: c.now });
  assert.equal(rl.allow('k'), true); // t=0
  c.tick(60);
  assert.equal(rl.allow('k'), true); // t=60
  c.tick(50); // t=110: first expired, second not
  assert.equal(rl.allow('k'), true);
  assert.equal(rl.allow('k'), false);
});
test('rejected requests are not recorded', () => {
  const c = clock();
  const rl = createRateLimiter({ limit: 1, windowMs: 100, now: c.now });
  assert.equal(rl.allow('k'), true);
  c.tick(50);
  assert.equal(rl.allow('k'), false);
  c.tick(50);
  assert.equal(rl.allow('k'), true);
});
test('keys are independent and remaining works', () => {
  const c = clock();
  const rl = createRateLimiter({ limit: 2, windowMs: 100, now: c.now });
  rl.allow('a');
  assert.equal(rl.remaining('a'), 1);
  assert.equal(rl.remaining('b'), 2);
  assert.equal(rl.allow('b'), true);
  c.tick(100);
  assert.equal(rl.remaining('a'), 2);
});
test('validates options', () => {
  assert.throws(() => createRateLimiter({ limit: 0, windowMs: 10 }), RangeError);
  assert.throws(() => createRateLimiter({ limit: 1, windowMs: 1.5 }), RangeError);
});
test('performance sanity', () => {
  const c = clock();
  const rl = createRateLimiter({ limit: 100, windowMs: 1000, now: c.now });
  let ok = 0;
  for (let i = 0; i < 200000; i++) {
    if (rl.allow('k' + (i % 50))) ok++;
    if (i % 100 === 0) c.tick(10);
  }
  assert.ok(ok > 0);
});
