# Blog Platform: GET by id returns the owner as a raw id

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Blog Platform** where users can discover, create and manage posts.

**Problem:** The detail page cannot show the author because `author` is only an id.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 056             # run the tests of this problem (replace 056 by the problem number)
DEBUG=1 npm test -- 056     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 056` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Post ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`published: false`).

## Expected API behaviour

### GET /api/posts/:id

**Purpose:** Returns a single post (public endpoint, no header needed). Works for hidden items (`published: false`) too.

**Success response (200)**
```json
{ "post": { /* full post, author populated with _id, name, email, bio */ } }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid post ID" }` |
| post does not exist | 404 | `{ "message": "Post not found" }` |

