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

describe('authentication (x-user-id header)', () => {
  it('POST without header -> 401 { message: "Not authenticated" }', async () => {
    const res = await api('POST', '', { body: valid() });
    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { message: 'Not authenticated' });
  });

  it('POST with an unknown user id -> 401', async () => {
    const res = await api('POST', '', { headers: as('64a000000000000000000099'), body: valid() });
    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { message: 'Not authenticated' });
  });

  it('POST with a malformed user id -> 401', async () => {
    const res = await api('POST', '', { headers: as('abc'), body: valid() });
    assert.equal(res.status, 401);
  });

  it('POST with a valid user id works', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(res.status, 201);
  });

  it('PUT without header -> 401', async () => {
    const res = await api('PUT', '/' + ITEM(1), { body: { name: 'x' } });
    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { message: 'Not authenticated' });
  });

  it('PUT with an unknown user id -> 401', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as('64a000000000000000000099'), body: { name: 'x' } });
    assert.equal(res.status, 401);
  });

  it('DELETE without header -> 401', async () => {
    const res = await api('DELETE', '/' + ITEM(1));
    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { message: 'Not authenticated' });
  });

  it('GET /mine without header -> 401', async () => {
    const res = await api('GET', '/mine');
    assert.equal(res.status, 401);
  });

  it('GET /mine with a valid user works', async () => {
    const res = await api('GET', '/mine', { headers: as(JOHN) });
    assert.equal(res.status, 200);
  });

  it('public reads do not need the header', async () => {
    assert.equal((await api('GET', '')).status, 200);
    assert.equal((await api('GET', '/' + ITEM(1))).status, 200);
  });
});
