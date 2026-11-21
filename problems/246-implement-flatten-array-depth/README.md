# Implement flatten(array, depth)

**Track:** Core JS utilities &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `flatten(array, depth = 1)` in `src/flatten.js` and also export `flattenDeep(array)` which flattens completely.

### Rules
- `flatten([1, [2, [3]]])` gives `[1, 2, [3]]` (one level by default).
- `flatten(arr, 0)` returns a shallow copy; `depth` may be `Infinity`.
- Only arrays are flattened. Objects, strings and `Set` values stay as they are.
- Do not mutate the input and do not use `Array.prototype.flat`.

## How to work

```bash
npm test -- 246     # run the tests of this problem (replace 246 by the problem number)
```

- Implement the code in `src/flatten.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 246` show the reference solution.
