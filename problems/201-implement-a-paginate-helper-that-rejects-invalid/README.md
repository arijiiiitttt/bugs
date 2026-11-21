# Implement a paginate helper that rejects invalid query values

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement `paginate(items, query)` in `src/paginate.js`. `query` is `req.query`-like: `page` and `limit` may be strings or missing.

### Rules
- Defaults: `page = 1`, `limit = 10`. The maximum page size is **50** (larger limits are capped).
- `page` and `limit` must be integers >= 1. Otherwise throw an `Error` with `message "Invalid pagination parameters"` and `status = 400` (`"abc"`, `"0"`, `"2.5"`, `""`, `-1` are all invalid).
- Return `{ data, page, limit, total, totalPages }`: `limit` is the effective (capped) page size, `total` the number of items, `totalPages = Math.ceil(total / limit)`.
- A page beyond the end returns an empty `data` array (not an error). The input array must not be modified.

## How to work

```bash
npm test -- 201     # run the tests of this problem (replace 201 by the problem number)
```

- Implement the code in `src/paginate.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 201` show the reference solution.
