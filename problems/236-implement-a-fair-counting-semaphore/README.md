# Implement a fair counting Semaphore

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement the class `Semaphore` in `src/semaphore.js`.

- `new Semaphore(max)` - `max` must be a positive integer, otherwise throw a `RangeError`.
- `acquire()` - returns a promise that resolves with a `release` function once a permit is available.
- `available` (getter) - the number of free permits right now.
- `withPermit(fn)` - acquires a permit, awaits `fn()` and always releases, then resolves/rejects with `fn`'s outcome.

### Rules
- Waiters are served in **FIFO** order (the first to wait gets the first free permit).
- A released permit goes **directly** to the first waiter, so `available` does not increase while someone waits.
- The `release` function is **idempotent**: calling it twice releases only one permit.

## How to work

```bash
npm test -- 236     # run the tests of this problem (replace 236 by the problem number)
```

- Implement the code in `src/semaphore.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 236` show the reference solution.
