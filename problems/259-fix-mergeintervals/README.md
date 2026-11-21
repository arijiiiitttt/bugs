# Fix mergeIntervals

**Track:** Algorithms & data structures &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`mergeIntervals(intervals)` in `src/mergeIntervals.js` should merge all overlapping ranges `[start, end]` and return them sorted by start.

### Rules
- Intervals that touch count as overlapping: `[1,2],[2,3]` -> `[1,3]`.
- The input array and its inner arrays must not be modified.

### Symptoms
- `[[1,4],[2,3]]` comes back as `[[1,3]]`.
- `[[8,10],[1,3],[2,6]]` does not give `[[1,6],[8,10]]`.
- Touching intervals stay separate.
- After calling it, the caller's array is in a different order.

## How to work

```bash
npm test -- 259     # run the tests of this problem (replace 259 by the problem number)
```

- Implement the code in `src/mergeIntervals.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 259` show the reference solution.
