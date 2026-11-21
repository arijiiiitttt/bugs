import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arrayToStream } from '../src/arrayToStream.js';

async function drain(stream) {
  const out = [];
  for await (const x of stream) out.push(x);
  return out;
}

test('emits every item in order', async () => {
  assert.deepEqual(await drain(arrayToStream([1, 'two', { three: 3 }])), [1, 'two', { three: 3 }]);
});

test('keeps object identity', async () => {
  const obj = { a: 1 };
  const [out] = await drain(arrayToStream([obj]));
  assert.equal(out, obj);
});

test('empty array ends immediately', async () => {
  assert.deepEqual(await drain(arrayToStream([])), []);
});

test('is an object mode stream', () => {
  assert.equal(arrayToStream([]).readableObjectMode, true);
});

test('null and undefined items destroy the stream with a TypeError', async () => {
  for (const bad of [null, undefined]) {
    const got = [];
    await assert.rejects(
      (async () => { for await (const x of arrayToStream([1, bad, 2])) got.push(x); })(),
      { name: 'TypeError', message: 'Items must not be null or undefined' },
    );
    assert.deepEqual(got, [1]);
  }
});
