# Fix: unauthorized requests still reach the handler and some requests hang

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
`src/app.js` exports `createApp()` and a `stats` counter (`stats.handled` counts how many times the `POST /orders` handler ran; `createApp()` resets it).

### Expected behaviour
| Request | Response |
|---|---|
| `POST /orders` without header `x-token: secret` | 401 `{ "message": "Unauthorized" }` and the handler must **not** run |
| `POST /orders` with the token | 201 `{ "lang": "<lang>" }`, `lang` = first tag of `Accept-Language` lower-cased, default `"en"` |

### Problem
1. Unauthorized requests sometimes still create orders (`stats.handled` goes up).
2. Requests that do not send an `Accept-Language` header never get a response.

Fix `src/app.js`.

## How to work

```bash
npm test -- 211     # run the tests of this problem (replace 211 by the problem number)
```

- Implement the code in `src/app.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 211` show the reference solution.
