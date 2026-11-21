# Implement delay(ms, value)

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `delay(ms, value)` in `src/delay.js`. It returns a promise that resolves with `value` after `ms` milliseconds.

### Rules
- `await delay(20, 'hi')` resolves to `'hi'` after about 20 ms.
- If no value is given the promise resolves with `undefined`.
- `ms` must be a non-negative **integer**. Otherwise `delay` throws a `RangeError` **synchronously** (it does not return a rejected promise).

## How to work

```bash
npm test -- 213     # run the tests of this problem (replace 213 by the problem number)
```

- Implement the code in `src/delay.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 213` show the reference solution.
