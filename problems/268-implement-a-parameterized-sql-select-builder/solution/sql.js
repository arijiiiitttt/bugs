export function buildSelect(query, schema) {
  const { table, columns = ['*'], where = {}, orderBy, limit } = query;
  if (typeof table !== 'string' || !Object.hasOwn(schema, table)) throw new Error('Unknown table: ' + table);
  const allowed = schema[table];
  const checkCol = (c) => {
    if (typeof c !== 'string' || !allowed.includes(c)) throw new Error('Unknown column: ' + c);
    return c;
  };
  const values = [];
  const ph = (v) => '$' + values.push(v);

  const cols = columns.length === 1 && columns[0] === '*' ? '*' : columns.map(checkCol).join(', ');
  let text = 'SELECT ' + cols + ' FROM ' + table;

  const conds = [];
  for (const [key, val] of Object.entries(where)) {
    checkCol(key);
    if (val === null) conds.push(key + ' IS NULL');
    else if (Array.isArray(val)) conds.push(key + ' = ANY(' + ph(val) + ')');
    else conds.push(key + ' = ' + ph(val));
  }
  if (conds.length) text += ' WHERE ' + conds.join(' AND ');

  if (orderBy) {
    const dir = String(orderBy.dir ?? 'asc').toUpperCase();
    if (dir !== 'ASC' && dir !== 'DESC') throw new Error('Invalid direction');
    text += ' ORDER BY ' + checkCol(orderBy.column) + ' ' + dir;
  }
  if (limit !== undefined) {
    if (!Number.isInteger(limit) || limit < 1) throw new Error('Invalid limit');
    text += ' LIMIT ' + ph(limit);
  }
  return { text, values };
}
