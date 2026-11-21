import { Item } from './model.js';
import { isValidId } from './store.js';

const UPDATABLE = ['title', 'syllabus', 'blurb', 'level', 'topics', 'durationHours', 'enrolling'];

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

export const listItems = async (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
    return res.status(400).json({ message: 'Invalid pagination parameters' });
  }
  const pageSize = Math.min(limit, 50);

  const filter = { enrolling: true };
  if (req.query.level) filter.level = req.query.level;

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
    courses: pageItems,
    page,
    limit: pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
};

export const myItems = async (req, res) => {
  const items = await Item.find({ instructor: req.user._id, enrolling: true });
  items.sort(newestFirst);
  await Promise.all(items.map((i) => i.populate()));
  res.status(200).json({ courses: items });
};

export const getItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Course not found' });
  }

  await item.populate();
  res.status(200).json({ course: item });
};

export const createItem = async (req, res) => {
  const { title, syllabus, blurb, level, topics, durationHours } = req.body || {};

  if (!isNonEmptyString(title) || !isNonEmptyString(syllabus) || !level) {
    return res.status(400).json({
      message: 'title, syllabus and level are required',
    });
  }

  const item = new Item({
    title: title.trim(),
    syllabus,
    blurb: blurb || syllabus.substring(0, 120),
    level,
    topics: topics || [],
    durationHours,
    enrolling: true,
    instructor: req.user._id,
  });

  await item.save();
  await item.populate();

  res.status(201).json({
    message: 'Course created successfully',
    course: item,
  });
};

export const updateItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Course not found' });
  }

  if (item.instructor !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized to update this course' });
  }

  const body = req.body || {};
  for (const f of UPDATABLE) {
    if (body[f] !== undefined) item[f] = body[f];
  }

  await item.save();
  await item.populate();

  res.status(200).json({
    message: 'Course updated successfully',
    course: item,
  });
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Course not found' });
  }

  if (item.instructor !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized to delete this course' });
  }

  await Item.findByIdAndDelete(id);

  res.status(200).json({ message: 'Course deleted successfully' });
};
