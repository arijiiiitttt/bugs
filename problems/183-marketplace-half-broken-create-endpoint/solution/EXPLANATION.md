# Explanation

1. **summary is not generated automatically**: The fallback `description.substring(0, 100)` was missing: `summary: summary || description.substring(0, 100)`.

2. **New products are not active**: `active` was hard-coded to `false`; it must be `true` on creation.

3. **tags sent by the client are lost**: `tags` was not passed to the `Item` constructor, so the model default (`[]`) was used.

4. **name keeps leading and trailing spaces**: The `name` must be stored trimmed: `name: name.trim()`.
