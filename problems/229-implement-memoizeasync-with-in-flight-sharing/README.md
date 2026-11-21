# Implement memoizeAsync with in-flight sharing

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `memoizeAsync(fn, { keyFn })` in `src/memoizeAsync.js`. `fn` is an async function.

### Rules
- The cache key is `keyFn(...args)` (default: the first argument).
- Calls with the same key while a call is **in flight** share the **same promise** - `fn` runs only once.
- Successful results stay cached; later calls with that key do not call `fn` again.
- **Rejections are not cached**: after a failure the next call with that key calls `fn` again.
- `memoized.clear()` empties the cache.

## How to work

```bash
npm test -- 229     # run the tests of this problem (replace 229 by the problem number)
```

- Implement the code in `src/memoizeAsync.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 229` show the reference solution.
