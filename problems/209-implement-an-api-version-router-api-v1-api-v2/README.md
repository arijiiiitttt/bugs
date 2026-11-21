# Implement an API version router (/api/v1, /api/v2)

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement `versionRouter(versions)` in `src/versionRouter.js`. `versions` maps a version name to an Express router, e.g. `{ v1: routerV1, v2: routerV2 }`. The returned router is mounted by the application at `/api`.

### Behaviour
| Request | Result |
|---|---|
| `GET /api/v1/users` | handled by `versions.v1` as `/users` (the version segment is stripped) |
| `GET /api/v2/users` | handled by `versions.v2` as `/users` |
| `GET /api/v3/users` | **404** `{ "message": "Unsupported API version" }` |
| `GET /api/constructor/users`, `/api/__proto__/x` | also 404 "Unsupported API version" (only real own keys count) |
| a path unknown **inside** a valid version | falls through to the next handler of the app (Express default 404) |

## How to work

```bash
npm test -- 209     # run the tests of this problem (replace 209 by the problem number)
```

- Implement the code in `src/versionRouter.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 209` show the reference solution.
