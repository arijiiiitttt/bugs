import { db, newId } from './store.js';

export const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food'];

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const FIELDS = ['title', 'content', 'excerpt', 'category', 'tags', 'readTime', 'published', 'author'];

function validate(doc) {
  if (typeof doc.title !== 'string' || !doc.title.trim()) throw new ValidationError('title is required');
  if (typeof doc.content !== 'string' || !doc.content.trim()) throw new ValidationError('content is required');
  if (doc.excerpt !== undefined && typeof doc.excerpt !== 'string') throw new ValidationError('excerpt must be a string');
  if (!CATEGORIES.includes(doc.category)) throw new ValidationError('Invalid category');
  if (!Array.isArray(doc.tags) || !doc.tags.every((t) => typeof t === 'string')) throw new ValidationError('tags must be an array of strings');
  if (typeof doc.readTime !== 'number' || Number.isNaN(doc.readTime) || doc.readTime < 0) throw new ValidationError('readTime must be a non-negative number');
  if (typeof doc.published !== 'boolean') throw new ValidationError('published must be a boolean');
}

/** A very small Mongoose-like model backed by the in-memory store. */
export class Item {
  constructor(data = {}) {
    Object.defineProperty(this, '_populated', { value: false, writable: true, enumerable: false });
    if (data._id !== undefined) this._id = data._id;
    for (const f of FIELDS) if (data[f] !== undefined) this[f] = data[f];
    if (this.tags === undefined) this.tags = [];
    if (this.readTime === undefined) this.readTime = 5;
    if (this.published === undefined) this.published = true;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  toDoc() {
    const doc = { _id: this._id };
    for (const f of FIELDS) doc[f] = this[f];
    doc.createdAt = this.createdAt;
    doc.updatedAt = this.updatedAt;
    return doc;
  }

  toJSON() {
    const out = this.toDoc();
    if (this._populated) {
      const user = db.users.find((u) => u._id === this.author);
      out.author = user ? { _id: user._id, name: user.name, email: user.email, bio: user.bio } : null;
    }
    return out;
  }

  /** Replace the owner id by the owner's public profile in toJSON(). */
  async populate() {
    this._populated = true;
    return this;
  }

  async save() {
    validate(this);
    const now = new Date().toISOString();
    if (!this._id) {
      this._id = newId();
      this.createdAt = now;
      this.updatedAt = now;
      db.items.push(this.toDoc());
    } else {
      const idx = db.items.findIndex((d) => d._id === this._id);
      db.items[idx] = this.toDoc();
    }
    return this;
  }

  static async findById(id) {
    const doc = db.items.find((d) => d._id === id);
    return doc ? new Item(doc) : null;
  }

  /** Equality filter, e.g. Item.find({ published: true }) */
  static async find(filter = {}) {
    return db.items
      .filter((d) => Object.entries(filter).every(([k, v]) => d[k] === v))
      .map((d) => new Item(d));
  }

  static async findByIdAndDelete(id) {
    const idx = db.items.findIndex((d) => d._id === id);
    if (idx === -1) return null;
    const [removed] = db.items.splice(idx, 1);
    return new Item(removed);
  }
}
