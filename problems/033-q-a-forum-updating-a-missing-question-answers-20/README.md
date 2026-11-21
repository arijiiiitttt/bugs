# Q&A Forum: Updating a missing question answers 200

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Q&A Forum** where users can discover, create and manage questions.

**Problem:** PUT on an id that does not exist returns 200 instead of 404.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 033             # run the tests of this problem (replace 033 by the problem number)
DEBUG=1 npm test -- 033     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 033` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Question ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`open: false`).

## Expected API behaviour

### PUT /api/questions/:id

**Purpose:** Updates a question. Only the owner may update it. Only the fields present in the body change.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Request body** (every field optional)
```json
{ "title": "string", "body": "string", "preview": "string", "topic": "string", "tags": ["string"], "votes": 0, "open": true }
```

**Success response (200)**
```json
{ "message": "Question updated successfully", "question": { /* full question, asker populated */ } }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid question ID" }` |
| question does not exist | 404 | `{ "message": "Question not found" }` |
| authenticated user is not the owner | 403 | `{ "message": "Not authorized to update this question" }` |
| invalid topic | 400 | `{ "message": "Invalid topic" }` |
| not authenticated | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- Changes must be saved. `createdAt` never changes; `updatedAt` changes on every update.
- The owner (`asker`) can never be changed through this endpoint.

