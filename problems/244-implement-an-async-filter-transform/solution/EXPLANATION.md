# Explanation

A Transform processes one chunk at a time, so awaiting inside `transform` keeps the order. Errors are passed to the callback which destroys the stream.
