# Hint

There are **6 separate bugs**. Fix them one at a time: run the tests, take the first failure, fix its cause, repeat.

- Look at `save()` in the model.
- The bug is not in the controller. Look at what `save()` does for a new document.
- The bug is in the model. Look at the index passed to `splice`.
- Defaults are applied in the model constructor.
- The allowed values live in the model.
- Changing a document in memory is not the same as saving it.
