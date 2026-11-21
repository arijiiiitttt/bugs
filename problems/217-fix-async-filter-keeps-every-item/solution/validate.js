export async function keepValid(items, isValid) {
  const flags = await Promise.all(items.map((item) => isValid(item)));
  return items.filter((_, i) => flags[i]);
}
