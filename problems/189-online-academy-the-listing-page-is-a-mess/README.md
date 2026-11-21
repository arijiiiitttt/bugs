# Online Academy: The listing page is a mess

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Online Academy** where users can discover, create and manage courses.

**Problem:** The public courses page has sorting, pagination and search problems at the same time.

There are **4 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 189             # run the tests of this problem (replace 189 by the problem number)
DEBUG=1 npm test -- 189     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 189` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Course ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`enrolling: false`).

## Expected API behaviour

### GET /api/courses

**Purpose:** Public, paginated list of courses that are `enrolling: true`, newest first (by `createdAt`).

**Query parameters**

| Param | Meaning |
|---|---|
| `level` | exact match filter, e.g. `?level=Beginner` |
| `q` | case-insensitive search in `title` |
| `page` | integer >= 1 (default 1) |
| `limit` | integer >= 1 (default 10, **maximum 50** - larger values are capped) |

**Success response (200)**
```json
{
  "courses": [ /* course objects, instructor populated */ ],
  "page": 1,
  "limit": 10,
  "total": 5,        // number of matching items (before pagination)
  "totalPages": 1    // Math.ceil(total / limit)
}
```

| When | Status | Body |
|---|---|---|
| page or limit is not a positive integer | 400 | `{ "message": "Invalid pagination parameters" }` |

