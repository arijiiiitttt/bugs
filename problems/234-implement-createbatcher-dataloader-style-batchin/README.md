# Implement createBatcher (DataLoader-style batching)

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `createBatcher(batchFn, options)` in `src/batcher.js`. `batchFn(keys)` is an async function that receives an array of keys and resolves with an array of values **in the same order**. `createBatcher` returns `load(key)` which returns a promise for the value of one key, but batches calls together.

### Rules
- All `load` calls made in the same synchronous turn (before the microtask queue is processed) are collected into **one** `batchFn` call.
- Duplicate keys in a batch are passed to `batchFn` **once**; all their callers get the same value.
- If the value for a key is an `Error` instance, only the promise(s) of that key reject with it.
- If `batchFn` rejects, or does not return an array of the same length as `keys` (use message `"batchFn must return an array of the same length"`), **all** promises of that batch reject.
- `options.maxBatchSize` (default `Infinity`) splits a batch into several `batchFn` calls of at most that many keys.
- Calls made in a later turn start a new batch.

## How to work

```bash
npm test -- 234     # run the tests of this problem (replace 234 by the problem number)
```

- Implement the code in `src/batcher.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 234` show the reference solution.
