import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runTasks } from '../src/runTasks.js';

const tick = () => new Promise((r) => setImmediate(r));
function deferred() {
  let resolve;
  const promise = new Promise((r) => { resolve = r; });
  return { promise, resolve };
}

test('passes dependency results to run and returns all results', async () => {
  const res = await runTasks({
    a: { run: async () => 1 },
    b: { deps: ['a'], run: async ({ a }) => a + 1 },
    c: { deps: ['a', 'b'], run: ({ a, b }) => a + b },
  });
  assert.deepEqual(res, { a: 1, b: 2, c: 3 });
});

test('independent tasks run concurrently', async () => {
  const gateA = deferred();
  const gateB = deferred();
  const started = [];
  const p = runTasks({
    a: { run: async () => { started.push('a'); await gateA.promise; return 'A'; } },
    b: { run: async () => { started.push('b'); await gateB.promise; return 'B'; } },
    c: { deps: ['a', 'b'], run: async (r) => { started.push('c'); return r.a + r.b; } },
  });
  await tick();
  assert.deepEqual(started, ['a', 'b']);
  gateB.resolve();
  await tick();
  assert.deepEqual(started, ['a', 'b'], 'c must wait for both dependencies');
  gateA.resolve();
  assert.deepEqual(await p, { a: 'A', b: 'B', c: 'AB' });
});

test('each task runs only once', async () => {
  const runs = { a: 0 };
  await runTasks({
    a: { run: async () => { runs.a++; return 1; } },
    b: { deps: ['a'], run: async () => 2 },
    c: { deps: ['a'], run: async () => 3 },
    d: { deps: ['b', 'c', 'a'], run: async () => 4 },
  });
  assert.equal(runs.a, 1);
});

test('rejects on unknown dependencies without running anything', async () => {
  let ran = false;
  await assert.rejects(
    runTasks({ a: { run: async () => { ran = true; } }, b: { deps: ['zzz'], run: async () => {} } }),
    { message: 'Unknown dependency: zzz' },
  );
  assert.equal(ran, false);
});

test('rejects on cycles without running anything', async () => {
  let ran = false;
  await assert.rejects(
    runTasks({
      a: { deps: ['c'], run: async () => { ran = true; } },
      b: { deps: ['a'], run: async () => { ran = true; } },
      c: { deps: ['b'], run: async () => { ran = true; } },
    }),
    { message: 'Cycle detected' },
  );
  assert.equal(ran, false);
});

test('a failing task rejects and its dependents never start', async () => {
  const started = [];
  await assert.rejects(
    runTasks({
      a: { run: async () => { started.push('a'); throw new Error('a failed'); } },
      b: { deps: ['a'], run: async () => { started.push('b'); } },
      c: { deps: ['b'], run: async () => { started.push('c'); } },
    }),
    /a failed/,
  );
  assert.deepEqual(started, ['a']);
});

test('no tasks resolves to an empty object', async () => {
  assert.deepEqual(await runTasks({}), {});
});
