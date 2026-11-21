# Library Catalog: GET by id returns the owner as a raw id

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Library Catalog** where users can discover, create and manage books.

**Problem:** The detail page cannot show the author because `lister` is only an id.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 055             # run the tests of this problem (replace 055 by the problem number)
DEBUG=1 npm test -- 055     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 055` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Book ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`available: false`).

## Expected API behaviour

### GET /api/books/:id

**Purpose:** Returns a single book (public endpoint, no header needed). Works for hidden items (`available: false`) too.

**Success response (200)**
```json
{ "book": { /* full book, lister populated with _id, name, email, bio */ } }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid book ID" }` |
| book does not exist | 404 | `{ "message": "Book not found" }` |

