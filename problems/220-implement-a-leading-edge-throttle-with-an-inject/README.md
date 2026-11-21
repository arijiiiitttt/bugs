# Implement a leading-edge throttle with an injectable clock

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `throttle(fn, wait, now)` in `src/throttle.js`. `now` is a function returning the current time in ms (default `Date.now`) so that tests can use a fake clock.

### Rules
- The first call runs `fn` immediately.
- Calls that arrive less than `wait` ms after the **last executed** call are ignored; they return the result of the last execution.
- A call at least `wait` ms after the last executed call runs `fn` again (with its own arguments and `this`).

## How to work

```bash
npm test -- 220     # run the tests of this problem (replace 220 by the problem number)
```

- Implement the code in `src/throttle.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 220` show the reference solution.
