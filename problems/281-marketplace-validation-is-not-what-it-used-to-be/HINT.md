# Hint

There are **6 separate bugs**. Fix them one at a time: run the tests, take the first failure, fix its cause, repeat.

- The allowed values live in the model.
- Look at the model validation.
- A string with only spaces is truthy. What helper does the code already have?
- Which required fields does the controller check?
- Look at the global error handler in `app.js`.
- Body parser errors have a `type` property.
