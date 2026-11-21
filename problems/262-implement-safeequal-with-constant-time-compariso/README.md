# Implement safeEqual with constant-time comparison

**Track:** Security & auth &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Comparing secrets (tokens, MACs, API keys) with `===` leaks timing information. Implement `safeEqual(a, b)` in `src/safeEqual.js`.

### Rules
- Accepts strings or Buffers (any mix). Strings are compared as UTF-8 bytes.
- Returns `true` only when the bytes are identical, `false` otherwise.
- It must **never throw**: inputs of different length simply return `false` (`crypto.timingSafeEqual` throws on length mismatch!).
- Any other input type (numbers, `null`, objects) returns `false`.
- The comparison time must not depend on where the first differing byte is.

## How to work

```bash
npm test -- 262     # run the tests of this problem (replace 262 by the problem number)
```

- Implement the code in `src/safeEqual.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 262` show the reference solution.
