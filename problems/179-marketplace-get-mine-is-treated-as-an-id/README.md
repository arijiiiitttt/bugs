# Marketplace: `GET /mine` is treated as an id

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Marketplace** where users can discover, create and manage products.

**Problem:** GET /api/products/mine answers 400 "Invalid product ID".

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 179             # run the tests of this problem (replace 179 by the problem number)
DEBUG=1 npm test -- 179     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 179` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Product ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`active: false`).

## Expected API behaviour

### GET /api/products/mine

**Purpose:** Returns every product owned by the authenticated user - **including hidden ones** (`active: false`) - newest first.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Success response (200)**
```json
{ "products": [ /* product objects, seller populated */ ] }
```

Not authenticated: 401 `{ "message": "Not authenticated" }`.

