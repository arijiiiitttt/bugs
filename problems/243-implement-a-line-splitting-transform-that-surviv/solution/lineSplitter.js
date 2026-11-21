import { Transform } from 'node:stream';
import { StringDecoder } from 'node:string_decoder';

const stripCR = (line) => (line.endsWith('\r') ? line.slice(0, -1) : line);

export function createLineSplitter() {
  const decoder = new StringDecoder('utf8');
  let rest = '';
  return new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
      rest += typeof chunk === 'string' ? chunk : decoder.write(chunk);
      const lines = rest.split('\n');
      rest = lines.pop();
      for (const line of lines) this.push(stripCR(line));
      callback();
    },
    flush(callback) {
      rest += decoder.end();
      if (rest.length > 0) this.push(stripCR(rest));
      callback();
    },
  });
}
