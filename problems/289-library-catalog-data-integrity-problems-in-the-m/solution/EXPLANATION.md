# Explanation

1. **`createdAt` changes when a book is edited**: `save()` overwrote `createdAt` when updating an existing document.

2. **Created books disappear**: In `model.js`, `save()` generated the id and timestamps but forgot `db.items.push(this.toDoc())`.

3. **Deleting a book removes the wrong one**: `findByIdAndDelete` spliced `idx + 1` instead of `idx`.

4. **Wrong default value for pages**: The constructor assigned `200 + 1` instead of `200`.

5. **Invalid genre values are accepted**: The model validation lost its `CATEGORIES.includes(...)` check.

6. **Updates are not persisted**: `await item.save()` was missing in `updateItem`.
