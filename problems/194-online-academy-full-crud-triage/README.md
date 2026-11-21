# Online Academy: Full CRUD triage

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Online Academy** where users can discover, create and manage courses.

**Problem:** After a refactor, six different things broke across create, read, update, delete and list.

There are **6 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 194             # run the tests of this problem (replace 194 by the problem number)
DEBUG=1 npm test -- 194     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 194` runs the tests against the reference solution.

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

### GET /api/courses/:id

**Purpose:** Returns a single course (public endpoint, no header needed). Works for hidden items (`enrolling: false`) too.

**Success response (200)**
```json
{ "course": { /* full course, instructor populated with _id, name, email, bio */ } }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid course ID" }` |
| course does not exist | 404 | `{ "message": "Course not found" }` |

### GET /api/courses

**Purpose:** Public, paginated list of courses that are `enrolling: true`, newest first (by `createdAt`).

**Query parameters**

| Param | Meaning |
|---|---|
| `level` | exact match filter, e.g. `?level=Beginner` |
| `q` | case-insensitive search in `title` |
| `page` | integer >= 1 (default 1) |
| `limit` | integer >= 1 (default 10, **maximum 50** - larger values are capped) |

**Success response (200)**
```json
{
  "courses": [ /* course objects, instructor populated */ ],
  "page": 1,
  "limit": 10,
  "total": 5,        // number of matching items (before pagination)
  "totalPages": 1    // Math.ceil(total / limit)
}
```

| When | Status | Body |
|---|---|---|
| page or limit is not a positive integer | 400 | `{ "message": "Invalid pagination parameters" }` |

### GET /api/courses/mine

**Purpose:** Returns every course owned by the authenticated user - **including hidden ones** (`enrolling: false`) - newest first.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Success response (200)**
```json
{ "courses": [ /* course objects, instructor populated */ ] }
```

Not authenticated: 401 `{ "message": "Not authenticated" }`.

### PUT /api/courses/:id

**Purpose:** Updates a course. Only the owner may update it. Only the fields present in the body change.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Request body** (every field optional)
```json
{ "title": "string", "syllabus": "string", "blurb": "string", "level": "string", "topics": ["string"], "durationHours": 0, "enrolling": true }
```

**Success response (200)**
```json
{ "message": "Course updated successfully", "course": { /* full course, instructor populated */ } }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid course ID" }` |
| course does not exist | 404 | `{ "message": "Course not found" }` |
| authenticated user is not the owner | 403 | `{ "message": "Not authorized to update this course" }` |
| invalid level | 400 | `{ "message": "Invalid level" }` |
| not authenticated | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- Changes must be saved. `createdAt` never changes; `updatedAt` changes on every update.
- The owner (`instructor`) can never be changed through this endpoint.

### DELETE /api/courses/:id

**Purpose:** Deletes a course. Only the owner may delete it.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Success response (200)**
```json
{ "message": "Course deleted successfully" }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid course ID" }` |
| course does not exist | 404 | `{ "message": "Course not found" }` |
| authenticated user is not the owner | 403 | `{ "message": "Not authorized to delete this course" }` |
| not authenticated | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- Exactly the requested course is removed from the database - no other one.

