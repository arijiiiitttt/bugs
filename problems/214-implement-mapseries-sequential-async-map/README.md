# Implement mapSeries (sequential async map)

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `mapSeries(items, fn)` in `src/mapSeries.js`. It calls `fn(item, index)` for every item **one after another** (the next call starts only when the previous promise has settled) and resolves with the array of results in input order.

### Rules
- `fn` may return a value or a promise.
- If `fn` rejects, `mapSeries` rejects with the same error and `fn` is **not** called for the remaining items.
- An empty array resolves to `[]`.

## How to work

```bash
npm test -- 214     # run the tests of this problem (replace 214 by the problem number)
```

- Implement the code in `src/mapSeries.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 214` show the reference solution.
