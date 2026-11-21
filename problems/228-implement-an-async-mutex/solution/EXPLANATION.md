# Explanation

`const run = this.#tail.then(() => fn()); this.#tail = run.then(noop, noop);` - errors reach the caller through `run` but never break the chain.
