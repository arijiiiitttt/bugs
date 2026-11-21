# Explanation

`async function collect(stream) { const out = []; for await (const c of stream) out.push(c); return out; }` - errors thrown by the async iterator reject the promise.
