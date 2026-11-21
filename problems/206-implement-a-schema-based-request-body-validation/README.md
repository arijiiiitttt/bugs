# Implement a schema-based request body validation middleware

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement `validate(schema)` in `src/validate.js`. It returns a middleware that validates `req.body` (already parsed by `express.json()`).

### Schema
An object whose keys are field names and whose values are rules:
`{ type?: "string" | "number" | "boolean", required?: boolean, minLength?, maxLength?, min?, max?, enum?: [...] }`

### Checks (per field, **first failing check wins**, so at most one error per field)
| Order | Condition | Message |
|---|---|---|
| 1 | value is `undefined` or `null` and `required` | `is required` |
| - | value is `undefined`/`null` and not required | field is skipped |
| 2 | `typeof value !== type` | `must be a <type>` |
| 3 | string shorter than `minLength` | `must have at least <n> characters` |
| 4 | string longer than `maxLength` | `must have at most <n> characters` |
| 5 | number below `min` | `must be >= <n>` |
| 6 | number above `max` | `must be <= <n>` |
| 7 | value not in `enum` | `must be one of: a, b, c` |

### Result
- No errors: call `next()`.
- Otherwise respond **400** with `{ "message": "Validation failed", "errors": [{ "field": "...", "message": "..." }] }` - errors in schema order.
- A missing/non-object body is treated as `{}`.

## How to work

```bash
npm test -- 206     # run the tests of this problem (replace 206 by the problem number)
```

- Implement the code in `src/validate.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 206` show the reference solution.
