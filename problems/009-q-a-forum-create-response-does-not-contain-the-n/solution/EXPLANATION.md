# Explanation

The response object was missing the `question` key. Fix: `res.status(201).json({ message, question: item })`.

Changed file(s): `src/controller.js`
