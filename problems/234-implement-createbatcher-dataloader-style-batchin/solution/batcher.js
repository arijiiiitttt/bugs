export function createBatcher(batchFn, { maxBatchSize = Infinity } = {}) {
  let pending = null;

  async function runBatch(entries) {
    const keys = entries.map(([key]) => key);
    let values;
    try {
      values = await batchFn(keys);
      if (!Array.isArray(values) || values.length !== keys.length) {
        throw new Error('batchFn must return an array of the same length');
      }
    } catch (err) {
      for (const [, d] of entries) d.reject(err);
      return;
    }
    entries.forEach(([, d], i) => (values[i] instanceof Error ? d.reject(values[i]) : d.resolve(values[i])));
  }

  function dispatch(map) {
    const entries = [...map.entries()];
    for (let i = 0; i < entries.length; i += maxBatchSize) runBatch(entries.slice(i, i + maxBatchSize));
  }

  return function load(key) {
    if (!pending) {
      const map = new Map();
      pending = map;
      queueMicrotask(() => {
        pending = null;
        dispatch(map);
      });
    }
    if (!pending.has(key)) {
      let resolve, reject;
      const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
      pending.set(key, { promise, resolve, reject });
    }
    return pending.get(key).promise;
  };
}
