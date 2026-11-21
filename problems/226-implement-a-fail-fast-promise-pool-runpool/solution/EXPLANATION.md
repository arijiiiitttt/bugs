# Explanation

Workers pull from a shared `next` index and stop when `failed` is set. `await Promise.all(workers)` rejects on the first failure and results are written by index to keep the order.
