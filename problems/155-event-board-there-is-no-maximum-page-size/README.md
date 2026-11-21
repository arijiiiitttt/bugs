# Event Board: There is no maximum page size

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Event Board** where users can discover, create and manage events.

**Problem:** Clients can request `limit=100000` and receive huge responses. The maximum page size must be 50.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 155             # run the tests of this problem (replace 155 by the problem number)
DEBUG=1 npm test -- 155     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 155` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Event ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`public: false`).

## Expected API behaviour

### GET /api/events

**Purpose:** Public, paginated list of events that are `public: true`, newest first (by `createdAt`).

**Query parameters**

| Param | Meaning |
|---|---|
| `type` | exact match filter, e.g. `?type=Conference` |
| `q` | case-insensitive search in `name` |
| `page` | integer >= 1 (default 1) |
| `limit` | integer >= 1 (default 10, **maximum 50** - larger values are capped) |

**Success response (200)**
```json
{
  "events": [ /* event objects, organizer populated */ ],
  "page": 1,
  "limit": 10,
  "total": 5,        // number of matching items (before pagination)
  "totalPages": 1    // Math.ceil(total / limit)
}
```

| When | Status | Body |
|---|---|---|
| page or limit is not a positive integer | 400 | `{ "message": "Invalid pagination parameters" }` |

