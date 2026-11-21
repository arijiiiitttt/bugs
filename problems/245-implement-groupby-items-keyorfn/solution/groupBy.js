export function groupBy(items, keyOrFn) {
  const fn = typeof keyOrFn === 'function' ? keyOrFn : (item) => item[keyOrFn];
  const out = {};
  items.forEach((item, i) => {
    const key = fn(item, i);
    (out[key] ??= []).push(item);
  });
  return out;
}
