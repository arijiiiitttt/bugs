# Implement role-based permission checks with inheritance

**Track:** Security & auth &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `createRbac(config)` in `src/rbac.js`. `config.roles` maps a role name to `{ can: string[], inherits?: string[] }`.

`createRbac(config).can(roles, permission)` answers whether a user holding the list `roles` may perform `permission`.

### Rules
- A role grants its own `can` entries plus everything its `inherits` roles grant (transitively).
- Permissions look like `"posts:read"`. A grant `"*"` matches everything; `"posts:*"` matches every permission starting with `"posts:"`. Otherwise the match is exact.
- Unknown roles grant nothing. `roles` may be `undefined` or a single string.
- Inheritance cycles (`a` inherits `b` inherits `a`) must not loop forever.

## How to work

```bash
npm test -- 265     # run the tests of this problem (replace 265 by the problem number)
```

- Implement the code in `src/rbac.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 265` show the reference solution.
