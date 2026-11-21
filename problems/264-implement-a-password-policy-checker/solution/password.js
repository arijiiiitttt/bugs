export function validatePassword(password, { username } = {}) {
  if (typeof password !== 'string') return ['invalid'];
  const out = [];
  const lower = password.toLowerCase();
  if (password.length < 12) out.push('too_short');
  if (!/[a-z]/.test(password)) out.push('no_lower');
  if (!/[A-Z]/.test(password)) out.push('no_upper');
  if (!/[0-9]/.test(password)) out.push('no_digit');
  if (!/[^A-Za-z0-9]/.test(password)) out.push('no_symbol');
  if (typeof username === 'string' && username.length >= 3 && lower.includes(username.toLowerCase())) out.push('contains_username');
  if (/(.)\1\1/s.test(password)) out.push('repeated');
  if (['password', 'qwerty', '123456'].some((w) => lower.includes(w))) out.push('common');
  return out;
}
