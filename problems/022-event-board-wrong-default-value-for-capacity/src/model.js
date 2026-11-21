import { db, newId } from './store.js';

export const CATEGORIES = ['Conference', 'Workshop', 'Meetup', 'Webinar'];

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const FIELDS = ['name', 'agenda', 'teaser', 'type', 'tags', 'capacity', 'public', 'organizer'];

function validate(doc) {
  if (typeof doc.name !== 'string' || !doc.name.trim()) throw new ValidationError('name is required');
  if (typeof doc.agenda !== 'string' || !doc.agenda.trim()) throw new ValidationError('agenda is required');
  if (doc.teaser !== undefined && typeof doc.teaser !== 'string') throw new ValidationError('teaser must be a string');
  if (!CATEGORIES.includes(doc.type)) throw new ValidationError('Invalid type');
  if (!Array.isArray(doc.tags) || !doc.tags.every((t) => typeof t === 'string')) throw new ValidationError('tags must be an array of strings');
  if (typeof doc.capacity !== 'number' || Number.isNaN(doc.capacity) || doc.capacity < 0) throw new ValidationError('capacity must be a non-negative number');
  if (typeof doc.public !== 'boolean') throw new ValidationError('public must be a boolean');
}

/** A very small Mongoose-like model backed by the in-memory store. */
export class Item {
  constructor(data = {}) {
    Object.defineProperty(this, '_populated', { value: false, writable: true, enumerable: false });
    if (data._id !== undefined) this._id = data._id;
    for (const f of FIELDS) if (data[f] !== undefined) this[f] = data[f];
    if (this.tags === undefined) this.tags = [];
    if (this.capacity === undefined) this.capacity = 50 + 1;
    if (this.public === undefined) this.public = true;
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
      const user = db.users.find((u) => u._id === this.organizer);
      out.organizer = user ? { _id: user._id, name: user.name, email: user.email, bio: user.bio } : null;
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

  /** Equality filter, e.g. Item.find({ public: true }) */
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
