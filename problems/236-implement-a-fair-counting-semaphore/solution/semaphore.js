export class Semaphore {
  #available;
  #waiters = [];

  constructor(max) {
    if (!Number.isInteger(max) || max < 1) throw new RangeError('max must be a positive integer');
    this.#available = max;
  }

  get available() {
    return this.#available;
  }

  acquire() {
    return new Promise((resolve) => {
      const grant = () => {
        let released = false;
        resolve(() => {
          if (released) return;
          released = true;
          this.#release();
        });
      };
      if (this.#available > 0) {
        this.#available--;
        grant();
      } else {
        this.#waiters.push(grant);
      }
    });
  }

  #release() {
    const next = this.#waiters.shift();
    if (next) next();
    else this.#available++;
  }

  async withPermit(fn) {
    const release = await this.acquire();
    try {
      return await fn();
    } finally {
      release();
    }
  }
}
