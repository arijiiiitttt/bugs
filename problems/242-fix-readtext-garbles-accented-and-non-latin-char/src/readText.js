export async function readText(readable) {
  let text = '';
  for await (const chunk of readable) {
    text += chunk.toString();
  }
  return text;
}
