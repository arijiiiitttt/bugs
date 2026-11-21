# Explanation

The `read()` implementation pushes one item per call (or `null` at the end). Invalid items call `this.destroy(error)`.
