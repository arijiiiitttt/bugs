# Explanation

The handler used `title`, `details`, `summary`, `priority`, `labels` and `estimateHours` but never read them from `req.body`, so the first access threw a ReferenceError (-> 500).
Fix: `const { title, details, summary, priority, labels, estimateHours } = req.body || {};`

Changed file(s): `src/controller.js`
