# Implement query string parse and stringify

**Track:** Core JS utilities &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
In `src/querystring.js` export `parse(qs)` and `stringify(obj)`.

### parse
- A leading `?` is ignored. `parse('a=1&b=2')` -> `{ a: '1', b: '2' }`.
- Percent-escapes are decoded and `+` means a space: `'q=hello+world%21'` -> `{ q: 'hello world!' }`.
- A key without `=` gets `''` (`'flag'` -> `{ flag: '' }`). Empty segments (`'a=1&&b=2'`) are skipped.
- A repeated key collects values into an array in order (`'t=a&t=b'` -> `{ t: ['a', 'b'] }`).
- Only the **first** `=` splits key and value (`'a=b=c'` -> `{ a: 'b=c' }`).

### stringify
- Keys and values are encoded with `encodeURIComponent`; arrays repeat the key (`{ t: ['a', 'b'] }` -> `'t=a&t=b'`).
- `undefined` and `null` values (also inside arrays) are skipped. Numbers and booleans are converted to strings. Output order follows key order, with no leading `?`.
- `stringify(parse(x))` should round-trip for simple inputs.

## How to work

```bash
npm test -- 251     # run the tests of this problem (replace 251 by the problem number)
```

- Implement the code in `src/querystring.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 251` show the reference solution.
