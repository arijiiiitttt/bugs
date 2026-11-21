import { StringDecoder } from 'node:string_decoder';

export async function readText(readable) {
  const decoder = new StringDecoder('utf8');
  let text = '';
  for await (const chunk of readable) {
    text += typeof chunk === 'string' ? chunk : decoder.write(chunk);
  }
  return text + decoder.end();
}
