# Explanation

Chain every operation on a private "tail" promise: `const p = this.#tail.then(op); this.#tail = p.then(noop, noop); return p;`. That makes read-modify-write atomic per account and keeps call order, while errors do not poison the queue.
