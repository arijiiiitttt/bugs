# Implement retry with exponential backoff

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `retry(fn, options)` in `src/retry.js`.

`fn(attempt)` is an async function; `attempt` starts at 1.

### Options (all optional)
| option | default | meaning |
|---|---|---|
| `retries` | 3 | number of **re-tries** after the first attempt (so up to `retries + 1` calls) |
| `delay` | 10 | wait before the first re-try (ms) |
| `factor` | 2 | each wait is `factor` times longer than the previous |
| `shouldRetry(err)` | always true | return false to stop immediately |
| `sleep(ms)` | real timer | injectable wait function (the tests use it) |

### Rules
- Resolve with the first successful result.
- Wait `delay * factor^(n-1)` ms before re-try number `n` using `sleep`.
- When all attempts fail (or `shouldRetry` returns false) reject with the **last** error and do not sleep again.

## How to work

```bash
npm test -- 224     # run the tests of this problem (replace 224 by the problem number)
```

- Implement the code in `src/retry.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 224` show the reference solution.
