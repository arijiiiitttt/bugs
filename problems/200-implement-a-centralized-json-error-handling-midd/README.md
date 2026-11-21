# Implement a centralized JSON error-handling middleware

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement the Express error middleware `errorHandler(err, req, res, next)` in `src/errorHandler.js`.

### Rules
- If the headers were already sent (`res.headersSent`) delegate with `next(err)`.
- The status is `err.status` or `err.statusCode` (first one that is an integer between 400 and 599), otherwise **500**.
- Body is `{ "message": ... }`:
  - status < 500: `err.message` is safe to show, except body-parser JSON errors (`err.type === "entity.parse.failed"`) which must read `"Invalid JSON"`.
  - status >= 500: never leak internals - always `"Internal Server Error"`.

## How to work

```bash
npm test -- 200     # run the tests of this problem (replace 200 by the problem number)
```

- Implement the code in `src/errorHandler.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 200` show the reference solution.
