export function memoizeAsync(fn, { keyFn = (first) => first } = {}) {
  const cache = new Map();

  function memoized(...args) {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    let p;
    try {
      p = Promise.resolve(fn.apply(this, args));
    } catch (err) {
      p = Promise.reject(err);
    }
    cache.set(key, p);
    p.catch(() => {
      if (cache.get(key) === p) cache.delete(key);
    });
    return p;
  }

  memoized.clear = () => cache.clear();
  return memoized;
}
