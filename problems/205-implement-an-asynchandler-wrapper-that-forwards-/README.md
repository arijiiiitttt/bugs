# Implement an asyncHandler wrapper that forwards errors to next()

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement `asyncHandler(fn)` in `src/asyncHandler.js`. It wraps a route handler `fn(req, res, next)` (sync **or** async) and returns a new Express handler.

### Rules
- The returned function must have the Express signature `(req, res, next)` (`length === 3`) and call `fn(req, res, next)` with the very same arguments.
- If `fn` throws synchronously **or** returns a promise that rejects, call `next(err)` **exactly once** with that error. The wrapper itself must never throw nor reject.
- If `fn` succeeds the wrapper must **not** call `next` by itself (the handler decides).
- The returned promise resolves after the error was forwarded, so callers can `await` it.

## How to work

```bash
npm test -- 205     # run the tests of this problem (replace 205 by the problem number)
```

- Implement the code in `src/asyncHandler.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 205` show the reference solution.
