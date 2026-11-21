export async function loadConfig(fetchConfig, fallback) {
  try {
    return await fetchConfig();
  } catch (err) {
    return fallback;
  }
}

export async function withCleanup(task, cleanup) {
  try {
    return await task();
  } finally {
    cleanup();
  }
}
