# Implement abortable(promise, signal)

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `abortable(promise, signal)` in `src/abortable.js`. It returns a promise that follows `promise` but rejects as soon as the AbortSignal `signal` is aborted.

### Rules
- If `signal` is already aborted, return a promise rejected with `signal.reason`.
- If `signal` aborts first, reject with `signal.reason` (so `controller.abort()` gives an `AbortError` and `controller.abort(err)` gives `err`).
- If `promise` settles first, settle the same way **and remove the "abort" listener** from the signal (no listener leak).

## How to work

```bash
npm test -- 230     # run the tests of this problem (replace 230 by the problem number)
```

- Implement the code in `src/abortable.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 230` show the reference solution.
