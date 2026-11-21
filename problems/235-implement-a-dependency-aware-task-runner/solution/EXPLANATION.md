# Explanation

`start(name)` returns a cached promise: await the dependency promises, then `run(depResults)`. Cycle check = DFS with states 0/1/2. Finally `Promise.all` over all names and build the result object.
