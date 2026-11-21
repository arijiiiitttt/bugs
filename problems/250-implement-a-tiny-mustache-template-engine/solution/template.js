const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function lookup(data, path) {
  let cur = data;
  for (const k of path.split('.')) {
    if (cur === null || cur === undefined) return '';
    cur = cur[k];
  }
  return cur === null || cur === undefined ? '' : String(cur);
}

export function render(template, data) {
  return template.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}|\{\{\s*([\w.]+)\s*\}\}/g, (_, raw, esc) => {
    if (raw !== undefined) return lookup(data, raw);
    return lookup(data, esc).replace(/[&<>"']/g, (c) => ESC[c]);
  });
}
