export async function runPool(tasks, limit) {
  if (!Number.isInteger(limit) || limit < 1) throw new TypeError('limit must be a positive integer');
  const results = new Array(tasks.length);
  let next = 0;
  let failed = false;

  async function worker() {
    while (!failed && next < tasks.length) {
      const i = next++;
      try {
        results[i] = await tasks[i]();
      } catch (err) {
        failed = true;
        throw err;
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}
