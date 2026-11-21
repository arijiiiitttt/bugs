# Event Board: The update flow is broken end to end

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Event Board** where users can discover, create and manage events.

**Problem:** Editing a event is a disaster: changes are lost, partial updates fail, timestamps never move, owners can be reassigned and error codes are wrong.

There are **6 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 271             # run the tests of this problem (replace 271 by the problem number)
DEBUG=1 npm test -- 271     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 271` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Event ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`public: false`).

## Expected API behaviour

### PUT /api/events/:id

**Purpose:** Updates a event. Only the owner may update it. Only the fields present in the body change.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Request body** (every field optional)
```json
{ "name": "string", "agenda": "string", "teaser": "string", "type": "string", "tags": ["string"], "capacity": 0, "public": true }
```

**Success response (200)**
```json
{ "message": "Event updated successfully", "event": { /* full event, organizer populated */ } }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid event ID" }` |
| event does not exist | 404 | `{ "message": "Event not found" }` |
| authenticated user is not the owner | 403 | `{ "message": "Not authorized to update this event" }` |
| invalid type | 400 | `{ "message": "Invalid type" }` |
| not authenticated | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- Changes must be saved. `createdAt` never changes; `updatedAt` changes on every update.
- The owner (`organizer`) can never be changed through this endpoint.

