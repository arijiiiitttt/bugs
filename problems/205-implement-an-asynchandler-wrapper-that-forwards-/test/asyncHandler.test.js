import { test } from 'node:test';
import assert from 'node:assert/strict';
import { asyncHandler } from '../src/asyncHandler.js';

test('has the express handler signature and passes the same arguments', async () => {
  const seen = [];
  const h = asyncHandler((...args) => { seen.push(args); });
  assert.equal(h.length, 3);
  const [req, res, next] = [{ r: 1 }, { s: 2 }, () => {}];
  await h(req, res, next);
  assert.equal(seen.length, 1);
  assert.equal(seen[0][0], req);
  assert.equal(seen[0][1], res);
  assert.equal(seen[0][2], next);
});

test('forwards the error of a rejected promise to next exactly once', async () => {
  const boom = new Error('boom');
  const calls = [];
  await asyncHandler(async () => { throw boom; })({}, {}, (e) => calls.push(e));
  assert.deepEqual(calls, [boom]);
});

test('forwards synchronous throws too and never throws itself', async () => {
  const boom = new Error('sync');
  const calls = [];
  let result;
  assert.doesNotThrow(() => { result = asyncHandler(() => { throw boom; })({}, {}, (e) => calls.push(e)); });
  await result;
  assert.deepEqual(calls, [boom]);
});

test('does not call next when the handler succeeds', async () => {
  const calls = [];
  await asyncHandler(async (req, res) => { res.sent = true; })({}, {}, (e) => calls.push(e));
  await asyncHandler(() => 'plain value')({}, {}, (e) => calls.push(e));
  assert.deepEqual(calls, []);
});

test('lets the handler call next itself', async () => {
  const calls = [];
  await asyncHandler(async (req, res, next) => { next(); })({}, {}, (e) => calls.push(e));
  assert.equal(calls.length, 1);
  assert.equal(calls[0], undefined);
});

test('the returned promise resolves only after the async handler finished', async () => {
  let finished = false;
  await asyncHandler(async () => { await new Promise((r) => setTimeout(r, 20)); finished = true; })({}, {}, () => {});
  assert.equal(finished, true);
});
