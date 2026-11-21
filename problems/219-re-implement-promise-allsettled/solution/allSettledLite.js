export function allSettledLite(values) {
  return Promise.all(
    Array.from(values, (v) =>
      Promise.resolve(v).then(
        (value) => ({ status: 'fulfilled', value }),
        (reason) => ({ status: 'rejected', reason }),
      ),
    ),
  );
}
