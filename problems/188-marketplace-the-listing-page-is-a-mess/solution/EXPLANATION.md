# Explanation

1. **The list is not sorted**: The `items.sort(newestFirst)` call was removed from `listItems`.

2. **Page 1 skips the first results**: `start` was `page * pageSize` instead of `(page - 1) * pageSize`.

3. **Search is case-sensitive**: The `name` was not lower-cased before `includes(needle)`.

4. **`totalPages` is too small**: `Math.floor` was used instead of `Math.ceil`.
