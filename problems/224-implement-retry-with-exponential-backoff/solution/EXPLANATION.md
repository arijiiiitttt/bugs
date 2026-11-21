# Explanation

Loop attempts from 1; on error throw if `attempt > retries || !shouldRetry(err)`, otherwise `await sleep(delay * factor ** (attempt - 1))`.
