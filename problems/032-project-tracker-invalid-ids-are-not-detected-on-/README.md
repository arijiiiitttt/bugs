# Project Tracker: Invalid ids are not detected on update

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Project Tracker** where users can discover, create and manage tasks.

**Problem:** PUT /api/tasks/not-an-id answers 404 instead of 400.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 032             # run the tests of this problem (replace 032 by the problem number)
DEBUG=1 npm test -- 032     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 032` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Task ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`open: false`).

## Expected API behaviour

### PUT /api/tasks/:id

**Purpose:** Updates a task. Only the owner may update it. Only the fields present in the body change.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Request body** (every field optional)
```json
{ "title": "string", "details": "string", "summary": "string", "priority": "string", "labels": ["string"], "estimateHours": 0, "open": true }
```

**Success response (200)**
```json
{ "message": "Task updated successfully", "task": { /* full task, assignee populated */ } }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid task ID" }` |
| task does not exist | 404 | `{ "message": "Task not found" }` |
| authenticated user is not the owner | 403 | `{ "message": "Not authorized to update this task" }` |
| invalid priority | 400 | `{ "message": "Invalid priority" }` |
| not authenticated | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- Changes must be saved. `createdAt` never changes; `updatedAt` changes on every update.
- The owner (`assignee`) can never be changed through this endpoint.

