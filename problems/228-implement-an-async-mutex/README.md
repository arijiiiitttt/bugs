# Implement an async Mutex

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement the class `Mutex` in `src/mutex.js` with:

- `runExclusive(fn)` - runs the (sync or async) function `fn` once all previously submitted functions have **finished**, and returns a promise for its result.
- `isLocked` (getter) - `true` while any function is running or waiting for its turn.

### Rules
- Functions run strictly one at a time, in submission order.
- If `fn` throws or rejects, the returned promise rejects with the same error **and the next waiting function still runs**.

## How to work

```bash
npm test -- 228     # run the tests of this problem (replace 228 by the problem number)
```

- Implement the code in `src/mutex.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 228` show the reference solution.
