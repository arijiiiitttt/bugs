# Explanation

Inside the `Promise` executor call `fn.call(this, ...args, (err, v) => err ? reject(err) : resolve(v))`. Exceptions thrown inside the executor automatically reject the promise.
