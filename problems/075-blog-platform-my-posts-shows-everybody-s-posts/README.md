# Blog Platform: "My posts" shows everybody's posts

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Blog Platform** where users can discover, create and manage posts.

**Problem:** The "my posts" page lists items of all users.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 075             # run the tests of this problem (replace 075 by the problem number)
DEBUG=1 npm test -- 075     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 075` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Post ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`published: false`).

## Expected API behaviour

### GET /api/posts/mine

**Purpose:** Returns every post owned by the authenticated user - **including hidden ones** (`published: false`) - newest first.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Success response (200)**
```json
{ "posts": [ /* post objects, author populated */ ] }
```

Not authenticated: 401 `{ "message": "Not authenticated" }`.

