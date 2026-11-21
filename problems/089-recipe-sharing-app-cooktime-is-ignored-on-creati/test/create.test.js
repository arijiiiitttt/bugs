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

const api = (method, path, opts) => call(server.base, method, '/api/recipes' + path, opts);
const valid = () => ({ name: 'My First Recipe', instructions: 'abcdefghij'.repeat(30), cuisine: 'Italian' });

describe('POST /api/recipes', () => {
  it('creates a recipe and answers 201 with the documented response', async () => {
    const payload = { name: 'Hello World', instructions: 'Some body text', summary: 'My own summary', cuisine: 'Indian', tags: ['a', 'b'], cookTime: 7 };
    const res = await api('POST', '', { headers: as(JOHN), body: payload });
    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Recipe created successfully');
    const item = res.body.recipe;
    assert.ok(item, 'the response must contain "recipe"');
    assert.match(item._id, /^[0-9a-f]{24}$/i);
    assert.equal(item.name, 'Hello World');
    assert.equal(item.instructions, 'Some body text');
    assert.equal(item.summary, 'My own summary');
    assert.equal(item.cuisine, 'Indian');
    assert.deepEqual(item.tags, ['a', 'b']);
    assert.equal(item.cookTime, 7);
    assert.equal(item.published, true);
    assert.ok(!Number.isNaN(Date.parse(item.createdAt)), 'createdAt must be an ISO date');
    assert.ok(!Number.isNaN(Date.parse(item.updatedAt)), 'updatedAt must be an ISO date');
  });

  it('populates chef with the public profile of the authenticated user', async () => {
    const res = await api('POST', '', { headers: as(SARAH), body: valid() });
    assert.equal(res.status, 201);
    const owner = res.body.recipe.chef;
    assert.equal(typeof owner, 'object', 'chef must be a populated object');
    assert.deepEqual(Object.keys(owner).sort(), ['_id', 'bio', 'email', 'name']);
    assert.deepEqual(owner, SARAH_PROFILE);
  });

  it('uses the first 120 characters of instructions as summary when it is not provided', async () => {
    const text = 'abcdefghij'.repeat(30);
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), instructions: text } });
    assert.equal(res.status, 201);
    assert.equal(res.body.recipe.summary, text.slice(0, 120));
  });

  it('defaults tags to [] and cookTime to 30', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.recipe.tags, []);
    assert.equal(res.body.recipe.cookTime, 30);
  });

  it('always sets published to true, whatever the client sends', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), published: false } });
    assert.equal(res.status, 201);
    assert.equal(res.body.recipe.published, true);
  });

  it('saves the recipe so that it can be fetched afterwards', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(created.status, 201);
    const fetched = await api('GET', '/' + created.body.recipe._id);
    assert.equal(fetched.status, 200);
    assert.equal(fetched.body.recipe.name, 'My First Recipe');
  });

  it('appears first in the public list after creation', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    const list = await api('GET', '');
    assert.equal(list.body.recipes[0]._id, created.body.recipe._id);
  });

  it('gives every recipe its own _id', async () => {
    const a = await api('POST', '', { headers: as(JOHN), body: valid() });
    const b = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.notEqual(a.body.recipe._id, b.body.recipe._id);
  });

  it('trims the name', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), name: '   Padded   ' } });
    assert.equal(res.status, 201);
    assert.equal(res.body.recipe.name, 'Padded');
  });

  for (const field of ['name', 'instructions', 'cuisine']) {
    it('rejects a missing ' + field + ' with 400', async () => {
      const body = valid();
      delete body[field];
      const res = await api('POST', '', { headers: as(JOHN), body });
      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'name, instructions and cuisine are required');
    });
  }

  it('rejects a whitespace-only name with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), name: '    ' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'name, instructions and cuisine are required');
  });

  it('rejects an unknown cuisine with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), cuisine: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid cuisine');
  });

  it('rejects a cookTime that is not a non-negative number with 400', async () => {
    for (const bad of ['lots', -5]) {
      const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), cookTime: bad } });
      assert.equal(res.status, 400, 'value ' + JSON.stringify(bad));
      assert.equal(res.body.message, 'cookTime must be a non-negative number');
    }
  });

  it('rejects tags that is not an array of strings with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), tags: 'not-an-array' } });
    assert.equal(res.status, 400);
  });

  it('never lets the client choose the chef', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), chef: SARAH } });
    assert.equal(res.status, 201);
    assert.equal(res.body.recipe.chef._id, JOHN);
  });

  it('requires authentication', async () => {
    const res = await api('POST', '', { body: valid() });
    assert.equal(res.status, 401);
  });
});
