// Tiny helpers shared by every problem's tests. You do not need to edit this file.
import http from 'node:http';

/**
 * Start an Express app (or any http request listener) on a random free port.
 * Returns { base, close }.
 */
export async function startServer(app) {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return {
    base: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise((resolve) => {
        server.closeAllConnections?.();
        server.close(() => resolve());
      }),
  };
}

/**
 * Make an HTTP call and return { status, headers, text, body }.
 *  - body: object -> sent as JSON
 *  - raw: string  -> sent as-is (use it to send malformed JSON)
 * Requests time out after 2 seconds so a hanging handler fails the test instead of freezing it.
 */
export async function call(base, method, path, { headers = {}, body, raw, timeout = 2000 } = {}) {
  const init = { method, headers: { ...headers }, signal: AbortSignal.timeout(timeout), redirect: 'manual' };
  if (raw !== undefined) {
    init.body = raw;
    init.headers['content-type'] ??= 'application/json';
  } else if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers['content-type'] = 'application/json';
  }
  const res = await fetch(base + path, init);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = undefined;
  }
  return { status: res.status, headers: res.headers, text, body: json };
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
