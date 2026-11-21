import { Item } from './model.js';
import { isValidId } from './store.js';

const UPDATABLE = ['name', 'instructions', 'summary', 'cuisine', 'tags', 'cookTime', 'published'];

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

export const listItems = async (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
    return res.status(400).json({ message: 'Invalid pagination parameters' });
  }
  const pageSize = Math.min(limit, 50);

  const filter = { published: true };
  if (req.query.cuisine) filter.cuisine = req.query.cuisine;

  let items = await Item.find(filter);

  if (req.query.q) {
    const needle = String(req.query.q).toLowerCase();
    items = items.filter((i) => i.name.toLowerCase().includes(needle));
  }

  items.sort(newestFirst);

  const total = items.length;
  const start = page * pageSize;
  const pageItems = items.slice(start, start + pageSize);
  await Promise.all(pageItems.map((i) => i.populate()));

  res.status(200).json({
    recipes: pageItems,
    page,
    limit: pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
};

export const myItems = async (req, res) => {
  const items = await Item.find({ chef: req.user._id });
  items.sort(newestFirst);
  await Promise.all(items.map((i) => i.populate()));
  res.status(200).json({ recipes: items });
};

export const getItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid recipe ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  await item.populate();
  res.status(200).json({ recipe: item });
};

export const createItem = async (req, res) => {
  const { name, instructions, summary, cuisine, tags, cookTime } = req.body || {};

  if (!isNonEmptyString(name) || !isNonEmptyString(instructions) || !cuisine) {
    return res.status(400).json({
      message: 'name, instructions and cuisine are required',
    });
  }

  const item = new Item({
    name: name.trim(),
    instructions,
    summary: summary || instructions.substring(0, 120),
    cuisine,
    tags: tags || [],
    cookTime,
    published: true,
    chef: req.user._id,
  });

  await item.save();
  await item.populate();

  res.status(201).json({
    message: 'Recipe created successfully',
    recipe: item,
  });
};

export const updateItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid recipe ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  if (item.chef !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized to update this recipe' });
  }

  const body = req.body || {};
  for (const f of UPDATABLE) {
    if (body[f] !== undefined) item[f] = body[f];
  }

  await item.save();
  await item.populate();

  res.status(200).json({
    message: 'Recipe updated successfully',
    recipe: item,
  });
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Invalid recipe ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  if (item.chef !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized to delete this recipe' });
  }

  await Item.findByIdAndDelete(id);

  res.status(200).json({ message: 'Recipe deleted successfully' });
};
