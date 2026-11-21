import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLineSplitter } from '../src/lineSplitter.js';

async function split(chunks) {
  const t = createLineSplitter();
  const out = [];
  const reader = (async () => { for await (const line of t) out.push(line); })();
  for (const c of chunks) t.write(c);
  t.end();
  await reader;
  return out;
}

test('splits lines across chunk boundaries', async () => {
  assert.deepEqual(await split(['ab', 'c\nde', 'f\n\ngh']), ['abc', 'def', '', 'gh']);
});

test('removes carriage returns, even when CR and LF are in different chunks', async () => {
  assert.deepEqual(await split(['a\r\nb\r', '\nc']), ['a', 'b', 'c']);
});

test('a trailing newline does not create an extra empty line', async () => {
  assert.deepEqual(await split(['x\n']), ['x']);
  assert.deepEqual(await split(['x\ny\n']), ['x', 'y']);
});

test('emits the last line even without a trailing newline', async () => {
  assert.deepEqual(await split(['first\nlast']), ['first', 'last']);
});

test('no input produces no lines; a lone newline produces one empty line', async () => {
  assert.deepEqual(await split([]), []);
  assert.deepEqual(await split(['\n']), ['']);
});

test('survives multi-byte characters split across chunks', async () => {
  const bytes = [...Buffer.from('héé\nñ€\nend')].map((b) => Buffer.from([b]));
  assert.deepEqual(await split(bytes), ['héé', 'ñ€', 'end']);
});

test('emits strings in object mode', async () => {
  const t = createLineSplitter();
  assert.equal(t.readableObjectMode, true);
  t.destroy();
});
