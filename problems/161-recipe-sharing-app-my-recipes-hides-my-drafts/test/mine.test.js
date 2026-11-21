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

describe('GET /api/recipes/mine', () => {
  it('requires authentication', async () => {
    const res = await api('GET', '/mine');
    assert.equal(res.status, 401);
  });

  it('returns every recipe of the user (hidden ones too), newest first', async () => {
    const res = await api('GET', '/mine', { headers: as(JOHN) });
    assert.equal(res.status, 200);
    assert.deepEqual(ids(res.body.recipes), [5, 2, 1].map(ITEM));
  });

  it('does not return recipes of other users', async () => {
    const sarah = await api('GET', '/mine', { headers: as(SARAH) });
    assert.deepEqual(ids(sarah.body.recipes), [6, 3].map(ITEM));
    const mike = await api('GET', '/mine', { headers: as(MIKE) });
    assert.deepEqual(ids(mike.body.recipes), [ITEM(4)]);
  });

  it('returns an empty list for a user without recipes', async () => {
    const res = await api('GET', '/mine', { headers: as(EMMA) });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.recipes, []);
  });

  it('populates the chef', async () => {
    const res = await api('GET', '/mine', { headers: as(JOHN) });
    assert.deepEqual(res.body.recipes[0].chef, JOHN_PROFILE);
  });
});
