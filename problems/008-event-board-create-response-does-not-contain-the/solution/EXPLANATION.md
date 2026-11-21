# Explanation

The response object was missing the `event` key. Fix: `res.status(201).json({ message, event: item })`.

Changed file(s): `src/controller.js`
