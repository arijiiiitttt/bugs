# Explanation

`acquire` either decrements `available` or pushes a "grant" callback. The release function calls `#release` once (flag), which shifts the next waiter and grants it, or increments `available`.
