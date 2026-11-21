# Fix sortByScore

**Track:** Algorithms & data structures &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`sortByScore(players)` in `src/sortByScore.js` takes `[{name, score}]` and must return a **new** array ordered by score descending; players with equal scores are ordered by name ascending (plain `<` / `>` string comparison).

### Symptoms
- The result is sometimes not in score order, and equal scores are not alphabetical.
- After calling the function the caller's original array has been reordered.

## How to work

```bash
npm test -- 258     # run the tests of this problem (replace 258 by the problem number)
```

- Implement the code in `src/sortByScore.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 258` show the reference solution.
