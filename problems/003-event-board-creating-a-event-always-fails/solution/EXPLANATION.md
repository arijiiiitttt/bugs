# Explanation

The handler used `name`, `agenda`, `teaser`, `type`, `tags` and `capacity` but never read them from `req.body`, so the first access threw a ReferenceError (-> 500).
Fix: `const { name, agenda, teaser, type, tags, capacity } = req.body || {};`

Changed file(s): `src/controller.js`
