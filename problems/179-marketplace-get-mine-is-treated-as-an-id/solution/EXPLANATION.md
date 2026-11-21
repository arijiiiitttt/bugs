# Explanation

The dynamic route `/:id` was declared before `/mine`, so "mine" was captured as an id. Declare static routes first.

Changed file(s): `src/routes.js`
