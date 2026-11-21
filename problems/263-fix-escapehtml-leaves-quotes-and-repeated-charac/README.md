# Fix: escapeHtml leaves quotes and repeated characters unescaped

**Track:** Security & auth &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
A comment widget renders user input with `escapeHtml` and `commentHtml` (`src/html.js`). Security testing found that:
- Input like `<b><b>` comes out as `&lt;b&gt;<b>`: only the first occurrence of a character seems to be handled.
- A user name such as `" onmouseover="alert(1)` breaks out of the `title` attribute of the rendered comment.
- Posting a comment with a missing text crashes the page.

Fix the module. `escapeHtml(value)` must escape `& < > " '` everywhere (`'` becomes `&#39;`), turn `null`/`undefined` into an empty string and stringify other values. `commentHtml(author, text)` must render `<p class="comment" title="AUTHOR">TEXT</p>` with both values escaped.

## How to work

```bash
npm test -- 263     # run the tests of this problem (replace 263 by the problem number)
```

- Implement the code in `src/html.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 263` show the reference solution.
