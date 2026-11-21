# Fix: change listeners see stale counter values

**Track:** Events & streams &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`Counter` in `src/counter.js` extends `EventEmitter`. It has a `value` getter (starts at 0), `increment(by = 1)` and `reset()`.

Whenever the value **actually changes** it must emit `'change'` with `(newValue, oldValue)` - **after** the new value has been stored.

### Symptom
A listener that reads `counter.value` inside the `'change'` handler sees the **old** value. Also, `increment(0)` and `reset()` on an already-zero counter emit pointless `'change'` events. Fix the class.

## How to work

```bash
npm test -- 237     # run the tests of this problem (replace 237 by the problem number)
```

- Implement the code in `src/counter.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 237` show the reference solution.
