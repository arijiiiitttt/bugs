# Implement CSRF tokens bound to a session

**Track:** Security & auth &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `createCsrf(secret)` in `src/csrf.js` returning `{ issue(sessionId), verify(sessionId, token) }`.

### Rules
- `issue` returns `nonce + "." + mac` where `nonce` is 16 random bytes in hex and `mac` is the hex HMAC-SHA256 (keyed with `secret`) of `sessionId + ":" + nonce`. Two calls give different tokens.
- `verify` returns `true` only for a token issued for **that** session with **that** secret.
- `verify` returns `false` (never throws) for tokens that are not strings, malformed, altered or issued for another session. Compare the MAC in constant time.

## How to work

```bash
npm test -- 269     # run the tests of this problem (replace 269 by the problem number)
```

- Implement the code in `src/csrf.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 269` show the reference solution.
