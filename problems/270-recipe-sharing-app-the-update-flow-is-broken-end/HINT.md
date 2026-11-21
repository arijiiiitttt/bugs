# Hint

There are **6 separate bugs**. Fix them one at a time: run the tests, take the first failure, fix its cause, repeat.

- Changing a document in memory is not the same as saving it.
- What happens to fields that are not in the body?
- Timestamps are maintained in the model `save()`.
- Which fields are allowed to change? Look at the whitelist.
- There is a validation helper for ids.
- Check the status code of the "not found" branch.
