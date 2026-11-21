import { Transform } from 'node:stream';

export function createUpperCase() {
  return new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk.toString().toUpperCase());
    },
  });
}
