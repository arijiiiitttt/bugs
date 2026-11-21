# Hint

Keep a `pending` Map (key -> deferred). The first `load` of a turn creates it and schedules `queueMicrotask` to dispatch it.
