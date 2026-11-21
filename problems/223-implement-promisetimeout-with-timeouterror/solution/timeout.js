export class TimeoutError extends Error {
  constructor(ms) {
    super('Timed out after ' + ms + 'ms');
    this.name = 'TimeoutError';
  }
}

export function promiseTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(ms)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
