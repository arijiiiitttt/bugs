import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { promiseAny } from '../src/promiseAny.js';

const original = Promise.any;
beforeEach(() => { Promise.any = () => { throw new Error('Promise.any is not allowed'); }; });
afterEach(() => { Promise.any = original; });

const later = (ms, v, fail = false) => new Promise((res, rej) => setTimeout(() => (fail ? rej(v) : res(v)), ms));

test('resolves with the first fulfilled value', async () => {
  assert.equal(await promiseAny([later(30, 'slow'), later(5, 'fast')]), 'fast');
});

test('ignores rejections while something can still fulfil', async () => {
  assert.equal(await promiseAny([Promise.reject(new Error('x')), later(5, 'ok')]), 'ok');
});

test('plain values count as fulfilled', async () => {
  assert.equal(await promiseAny([later(20, 'p'), 7]), 7);
});

test('rejects with an AggregateError listing reasons in input order', async () => {
  const e1 = new Error('one');
  const e2 = new Error('two');
  await assert.rejects(promiseAny([later(20, e1, true), later(2, e2, true)]), (err) => {
    assert.ok(err instanceof AggregateError);
    assert.deepEqual(err.errors, [e1, e2]);
    assert.equal(err.message, 'All promises were rejected');
    return true;
  });
});

test('an empty iterable rejects with an empty AggregateError', async () => {
  await assert.rejects(promiseAny([]), (err) => err instanceof AggregateError && err.errors.length === 0);
});
