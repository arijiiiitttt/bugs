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

const api = (method, path, opts) => call(server.base, method, '/api/products' + path, opts);
const valid = () => ({ name: 'My First Product', description: 'abcdefghij'.repeat(30), department: 'Electronics' });

describe('PUT /api/products/:id', () => {
  it('updates the provided fields and answers 200', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { name: 'Renamed', stock: 99, tags: ['x'] } });
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Product updated successfully');
    assert.equal(res.body.product._id, ITEM(1));
    assert.equal(res.body.product.name, 'Renamed');
    assert.equal(res.body.product.stock, 99);
    assert.deepEqual(res.body.product.tags, ['x']);
  });

  it('keeps the fields that are not in the request (partial update)', async () => {
    const before = (await api('GET', '/' + ITEM(1))).body.product;
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { name: 'Only the title changes' } });
    assert.equal(res.status, 200);
    const item = res.body.product;
    assert.equal(item.name, 'Only the title changes');
    assert.equal(item.description, before.description);
    assert.equal(item.summary, before.summary);
    assert.equal(item.department, before.department);
    assert.deepEqual(item.tags, before.tags);
    assert.equal(item.stock, before.stock);
  });

  it('persists the change', async () => {
    await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { name: 'Persisted title' } });
    const res = await api('GET', '/' + ITEM(1));
    assert.equal(res.body.product.name, 'Persisted title');
  });

  it('returns seller as the populated public profile', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { name: 'Again' } });
    assert.deepEqual(res.body.product.seller, JOHN_PROFILE);
  });

  it('can switch active off', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { active: false } });
    assert.equal(res.status, 200);
    assert.equal(res.body.product.active, false);
  });

  it('rejects users that are not the owner with 403 and leaves the product untouched', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(SARAH), body: { name: 'Hacked' } });
    assert.equal(res.status, 403);
    assert.equal(res.body.message, 'Not authorized to update this product');
    const after = await api('GET', '/' + ITEM(1));
    assert.equal(after.body.product.name, 'Alpha Primer');
  });

  it('answers 404 for an unknown id', async () => {
    const res = await api('PUT', '/' + ITEM(9), { headers: as(JOHN), body: { name: 'x' } });
    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Product not found');
  });

  it('answers 400 for an invalid id', async () => {
    const res = await api('PUT', '/not-an-id', { headers: as(JOHN), body: { name: 'x' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid product ID');
  });

  it('answers 401 without authentication', async () => {
    const res = await api('PUT', '/' + ITEM(1), { body: { name: 'x' } });
    assert.equal(res.status, 401);
  });

  it('rejects an unknown department with 400', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { department: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid department');
  });

  it('bumps updatedAt and keeps createdAt', async () => {
    const before = (await api('GET', '/' + ITEM(1))).body.product;
    await sleep(5);
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { name: 'Later' } });
    const item = res.body.product;
    assert.equal(item.createdAt, before.createdAt);
    assert.ok(Date.parse(item.updatedAt) > Date.parse(before.updatedAt), 'updatedAt must change');
  });

  it('does not allow changing the seller', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { seller: SARAH, name: 'Mine still' } });
    assert.equal(res.status, 200);
    assert.equal(res.body.product.seller._id, JOHN);
    const after = await api('GET', '/' + ITEM(1));
    assert.equal(after.body.product.seller._id, JOHN);
  });
});
