import { Item } from './model.js';
import { isValidId } from './store.js';

const UPDATABLE = ['title', 'body', 'preview', 'topic', 'tags', 'votes', 'open'];

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

export const listItems = async (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
    return res.status(400).json({ message: 'Invalid pagination parameters' });
  }
  const pageSize = Math.min(limit, 50);

  const filter = { open: true };
  if (req.query.topic) filter.topic = req.query.topic;

  let items = await Item.find(filter);

  if (req.query.q) {
    const needle = String(req.query.q).toLowerCase();
    items = items.filter((i) => i.title.toLowerCase().includes(needle));
  }

  items.sort(newestFirst);

  const total = items.length;
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);
  await Promise.all(pageItems.map((i) => i.populate()));

  res.status(200).json({
    questions: pageItems,
    page,
    limit: pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
};

export const myItems = async (req, res) => {
  const items = await Item.find({ asker: req.user._id });
  items.sort(newestFirst);
  await Promise.all(items.map((i) => i.populate()));
  res.status(200).json({ questions: items });
};

export const getItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid question ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Question not found' });
  }

  await item.populate();
  res.status(200).json({ question: item });
};

export const createItem = async (req, res) => {
  const { title, body, preview, topic, tags, votes } = req.body || {};

  if (!isNonEmptyString(title) || !isNonEmptyString(body) || !topic) {
    return res.status(400).json({
      message: 'title, body and topic are required',
    });
  }

  const item = new Item({
    title: title.trim(),
    body,
    preview: preview || body.substring(0, 100),
    topic,
    tags: tags || [],
    votes,
    open: true,
    asker: req.user._id,
  });

  await item.save();
  await item.populate();

  res.status(201).json({
    message: 'Question created successfully',
    question: item,
  });
};

export const updateItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid question ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Question not found' });
  }

  if (item.asker !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized to update this question' });
  }

  const body = req.body || {};
  for (const f of UPDATABLE) {
    if (body[f] !== undefined) item[f] = body[f];
  }

  await item.save();
  await item.populate();

  res.status(200).json({
    message: 'Question updated successfully',
    question: item,
  });
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid question ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Question not found' });
  }

  if (item.asker !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized to delete this question' });
  }

  await Item.findByIdAndDelete(id);

  res.status(200).json({ message: 'Question deleted successfully' });
};
