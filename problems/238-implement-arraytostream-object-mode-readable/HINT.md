# Hint

`new Readable({ objectMode: true, read() { ... } })` - keep an index; `this.push(item)` for each element and `this.push(null)` at the end.
