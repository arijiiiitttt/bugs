# Implement a tiny {{mustache}} template engine

**Track:** Core JS utilities &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `render(template, data)` in `src/template.js`.

### Rules
- `{{ name }}` is replaced by the value found at that path in `data`. Dots navigate nested objects (`{{ user.address.city }}`) and whitespace inside the braces is optional.
- Values are **HTML-escaped** (`&`, `<`, `>`, `"`, `'` become `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`).
- `{{{ name }}}` (triple braces) inserts the value **unescaped**.
- Missing paths, `null` and `undefined` render as an empty string. `0` and `false` render as `'0'` and `'false'`.
- Everything else in the template is copied verbatim. Escaped output must never be re-processed as a template.

## How to work

```bash
npm test -- 250     # run the tests of this problem (replace 250 by the problem number)
```

- Implement the code in `src/template.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 250` show the reference solution.
