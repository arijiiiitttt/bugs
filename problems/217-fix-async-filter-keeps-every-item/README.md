# Fix: async filter keeps every item

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`keepValid(items, isValid)` in `src/validate.js` receives an **async** predicate and resolves with only the items for which the predicate resolves to a truthy value, keeping the input order.

### Symptom
Invalid items are never removed - the result always equals the input. Fix `keepValid`.

## How to work

```bash
npm test -- 217     # run the tests of this problem (replace 217 by the problem number)
```

- Implement the code in `src/validate.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 217` show the reference solution.
