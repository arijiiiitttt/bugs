# Explanation

A Map keyed by key gives de-duplication. `queueMicrotask` dispatches after the synchronous callers are done. Slice entries by `maxBatchSize`, await `batchFn(keys)`, validate the length and resolve/reject each deferred by index.
