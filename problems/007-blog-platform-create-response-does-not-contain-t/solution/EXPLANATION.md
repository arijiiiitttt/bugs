# Explanation

The response object was missing the `post` key. Fix: `res.status(201).json({ message, post: item })`.

Changed file(s): `src/controller.js`
