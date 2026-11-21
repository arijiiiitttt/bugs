export function scheduleAll(log) {
  return new Promise((resolve) => {
    setTimeout(() => {
      log.push('timeout');
      resolve(log);
    }, 150);
    setImmediate(() => log.push('immediate'));
    log.push('micro');
    Promise.resolve().then(() => log.push('sync'));
  });
}
