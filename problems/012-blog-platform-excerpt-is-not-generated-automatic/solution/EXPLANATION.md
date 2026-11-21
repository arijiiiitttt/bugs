# Explanation

The fallback `content.substring(0, 160)` was missing: `excerpt: excerpt || content.substring(0, 160)`.

Changed file(s): `src/controller.js`
