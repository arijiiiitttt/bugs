# Explanation

The handler used `title`, `content`, `excerpt`, `category`, `tags` and `readTime` but never read them from `req.body`, so the first access threw a ReferenceError (-> 500).
Fix: `const { title, content, excerpt, category, tags, readTime } = req.body || {};`

Changed file(s): `src/controller.js`
