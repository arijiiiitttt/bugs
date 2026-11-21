# Explanation

1. **Unknown user ids crash the server**: The middleware did not check that the user exists, so `req.user` was `undefined` and handlers crashed.

2. **Wrong status code for unauthenticated requests**: The middleware answered 403 instead of 401.

3. **Creating without logging in crashes the server**: The `requireAuth` middleware was missing on `router.post('/')`.

4. **`GET /mine` is treated as an id**: The dynamic route `/:id` was declared before `/mine`, so "mine" was captured as an id. Declare static routes first.
