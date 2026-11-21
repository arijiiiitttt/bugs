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

const api = (method, path, opts) => call(server.base, method, '/api/posts' + path, opts);
const valid = () => ({ title: 'My First Post', content: 'abcdefghij'.repeat(30), category: 'Technology' });

describe('PUT /api/posts/:id', () => {
  it('updates the provided fields and answers 200', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Renamed', readTime: 99, tags: ['x'] } });
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Post updated successfully');
    assert.equal(res.body.post._id, ITEM(1));
    assert.equal(res.body.post.title, 'Renamed');
    assert.equal(res.body.post.readTime, 99);
    assert.deepEqual(res.body.post.tags, ['x']);
  });

  it('keeps the fields that are not in the request (partial update)', async () => {
    const before = (await api('GET', '/' + ITEM(1))).body.post;
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Only the title changes' } });
    assert.equal(res.status, 200);
    const item = res.body.post;
    assert.equal(item.title, 'Only the title changes');
    assert.equal(item.content, before.content);
    assert.equal(item.excerpt, before.excerpt);
    assert.equal(item.category, before.category);
    assert.deepEqual(item.tags, before.tags);
    assert.equal(item.readTime, before.readTime);
  });

  it('persists the change', async () => {
    await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Persisted title' } });
    const res = await api('GET', '/' + ITEM(1));
    assert.equal(res.body.post.title, 'Persisted title');
  });

  it('returns author as the populated public profile', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Again' } });
    assert.deepEqual(res.body.post.author, JOHN_PROFILE);
  });

  it('can switch published off', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { published: false } });
    assert.equal(res.status, 200);
    assert.equal(res.body.post.published, false);
  });

  it('rejects users that are not the owner with 403 and leaves the post untouched', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(SARAH), body: { title: 'Hacked' } });
    assert.equal(res.status, 403);
    assert.equal(res.body.message, 'Not authorized to update this post');
    const after = await api('GET', '/' + ITEM(1));
    assert.equal(after.body.post.title, 'Alpha Primer');
  });

  it('answers 404 for an unknown id', async () => {
    const res = await api('PUT', '/' + ITEM(9), { headers: as(JOHN), body: { title: 'x' } });
    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Post not found');
  });

  it('answers 400 for an invalid id', async () => {
    const res = await api('PUT', '/not-an-id', { headers: as(JOHN), body: { title: 'x' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid post ID');
  });

  it('answers 401 without authentication', async () => {
    const res = await api('PUT', '/' + ITEM(1), { body: { title: 'x' } });
    assert.equal(res.status, 401);
  });

  it('rejects an unknown category with 400', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { category: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid category');
  });

  it('bumps updatedAt and keeps createdAt', async () => {
    const before = (await api('GET', '/' + ITEM(1))).body.post;
    await sleep(5);
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Later' } });
    const item = res.body.post;
    assert.equal(item.createdAt, before.createdAt);
    assert.ok(Date.parse(item.updatedAt) > Date.parse(before.updatedAt), 'updatedAt must change');
  });

  it('does not allow changing the author', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { author: SARAH, title: 'Mine still' } });
    assert.equal(res.status, 200);
    assert.equal(res.body.post.author._id, JOHN);
    const after = await api('GET', '/' + ITEM(1));
    assert.equal(after.body.post.author._id, JOHN);
  });
});
