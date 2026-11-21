# Implement promiseTimeout with TimeoutError

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
In `src/timeout.js` export a class `TimeoutError` (extends `Error`, `name === 'TimeoutError'`, message `"Timed out after <ms>ms"`) and a function `promiseTimeout(promise, ms)`.

### Rules
- If `promise` settles within `ms` milliseconds, `promiseTimeout` settles the same way (value or rejection).
- Otherwise it rejects with a `TimeoutError`.
- The internal timer must be cleared once the promise has settled (no dangling timers, no late rejections).

## How to work

```bash
npm test -- 223     # run the tests of this problem (replace 223 by the problem number)
```

- Implement the code in `src/timeout.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 223` show the reference solution.
