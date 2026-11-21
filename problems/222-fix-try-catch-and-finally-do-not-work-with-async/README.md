# Fix: try/catch and finally do not work with async tasks

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`src/config.js` exports two helpers that take **async** functions:

- `loadConfig(fetchConfig, fallback)` resolves with `await fetchConfig()`, or with `fallback` if `fetchConfig` rejects.
- `withCleanup(task, cleanup)` runs `task()`, resolves with its result and calls `cleanup()` **after** the task has finished (success or failure).

### Symptom
When `fetchConfig` fails, `loadConfig` rejects instead of returning the fallback. `cleanup` is called while the task is still running (for example it closes a connection that is still in use). Fix both functions.

## How to work

```bash
npm test -- 222     # run the tests of this problem (replace 222 by the problem number)
```

- Implement the code in `src/config.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 222` show the reference solution.
