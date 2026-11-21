# Implement a fail-fast promise pool (runPool)

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `runPool(tasks, limit)` in `src/pool.js`. `tasks` is an array of functions returning promises. Run them with **at most `limit` running at once** and resolve with the results **in input order**.

### Rules
- Start tasks in input order, as soon as a slot is free.
- **Fail fast**: when a task rejects, `runPool` rejects with that error and **no further task is started** (tasks already running are left alone).
- `tasks = []` resolves to `[]`.
- `limit` must be a positive integer, otherwise reject with a `TypeError`.

## How to work

```bash
npm test -- 226     # run the tests of this problem (replace 226 by the problem number)
```

- Implement the code in `src/pool.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 226` show the reference solution.
