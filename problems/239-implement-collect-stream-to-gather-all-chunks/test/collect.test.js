import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { collect } from '../src/collect.js';

test('collects object-mode chunks', async () => {
  assert.deepEqual(await collect(Readable.from([1, 2, 3])), [1, 2, 3]);
});

test('collects Buffer chunks as emitted', async () => {
  const chunks = await collect(Readable.from([Buffer.from('ab'), Buffer.from('cd')]));
  assert.equal(Buffer.concat(chunks).toString(), 'abcd');
  assert.equal(chunks.length, 2);
});

test('empty stream gives []', async () => {
  assert.deepEqual(await collect(Readable.from([])), []);
});

test('rejects when the stream errors', async () => {
  const s = new Readable({
    objectMode: true,
    read() {
      if (!this.sent) { this.sent = true; this.push('first'); } else this.destroy(new Error('disk failure'));
    },
  });
  await assert.rejects(collect(s), /disk failure/);
});
