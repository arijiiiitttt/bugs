import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { reset } from '../src/store.js';
import { startServer, call, sleep } from '../../../lib/testkit.js';

// Seed users (see README) and seed items. ITEM(n) is the id of seed item n (1..6).
const JOHN = '64a000000000000000000001';
const SARAH = '64a000000000000000000002';
const MIKE = '64a000000000000000000003';
const EMMA = '64a000000000000000000004';
const JOHN_PROFILE = { _id: JOHN, name: 'John Doe', email: 'john@example.com', bio: 'Full-stack developer' };
const SARAH_PROFILE = { _id: SARAH, name: 'Sarah Smith', email: 'sarah@example.com', bio: 'Travel writer' };
const ITEM = (n) => '5f' + String(n).padStart(22, '0');
const ids = (list) => list.map((x) => x._id);
const as = (userId) => ({ 'x-user-id': userId });

let server;
before(async () => { server = await startServer(app); });
after(async () => { await server.close(); });
beforeEach(() => reset());

const api = (method, path, opts) => call(server.base, method, '/api/books' + path, opts);
const valid = () => ({ title: 'My First Book', plot: 'abcdefghij'.repeat(30), genre: 'Fantasy' });

describe('PUT /api/books/:id', () => {
  it('updates the provided fields and answers 200', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Renamed', pages: 99, tags: ['x'] } });
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Book updated successfully');
    assert.equal(res.body.book._id, ITEM(1));
    assert.equal(res.body.book.title, 'Renamed');
    assert.equal(res.body.book.pages, 99);
    assert.deepEqual(res.body.book.tags, ['x']);
  });

  it('keeps the fields that are not in the request (partial update)', async () => {
    const before = (await api('GET', '/' + ITEM(1))).body.book;
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Only the title changes' } });
    assert.equal(res.status, 200);
    const item = res.body.book;
    assert.equal(item.title, 'Only the title changes');
    assert.equal(item.plot, before.plot);
    assert.equal(item.blurb, before.blurb);
    assert.equal(item.genre, before.genre);
    assert.deepEqual(item.tags, before.tags);
    assert.equal(item.pages, before.pages);
  });

  it('persists the change', async () => {
    await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Persisted title' } });
    const res = await api('GET', '/' + ITEM(1));
    assert.equal(res.body.book.title, 'Persisted title');
  });

  it('returns lister as the populated public profile', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Again' } });
    assert.deepEqual(res.body.book.lister, JOHN_PROFILE);
  });

  it('can switch available off', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { available: false } });
    assert.equal(res.status, 200);
    assert.equal(res.body.book.available, false);
  });

  it('rejects users that are not the owner with 403 and leaves the book untouched', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(SARAH), body: { title: 'Hacked' } });
    assert.equal(res.status, 403);
    assert.equal(res.body.message, 'Not authorized to update this book');
    const after = await api('GET', '/' + ITEM(1));
    assert.equal(after.body.book.title, 'Alpha Primer');
  });

  it('answers 404 for an unknown id', async () => {
    const res = await api('PUT', '/' + ITEM(9), { headers: as(JOHN), body: { title: 'x' } });
    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Book not found');
  });

  it('answers 400 for an invalid id', async () => {
    const res = await api('PUT', '/not-an-id', { headers: as(JOHN), body: { title: 'x' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid book ID');
  });

  it('answers 401 without authentication', async () => {
    const res = await api('PUT', '/' + ITEM(1), { body: { title: 'x' } });
    assert.equal(res.status, 401);
  });

  it('rejects an unknown genre with 400', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { genre: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid genre');
  });

  it('bumps updatedAt and keeps createdAt', async () => {
    const before = (await api('GET', '/' + ITEM(1))).body.book;
    await sleep(5);
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Later' } });
    const item = res.body.book;
    assert.equal(item.createdAt, before.createdAt);
    assert.ok(Date.parse(item.updatedAt) > Date.parse(before.updatedAt), 'updatedAt must change');
  });

  it('does not allow changing the lister', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { lister: SARAH, title: 'Mine still' } });
    assert.equal(res.status, 200);
    assert.equal(res.body.book.lister._id, JOHN);
    const after = await api('GET', '/' + ITEM(1));
    assert.equal(after.body.book.lister._id, JOHN);
  });
});
