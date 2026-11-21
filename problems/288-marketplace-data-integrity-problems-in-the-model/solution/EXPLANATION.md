# Explanation

1. **`createdAt` changes when a product is edited**: `save()` overwrote `createdAt` when updating an existing document.

2. **Created products disappear**: In `model.js`, `save()` generated the id and timestamps but forgot `db.items.push(this.toDoc())`.

3. **Deleting a product removes the wrong one**: `findByIdAndDelete` spliced `idx + 1` instead of `idx`.

4. **Wrong default value for stock**: The constructor assigned `0 + 1` instead of `0`.

5. **Invalid department values are accepted**: The model validation lost its `CATEGORIES.includes(...)` check.

6. **Updates are not persisted**: `await item.save()` was missing in `updateItem`.
