export function debounce(fn, wait, scheduler = { setTimeout, clearTimeout }) {
  let timer = null;
  let lastArgs;
  let lastThis;

  const invoke = () => {
    timer = null;
    const args = lastArgs;
    const self = lastThis;
    lastArgs = lastThis = undefined;
    return fn.apply(self, args);
  };

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    if (timer !== null) scheduler.clearTimeout(timer);
    timer = scheduler.setTimeout(invoke, wait);
  }

  debounced.cancel = () => {
    if (timer !== null) scheduler.clearTimeout(timer);
    timer = null;
    lastArgs = lastThis = undefined;
  };

  debounced.flush = () => {
    if (timer === null) return undefined;
    scheduler.clearTimeout(timer);
    return invoke();
  };

  return debounced;
}
