# Implement camelCase, snake_case and kebab-case converters

**Track:** Core JS utilities &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
In `src/caseConvert.js` export `toCamel(str)`, `toSnake(str)` and `toKebab(str)`.

### Rules
Split the input into words, then re-join them:
- Words are separated by any non-alphanumeric characters (`_`, `-`, spaces, dots) **and** by case changes: `fooBar` -> `foo`, `Bar`; an acronym followed by a word splits before the last capital: `HTTPServer` -> `HTTP`, `Server`. Digits stay attached to the word before them (`get2Items` -> `get2`, `Items`).
- `toCamel`: first word lower-case, following words capitalised (rest lower-case): `'XMLHttpRequest'` -> `'xmlHttpRequest'`.
- `toSnake`: lower-case words joined by `_`. `toKebab`: lower-case words joined by `-`.
- An input without words gives `''`.

## How to work

```bash
npm test -- 249     # run the tests of this problem (replace 249 by the problem number)
```

- Implement the code in `src/caseConvert.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 249` show the reference solution.
