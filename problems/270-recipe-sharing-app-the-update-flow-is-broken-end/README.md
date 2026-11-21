# Recipe Sharing App: The update flow is broken end to end

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Recipe Sharing App** where users can discover, create and manage recipes.

**Problem:** Editing a recipe is a disaster: changes are lost, partial updates fail, timestamps never move, owners can be reassigned and error codes are wrong.

There are **6 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 270             # run the tests of this problem (replace 270 by the problem number)
DEBUG=1 npm test -- 270     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 270` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Recipe ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`published: false`).

## Expected API behaviour

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

