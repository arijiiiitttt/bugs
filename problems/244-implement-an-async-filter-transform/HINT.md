# Hint

In `transform(chunk, enc, cb)` `await` the predicate, `this.push(chunk)` when truthy, then call `cb()` (or `cb(err)` in the `catch`).
