import { createHash, timingSafeEqual } from 'node:crypto';

const toBuf = (v) => (Buffer.isBuffer(v) ? v : typeof v === 'string' ? Buffer.from(v, 'utf8') : null);
const digest = (b) => createHash('sha256').update(b).digest();

export function safeEqual(a, b) {
  const x = toBuf(a);
  const y = toBuf(b);
  if (!x || !y) return false;
  return timingSafeEqual(digest(x), digest(y));
}
