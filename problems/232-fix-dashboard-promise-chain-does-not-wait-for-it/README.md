# Fix: dashboard promise chain does not wait for its steps

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`loadDashboard(api)` in `src/dashboard.js` builds a dashboard in three **sequential** steps:

1. `api.getUser()` -> `dash.user`
2. `api.getPosts(user.id)` -> `dash.posts`
3. `api.getNotifications(user.id)` -> `dash.notifications`

and resolves with `{ user, posts, notifications }` once everything is loaded. If any step fails, the returned promise must reject with that error.

### Symptom
The dashboard resolves with only `user` (posts and notifications are filled in later, if at all), and when `getPosts` fails the program logs an unhandled rejection instead of rejecting `loadDashboard`. Fix the chain.

## How to work

```bash
npm test -- 232     # run the tests of this problem (replace 232 by the problem number)
```

- Implement the code in `src/dashboard.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 232` show the reference solution.
