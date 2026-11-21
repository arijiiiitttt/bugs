# Explanation

Short-circuit on `===` and NaN, compare prototypes, handle Date/Map/Set explicitly, then compare own keys. A visited map makes cycles terminate.
