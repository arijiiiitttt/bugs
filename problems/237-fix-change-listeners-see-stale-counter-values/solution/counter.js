import { EventEmitter } from 'node:events';

export class Counter extends EventEmitter {
  #value = 0;

  get value() {
    return this.#value;
  }

  increment(by = 1) {
    if (by === 0) return;
    const old = this.#value;
    this.#value = old + by;
    this.emit('change', this.#value, old);
  }

  reset() {
    if (this.#value === 0) return;
    const old = this.#value;
    this.#value = 0;
    this.emit('change', 0, old);
  }
}
