# Fix: readText garbles accented and non-Latin characters

**Track:** Events & streams &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`readText(readable)` in `src/readText.js` reads a stream to the end and resolves with its content as a UTF-8 string. Chunks can be `Buffer`s (the default) or strings (when the stream has an encoding set).

### Symptom
Texts such as `"héllo wörld € 日本"` sometimes come out with `�` replacement characters in the middle of words - it depends on how the data happened to be split into chunks (network packets, file read sizes...). Plain ASCII works fine. Fix `readText`.

## How to work

```bash
npm test -- 242     # run the tests of this problem (replace 242 by the problem number)
```

- Implement the code in `src/readText.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 242` show the reference solution.
