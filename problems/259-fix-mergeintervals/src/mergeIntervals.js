export function mergeIntervals(intervals) {
  const sorted = intervals.sort((a, b) => a[1] - b[1]);
  const out = [];
  for (const iv of sorted) {
    const last = out[out.length - 1];
    if (last && iv[0] < last[1]) last[1] = iv[1];
    else out.push(iv);
  }
  return out;
}
