# Fix: full names show up as "undefined undefined"

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`src/names.js` exports two helpers built on a repository whose `findUser(id)` is **asynchronous** (resolves to `{ first, last }` or `null`).

- `getFullName(id, repo)` resolves with `"First Last"` and rejects with `Error("User not found: <id>")` for unknown users.
- `getFullNames(ids, repo)` resolves with the array of full names in the same order as `ids`.

### Symptom
`getFullName` returns `"undefined undefined"`, never rejects for unknown users, and `getFullNames` returns an array of promises instead of strings. Fix the code.

## How to work

```bash
npm test -- 216     # run the tests of this problem (replace 216 by the problem number)
```

- Implement the code in `src/names.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 216` show the reference solution.
