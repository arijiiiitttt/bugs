# Implement a Content-Length based body size limit middleware

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement `limitBody(maxBytes)` in `src/limitBody.js`. It must run **before** `express.json()` and reject oversized uploads without reading them.

### Rules
| Situation | Response |
|---|---|
| `POST`, `PUT` or `PATCH` without a `Content-Length` header (e.g. chunked) | **411** `{ "message": "Length Required" }` |
| `Content-Length` is not a non-negative integer | **400** `{ "message": "Invalid Content-Length" }` |
| `Content-Length > maxBytes` | **413** `{ "message": "Payload Too Large" }` |
| `Content-Length <= maxBytes` (exactly `maxBytes` is fine) | continue with `next()` |
| `GET`, `HEAD`, `DELETE`, `OPTIONS` without `Content-Length` | continue with `next()` |

## How to work

```bash
npm test -- 207     # run the tests of this problem (replace 207 by the problem number)
```

- Implement the code in `src/limitBody.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 207` show the reference solution.
