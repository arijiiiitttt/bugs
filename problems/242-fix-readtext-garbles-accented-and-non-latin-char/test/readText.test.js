import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { readText } from '../src/readText.js';

const TEXT = 'héllo wörld € 日本 🎉';

test('decodes characters that are split across chunks (one byte per chunk)', async () => {
  const bytes = [...Buffer.from(TEXT)].map((b) => Buffer.from([b]));
  assert.equal(await readText(Readable.from(bytes)), TEXT);
});

test('decodes characters split at an odd position', async () => {
  const buf = Buffer.from(TEXT);
  const stream = Readable.from([buf.subarray(0, 2), buf.subarray(2, 9), buf.subarray(9)]);
  assert.equal(await readText(stream), TEXT);
});

test('accepts string chunks (stream with an encoding)', async () => {
  const stream = Readable.from([Buffer.from('abc')]);
  stream.setEncoding('utf8');
  assert.equal(await readText(stream), 'abc');
});

test('empty stream gives an empty string', async () => {
  assert.equal(await readText(Readable.from([])), '');
});
