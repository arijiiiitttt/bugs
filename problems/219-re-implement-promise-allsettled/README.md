# Re-implement Promise.allSettled

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `allSettledLite(values)` in `src/allSettledLite.js` **without using `Promise.allSettled`** (the tests make it throw).

It takes an iterable of promises and/or plain values and returns a promise that **never rejects** and resolves, after every input has settled, with an array - in input order - of:
- `{ status: 'fulfilled', value }`
- `{ status: 'rejected', reason }`

Plain values count as fulfilled. An empty iterable resolves to `[]`.

## How to work

```bash
npm test -- 219     # run the tests of this problem (replace 219 by the problem number)
```

- Implement the code in `src/allSettledLite.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 219` show the reference solution.
