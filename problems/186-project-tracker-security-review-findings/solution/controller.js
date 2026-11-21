import { Item } from './model.js';
import { isValidId } from './store.js';

const UPDATABLE = ['title', 'details', 'summary', 'priority', 'labels', 'estimateHours', 'open'];

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
  if (req.query.priority) filter.priority = req.query.priority;

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
    tasks: pageItems,
    page,
    limit: pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
};

export const myItems = async (req, res) => {
  const items = await Item.find({ assignee: req.user._id });
  items.sort(newestFirst);
  await Promise.all(items.map((i) => i.populate()));
  res.status(200).json({ tasks: items });
};

export const getItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Task not found' });
  }

  await item.populate();
  res.status(200).json({ task: item });
};

export const createItem = async (req, res) => {
  const { title, details, summary, priority, labels, estimateHours } = req.body || {};

  if (!isNonEmptyString(title) || !isNonEmptyString(details) || !priority) {
    return res.status(400).json({
      message: 'title, details and priority are required',
    });
  }

  const item = new Item({
    title: title.trim(),
    details,
    summary: summary || details.substring(0, 80),
    priority,
    labels: labels || [],
    estimateHours,
    open: true,
    assignee: req.user._id,
  });

  await item.save();
  await item.populate();

  res.status(201).json({
    message: 'Task created successfully',
    task: item,
  });
};

export const updateItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (item.assignee !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized to update this task' });
  }

  const body = req.body || {};
  for (const f of UPDATABLE) {
    if (body[f] !== undefined) item[f] = body[f];
  }

  await item.save();
  await item.populate();

  res.status(200).json({
    message: 'Task updated successfully',
    task: item,
  });
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (item.assignee !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized to delete this task' });
  }

  await Item.findByIdAndDelete(id);

  res.status(200).json({ message: 'Task deleted successfully' });
};
