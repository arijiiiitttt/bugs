function words(str) {
  return String(str)
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^A-Za-z\d]+/)
    .filter(Boolean);
}

export function toCamel(str) {
  return words(str)
    .map((w, i) => {
      const l = w.toLowerCase();
      return i === 0 ? l : l[0].toUpperCase() + l.slice(1);
    })
    .join('');
}

export function toSnake(str) {
  return words(str).map((w) => w.toLowerCase()).join('_');
}

export function toKebab(str) {
  return words(str).map((w) => w.toLowerCase()).join('-');
}
