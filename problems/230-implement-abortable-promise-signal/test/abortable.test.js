import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import { abortable } from '../src/abortable.js';

const later = (ms, v, fail = false) => new Promise((res, rej) => setTimeout(() => (fail ? rej(v) : res(v)), ms));

test('passes the value through when not aborted', async () => {
  const c = new AbortController();
  assert.equal(await abortable(later(5, 'v'), c.signal), 'v');
});

test('passes the rejection through', async () => {
  const c = new AbortController();
  const err = new Error('inner');
  await assert.rejects(abortable(later(5, err, true), c.signal), (e) => e === err);
});

test('rejects with an AbortError when aborted while waiting', async () => {
  const c = new AbortController();
  const p = abortable(later(200, 'late'), c.signal);
  setTimeout(() => c.abort(), 5);
  await assert.rejects(p, (e) => e.name === 'AbortError');
});

test('rejects with a custom abort reason', async () => {
  const c = new AbortController();
  const reason = new Error('user left');
  const p = abortable(later(200, 'late'), c.signal);
  c.abort(reason);
  await assert.rejects(p, (e) => e === reason);
});

test('rejects immediately if the signal is already aborted', async () => {
  const c = new AbortController();
  c.abort();
  await assert.rejects(abortable(Promise.resolve('x'), c.signal), (e) => e.name === 'AbortError');
});

test('removes its listener once the promise settled', async () => {
  const c = new AbortController();
  await abortable(Promise.resolve(1), c.signal);
  assert.equal(getEventListeners(c.signal, 'abort').length, 0);
});
