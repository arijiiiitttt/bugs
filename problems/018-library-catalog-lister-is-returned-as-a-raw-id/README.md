# Library Catalog: lister is returned as a raw id

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Library Catalog** where users can discover, create and manage books.

**Problem:** The create response contains the owner id, but the UI needs the owner's `_id`, `name`, `email` and `bio`.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 018             # run the tests of this problem (replace 018 by the problem number)
DEBUG=1 npm test -- 018     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 018` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Book ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`available: false`).

## Expected API behaviour

### POST /api/books

**Purpose:** Creates a new book entry for the authenticated user and returns the created book.

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
  "plot": "string",     // Required
  "blurb": "string",     // Optional: Short description
  "genre": "string",     // Required: one of `Fantasy`, `Mystery`, `Science`, `History`
  "tags": ["string"],   // Optional: array of strings (default [])
  "pages": 0             // Optional: number >= 0, Number of pages (default 200)
}
```

**Success response (201)**
```json
{
  "message": "Book created successfully",
  "book": {
    "_id": "string",            // generated id
    "title": "string",            // trimmed
    "plot": "string",
    "blurb": "string",            // provided, or the first 150 characters of plot
    "genre": "string",
    "tags": ["string"],
    "pages": 0,
    "available": true,                // always true on creation
    "lister": { "_id": "string", "name": "string", "email": "string", "bio": "string" },
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

**Error responses**

| When | Status | Body |
|---|---|---|
| title missing/blank, plot missing/blank or genre missing | 400 | `{ "message": "title, plot and genre are required" }` |
| genre is not one of the allowed values | 400 | `{ "message": "Invalid genre" }` |
| pages is not a number >= 0 | 400 | `{ "message": "pages must be a non-negative number" }` |
| tags is not an array of strings | 400 | `{ "message": "tags must be an array of strings" }` |
| missing / unknown `x-user-id` | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- The book must be saved so it can be fetched later with `GET /api/books/:id`.
- `available` is always `true` on creation, even if the client sends something else.
- The owner (`lister`) is always the authenticated user - never a value from the request body.
- `lister` is returned **populated** with `_id`, `name`, `email`, `bio` and nothing else.

