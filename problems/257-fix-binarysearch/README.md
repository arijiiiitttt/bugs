# Fix binarySearch

**Track:** Algorithms & data structures &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`binarySearch(arr, target)` in `src/binarySearch.js` should return the index of `target` in an ascending sorted array, or `-1` when it is absent.

### Symptoms
- Searching a one-element array for its only element returns `-1`.
- Looking for the last element of some arrays reports it as missing.
- Other lookups work fine.

## How to work

```bash
npm test -- 257     # run the tests of this problem (replace 257 by the problem number)
```

- Implement the code in `src/binarySearch.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 257` show the reference solution.
