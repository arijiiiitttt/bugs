import { Transform } from 'node:stream';

export function createFilter(predicate) {
  return new Transform({
    objectMode: true,
    async transform(chunk, encoding, callback) {
      try {
        if (await predicate(chunk)) this.push(chunk);
        callback();
      } catch (err) {
        callback(err);
      }
    },
  });
}
