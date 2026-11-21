export class TinyEmitter {
  #map = new Map();

  #add(event, fn, once) {
    if (!this.#map.has(event)) this.#map.set(event, []);
    this.#map.get(event).push({ fn, once });
    return this;
  }

  #remove(event, entry) {
    const list = this.#map.get(event);
    if (!list) return;
    const i = list.indexOf(entry);
    if (i !== -1) list.splice(i, 1);
    if (list.length === 0) this.#map.delete(event);
  }

  on(event, fn) {
    return this.#add(event, fn, false);
  }

  once(event, fn) {
    return this.#add(event, fn, true);
  }

  off(event, fn) {
    const list = this.#map.get(event);
    if (!list) return this;
    const i = list.findLastIndex((e) => e.fn === fn);
    if (i !== -1) this.#remove(event, list[i]);
    return this;
  }

  listenerCount(event) {
    return this.#map.get(event)?.length ?? 0;
  }

  emit(event, ...args) {
    const list = this.#map.get(event);
    if (!list || list.length === 0) {
      if (event === 'error') throw args[0] instanceof Error ? args[0] : new Error('Unhandled error.');
      return false;
    }
    for (const entry of [...list]) {
      if (entry.once) this.#remove(event, entry);
      entry.fn.apply(this, args);
    }
    return true;
  }
}
