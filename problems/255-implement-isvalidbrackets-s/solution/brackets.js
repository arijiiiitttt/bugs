export function isValidBrackets(s) {
  const pairs = { '(': ')', '[': ']', '{': '}' };
  const closers = new Set(Object.values(pairs));
  const stack = [];
  for (const ch of s) {
    if (pairs[ch]) stack.push(pairs[ch]);
    else if (closers.has(ch)) {
      if (stack.pop() !== ch) return false;
    }
  }
  return stack.length === 0;
}
