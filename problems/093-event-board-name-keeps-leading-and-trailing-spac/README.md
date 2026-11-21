# Event Board: name keeps leading and trailing spaces

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Event Board** where users can discover, create and manage events.

**Problem:** Users complain that titles like "  Hello  " are stored with the extra spaces.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 093             # run the tests of this problem (replace 093 by the problem number)
DEBUG=1 npm test -- 093     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 093` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Event ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`public: false`).

## Expected API behaviour

### POST /api/events

**Purpose:** Creates a new event for the authenticated user and returns the created event.

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
  "name": "string",     // Required
  "agenda": "string",     // Required
  "teaser": "string",     // Optional: Short description
  "type": "string",     // Required: one of `Conference`, `Workshop`, `Meetup`, `Webinar`
  "tags": ["string"],   // Optional: array of strings (default [])
  "capacity": 0             // Optional: number >= 0, Maximum number of attendees (default 50)
}
```

**Success response (201)**
```json
{
  "message": "Event created successfully",
  "event": {
    "_id": "string",            // generated id
    "name": "string",            // trimmed
    "agenda": "string",
    "teaser": "string",            // provided, or the first 140 characters of agenda
    "type": "string",
    "tags": ["string"],
    "capacity": 0,
    "public": true,                // always true on creation
    "organizer": { "_id": "string", "name": "string", "email": "string", "bio": "string" },
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

**Error responses**

| When | Status | Body |
|---|---|---|
| name missing/blank, agenda missing/blank or type missing | 400 | `{ "message": "name, agenda and type are required" }` |
| type is not one of the allowed values | 400 | `{ "message": "Invalid type" }` |
| capacity is not a number >= 0 | 400 | `{ "message": "capacity must be a non-negative number" }` |
| tags is not an array of strings | 400 | `{ "message": "tags must be an array of strings" }` |
| missing / unknown `x-user-id` | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- The event must be saved so it can be fetched later with `GET /api/events/:id`.
- `public` is always `true` on creation, even if the client sends something else.
- The owner (`organizer`) is always the authenticated user - never a value from the request body.
- `organizer` is returned **populated** with `_id`, `name`, `email`, `bio` and nothing else.

