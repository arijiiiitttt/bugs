export class Mutex {
  #tail = Promise.resolve();
  #count = 0;

  get isLocked() {
    return this.#count > 0;
  }

  runExclusive(fn) {
    this.#count++;
    const run = this.#tail.then(() => fn());
    this.#tail = run.then(() => {}, () => {});
    return run.finally(() => {
      this.#count--;
    });
  }
}
