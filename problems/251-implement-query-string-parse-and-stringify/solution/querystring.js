const dec = (s) => decodeURIComponent(s.replace(/\+/g, ' '));

export function parse(qs) {
  const out = {};
  const s = qs.startsWith('?') ? qs.slice(1) : qs;
  for (const part of s.split('&')) {
    if (!part) continue;
    const i = part.indexOf('=');
    const key = dec(i === -1 ? part : part.slice(0, i));
    const val = i === -1 ? '' : dec(part.slice(i + 1));
    if (!Object.hasOwn(out, key)) out[key] = val;
    else if (Array.isArray(out[key])) out[key].push(val);
    else out[key] = [out[key], val];
  }
  return out;
}

export function stringify(obj) {
  const parts = [];
  for (const [k, v] of Object.entries(obj)) {
    for (const item of Array.isArray(v) ? v : [v]) {
      if (item === undefined || item === null) continue;
      parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(item)));
    }
  }
  return parts.join('&');
}
