export function paginate(items, { page, limit } = {}) {
  const p = page === undefined ? 1 : Number(page);
  const l = limit === undefined ? 10 : Number(limit);
  if (!Number.isInteger(p) || p < 1 || !Number.isInteger(l) || l < 1) {
    const err = new Error('Invalid pagination parameters');
    err.status = 400;
    throw err;
  }
  const size = Math.min(l, 50);
  const total = items.length;
  return { data: items.slice((p - 1) * size, p * size), page: p, limit: size, total, totalPages: Math.ceil(total / size) };
}
