# Fix: any user can make themselves admin through profile update

**Track:** Security & auth &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`updateProfile(user, body)` in `src/profile.js` applies a JSON body sent by a client to a user record and returns the updated user.

### Observed problems
- A client that posts `{"role":"admin"}` becomes an administrator; others overwrite their own `id`.
- Posting `{"__proto__": {"isAdmin": true}}` (parsed with `JSON.parse`) makes the returned user look like an admin.
- The original user object gets modified by the call.

### Expected behaviour
Only `name`, `email` and `bio` may be changed. Everything else in the body is silently ignored. `name`/`bio` must be strings (otherwise throw a `TypeError`); `email` is trimmed and lowercased and must contain an `@` (otherwise throw `TypeError`). The function returns a **new** object and leaves the input untouched.

## How to work

```bash
npm test -- 266     # run the tests of this problem (replace 266 by the problem number)
```

- Implement the code in `src/profile.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 266` show the reference solution.
