# Implement debounce with an injectable scheduler

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `debounce(fn, wait, scheduler)` in `src/debounce.js`. The `scheduler` is an object `{ setTimeout, clearTimeout }` (default: the real global functions) - the tests pass a fake one so no real time is needed.

### Rules
- The returned function delays calling `fn` until `wait` ms have passed without a new call (**trailing edge**). Every call cancels the previously scheduled timer and schedules a new one with `scheduler.setTimeout(callback, wait)`.
- `fn` is called with the **latest** arguments and the `this` of the latest call.
- `debounced.cancel()` drops the pending call.
- `debounced.flush()` runs the pending call immediately and returns its result (if nothing is pending it does nothing and returns `undefined`).

## How to work

```bash
npm test -- 227     # run the tests of this problem (replace 227 by the problem number)
```

- Implement the code in `src/debounce.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 227` show the reference solution.
