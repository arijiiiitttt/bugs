# Implement TinyEmitter (a mini EventEmitter)

**Track:** Events & streams &nbsp;|&nbsp; **Difficulty:** Medium &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement the class `TinyEmitter` in `src/emitter.js` **without extending Node's `EventEmitter`**.

### API
- `on(event, fn)` - registers a listener, returns `this` (chainable).
- `once(event, fn)` - like `on` but the listener runs at most once.
- `off(event, fn)` - removes **one** registration of `fn` (the most recently added one). It also works for listeners registered with `once` (using the original function). Returns `this`.
- `emit(event, ...args)` - calls the listeners in registration order with `args` and `this` = the emitter. Returns `true` if there was at least one listener, else `false`.
- `listenerCount(event)`.

### Rules
- Listeners added or removed **during** an `emit` do not change which listeners run in that emit (work on a snapshot).
- Emitting `'error'` with **no** `'error'` listener throws the first argument if it is an `Error`, otherwise `new Error('Unhandled error.')`.

## How to work

```bash
npm test -- 241     # run the tests of this problem (replace 241 by the problem number)
```

- Implement the code in `src/emitter.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 241` show the reference solution.
