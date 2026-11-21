# Hint

There are **7 separate bugs**. Fix them one at a time: run the tests, take the first failure, fix its cause, repeat.

- The bug is not in the controller. Look at what `save()` does for a new document.
- Only `_id`, `name`, `email` and `bio` may be exposed. Look at `toJSON` in the model.
- What does the README say about users that are not the owner?
- Does the handler actually delete anything?
- A helper `newestFirst` exists.
- Look at the filter passed to `Item.find`.
- What runs when no route matches?
