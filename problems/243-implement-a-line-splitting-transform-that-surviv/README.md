# Implement a line-splitting Transform that survives chunk boundaries

**Track:** Events & streams &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `createLineSplitter()` in `src/lineSplitter.js`. It returns a `Transform` that receives text in arbitrarily sized chunks (Buffers or strings) and emits **one string per line** (its readable side is in object mode).

### Rules
- Lines end with `\n`. A trailing `\r` (CRLF files) is removed from the emitted line.
- A line may be split across any number of chunks - including in the middle of a multi-byte UTF-8 character.
- Empty lines in the middle are emitted as `''`.
- A final line **without** trailing newline is emitted when the stream ends. A trailing newline does **not** create an extra empty line.
- No input produces no lines.

Example: chunks `['ab', 'c\nde', 'f\n\ngh']` -> `['abc', 'def', '', 'gh']`.

## How to work

```bash
npm test -- 243     # run the tests of this problem (replace 243 by the problem number)
```

- Implement the code in `src/lineSplitter.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 243` show the reference solution.
