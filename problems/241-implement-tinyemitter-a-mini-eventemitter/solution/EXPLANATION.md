# Explanation

A Map of event -> array of entries. `emit` loops over `[...list]`; for once-entries it removes that exact entry (by identity) before calling. `off` uses `findLastIndex` to remove the most recent registration.
