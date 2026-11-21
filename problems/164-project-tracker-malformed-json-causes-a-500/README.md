# Project Tracker: Malformed JSON causes a 500

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Project Tracker** where users can discover, create and manage tasks.

**Problem:** Sending a request with broken JSON returns 500 instead of a 400 "Invalid JSON" error.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 164             # run the tests of this problem (replace 164 by the problem number)
DEBUG=1 npm test -- 164     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 164` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Task ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`open: false`).

## Expected API behaviour

### Application behaviour

| When | Status | Body |
|---|---|---|
| `GET /health` | 200 | `{ "status": "ok" }` |
| request body is not valid JSON | 400 | `{ "message": "Invalid JSON" }` |
| unknown route | 404 | `{ "message": "Route not found" }` |
| model validation error (e.g. invalid priority) | 400 | `{ "message": "<validation message>" }` |
| any other error | 500 | `{ "message": "Internal Server Error" }` |

