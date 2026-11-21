export async function collect(stream) {
  const out = [];
  for await (const chunk of stream) out.push(chunk);
  return out;
}
