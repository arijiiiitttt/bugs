# Explanation

The fallback `instructions.substring(0, 120)` was missing: `summary: summary || instructions.substring(0, 120)`.

Changed file(s): `src/controller.js`
