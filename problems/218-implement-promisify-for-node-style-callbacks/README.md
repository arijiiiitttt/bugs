# Implement promisify for Node-style callbacks

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `promisify(fn)` in `src/promisify.js`. `fn` is a Node-style function whose **last argument** is a callback `(err, value) => void`. `promisify(fn)` returns a function that takes the same arguments **without** the callback and returns a promise.

### Rules
- Resolves with `value` when `err` is falsy, rejects with `err` otherwise.
- The returned function keeps the `this` it is called with (it is forwarded to `fn`).
- If `fn` throws synchronously, the returned promise rejects with that error.

## How to work

```bash
npm test -- 218     # run the tests of this problem (replace 218 by the problem number)
```

- Implement the code in `src/promisify.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 218` show the reference solution.
