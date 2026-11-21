# Hint

Convert each input with `Promise.resolve(v).then(onOk, onFail)` so that every derived promise fulfils, then use `Promise.all`.
