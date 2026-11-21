# Fix: scheduled log entries appear in the wrong order

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`scheduleAll(log)` in `src/schedule.js` must push four labels to the array `log` using four different mechanisms, in this exact order:

1. `'sync'` - synchronously, before `scheduleAll` returns
2. `'micro'` - from a microtask (`queueMicrotask` or a promise callback)
3. `'immediate'` - from `setImmediate`
4. `'timeout'` - from a `setTimeout` of 150 ms

It returns a promise that resolves with `log` right after `'timeout'` was pushed.

### Symptom
The final log is `['micro', 'sync', 'immediate', 'timeout']`. Fix `scheduleAll` (understand why each label ends up where it does).

## How to work

```bash
npm test -- 221     # run the tests of this problem (replace 221 by the problem number)
```

- Implement the code in `src/schedule.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 221` show the reference solution.
