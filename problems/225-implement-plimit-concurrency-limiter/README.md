# Implement pLimit (concurrency limiter)

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `pLimit(concurrency)` in `src/pLimit.js`. It returns a function `limit(fn, ...args)` that calls `fn(...args)` and returns a promise for its result, but **never runs more than `concurrency` calls at the same time**. Extra calls wait in a FIFO queue.

### Rules
- Calls start in the order they were submitted.
- When a call finishes (resolves **or** rejects) the next queued call starts. A rejection only rejects that call's promise.
- `limit.activeCount` = number of running calls, `limit.pendingCount` = number of queued calls.
- `concurrency` must be a positive integer, otherwise throw a `TypeError`.
- `fn` may throw synchronously - that must reject the returned promise.

## How to work

```bash
npm test -- 225     # run the tests of this problem (replace 225 by the problem number)
```

- Implement the code in `src/pLimit.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 225` show the reference solution.
