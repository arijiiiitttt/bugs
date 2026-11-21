# Explanation

1. **Invalid genre values are accepted**: The model validation lost its `CATEGORIES.includes(...)` check.

2. **pages accepts strings and negative numbers**: The numeric validation of `pages` was removed from `validate()` in the model.

3. **Whitespace-only title gives the wrong error**: The check used `!title` instead of `!isNonEmptyString(title)`, so blank titles slipped past the controller validation.

4. **Missing plot returns the wrong error message**: `plot` was removed from the controller-level required check; it must be validated together with `title` and `genre`.

5. **Validation errors are reported as server errors**: The error handler mapped `ValidationError` to status 500 instead of 400.

6. **Malformed JSON causes a 500**: The error handler lost its `entity.parse.failed` branch.
