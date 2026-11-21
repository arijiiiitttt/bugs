# Event Board: My items, routing and app-level behaviour

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Event Board** where users can discover, create and manage events.

**Problem:** The "mine" endpoint, route ordering, the 404 handler, JSON error handling and the auth middleware are all misbehaving.

There are **5 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 287             # run the tests of this problem (replace 287 by the problem number)
DEBUG=1 npm test -- 287     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 287` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Event ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`public: false`).

## Expected API behaviour

### GET /api/events/mine

**Purpose:** Returns every event owned by the authenticated user - **including hidden ones** (`public: false`) - newest first.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Success response (200)**
```json
{ "events": [ /* event objects, organizer populated */ ] }
```

Not authenticated: 401 `{ "message": "Not authenticated" }`.

### Authentication

Protected endpoints (`POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id`, `GET /api/events/mine`) read the `x-user-id` header.

| When | Status | Body |
|---|---|---|
| header missing | 401 | `{ "message": "Not authenticated" }` |
| header present but no such user (also for malformed ids) | 401 | `{ "message": "Not authenticated" }` |
| header belongs to an existing user | request continues, the user is available as `req.user` | |

Public endpoints (`GET /api/events`, `GET /api/events/:id`) never need the header.

### Application behaviour

| When | Status | Body |
|---|---|---|
| `GET /health` | 200 | `{ "status": "ok" }` |
| request body is not valid JSON | 400 | `{ "message": "Invalid JSON" }` |
| unknown route | 404 | `{ "message": "Route not found" }` |
| model validation error (e.g. invalid type) | 400 | `{ "message": "<validation message>" }` |
| any other error | 500 | `{ "message": "Internal Server Error" }` |

