# Fix: sendAll resolves before the emails are sent

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`sendAll(users, send)` in `src/sendAll.js` calls the async function `send(user)` for every user and should resolve with the array of **user ids, in the same order as the input**, once **all** sends have finished.

### Symptom
Callers report that `sendAll` resolves immediately with an empty array, long before the emails are actually sent. If a send fails the error is not reported to the caller either.

Fix the bug. Sends may run concurrently, but the result order must match the input order and a failing send must reject the returned promise.

## How to work

```bash
npm test -- 215     # run the tests of this problem (replace 215 by the problem number)
```

- Implement the code in `src/sendAll.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 215` show the reference solution.
