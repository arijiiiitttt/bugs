# Blog Platform: Full CRUD triage

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Blog Platform** where users can discover, create and manage posts.

**Problem:** After a refactor, six different things broke across create, read, update, delete and list.

There are **6 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 196             # run the tests of this problem (replace 196 by the problem number)
DEBUG=1 npm test -- 196     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 196` runs the tests against the reference solution.

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

### GET /api/posts/:id

**Purpose:** Returns a single post (public endpoint, no header needed). Works for hidden items (`published: false`) too.

**Success response (200)**
```json
{ "post": { /* full post, author populated with _id, name, email, bio */ } }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid post ID" }` |
| post does not exist | 404 | `{ "message": "Post not found" }` |

### GET /api/posts

**Purpose:** Public, paginated list of posts that are `published: true`, newest first (by `createdAt`).

**Query parameters**

| Param | Meaning |
|---|---|
| `category` | exact match filter, e.g. `?category=Technology` |
| `q` | case-insensitive search in `title` |
| `page` | integer >= 1 (default 1) |
| `limit` | integer >= 1 (default 10, **maximum 50** - larger values are capped) |

**Success response (200)**
```json
{
  "posts": [ /* post objects, author populated */ ],
  "page": 1,
  "limit": 10,
  "total": 5,        // number of matching items (before pagination)
  "totalPages": 1    // Math.ceil(total / limit)
}
```

| When | Status | Body |
|---|---|---|
| page or limit is not a positive integer | 400 | `{ "message": "Invalid pagination parameters" }` |

### GET /api/posts/mine

**Purpose:** Returns every post owned by the authenticated user - **including hidden ones** (`published: false`) - newest first.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Success response (200)**
```json
{ "posts": [ /* post objects, author populated */ ] }
```

Not authenticated: 401 `{ "message": "Not authenticated" }`.

### PUT /api/posts/:id

**Purpose:** Updates a post. Only the owner may update it. Only the fields present in the body change.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Request body** (every field optional)
```json
{ "title": "string", "content": "string", "excerpt": "string", "category": "string", "tags": ["string"], "readTime": 0, "published": true }
```

**Success response (200)**
```json
{ "message": "Post updated successfully", "post": { /* full post, author populated */ } }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid post ID" }` |
| post does not exist | 404 | `{ "message": "Post not found" }` |
| authenticated user is not the owner | 403 | `{ "message": "Not authorized to update this post" }` |
| invalid category | 400 | `{ "message": "Invalid category" }` |
| not authenticated | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- Changes must be saved. `createdAt` never changes; `updatedAt` changes on every update.
- The owner (`author`) can never be changed through this endpoint.

### DELETE /api/posts/:id

**Purpose:** Deletes a post. Only the owner may delete it.

**Request headers**
```json
{
  "x-user-id": "string",   // id of the authenticated user (must belong to an existing user)
  "Content-Type": "application/json"
}
```

**Success response (200)**
```json
{ "message": "Post deleted successfully" }
```

| When | Status | Body |
|---|---|---|
| id is not a valid 24-char hex id | 400 | `{ "message": "Invalid post ID" }` |
| post does not exist | 404 | `{ "message": "Post not found" }` |
| authenticated user is not the owner | 403 | `{ "message": "Not authorized to delete this post" }` |
| not authenticated | 401 | `{ "message": "Not authenticated" }` |

**Additional information**
- Exactly the requested post is removed from the database - no other one.

