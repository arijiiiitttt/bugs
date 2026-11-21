# Explanation

Validate with `Number.isInteger(ms) && ms >= 0`, then `return new Promise((resolve) => setTimeout(resolve, ms, value))`.
