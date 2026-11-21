# Explanation

The middleware did not check that the user exists, so `req.user` was `undefined` and handlers crashed.

Changed file(s): `src/middleware.js`
