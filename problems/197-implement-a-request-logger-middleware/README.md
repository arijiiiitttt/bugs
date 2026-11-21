# Implement a request logger middleware

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement `requestLogger(log)` in `src/logger.js`. It returns an Express middleware that reports every request **after the response has been sent**.

### Rules
- `log` is a function that receives one string per request: `"<METHOD> <originalUrl> <statusCode>"`, e.g. `"GET /api/x?y=1 201"`.
- Use `req.originalUrl` (it keeps the mount path and the query string).
- Log exactly once per request, when the response is finished (not before).
- The middleware must never block the request: always continue the chain.

## How to work

```bash
npm test -- 197     # run the tests of this problem (replace 197 by the problem number)
```

- Implement the code in `src/logger.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 197` show the reference solution.
