export function createRateLimiter({ capacity, refillPerSec, now = Date.now, keyFn = (req) => req.ip }) {
  const buckets = new Map();
  return function rateLimiter(req, res, next) {
    const key = keyFn(req);
    const t = now();
    let b = buckets.get(key);
    if (!b) {
      b = { tokens: capacity, last: t };
      buckets.set(key, b);
    }
    const elapsed = Math.max(0, t - b.last) / 1000;
    b.tokens = Math.min(capacity, b.tokens + elapsed * refillPerSec);
    b.last = t;
    res.setHeader('X-RateLimit-Limit', String(capacity));
    if (b.tokens < 1) {
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('Retry-After', String(Math.ceil((1 - b.tokens) / refillPerSec)));
      return res.status(429).json({ message: 'Too Many Requests' });
    }
    b.tokens -= 1;
    res.setHeader('X-RateLimit-Remaining', String(Math.floor(b.tokens)));
    next();
  };
}
