import { createHmac, timingSafeEqual } from 'node:crypto';

const fail = (code) => Object.assign(new Error(code), { code });
const mac = (data, secret) => createHmac('sha256', secret).update(data).digest();

export function signToken(payload, secret, { ttlSeconds, now = Date.now } = {}) {
  const iat = Math.floor(now() / 1000);
  const claims = { ...payload, iat, exp: iat + ttlSeconds };
  const body = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return body + '.' + mac(body, secret).toString('base64url');
}

export function verifyToken(token, secret, { now = Date.now } = {}) {
  if (typeof token !== 'string') throw fail('MALFORMED');
  const parts = token.split('.');
  if (parts.length !== 2) throw fail('MALFORMED');
  const [body, sig] = parts;
  const given = Buffer.from(sig, 'base64url');
  const expected = mac(body, secret);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) throw fail('BAD_SIGNATURE');
  let claims;
  try {
    claims = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    throw fail('MALFORMED');
  }
  if (now() / 1000 >= claims.exp) throw fail('EXPIRED');
  return claims;
}
