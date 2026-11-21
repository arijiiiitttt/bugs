# Implement a request-id middleware

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement the middleware `requestId(req, res, next)` in `src/requestId.js` to make requests traceable across services.

### Rules
- If the client sent an `x-request-id` header whose value matches `/^[A-Za-z0-9._-]{1,64}$/`, reuse it.
- Otherwise generate a fresh unique id (e.g. `crypto.randomUUID()`). Invalid values (spaces, too long, ...) are **replaced**, never echoed.
- Store the id on `req.id` and send it back in the `x-request-id` response header.
- Always call `next()`.

## How to work

```bash
npm test -- 198     # run the tests of this problem (replace 198 by the problem number)
```

- Implement the code in `src/requestId.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 198` show the reference solution.
