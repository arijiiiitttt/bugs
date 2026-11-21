# Project Tracker: Invalid ids are not detected on delete

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Project Tracker** where users can discover, create and manage tasks.

**Problem:** DELETE /api/tasks/not-an-id answers 404 instead of 400.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 044             # run the tests of this problem (replace 044 by the problem number)
DEBUG=1 npm test -- 044     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 044` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Task ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`open: false`).

## Expected API behaviour

### DELETE /api/tasks/:id

**Purpose:** Deletes a task. Only the owner may delete it.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Success response (200)**
```json
{ "message": "Task deleted successfully" }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid task ID" }` |
| task does not exist | 404 | `{ "message": "Task not found" }` |
| authenticated user is not the owner | 403 | `{ "message": "Not authorized to delete this task" }` |
| not authenticated | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- Exactly the requested task is removed from the database - no other one.

