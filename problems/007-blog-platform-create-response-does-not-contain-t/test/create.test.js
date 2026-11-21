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

describe('POST /api/posts', () => {
  it('creates a post and answers 201 with the documented response', async () => {
    const payload = { title: 'Hello World', content: 'Some body text', excerpt: 'My own summary', category: 'Lifestyle', tags: ['a', 'b'], readTime: 7 };
    const res = await api('POST', '', { headers: as(JOHN), body: payload });
    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Post created successfully');
    const item = res.body.post;
    assert.ok(item, 'the response must contain "post"');
    assert.match(item._id, /^[0-9a-f]{24}$/i);
    assert.equal(item.title, 'Hello World');
    assert.equal(item.content, 'Some body text');
    assert.equal(item.excerpt, 'My own summary');
    assert.equal(item.category, 'Lifestyle');
    assert.deepEqual(item.tags, ['a', 'b']);
    assert.equal(item.readTime, 7);
    assert.equal(item.published, true);
    assert.ok(!Number.isNaN(Date.parse(item.createdAt)), 'createdAt must be an ISO date');
    assert.ok(!Number.isNaN(Date.parse(item.updatedAt)), 'updatedAt must be an ISO date');
  });

  it('populates author with the public profile of the authenticated user', async () => {
    const res = await api('POST', '', { headers: as(SARAH), body: valid() });
    assert.equal(res.status, 201);
    const owner = res.body.post.author;
    assert.equal(typeof owner, 'object', 'author must be a populated object');
    assert.deepEqual(Object.keys(owner).sort(), ['_id', 'bio', 'email', 'name']);
    assert.deepEqual(owner, SARAH_PROFILE);
  });

  it('uses the first 160 characters of content as excerpt when it is not provided', async () => {
    const text = 'abcdefghij'.repeat(30);
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), content: text } });
    assert.equal(res.status, 201);
    assert.equal(res.body.post.excerpt, text.slice(0, 160));
  });

  it('defaults tags to [] and readTime to 5', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.post.tags, []);
    assert.equal(res.body.post.readTime, 5);
  });

  it('always sets published to true, whatever the client sends', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), published: false } });
    assert.equal(res.status, 201);
    assert.equal(res.body.post.published, true);
  });

  it('saves the post so that it can be fetched afterwards', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(created.status, 201);
    const fetched = await api('GET', '/' + created.body.post._id);
    assert.equal(fetched.status, 200);
    assert.equal(fetched.body.post.title, 'My First Post');
  });

  it('appears first in the public list after creation', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    const list = await api('GET', '');
    assert.equal(list.body.posts[0]._id, created.body.post._id);
  });

  it('gives every post its own _id', async () => {
    const a = await api('POST', '', { headers: as(JOHN), body: valid() });
    const b = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.notEqual(a.body.post._id, b.body.post._id);
  });

  it('trims the title', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), title: '   Padded   ' } });
    assert.equal(res.status, 201);
    assert.equal(res.body.post.title, 'Padded');
  });

  for (const field of ['title', 'content', 'category']) {
    it('rejects a missing ' + field + ' with 400', async () => {
      const body = valid();
      delete body[field];
      const res = await api('POST', '', { headers: as(JOHN), body });
      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'title, content and category are required');
    });
  }

  it('rejects a whitespace-only title with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), title: '    ' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'title, content and category are required');
  });

  it('rejects an unknown category with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), category: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid category');
  });

  it('rejects a readTime that is not a non-negative number with 400', async () => {
    for (const bad of ['lots', -5]) {
      const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), readTime: bad } });
      assert.equal(res.status, 400, 'value ' + JSON.stringify(bad));
      assert.equal(res.body.message, 'readTime must be a non-negative number');
    }
  });

  it('rejects tags that is not an array of strings with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), tags: 'not-an-array' } });
    assert.equal(res.status, 400);
  });

  it('never lets the client choose the author', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), author: SARAH } });
    assert.equal(res.status, 201);
    assert.equal(res.body.post.author._id, JOHN);
  });

  it('requires authentication', async () => {
    const res = await api('POST', '', { body: valid() });
    assert.equal(res.status, 401);
  });
});
