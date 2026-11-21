# Implement lowerBound and upperBound

**Track:** Algorithms & data structures &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
In `src/bounds.js` implement two binary-search helpers over an ascending sorted array of numbers.

- `lowerBound(arr, x)`: the first index `i` with `arr[i] >= x`.
- `upperBound(arr, x)`: the first index `i` with `arr[i] > x`.

Both return `arr.length` when no such index exists. With duplicates, `upperBound - lowerBound` is the count of `x`. Must be O(log n).

## How to work

```bash
npm test -- 256     # run the tests of this problem (replace 256 by the problem number)
```

- Implement the code in `src/bounds.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 256` show the reference solution.
