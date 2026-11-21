# Fix: notes API ignores the body and skips authentication

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
`src/app.js` exports `createApp()`, a small notes API.

### Expected behaviour
| Request | Response |
|---|---|
| `GET /health` | 200 `ok` (public) |
| any `/api/*` request without `Authorization: Bearer secret-token` | 401 `{ "message": "Unauthorized" }` |
| `GET /api/notes` (authorized) | 200 list of notes |
| `POST /api/notes` `{ "text": "hi" }` (authorized) | 201 `{ "id": 1, "text": "hi", "by": "ann" }` |
| `POST /api/notes` without `text` | 400 `{ "message": "text is required" }` |

### Problem
- Anybody can read `/api/notes` without a token.
- Authorized `POST` requests fail with a 500 error or complain that `text` is missing although it was sent.

Fix the bug(s) in `src/app.js` (the route handlers themselves are fine).

## How to work

```bash
npm test -- 210     # run the tests of this problem (replace 210 by the problem number)
```

- Implement the code in `src/app.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 210` show the reference solution.
