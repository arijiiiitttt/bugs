# Blog Platform: Reading and listing are both off

**Track:** Express API bug-fix &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js + Express (in-memory database)

## Overview

This is the backend of a **Blog Platform** where users can discover, create and manage posts.

**Problem:** Both the detail page and the public list of posts misbehave: errors, missing owner data, hidden items shown, filters ignored and bad pagination accepted.

There are **6 independent bugs**. Your task is to fix all of them.

## How to work

```bash
npm test -- 277             # run the tests of this problem (replace 277 by the problem number)
DEBUG=1 npm test -- 277     # also print server-side errors to the console
```

- Only edit files inside `src/`. Never edit the tests.
- The "database" is a plain in-memory object (`src/store.js`). The tests reset it before every test.
- Stuck? Open `HINT.md`. Done (or really stuck)? `solution/EXPLANATION.md` explains the bug, and `npm run solution -- 277` runs the tests against the reference solution.

## Seed data

Users (id -> name): `64a000000000000000000001` John Doe, `...02` Sarah Smith, `...03` Mike Johnson, `...04` Emma Wilson.

Post ids are `5f0000000000000000000001` ... `5f0000000000000000000006` (oldest to newest). Items 1, 2 and 5 belong to John, 3 and 6 to Sarah, 4 to Mike. Item 5 is hidden (`published: false`).

## Expected API behaviour

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

