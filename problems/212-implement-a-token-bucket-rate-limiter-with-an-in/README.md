# Implement a token-bucket rate limiter with an injectable clock

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement `createRateLimiter(options)` in `src/rateLimiter.js`. It returns an Express middleware that limits requests per client using a **token bucket**.

### Options
| Option | Meaning |
|---|---|
| `capacity` | bucket size = maximum burst (number of tokens) |
| `refillPerSec` | tokens added per second (fractional refill, continuous) |
| `now` | function returning the current time in ms (default `Date.now`) - tests inject a fake clock |
| `keyFn` | `(req) => key` that identifies the client (default `req.ip`) |

### Behaviour
- Every key has its own bucket, which **starts full**.
- Each request consumes 1 token. Tokens refill continuously (`elapsedSeconds * refillPerSec`) but never exceed `capacity`.
- If at least 1 token is available the request continues (`next()`) and the headers `X-RateLimit-Limit` (the capacity) and `X-RateLimit-Remaining` (`Math.floor` of the tokens left after this request) are set.
- Otherwise respond **429** with `{ "message": "Too Many Requests" }`, `X-RateLimit-Remaining: 0` and `Retry-After: <seconds>` = `Math.ceil` of the seconds until one whole token is available.
- A rejected request does not consume anything.

## How to work

```bash
npm test -- 212     # run the tests of this problem (replace 212 by the problem number)
```

- Implement the code in `src/rateLimiter.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 212` show the reference solution.
