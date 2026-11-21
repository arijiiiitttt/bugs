export function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (Object.hasOwn(obj, k)) out[k] = obj[k];
  return out;
}

export function omit(obj, keys) {
  const drop = new Set(keys);
  const out = {};
  for (const [k, v] of Object.entries(obj)) if (!drop.has(k)) out[k] = v;
  return out;
}
