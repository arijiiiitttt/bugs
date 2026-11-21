# Explanation

`cache.set(key, p); p.catch(() => cache.delete(key));` - caching the promise (not the value) gives in-flight sharing for free.
