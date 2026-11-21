import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Account } from '../src/account.js';

const tick = () => new Promise((r) => setImmediate(r));
function makeStore(initial) {
  let value = initial;
  return {
    async read() { await tick(); return value; },
    async write(v) { await tick(); value = v; },
    get value() { return value; },
  };
}

test('basic deposit, withdraw and balance', async () => {
  const acc = new Account(makeStore(100));
  assert.equal(await acc.deposit(50), 150);
  assert.equal(await acc.withdraw(30), 120);
  assert.equal(await acc.balance(), 120);
});

test('rejects invalid amounts and overdrafts', async () => {
  const acc = new Account(makeStore(10));
  await assert.rejects(acc.deposit(0), RangeError);
  await assert.rejects(acc.withdraw(-5), RangeError);
  await assert.rejects(acc.withdraw('5'), RangeError);
  await assert.rejects(acc.withdraw(11), { message: 'Insufficient funds' });
  assert.equal(await acc.balance(), 10);
});

test('concurrent withdrawals cannot overdraw', async () => {
  const store = makeStore(100);
  const acc = new Account(store);
  const results = await Promise.allSettled([acc.withdraw(60), acc.withdraw(60)]);
  assert.deepEqual(results.map((r) => r.status), ['fulfilled', 'rejected']);
  assert.equal(results[1].reason.message, 'Insufficient funds');
  assert.equal(store.value, 40);
});

test('concurrent deposits are not lost', async () => {
  const store = makeStore(0);
  const acc = new Account(store);
  await Promise.all(Array.from({ length: 10 }, () => acc.deposit(10)));
  assert.equal(store.value, 100);
});

test('operations run in call order even when not awaited', async () => {
  const store = makeStore(100);
  const acc = new Account(store);
  const dep = acc.deposit(50);
  const wd = acc.withdraw(120);
  assert.equal(await dep, 150);
  assert.equal(await wd, 30);
  assert.equal(store.value, 30);
});

test('a failed operation does not block the queue', async () => {
  const acc = new Account(makeStore(10));
  const bad = acc.withdraw(100);
  const good = acc.deposit(5);
  await assert.rejects(bad, /Insufficient/);
  assert.equal(await good, 15);
});
