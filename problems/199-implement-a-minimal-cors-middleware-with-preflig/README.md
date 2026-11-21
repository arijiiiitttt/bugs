# Implement a minimal CORS middleware with preflight support

**Track:** Express middleware & routing &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies except Express)

## Task

## Overview
Implement `cors(options)` in `src/cors.js` (do not use the `cors` package).

### Options (all optional)
`origins` (array, default `[]`; `"*"` allows every origin), `methods` (default `["GET","POST","PUT","DELETE"]`), `headers` (default `["Content-Type","Authorization"]`), `maxAge` (default `600`).

### Behaviour
| Request | Result |
|---|---|
| any request | add `Vary: Origin` |
| `Origin` header is allowed | `Access-Control-Allow-Origin` = the request's origin (echoed, even for `"*"`) |
| no `Origin` header or origin not allowed | no `Access-Control-Allow-Origin` header, request continues normally |
| `OPTIONS` **with** `Access-Control-Request-Method` (a preflight) | answer **204** with an empty body and never call the route. If the origin is allowed also send `Access-Control-Allow-Methods` (joined with `", "`), `Access-Control-Allow-Headers` (joined with `", "`) and `Access-Control-Max-Age` |
| `OPTIONS` without `Access-Control-Request-Method` | not a preflight: continue to the next handler |

## How to work

```bash
npm test -- 199     # run the tests of this problem (replace 199 by the problem number)
```

- Implement the code in `src/cors.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 199` show the reference solution.
