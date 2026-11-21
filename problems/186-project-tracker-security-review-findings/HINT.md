# Hint

There are **4 separate bugs**. Fix them one at a time: run the tests, take the first failure, fix its cause, repeat.

- The owner must come from authentication, not from the request body.
- Only `_id`, `name`, `email` and `bio` may be exposed. Look at `toJSON` in the model.
- Which fields are allowed to change? Look at the whitelist.
- What does `req.user` contain when the id does not belong to anyone?
