export function topKFrequent(nums, k) {
  if (k <= 0) return [];
  const counts = new Map();
  for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0] - b[0]).slice(0, k).map((e) => e[0]);
}
