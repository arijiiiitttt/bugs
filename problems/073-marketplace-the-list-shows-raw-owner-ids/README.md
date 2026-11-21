# Marketplace: The list shows raw owner ids

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Marketplace** where users can discover, create and manage products.

**Problem:** The list page cannot show the owner names.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 073             # run the tests of this problem (replace 073 by the problem number)
DEBUG=1 npm test -- 073     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 073` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Product ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`active: false`).

## Expected API behaviour

### GET /api/products

**Purpose:** Public, paginated list of products that are `active: true`, newest first (by `createdAt`).

**Query parameters**

| Param | Meaning |
|---|---|
| `department` | exact match filter, e.g. `?department=Electronics` |
| `q` | case-insensitive search in `name` |
| `page` | integer >= 1 (default 1) |
| `limit` | integer >= 1 (default 10, **maximum 50** - larger values are capped) |

**Success response (200)**
```json
{
  "products": [ /* product objects, seller populated */ ],
  "page": 1,
  "limit": 10,
  "total": 5,        // number of matching items (before pagination)
  "totalPages": 1    // Math.ceil(total / limit)
}
```

| When | Status | Body |
|---|---|---|
| page or limit is not a positive integer | 400 | `{ "message": "Invalid pagination parameters" }` |

