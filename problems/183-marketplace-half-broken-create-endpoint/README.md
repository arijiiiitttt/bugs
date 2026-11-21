# Marketplace: Half-broken create endpoint

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Marketplace** where users can discover, create and manage products.

**Problem:** QA reports several problems with creating a product listing: missing summaries, items that are not visible, lost tags and untrimmed titles.

There are **4 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 183             # run the tests of this problem (replace 183 by the problem number)
DEBUG=1 npm test -- 183     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 183` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Product ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`active: false`).

## Expected API behaviour

### POST /api/products

**Purpose:** Creates a new product listing for the authenticated user and returns the created product.

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
  "description": "string",     // Required
  "summary": "string",     // Optional: Short description
  "department": "string",     // Required: one of `Electronics`, `Books`, `Clothing`, `Home`
  "tags": ["string"],   // Optional: array of strings (default [])
  "stock": 0             // Optional: number >= 0, Units in stock (default 0)
}
```

**Success response (201)**
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "string",            // generated id
    "name": "string",            // trimmed
    "description": "string",
    "summary": "string",            // provided, or the first 100 characters of description
    "department": "string",
    "tags": ["string"],
    "stock": 0,
    "active": true,                // always true on creation
    "seller": { "_id": "string", "name": "string", "email": "string", "bio": "string" },
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

**Error responses**

| When | Status | Body |
|---|---|---|
| name missing/blank, description missing/blank or department missing | 400 | `{ "message": "name, description and department are required" }` |
| department is not one of the allowed values | 400 | `{ "message": "Invalid department" }` |
| stock is not a number >= 0 | 400 | `{ "message": "stock must be a non-negative number" }` |
| tags is not an array of strings | 400 | `{ "message": "tags must be an array of strings" }` |
| missing / unknown `x-user-id` | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- The product must be saved so it can be fetched later with `GET /api/products/:id`.
- `active` is always `true` on creation, even if the client sends something else.
- The owner (`seller`) is always the authenticated user - never a value from the request body.
- `seller` is returned **populated** with `_id`, `name`, `email`, `bio` and nothing else.

