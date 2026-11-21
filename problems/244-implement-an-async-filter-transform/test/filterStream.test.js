import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createFilter } from '../src/filterStream.js';

async function run(items, predicate) {
  const out = [];
  for await (const x of Readable.from(items).pipe(createFilter(predicate))) out.push(x);
  return out;
}

test('keeps only accepted chunks (sync predicate)', async () => {
  assert.deepEqual(await run([1, 2, 3, 4, 5], (n) => n % 2 === 1), [1, 3, 5]);
});

test('supports async predicates and keeps the order', async () => {
  const delays = { 1: 15, 2: 1, 3: 8, 4: 1 };
  const res = await run([1, 2, 3, 4], async (n) => {
    await new Promise((r) => setTimeout(r, delays[n]));
    return true;
  });
  assert.deepEqual(res, [1, 2, 3, 4]);
});

test('keeps accepted falsy values like 0 and empty strings', async () => {
  assert.deepEqual(await run([0, 1, ''], () => true), [0, 1, '']);
});

test('is an object-mode transform', () => {
  const f = createFilter(() => true);
  assert.equal(f.readableObjectMode, true);
  assert.equal(f.writableObjectMode, true);
  f.destroy();
});

test('destroys the stream when the predicate fails', async () => {
  await assert.rejects(
    run([1, 2, 3], async (n) => { if (n === 2) throw new Error('bad predicate'); return true; }),
    /bad predicate/,
  );
});
