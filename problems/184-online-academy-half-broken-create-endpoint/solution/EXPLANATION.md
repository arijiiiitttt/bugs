# Explanation

1. **blurb is not generated automatically**: The fallback `syllabus.substring(0, 120)` was missing: `blurb: blurb || syllabus.substring(0, 120)`.

2. **New courses are not enrolling**: `enrolling` was hard-coded to `false`; it must be `true` on creation.

3. **topics sent by the client are lost**: `topics` was not passed to the `Item` constructor, so the model default (`[]`) was used.

4. **title keeps leading and trailing spaces**: The `title` must be stored trimmed: `title: title.trim()`.
