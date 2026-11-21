# Explanation

1. **Updates are not persisted**: `await item.save()` was missing in `updateItem`.

2. **Updating one field breaks the update**: The loop assigned every updatable field, even the ones that were `undefined`. Only assign fields present in the body.

3. **`updatedAt` never changes**: The `else` branch of `save()` (existing document) did not set `this.updatedAt = now`.

4. **Owners can be changed through the update endpoint**: `chef` was added to the `UPDATABLE` whitelist (mass assignment). The owner must never change.

5. **Invalid ids are not detected on update**: The `isValidId` check was missing in `updateItem`.

6. **Updating a missing recipe answers 200**: The not-found branch used status 200 instead of 404.
