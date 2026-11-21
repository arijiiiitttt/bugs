# Implement deepClone with Dates, Maps, Sets and cycles

**Track:** Core JS utilities &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `deepClone(value)` in `src/deepClone.js`. It returns a structurally identical copy that shares no mutable object with the original.

### Rules
- Primitives and functions are returned as is.
- Plain objects, arrays, `Date`, `RegExp`, `Map` and `Set` are cloned recursively (Map keys and values, Set members included).
- Circular references are supported: the clone must contain the same cycle, pointing to the clone.
- An object referenced twice in the input is cloned **once**; both places in the output point to the same clone.
- Do not use `structuredClone` or `JSON`.

## How to work

```bash
npm test -- 252     # run the tests of this problem (replace 252 by the problem number)
```

- Implement the code in `src/deepClone.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 252` show the reference solution.
