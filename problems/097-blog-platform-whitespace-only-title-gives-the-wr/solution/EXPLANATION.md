# Explanation

The check used `!title` instead of `!isNonEmptyString(title)`, so blank titles slipped past the controller validation.

Changed file(s): `src/controller.js`
