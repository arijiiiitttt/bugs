# Blog Platform: Creating a post always fails

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Blog Platform** where users can discover, create and manage posts.

**Problem:** Every attempt to create a new blog post fails with a 500 error, even when all required fields are filled in correctly.

Your task is to find and fix the bug in the backend so that all tests pass.

## How to work

```bash
npm test -- 001             # run the tests of this problem (replace 001 by the problem number)
DEBUG=1 npm test -- 001     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 001` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Post ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`published: false`).

## Expected API behaviour

### POST /api/posts

**Purpose:** Creates a new blog post for the authenticated user and returns the created post.

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
  "content": "string",     // Required
  "excerpt": "string",     // Optional: Short description
  "category": "string",     // Required: one of `Technology`, `Lifestyle`, `Travel`, `Food`
  "tags": ["string"],   // Optional: array of strings (default [])
  "readTime": 0             // Optional: number >= 0, Estimated read time in minutes (default 5)
}
```

**Success response (201)**
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "string",            // generated id
    "title": "string",            // trimmed
    "content": "string",
    "excerpt": "string",            // provided, or the first 160 characters of content
    "category": "string",
    "tags": ["string"],
    "readTime": 0,
    "published": true,                // always true on creation
    "author": { "_id": "string", "name": "string", "email": "string", "bio": "string" },
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

**Error responses**

| When | Status | Body |
|---|---|---|
| title missing/blank, content missing/blank or category missing | 400 | `{ "message": "title, content and category are required" }` |
| category is not one of the allowed values | 400 | `{ "message": "Invalid category" }` |
| readTime is not a number >= 0 | 400 | `{ "message": "readTime must be a non-negative number" }` |
| tags is not an array of strings | 400 | `{ "message": "tags must be an array of strings" }` |
| missing / unknown `x-user-id` | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- The post must be saved so it can be fetched later with `GET /api/posts/:id`.
- `published` is always `true` on creation, even if the client sends something else.
- The owner (`author`) is always the authenticated user - never a value from the request body.
- `author` is returned **populated** with `_id`, `name`, `email`, `bio` and nothing else.

