import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Transform, Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createUpperCase } from '../src/upperCase.js';

async function read(stream) {
  let s = '';
  for await (const c of stream) s += c.toString();
  return s;
}

test('returns a Transform', () => {
  assert.ok(createUpperCase() instanceof Transform);
});

test('upper-cases strings and Buffers written to it', async () => {
  const t = createUpperCase();
  const result = read(t);
  t.write('hello ');
  t.write(Buffer.from('big '));
  t.end('wörld');
  assert.equal(await result, 'HELLO BIG WÖRLD');
});

test('works inside a pipeline', async () => {
  const t = createUpperCase();
  const chunks = [];
  const { Writable } = await import('node:stream');
  await pipeline(
    Readable.from(['abc', 'def']),
    t,
    new Writable({ write(chunk, enc, cb) { chunks.push(chunk.toString()); cb(); } }),
  );
  assert.equal(chunks.join(''), 'ABCDEF');
});

test('empty input produces empty output', async () => {
  const t = createUpperCase();
  const result = read(t);
  t.end();
  assert.equal(await result, '');
});
