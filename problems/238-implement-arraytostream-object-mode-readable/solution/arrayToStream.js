import { Readable } from 'node:stream';

export function arrayToStream(items) {
  let i = 0;
  return new Readable({
    objectMode: true,
    read() {
      if (i >= items.length) return this.push(null);
      const item = items[i++];
      if (item === null || item === undefined) {
        return this.destroy(new TypeError('Items must not be null or undefined'));
      }
      this.push(item);
    },
  });
}
