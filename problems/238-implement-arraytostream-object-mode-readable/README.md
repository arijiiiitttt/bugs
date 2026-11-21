# Implement arrayToStream (object-mode Readable)

**Track:** Events & streams &nbsp;|&nbsp; **Difficulty:** Easy &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `arrayToStream(items)` in `src/arrayToStream.js`. It returns an **object-mode** `Readable` that emits every element of `items` in order and then ends.

### Rules
- An empty array gives a stream that ends immediately without emitting data.
- Elements are emitted unchanged (same object identity).
- If an element is `null` or `undefined` the stream is destroyed with a `TypeError('Items must not be null or undefined')` (items before it have already been emitted).
- `stream.readableObjectMode` must be `true`.

## How to work

```bash
npm test -- 238     # run the tests of this problem (replace 238 by the problem number)
```

- Implement the code in `src/arrayToStream.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 238` show the reference solution.
