import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getFullName, getFullNames } from '../src/names.js';

const users = { 1: { first: 'Ada', last: 'Lovelace' }, 2: { first: 'Alan', last: 'Turing' } };
const repo = {
  async findUser(id) {
    await new Promise((r) => setImmediate(r));
    return users[id] ?? null;
  },
};

test('getFullName joins first and last name', async () => {
  assert.equal(await getFullName(1, repo), 'Ada Lovelace');
});

test('getFullName rejects for unknown users', async () => {
  await assert.rejects(getFullName(99, repo), { message: 'User not found: 99' });
});

test('getFullNames resolves with strings in input order', async () => {
  assert.deepEqual(await getFullNames([2, 1], repo), ['Alan Turing', 'Ada Lovelace']);
});

test('getFullNames rejects if one user is unknown', async () => {
  await assert.rejects(getFullNames([1, 7], repo), /User not found: 7/);
});
