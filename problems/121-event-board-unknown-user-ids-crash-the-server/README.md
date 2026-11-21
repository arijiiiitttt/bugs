# Event Board: Unknown user ids crash the server

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Event Board** where users can discover, create and manage events.

**Problem:** Calling a protected endpoint with a well-formed but non-existent `x-user-id` returns 500 instead of 401.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 121             # run the tests of this problem (replace 121 by the problem number)
DEBUG=1 npm test -- 121     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 121` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Event ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`public: false`).

## Expected API behaviour

### Authentication

Protected endpoints (`POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id`, `GET /api/events/mine`) read the `x-user-id` header.

| When | Status | Body |
|---|---|---|
| header missing | 401 | `{ "message": "Not authenticated" }` |
| header present but no such user (also for malformed ids) | 401 | `{ "message": "Not authenticated" }` |
| header belongs to an existing user | request continues, the user is available as `req.user` | |

Public endpoints (`GET /api/events`, `GET /api/events/:id`) never need the header.

