const ALLOWED = ['name', 'email', 'bio'];

export function updateProfile(user, body) {
  const next = { ...user };
  for (const key of ALLOWED) {
    if (!body || !Object.hasOwn(body, key)) continue;
    const v = body[key];
    if (key === 'email') {
      if (typeof v !== 'string' || !v.includes('@')) throw new TypeError('invalid email');
      next.email = v.trim().toLowerCase();
    } else {
      if (typeof v !== 'string') throw new TypeError('invalid ' + key);
      next[key] = v;
    }
  }
  return next;
}
