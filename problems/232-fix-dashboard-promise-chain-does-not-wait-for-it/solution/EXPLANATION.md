# Explanation

The inner `api.getPosts(...).then(...)` and `api.getNotifications(...).then(...)` promises were not returned, so the chain did not wait for them and their errors were detached. Add `return`.
