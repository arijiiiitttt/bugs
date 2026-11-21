# Explanation

The fallback `body.substring(0, 100)` was missing: `preview: preview || body.substring(0, 100)`.

Changed file(s): `src/controller.js`
