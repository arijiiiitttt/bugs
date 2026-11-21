# Fix: /users/me is swallowed by the /users/:id route

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
The API in `src/app.js` exports `createApp()`.

### Expected behaviour
| Request | Response |
|---|---|
| `GET /users/me` | 200 `{ "me": true }` |
| `GET /users/42` | 200 `{ "id": 42 }` |
| `GET /users/abc` | 400 `{ "message": "Invalid id" }` |
| `GET /users/7/posts` | 200 `{ "userId": 7, "posts": [] }` |

### Problem
Users report that the "my profile" page is broken: `GET /users/me` answers **400 Invalid id** instead of the profile. All other routes work.

Fix the bug in `src/app.js`.

## How to work

```bash
npm test -- 202     # run the tests of this problem (replace 202 by the problem number)
```

- Implement the code in `src/app.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 202` show the reference solution.
