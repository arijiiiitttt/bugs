# Implement pick and omit

**Track:** Core JS utilities &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `pick(obj, keys)` and `omit(obj, keys)` in `src/pickOmit.js`. Both return a **new** object.

### Rules
- `pick` keeps only the listed keys. Keys the object does not own are skipped (they do not appear as `undefined`). A key that exists with the value `undefined` is kept.
- `omit` keeps everything except the listed keys.
- Inherited properties are ignored by both (only own enumerable keys count).
- The input object is never mutated.

## How to work

```bash
npm test -- 247     # run the tests of this problem (replace 247 by the problem number)
```

- Implement the code in `src/pickOmit.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 247` show the reference solution.
