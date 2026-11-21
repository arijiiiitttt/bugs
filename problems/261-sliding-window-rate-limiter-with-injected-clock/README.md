# Sliding window rate limiter with injected clock

**Track:** Algorithms & data structures &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `createRateLimiter({ limit, windowMs, now })` in `src/rateLimiter.js`. It returns an object with `allow(key)`.

### Rules
- `now` is a function returning the current time in ms (injected so tests control time; default `Date.now`).
- Sliding window **log**: `allow(key)` returns `true` and records the request if fewer than `limit` *allowed* requests happened for that key in the last `windowMs`; otherwise `false` (rejected calls are **not** recorded).
- A request made exactly `windowMs` ago is already expired (window is `(t - windowMs, t]`).
- Keys are independent.
- `limit` and `windowMs` must be positive integers, otherwise throw `RangeError`.
- Add `remaining(key)` returning how many more requests are currently allowed for that key.

## How to work

```bash
npm test -- 261     # run the tests of this problem (replace 261 by the problem number)
```

- Implement the code in `src/rateLimiter.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 261` show the reference solution.
