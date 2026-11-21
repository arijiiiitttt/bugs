# Implement a response envelope middleware (res.ok, res.created, res.fail)

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement the middleware `envelope(req, res, next)` in `src/envelope.js`. It adds three helpers to `res` so every endpoint answers in the same shape.

| Helper | Status | Body |
|---|---|---|
| `res.ok(data, meta?)` | 200 | `{ "success": true, "data": data }` plus `"meta": meta` **only if** `meta !== undefined` |
| `res.created(data)` | 201 | `{ "success": true, "data": data }` |
| `res.fail(status, message, details?)` | `status` | `{ "success": false, "error": { "message": message } }` plus `"details"` inside `error` only if given |

Each helper sends the response (and returns it). The middleware must call `next()`.

## How to work

```bash
npm test -- 204     # run the tests of this problem (replace 204 by the problem number)
```

- Implement the code in `src/envelope.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 204` show the reference solution.
