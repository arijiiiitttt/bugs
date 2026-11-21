# Explanation

Store `timer`/`lastArgs`/`lastThis`. Each call clears the old timer and sets a new one. `flush` clears the timer and calls the invoke function directly.
