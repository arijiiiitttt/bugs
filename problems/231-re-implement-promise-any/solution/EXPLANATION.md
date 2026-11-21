# Explanation

`Promise.resolve(item).then(resolve, (err) => { errors[i] = err; if (--remaining === 0) reject(new AggregateError(errors, ...)); })`
