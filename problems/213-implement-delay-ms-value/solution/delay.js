export function delay(ms, value) {
  if (!Number.isInteger(ms) || ms < 0) throw new RangeError('ms must be a non-negative integer');
  return new Promise((resolve) => setTimeout(resolve, ms, value));
}
