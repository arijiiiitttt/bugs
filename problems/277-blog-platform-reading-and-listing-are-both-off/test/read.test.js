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

describe('GET /api/posts/:id', () => {
  it('returns the post wrapped in { post }', async () => {
    const res = await api('GET', '/' + ITEM(2));
    assert.equal(res.status, 200);
    assert.ok(res.body.post, 'body must contain "post"');
    assert.equal(res.body.post._id, ITEM(2));
    assert.equal(res.body.post.title, 'Beta Notes');
    assert.equal(res.body.post.category, 'Lifestyle');
  });

  it('populates author with the public profile only', async () => {
    const res = await api('GET', '/' + ITEM(3));
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.post.author, SARAH_PROFILE);
  });

  it('also returns a hidden (published = false) post when asked by id', async () => {
    const res = await api('GET', '/' + ITEM(5));
    assert.equal(res.status, 200);
    assert.equal(res.body.post.published, false);
  });

  it('answers 400 for an invalid id', async () => {
    const res = await api('GET', '/abc');
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid post ID');
  });

  it('answers 404 for an unknown id', async () => {
    const res = await api('GET', '/' + ITEM(9));
    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Post not found');
  });
});
