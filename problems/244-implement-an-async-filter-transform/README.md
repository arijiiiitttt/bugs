# Implement an async filter Transform

**Track:** Events & streams &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `createFilter(predicate)` in `src/filterStream.js`. It returns an **object-mode** `Transform` that passes through only the chunks for which `await predicate(chunk)` is truthy.

### Rules
- `predicate` may be sync or async.
- The output order equals the input order, even if some predicate calls take longer than others.
- Falsy-but-valid chunks such as `0` or `''` are ordinary values: they are kept when the predicate accepts them.
- If `predicate` throws or rejects, the stream is destroyed with that error.

## How to work

```bash
npm test -- 244     # run the tests of this problem (replace 244 by the problem number)
```

- Implement the code in `src/filterStream.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 244` show the reference solution.
