# Explanation

1. **GET with an invalid id answers 404**: The `isValidId` check was missing in `getItem`.

2. **GET of an unknown course crashes**: The `if (!item)` branch was missing in `getItem`, so `item.populate()` threw.

3. **GET by id returns the owner as a raw id**: The `await item.populate()` call was missing in `getItem`.

4. **Hidden courses show up in the public list**: The filter `{ enrolling: true }` was replaced by an empty filter.

5. **Filtering by level does nothing**: The line that copies `req.query.level` into the filter was removed.

6. **Invalid `page`/`limit` values are not rejected**: The pagination validation block was removed from `listItems`.
