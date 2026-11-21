# Q&A Forum: Created questions disappear

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Q&A Forum** where users can discover, create and manage questions.

**Problem:** The API answers 201 and returns an `_id`, but fetching the question by that id afterwards gives 404.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 101             # run the tests of this problem (replace 101 by the problem number)
DEBUG=1 npm test -- 101     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 101` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Question ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`open: false`).

## Expected API behaviour

### POST /api/questions

**Purpose:** Creates a new forum question for the authenticated user and returns the created question.

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
  "body": "string",     // Required
  "preview": "string",     // Optional: Short description
  "topic": "string",     // Required: one of `JavaScript`, `Databases`, `DevOps`, `Design`
  "tags": ["string"],   // Optional: array of strings (default [])
  "votes": 0             // Optional: number >= 0, Vote count (default 0)
}
```

**Success response (201)**
```json
{
  "message": "Question created successfully",
  "question": {
    "_id": "string",            // generated id
    "title": "string",            // trimmed
    "body": "string",
    "preview": "string",            // provided, or the first 100 characters of body
    "topic": "string",
    "tags": ["string"],
    "votes": 0,
    "open": true,                // always true on creation
    "asker": { "_id": "string", "name": "string", "email": "string", "bio": "string" },
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

**Error responses**

| When | Status | Body |
|---|---|---|
| title missing/blank, body missing/blank or topic missing | 400 | `{ "message": "title, body and topic are required" }` |
| topic is not one of the allowed values | 400 | `{ "message": "Invalid topic" }` |
| votes is not a number >= 0 | 400 | `{ "message": "votes must be a non-negative number" }` |
| tags is not an array of strings | 400 | `{ "message": "tags must be an array of strings" }` |
| missing / unknown `x-user-id` | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- The question must be saved so it can be fetched later with `GET /api/questions/:id`.
- `open` is always `true` on creation, even if the client sends something else.
- The owner (`asker`) is always the authenticated user - never a value from the request body.
- `asker` is returned **populated** with `_id`, `name`, `email`, `bio` and nothing else.

