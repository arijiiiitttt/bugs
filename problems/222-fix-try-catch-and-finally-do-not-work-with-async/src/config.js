export async function loadConfig(fetchConfig, fallback) {
  try {
    return fetchConfig();
  } catch (err) {
    return fallback;
  }
}

export async function withCleanup(task, cleanup) {
  try {
    return task();
  } finally {
    cleanup();
  }
}
