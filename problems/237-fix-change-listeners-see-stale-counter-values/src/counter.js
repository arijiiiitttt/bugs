import { EventEmitter } from 'node:events';

export class Counter extends EventEmitter {
  #value = 0;

  get value() {
    return this.#value;
  }

  increment(by = 1) {
    const old = this.#value;
    this.emit('change', old + by, old);
    this.#value = old + by;
  }

  reset() {
    const old = this.#value;
    this.emit('change', 0, old);
    this.#value = 0;
  }
}
