export async function runTasks(tasks) {
  const names = Object.keys(tasks);
  const depsOf = (n) => tasks[n].deps ?? [];

  for (const n of names) {
    for (const d of depsOf(n)) {
      if (!Object.hasOwn(tasks, d)) throw new Error('Unknown dependency: ' + d);
    }
  }

  const state = new Map();
  const visit = (n) => {
    if (state.get(n) === 2) return;
    if (state.get(n) === 1) throw new Error('Cycle detected');
    state.set(n, 1);
    depsOf(n).forEach(visit);
    state.set(n, 2);
  };
  names.forEach(visit);

  const promises = new Map();
  const start = (n) => {
    if (!promises.has(n)) {
      promises.set(
        n,
        (async () => {
          const depResults = {};
          await Promise.all(
            depsOf(n).map(async (d) => {
              depResults[d] = await start(d);
            }),
          );
          return tasks[n].run(depResults);
        })(),
      );
    }
    return promises.get(n);
  };

  const entries = await Promise.all(names.map(async (n) => [n, await start(n)]));
  return Object.fromEntries(entries);
}
