# Hint

Keep a queue array and an `active` counter. A `next()` function starts queued work while `active < concurrency` and is called again whenever a job ends.
