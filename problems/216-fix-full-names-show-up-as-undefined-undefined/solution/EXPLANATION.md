# Explanation

`repo.findUser(id)` must be awaited, otherwise `user` is a (truthy) promise. `getFullNames` must wrap the `map` in `Promise.all`.
