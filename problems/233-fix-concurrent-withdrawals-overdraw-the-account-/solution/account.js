function check(amount) {
  if (typeof amount !== 'number' || !(amount > 0)) throw new RangeError('amount must be a positive number');
}

export class Account {
  #tail = Promise.resolve();

  constructor(store) {
    this.store = store;
  }

  #enqueue(op) {
    const p = this.#tail.then(op);
    this.#tail = p.then(() => {}, () => {});
    return p;
  }

  balance() {
    return this.#enqueue(() => this.store.read());
  }

  deposit(amount) {
    return this.#enqueue(async () => {
      check(amount);
      const balance = await this.store.read();
      await this.store.write(balance + amount);
      return balance + amount;
    });
  }

  withdraw(amount) {
    return this.#enqueue(async () => {
      check(amount);
      const balance = await this.store.read();
      if (balance < amount) throw new Error('Insufficient funds');
      await this.store.write(balance - amount);
      return balance - amount;
    });
  }
}
