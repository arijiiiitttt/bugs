# Implement deepEqual for objects, collections and cycles

**Track:** Core JS utilities &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `deepEqual(a, b)` in `src/deepEqual.js` returning `true` when two values are structurally equal.

### Rules
- Primitives compare with `===`, except that `NaN` equals `NaN`.
- Objects must have the same prototype, the same own enumerable keys (order does not matter) and deeply equal values. A key holding `undefined` is **not** equal to a missing key.
- Arrays compare element by element (and by length).
- `Date` compares by time value.
- `Map` and `Set` compare by size and contents. Keys and Set members are matched by identity (`has`); Map values are compared deeply.
- Circular structures must not cause infinite recursion: two cyclic structures with the same shape are equal.

## How to work

```bash
npm test -- 253     # run the tests of this problem (replace 253 by the problem number)
```

- Implement the code in `src/deepEqual.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 253` show the reference solution.
