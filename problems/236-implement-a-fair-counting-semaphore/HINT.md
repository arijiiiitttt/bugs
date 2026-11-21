# Hint

Keep `available` and a queue of waiter callbacks. `release`: if the queue is not empty hand the permit to the first waiter, else increment `available`. Guard the returned function with a `released` flag.
