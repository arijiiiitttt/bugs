export function throttle(fn, wait, now = Date.now) {
  let last = -Infinity;
  let result;
  return function (...args) {
    const t = now();
    if (t - last >= wait) {
      last = t;
      result = fn.apply(this, args);
    }
    return result;
  };
}
