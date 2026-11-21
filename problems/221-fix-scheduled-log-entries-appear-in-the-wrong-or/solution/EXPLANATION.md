# Explanation

The labels `sync` and `micro` were swapped: `sync` must be pushed directly and `micro` inside `queueMicrotask` / `Promise.resolve().then`. Event-loop order: sync code, microtasks, check phase (`setImmediate`), later timers.
