export function createRateLimiter({ limit, windowMs, now = Date.now }) {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError('limit must be a positive integer');
  if (!Number.isInteger(windowMs) || windowMs < 1) throw new RangeError('windowMs must be a positive integer');
  const logs = new Map();
  function prune(key, t) {
    const ts = logs.get(key) || [];
    let i = 0;
    while (i < ts.length && ts[i] <= t - windowMs) i++;
    if (i) ts.splice(0, i);
    if (ts.length === 0) logs.delete(key);
    return ts;
  }
  return {
    allow(key) {
      const t = now();
      const ts = prune(key, t);
      if (ts.length >= limit) return false;
      ts.push(t);
      logs.set(key, ts);
      return true;
    },
    remaining(key) {
      return limit - prune(key, now()).length;
    },
  };
}
