# Implement collect(stream) to gather all chunks

**Track:** Events & streams &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `collect(stream)` in `src/collect.js`. It reads a Readable stream to the end and resolves with an **array of all chunks** in order.

### Rules
- Works for object-mode and byte streams (chunks are returned as they are emitted).
- An empty stream resolves to `[]`.
- If the stream emits an error (or is destroyed with an error) the promise rejects with that error.

## How to work

```bash
npm test -- 239     # run the tests of this problem (replace 239 by the problem number)
```

- Implement the code in `src/collect.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 239` show the reference solution.
