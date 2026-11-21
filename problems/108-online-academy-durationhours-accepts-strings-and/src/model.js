import { db, newId } from './store.js';

export const CATEGORIES = ['Beginner', 'Intermediate', 'Advanced'];

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const FIELDS = ['title', 'syllabus', 'blurb', 'level', 'topics', 'durationHours', 'enrolling', 'instructor'];

function validate(doc) {
  if (typeof doc.title !== 'string' || !doc.title.trim()) throw new ValidationError('title is required');
  if (typeof doc.syllabus !== 'string' || !doc.syllabus.trim()) throw new ValidationError('syllabus is required');
  if (doc.blurb !== undefined && typeof doc.blurb !== 'string') throw new ValidationError('blurb must be a string');
  if (!CATEGORIES.includes(doc.level)) throw new ValidationError('Invalid level');
  if (!Array.isArray(doc.topics) || !doc.topics.every((t) => typeof t === 'string')) throw new ValidationError('topics must be an array of strings');
  if (typeof doc.enrolling !== 'boolean') throw new ValidationError('enrolling must be a boolean');
}

/** A very small Mongoose-like model backed by the in-memory store. */
export class Item {
  constructor(data = {}) {
    Object.defineProperty(this, '_populated', { value: false, writable: true, enumerable: false });
    if (data._id !== undefined) this._id = data._id;
    for (const f of FIELDS) if (data[f] !== undefined) this[f] = data[f];
    if (this.topics === undefined) this.topics = [];
    if (this.durationHours === undefined) this.durationHours = 10;
    if (this.enrolling === undefined) this.enrolling = true;
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
      const user = db.users.find((u) => u._id === this.instructor);
      out.instructor = user ? { _id: user._id, name: user.name, email: user.email, bio: user.bio } : null;
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
      this.updatedAt = now;
      const idx = db.items.findIndex((d) => d._id === this._id);
      db.items[idx] = this.toDoc();
    }
    return this;
  }

  static async findById(id) {
    const doc = db.items.find((d) => d._id === id);
    return doc ? new Item(doc) : null;
  }

  /** Equality filter, e.g. Item.find({ enrolling: true }) */
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
