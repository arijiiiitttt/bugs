# Implement groupBy(items, keyOrFn)

**Track:** Core JS utilities &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `groupBy(items, keyOrFn)` in `src/groupBy.js`. It returns an object that maps each group key to the array of items in that group.

### Rules
- `keyOrFn` is either a function `(item, index) => key` or a string naming a property of each item.
- Items keep their original relative order inside each group.
- Keys are converted to strings by normal object semantics (`groupBy([1.5, 2.5], Math.floor)` gives keys `'1'` and `'2'`).
- An empty input gives `{}`. The input array is not mutated.

## How to work

```bash
npm test -- 245     # run the tests of this problem (replace 245 by the problem number)
```

- Implement the code in `src/groupBy.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 245` show the reference solution.
