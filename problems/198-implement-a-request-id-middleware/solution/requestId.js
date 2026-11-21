import { randomUUID } from 'node:crypto';

export function requestId(req, res, next) {
  const incoming = req.headers['x-request-id'];
  const id = typeof incoming === 'string' && /^[A-Za-z0-9._-]{1,64}$/.test(incoming) ? incoming : randomUUID();
  req.id = id;
  res.setHeader('x-request-id', id);
  next();
}
