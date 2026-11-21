# Explanation

1. **excerpt is not generated automatically**: The fallback `content.substring(0, 160)` was missing: `excerpt: excerpt || content.substring(0, 160)`.

2. **New posts are not published**: `published` was hard-coded to `false`; it must be `true` on creation.

3. **tags sent by the client are lost**: `tags` was not passed to the `Item` constructor, so the model default (`[]`) was used.

4. **title keeps leading and trailing spaces**: The `title` must be stored trimmed: `title: title.trim()`.
