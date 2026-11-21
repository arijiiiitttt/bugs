# Explanation

Queue entries hold `fn`, `args` and the `resolve/reject` of the outer promise. `next()` shifts one, increments `active`, runs it and decrements + calls `next()` in `finally`.
