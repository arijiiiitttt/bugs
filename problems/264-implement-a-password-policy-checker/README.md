# Implement a password policy checker

**Track:** Security & auth &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `validatePassword(password, { username } = {})` in `src/password.js`. It returns an **array of violation codes** (empty array = password accepted).

### Checks (report all that apply, in exactly this order)
1. `too_short` - fewer than 12 characters
2. `no_lower` - no lowercase letter (`a-z`)
3. `no_upper` - no uppercase letter (`A-Z`)
4. `no_digit` - no digit
5. `no_symbol` - no character outside letters and digits (spaces count as symbols)
6. `contains_username` - when `username` has at least 3 characters and appears in the password, case-insensitively
7. `repeated` - the same character three or more times in a row (`aaa`)
8. `common` - the lowercase password contains `password`, `qwerty` or `123456`

A non-string password returns `['invalid']`.

## How to work

```bash
npm test -- 264     # run the tests of this problem (replace 264 by the problem number)
```

- Implement the code in `src/password.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 264` show the reference solution.
