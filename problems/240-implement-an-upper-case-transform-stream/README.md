# Implement an upper-case Transform stream

**Track:** Events & streams &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `createUpperCase()` in `src/upperCase.js`. It returns a `Transform` stream that converts everything written to it to **upper case**.

### Rules
- Accepts strings and Buffers.
- The output chunks are upper-cased text (strings or Buffers are both fine).
- Must be usable in `.pipe()` / `pipeline()` chains and end correctly when the writable side ends.

## How to work

```bash
npm test -- 240     # run the tests of this problem (replace 240 by the problem number)
```

- Implement the code in `src/upperCase.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 240` show the reference solution.
