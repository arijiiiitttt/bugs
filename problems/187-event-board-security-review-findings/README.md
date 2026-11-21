# Event Board: Security review findings

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Event Board** where users can discover, create and manage events.

**Problem:** A penetration test found four weaknesses in the events API (spoofed owners, leaked user data, owner reassignment and a crash on unknown users).

There are **4 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 187             # run the tests of this problem (replace 187 by the problem number)
DEBUG=1 npm test -- 187     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 187` runs the tests against the reference solution.

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

### Authentication

Protected endpoints (`POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id`, `GET /api/events/mine`) read the `x-user-id` header.

| When | Status | Body |
|---|---|---|
| header missing | 401 | `{ "message": "Not authenticated" }` |
| header present but no such user (also for malformed ids) | 401 | `{ "message": "Not authenticated" }` |
| header belongs to an existing user | request continues, the user is available as `req.user` | |

Public endpoints (`GET /api/events`, `GET /api/events/:id`) never need the header.

