export function lowerBound(arr, x) {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] >= x) hi = mid; else lo = mid + 1;
  }
  return lo;
}

export function upperBound(arr, x) {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] > x) hi = mid; else lo = mid + 1;
  }
  return lo;
}
