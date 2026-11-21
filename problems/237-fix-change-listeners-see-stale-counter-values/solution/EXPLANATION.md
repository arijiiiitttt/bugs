# Explanation

The event was emitted before `this.#value` was assigned, and the "no change" cases were not skipped. Set the value, then `emit("change", newValue, oldValue)`; skip `by === 0` and `reset()` at zero.
