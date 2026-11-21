import { Item } from './model.js';
import { isValidId } from './store.js';

const UPDATABLE = ['name', 'agenda', 'teaser', 'type', 'tags', 'capacity', 'public'];

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

export const listItems = async (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
    return res.status(400).json({ message: 'Invalid pagination parameters' });
  }
  const pageSize = Math.min(limit, 50);

  const filter = { public: true };
  if (req.query.type) filter.type = req.query.type;

  let items = await Item.find(filter);

  if (req.query.q) {
    const needle = String(req.query.q).toLowerCase();
    items = items.filter((i) => i.name.toLowerCase().includes(needle));
  }

  items.sort(newestFirst);

  const total = items.length;
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);
  await Promise.all(pageItems.map((i) => i.populate()));

  res.status(200).json({
    events: pageItems,
    page,
    limit: pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
};

export const myItems = async (req, res) => {
  const items = await Item.find();
  items.sort(newestFirst);
  await Promise.all(items.map((i) => i.populate()));
  res.status(200).json({ events: items });
};

export const getItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Event not found' });
  }

  await item.populate();
  res.status(200).json({ event: item });
};

export const createItem = async (req, res) => {
  const { name, agenda, teaser, type, tags, capacity } = req.body || {};

  if (!isNonEmptyString(name) || !isNonEmptyString(agenda) || !type) {
    return res.status(400).json({
      message: 'name, agenda and type are required',
    });
  }

  const item = new Item({
    name: name.trim(),
    agenda,
    teaser: teaser || agenda.substring(0, 140),
    type,
    tags: tags || [],
    capacity,
    public: true,
    organizer: req.user._id,
  });

  await item.save();
  await item.populate();

  res.status(201).json({
    message: 'Event created successfully',
    event: item,
  });
};

export const updateItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (item.organizer !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized to update this event' });
  }

  const body = req.body || {};
  for (const f of UPDATABLE) {
    if (body[f] !== undefined) item[f] = body[f];
  }

  await item.save();
  await item.populate();

  res.status(200).json({
    message: 'Event updated successfully',
    event: item,
  });
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (item.organizer !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized to delete this event' });
  }

  await Item.findByIdAndDelete(id);

  res.status(200).json({ message: 'Event deleted successfully' });
};
