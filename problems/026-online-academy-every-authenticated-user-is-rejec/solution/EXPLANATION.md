# Explanation

The middleware read the wrong header (`user-id`). It must read `x-user-id`.

Changed file(s): `src/middleware.js`
