# Explanation

`forEach` ignores the promises returned by its callback. Use `await Promise.all(users.map(async (u) => { await send(u); return u.id; }))` - results come back in input order and rejections propagate.
