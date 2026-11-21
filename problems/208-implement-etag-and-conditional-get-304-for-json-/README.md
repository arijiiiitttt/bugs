# Implement ETag and conditional GET (304) for JSON responses

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement `etagJson(req, res, data)` in `src/etag.js`. Route handlers call it instead of `res.json(data)`.

### Rules
- Serialize `data` with `JSON.stringify`. The ETag is `W/"<first 16 hex chars of the sha1 of that JSON text>"` (weak validator). Equal data -> equal ETag, different data -> different ETag.
- Always send `ETag` and `Cache-Control: no-cache`.
- If the request has `If-None-Match` and it matches the ETag respond **304** with an empty body. `If-None-Match` may hold a comma separated list, `*` matches anything, and a tag matches whether or not the client prefixed it with `W/`.
- Otherwise respond **200** with `Content-Type: application/json` and the JSON text.

## How to work

```bash
npm test -- 208     # run the tests of this problem (replace 208 by the problem number)
```

- Implement the code in `src/etag.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 208` show the reference solution.
