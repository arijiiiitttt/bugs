# Node.js's bugs Practice Pack - 289 HackerRank style problems

Practice problems in the style of the "Blog Platform (MERN): Post Creation" task:
you get a project with a README spec, some code and a test-suite, and you make the tests pass.

Two kinds of problems:
- **Fix the bug** - the code exists but is broken (the symptom is described, the cause is not).
- **Implement from spec** - the files contain stubs that throw `Not implemented`.

## Setup

```bash
npm install            # once (installs Express, needed by the API problems)
npm run list           # all problems
npm run list -- hard   # filter: easy | medium | hard | any word of the title/track
npm test -- 001        # run the tests of problem 001
npm test -- 001 --watch
DEBUG=1 npm test -- 001   # (Express problems) also print server-side errors
```

Requires Node.js 20+ (tested on 22). Tests use the built-in `node:test` runner - no Jest/Mocha needed.

## How to practise

1. Open `problems/<number>-<name>/README.md`.
2. Work **only inside `src/`**. Do not edit `test/`.
3. Run `npm test -- <number>`. Read the first failing assertion, fix, repeat.
4. Stuck for 10+ minutes? Read `HINT.md`. Finished? Compare with `solution/EXPLANATION.md`.
5. To check that a problem is solvable: `npm run solution -- <number>` runs the tests against the reference solution.

Tip: time yourself like in a real assessment - Easy 10-15 min, Medium 20-30 min, Hard 30-45 min.

## Contents

| Track | Easy | Medium | Hard | Total |
|---|---|---|---|---|
| Express API bug-fix | 80 | 86 | 50 | 216 |
| Express middleware & routing | 8 | 7 | 1 | 16 |
| Async & promises | 9 | 11 | 4 | 24 |
| Events & streams | 4 | 4 | 0 | 8 |
| Core JS utilities | 5 | 2 | 2 | 9 |
| Algorithms & data structures | 5 | 3 | 0 | 8 |
| Security & auth | 5 | 3 | 0 | 8 |
| **Total** | 116 | 116 | 57 | **289** |

The Express API problems all share the same project layout (`app.js`, `routes.js`, `middleware.js`, `controller.js`, `model.js`, `store.js`) in 8 different domains (posts, recipes, products, tasks, courses, events, books, questions), like the original blog task: header-based auth (`x-user-id`), populated owners, pagination, ownership checks.
