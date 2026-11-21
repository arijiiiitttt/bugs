export function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (value instanceof Map) {
    const m = new Map();
    seen.set(value, m);
    for (const [k, v] of value) m.set(deepClone(k, seen), deepClone(v, seen));
    return m;
  }
  if (value instanceof Set) {
    const s = new Set();
    seen.set(value, s);
    for (const v of value) s.add(deepClone(v, seen));
    return s;
  }
  if (Array.isArray(value)) {
    const a = new Array(value.length);
    seen.set(value, a);
    for (let i = 0; i < value.length; i++) a[i] = deepClone(value[i], seen);
    return a;
  }
  const o = Object.create(Object.getPrototypeOf(value));
  seen.set(value, o);
  for (const k of Object.keys(value)) o[k] = deepClone(value[k], seen);
  return o;
}
