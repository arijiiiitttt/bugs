# Implement slugify(text)

**Track:** Core JS utilities &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `slugify(text)` in `src/slugify.js` to produce URL-friendly slugs.

### Rules
- Lower-case the text and strip accents (`'Crème Brûlée'` becomes `'creme-brulee'`).
- Every run of characters that are not `a-z` or `0-9` becomes a single `-`.
- No leading or trailing `-`.
- Input that yields nothing (`''`, `'  '`, `'!!!'`) gives `''`.
- A non-string argument throws a `TypeError`.

## How to work

```bash
npm test -- 248     # run the tests of this problem (replace 248 by the problem number)
```

- Implement the code in `src/slugify.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 248` show the reference solution.
