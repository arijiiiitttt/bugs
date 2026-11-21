export function scheduleAll(log) {
  return new Promise((resolve) => {
    log.push('sync');
    queueMicrotask(() => log.push('micro'));
    setImmediate(() => log.push('immediate'));
    setTimeout(() => {
      log.push('timeout');
      resolve(log);
    }, 150);
  });
}
