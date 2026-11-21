export async function mapSeries(items, fn) {
  const out = [];
  let i = 0;
  for (const item of items) out.push(await fn(item, i++));
  return out;
}
