# Implement HMAC-signed tokens with expiry

**Track:** Security & auth &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Build a minimal signed token (a tiny JWT cousin) in `src/token.js` using `node:crypto`.

### `signToken(payload, secret, { ttlSeconds, now = Date.now })`
- `iat = Math.floor(now() / 1000)` and `exp = iat + ttlSeconds` are added to a copy of `payload`.
- Token format: `base64url(JSON(claims)) + "." + base64url(HMAC-SHA256(secret, firstPart))`.

### `verifyToken(token, secret, { now = Date.now })`
Returns the claims object, or throws an `Error` whose `code` property is:
- `MALFORMED` - not a string, not exactly two dot-separated parts, or the payload is not valid JSON
- `BAD_SIGNATURE` - the signature does not match (compare in constant time; check this **before** trusting the payload)
- `EXPIRED` - `now() / 1000 >= exp`

Tampering with the payload or the signature, or using another secret, must be detected.

## How to work

```bash
npm test -- 267     # run the tests of this problem (replace 267 by the problem number)
```

- Implement the code in `src/token.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 267` show the reference solution.
