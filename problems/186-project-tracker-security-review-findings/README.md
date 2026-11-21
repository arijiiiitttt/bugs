# Project Tracker: Security review findings

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Project Tracker** where users can discover, create and manage tasks.

**Problem:** A penetration test found four weaknesses in the tasks API (spoofed owners, leaked user data, owner reassignment and a crash on unknown users).

There are **4 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 186             # run the tests of this problem (replace 186 by the problem number)
DEBUG=1 npm test -- 186     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 186` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Task ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`open: false`).

## Expected API behaviour

### POST /api/tasks

**Purpose:** Creates a new task for the authenticated user and returns the created task.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Request body**
```json
{
  "title": "string",     // Required
  "details": "string",     // Required
  "summary": "string",     // Optional: Short description
  "priority": "string",     // Required: one of `low`, `medium`, `high`
  "labels": ["string"],   // Optional: array of strings (default [])
  "estimateHours": 0             // Optional: number >= 0, Estimated effort in hours (default 1)
}
```

**Success response (201)**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "string",            // generated id
    "title": "string",            // trimmed
    "details": "string",
    "summary": "string",            // provided, or the first 80 characters of details
    "priority": "string",
    "labels": ["string"],
    "estimateHours": 0,
    "open": true,                // always true on creation
    "assignee": { "_id": "string", "name": "string", "email": "string", "bio": "string" },
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

**Error responses**

| When | Status | Body |
|---|---|---|
| title missing/blank, details missing/blank or priority missing | 400 | `{ "message": "title, details and priority are required" }` |
| priority is not one of the allowed values | 400 | `{ "message": "Invalid priority" }` |
| estimateHours is not a number >= 0 | 400 | `{ "message": "estimateHours must be a non-negative number" }` |
| labels is not an array of strings | 400 | `{ "message": "labels must be an array of strings" }` |
| missing / unknown `x-user-id` | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- The task must be saved so it can be fetched later with `GET /api/tasks/:id`.
- `open` is always `true` on creation, even if the client sends something else.
- The owner (`assignee`) is always the authenticated user - never a value from the request body.
- `assignee` is returned **populated** with `_id`, `name`, `email`, `bio` and nothing else.

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

### Authentication

Protected endpoints (`POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`, `GET /api/tasks/mine`) read the `x-user-id` header.

| When | Status | Body |
|---|---|---|
| header missing | 401 | `{ "message": "Not authenticated" }` |
| header present but no such user (also for malformed ids) | 401 | `{ "message": "Not authenticated" }` |
| header belongs to an existing user | request continues, the user is available as `req.user` | |

Public endpoints (`GET /api/tasks`, `GET /api/tasks/:id`) never need the header.

