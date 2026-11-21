# Implement a parameterized SQL select builder

**Track:** Security & auth &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
String-concatenated SQL is an injection hole. Implement `buildSelect(query, schema)` in `src/sql.js`. It returns `{ text, values }` for a PostgreSQL-style driver (`$1, $2, ...` placeholders).

`schema` maps table names to arrays of allowed column names, e.g. `{ users: ['id', 'name', 'email'] }`.

### `query` fields
- `table` (required) - must be a key of `schema`.
- `columns` - array of allowed columns; default / `["*"]` gives `*`.
- `where` - object. For each key in insertion order, joined with `AND`: a scalar -> `col = $n`; an array -> `col = ANY($n)` (array passed as one value); `null` -> `col IS NULL` (no value).
- `orderBy` - `{ column, dir }` with `dir` `"asc"`/`"desc"` (case-insensitive, default ASC) -> `ORDER BY col DIR`.
- `limit` - positive integer -> `LIMIT $n` (as a value).

Any unknown table/column, invalid direction or invalid limit throws an `Error`. **Values must never appear in `text`.**

Example: `SELECT id, name FROM users WHERE email = $1 AND id = ANY($2) ORDER BY name DESC LIMIT $3`

## How to work

```bash
npm test -- 268     # run the tests of this problem (replace 268 by the problem number)
```

- Implement the code in `src/sql.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 268` show the reference solution.
