# Online Academy: durationHours accepts strings and negative numbers

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Online Academy** where users can discover, create and manage courses.

**Problem:** Clients can create a course with `"durationHours": "lots"` or `-5`.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 108             # run the tests of this problem (replace 108 by the problem number)
DEBUG=1 npm test -- 108     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 108` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Course ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`enrolling: false`).

## Expected API behaviour

### POST /api/courses

**Purpose:** Creates a new course for the authenticated user and returns the created course.

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
  "syllabus": "string",     // Required
  "blurb": "string",     // Optional: Short description
  "level": "string",     // Required: one of `Beginner`, `Intermediate`, `Advanced`
  "topics": ["string"],   // Optional: array of strings (default [])
  "durationHours": 0             // Optional: number >= 0, Total duration in hours (default 10)
}
```

**Success response (201)**
```json
{
  "message": "Course created successfully",
  "course": {
    "_id": "string",            // generated id
    "title": "string",            // trimmed
    "syllabus": "string",
    "blurb": "string",            // provided, or the first 120 characters of syllabus
    "level": "string",
    "topics": ["string"],
    "durationHours": 0,
    "enrolling": true,                // always true on creation
    "instructor": { "_id": "string", "name": "string", "email": "string", "bio": "string" },
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

**Error responses**

| When | Status | Body |
|---|---|---|
| title missing/blank, syllabus missing/blank or level missing | 400 | `{ "message": "title, syllabus and level are required" }` |
| level is not one of the allowed values | 400 | `{ "message": "Invalid level" }` |
| durationHours is not a number >= 0 | 400 | `{ "message": "durationHours must be a non-negative number" }` |
| topics is not an array of strings | 400 | `{ "message": "topics must be an array of strings" }` |
| missing / unknown `x-user-id` | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- The course must be saved so it can be fetched later with `GET /api/courses/:id`.
- `enrolling` is always `true` on creation, even if the client sends something else.
- The owner (`instructor`) is always the authenticated user - never a value from the request body.
- `instructor` is returned **populated** with `_id`, `name`, `email`, `bio` and nothing else.

