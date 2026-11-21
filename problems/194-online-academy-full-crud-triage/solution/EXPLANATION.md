# Explanation

1. **Create answers with the wrong status code**: The handler sent 200 instead of 201.

2. **Updates are not persisted**: `await item.save()` was missing in `updateItem`.

3. **Deleted courses are still there**: The `Item.findByIdAndDelete(id)` call was missing.

4. **GET by id has the wrong response shape**: The handler sent the item directly instead of `{ course: item }`.

5. **Hidden courses show up in the public list**: The filter `{ enrolling: true }` was replaced by an empty filter.

6. **"My courses" hides my drafts**: The filter also required `enrolling: true`; owners must see all of their items.
