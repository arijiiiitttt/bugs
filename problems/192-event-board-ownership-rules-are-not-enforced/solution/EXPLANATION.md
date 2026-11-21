# Explanation

1. **Anyone can edit any event**: The ownership check (403) was removed from `updateItem`.

2. **Anyone can delete any event**: The ownership check (403) was removed from `deleteItem`.

3. **Deleting a event removes the wrong one**: `findByIdAndDelete` spliced `idx + 1` instead of `idx`.

4. **Updates are not persisted**: `await item.save()` was missing in `updateItem`.
