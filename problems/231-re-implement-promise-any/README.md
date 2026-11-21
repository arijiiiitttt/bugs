# Re-implement Promise.any

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `promiseAny(iterable)` in `src/promiseAny.js` **without `Promise.any`** (the tests make it throw).

### Rules
- Resolves with the value of the **first promise that fulfils**. Plain values count as fulfilled.
- If **all** inputs reject, reject with an `AggregateError` whose `errors` array holds the rejection reasons **in input order** (message `"All promises were rejected"`).
- An empty iterable rejects with an `AggregateError` with an empty `errors` array.
- Rejections do not matter as long as one input fulfils.

## How to work

```bash
npm test -- 231     # run the tests of this problem (replace 231 by the problem number)
```

- Implement the code in `src/promiseAny.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 231` show the reference solution.
