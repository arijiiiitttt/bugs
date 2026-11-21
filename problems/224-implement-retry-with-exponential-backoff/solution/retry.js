const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function retry(fn, { retries = 3, delay = 10, factor = 2, shouldRetry = () => true, sleep = defaultSleep } = {}) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      if (attempt > retries || !shouldRetry(err)) throw err;
      await sleep(delay * factor ** (attempt - 1));
    }
  }
}
