# Hint

There are **7 separate bugs**. Fix them one at a time: run the tests, take the first failure, fix its cause, repeat.

- Which status code means "Created"?
- Compare the response in the README with what `res.json(...)` sends.
- Mongoose-style models need `populate` before the document is sent.
- Compare the fields passed to `new Item({...})` with the request body fields.
- Look closely at the arguments of `substring`.
- Where does the value of `open` come from? Should the client control it?
- Defaults are applied in the model constructor.
