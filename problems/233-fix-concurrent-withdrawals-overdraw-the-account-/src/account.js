function check(amount) {
  if (typeof amount !== 'number' || !(amount > 0)) throw new RangeError('amount must be a positive number');
}

export class Account {
  constructor(store) {
    this.store = store;
  }

  async balance() {
    return this.store.read();
  }

  async deposit(amount) {
    check(amount);
    const balance = await this.store.read();
    await this.store.write(balance + amount);
    return balance + amount;
  }

  async withdraw(amount) {
    check(amount);
    const balance = await this.store.read();
    if (balance < amount) throw new Error('Insufficient funds');
    await this.store.write(balance - amount);
    return balance - amount;
  }
}
