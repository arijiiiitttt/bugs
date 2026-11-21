# Fix: every route answers "Route not found"

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
`src/app.js` builds an Express app with a few routes and a JSON 404 fallback.

### Expected behaviour
| Request | Response |
|---|---|
| `GET /` | 200 `{ "name": "api" }` |
| `GET /ping` | 200 text `pong` |
| `GET /api/items` | 200 `[1, 2, 3]` |
| anything else | 404 `{ "message": "Route not found" }` |

### Problem
After a refactor **every** URL, including `/` and `/ping`, answers 404 `Route not found`. Fix `src/app.js`.

## How to work

```bash
npm test -- 203     # run the tests of this problem (replace 203 by the problem number)
```

- Implement the code in `src/app.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 203` show the reference solution.
