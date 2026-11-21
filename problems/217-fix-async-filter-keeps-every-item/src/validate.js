export async function keepValid(items, isValid) {
  return items.filter(async (item) => await isValid(item));
}
