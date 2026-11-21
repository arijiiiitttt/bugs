# Project Tracker: The authentication chain is full of holes

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Project Tracker** where users can discover, create and manage tasks.

**Problem:** Authentication fails in four different ways: wrong status codes, unknown users get through, one route is unprotected and one route is shadowed by another.

There are **4 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 274             # run the tests of this problem (replace 274 by the problem number)
DEBUG=1 npm test -- 274     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 274` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Task ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`open: false`).

## Expected API behaviour

### GET /api/tasks/mine

**Purpose:** Returns every task owned by the authenticated user - **including hidden ones** (`open: false`) - newest first.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Success response (200)**
```json
{ "tasks": [ /* task objects, assignee populated */ ] }
```

Not authenticated: 401 `{ "message": "Not authenticated" }`.

### Authentication

Protected endpoints (`POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`, `GET /api/tasks/mine`) read the `x-user-id` header.

| When | Status | Body |
|---|---|---|
| header missing | 401 | `{ "message": "Not authenticated" }` |
| header present but no such user (also for malformed ids) | 401 | `{ "message": "Not authenticated" }` |
| header belongs to an existing user | request continues, the user is available as `req.user` | |

Public endpoints (`GET /api/tasks`, `GET /api/tasks/:id`) never need the header.

