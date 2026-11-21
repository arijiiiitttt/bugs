# Recipe Sharing App: Security review findings

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Recipe Sharing App** where users can discover, create and manage recipes.

**Problem:** A penetration test found four weaknesses in the recipes API (spoofed owners, leaked user data, owner reassignment and a crash on unknown users).

There are **4 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 185             # run the tests of this problem (replace 185 by the problem number)
DEBUG=1 npm test -- 185     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 185` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Recipe ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`published: false`).

## Expected API behaviour

### POST /api/recipes

**Purpose:** Creates a new recipe for the authenticated user and returns the created recipe.

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
  "instructions": "string",     // Required
  "summary": "string",     // Optional: Short description
  "cuisine": "string",     // Required: one of `Italian`, `Indian`, `Mexican`, `Thai`
  "tags": ["string"],   // Optional: array of strings (default [])
  "cookTime": 0             // Optional: number >= 0, Cooking time in minutes (default 30)
}
```

**Success response (201)**
```json
{
  "message": "Recipe created successfully",
  "recipe": {
    "_id": "string",            // generated id
    "name": "string",            // trimmed
    "instructions": "string",
    "summary": "string",            // provided, or the first 120 characters of instructions
    "cuisine": "string",
    "tags": ["string"],
    "cookTime": 0,
    "published": true,                // always true on creation
    "chef": { "_id": "string", "name": "string", "email": "string", "bio": "string" },
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

**Error responses**

| When | Status | Body |
|---|---|---|
| name missing/blank, instructions missing/blank or cuisine missing | 400 | `{ "message": "name, instructions and cuisine are required" }` |
| cuisine is not one of the allowed values | 400 | `{ "message": "Invalid cuisine" }` |
| cookTime is not a number >= 0 | 400 | `{ "message": "cookTime must be a non-negative number" }` |
| tags is not an array of strings | 400 | `{ "message": "tags must be an array of strings" }` |
| missing / unknown `x-user-id` | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- The recipe must be saved so it can be fetched later with `GET /api/recipes/:id`.
- `published` is always `true` on creation, even if the client sends something else.
- The owner (`chef`) is always the authenticated user - never a value from the request body.
- `chef` is returned **populated** with `_id`, `name`, `email`, `bio` and nothing else.

### PUT /api/recipes/:id

**Purpose:** Updates a recipe. Only the owner may update it. Only the fields present in the body change.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Request body** (every field optional)
```json
{ "name": "string", "instructions": "string", "summary": "string", "cuisine": "string", "tags": ["string"], "cookTime": 0, "published": true }
```

**Success response (200)**
```json
{ "message": "Recipe updated successfully", "recipe": { /* full recipe, chef populated */ } }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid recipe ID" }` |
| recipe does not exist | 404 | `{ "message": "Recipe not found" }` |
| authenticated user is not the owner | 403 | `{ "message": "Not authorized to update this recipe" }` |
| invalid cuisine | 400 | `{ "message": "Invalid cuisine" }` |
| not authenticated | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- Changes must be saved. `createdAt` never changes; `updatedAt` changes on every update.
- The owner (`chef`) can never be changed through this endpoint.

### Authentication

Protected endpoints (`POST /api/recipes`, `PUT /api/recipes/:id`, `DELETE /api/recipes/:id`, `GET /api/recipes/mine`) read the `x-user-id` header.

| When | Status | Body |
|---|---|---|
| header missing | 401 | `{ "message": "Not authenticated" }` |
| header present but no such user (also for malformed ids) | 401 | `{ "message": "Not authenticated" }` |
| header belongs to an existing user | request continues, the user is available as `req.user` | |

Public endpoints (`GET /api/recipes`, `GET /api/recipes/:id`) never need the header.

