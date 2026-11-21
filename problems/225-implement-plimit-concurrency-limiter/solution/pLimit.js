export function pLimit(concurrency) {
  if (!Number.isInteger(concurrency) || concurrency < 1) throw new TypeError('concurrency must be a positive integer');
  const queue = [];
  let active = 0;

  const next = () => {
    if (active >= concurrency || queue.length === 0) return;
    active++;
    const { fn, args, resolve, reject } = queue.shift();
    Promise.resolve()
      .then(() => fn(...args))
      .then(resolve, reject)
      .finally(() => {
        active--;
        next();
      });
  };

  const limit = (fn, ...args) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, args, resolve, reject });
      next();
    });

  Object.defineProperties(limit, {
    activeCount: { get: () => active },
    pendingCount: { get: () => queue.length },
  });
  return limit;
}
