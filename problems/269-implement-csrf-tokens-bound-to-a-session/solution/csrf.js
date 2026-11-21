import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export function createCsrf(secret) {
  const mac = (sessionId, nonce) => createHmac('sha256', secret).update(sessionId + ':' + nonce).digest('hex');
  return {
    issue(sessionId) {
      const nonce = randomBytes(16).toString('hex');
      return nonce + '.' + mac(sessionId, nonce);
    },
    verify(sessionId, token) {
      if (typeof sessionId !== 'string' || typeof token !== 'string') return false;
      const parts = token.split('.');
      if (parts.length !== 2) return false;
      const [nonce, given] = parts;
      const expected = mac(sessionId, nonce);
      if (given.length !== expected.length) return false;
      return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
    },
  };
}
