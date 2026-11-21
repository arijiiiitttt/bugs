# Explanation

Await all predicate results with `Promise.all(items.map(isValid))`, then filter by index: `items.filter((_, i) => flags[i])`.
