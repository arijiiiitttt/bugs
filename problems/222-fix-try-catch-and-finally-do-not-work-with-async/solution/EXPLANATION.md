# Explanation

Without `await`, the promise is returned from the `try` block, so `catch` never sees its rejection and `finally` runs right away. Use `return await fetchConfig()` and `return await task()`.
