# Explanation

Race manually inside `new Promise`: `signal.addEventListener("abort", onAbort, { once: true })` and remove the listener in both branches of `promise.then(onOk, onFail)` **before** resolving/rejecting.
