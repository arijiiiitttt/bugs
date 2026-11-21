# Event Board: `GET /mine` is treated as an id

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Event Board** where users can discover, create and manage events.

**Problem:** GET /api/events/mine answers 400 "Invalid event ID".

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 180             # run the tests of this problem (replace 180 by the problem number)
DEBUG=1 npm test -- 180     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 180` runs the tests against the reference solution.

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

