# Explanation

1. **Created courses disappear**: In `model.js`, `save()` generated the id and timestamps but forgot `db.items.push(this.toDoc())`.

2. **The instructor object leaks private user data**: `toJSON()` returned the whole user record instead of picking the 4 public fields.

3. **Anyone can edit any course**: The ownership check (403) was removed from `updateItem`.

4. **Deleted courses are still there**: The `Item.findByIdAndDelete(id)` call was missing.

5. **The list is not sorted**: The `items.sort(newestFirst)` call was removed from `listItems`.

6. **"My courses" shows everybody's courses**: The owner filter was removed from `myItems`.

7. **Unknown routes do not return the JSON 404**: The catch-all 404 middleware was removed from `app.js`.
