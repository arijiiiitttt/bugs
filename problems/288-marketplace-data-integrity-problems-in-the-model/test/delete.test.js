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

describe('DELETE /api/products/:id', () => {
  it('deletes the product and answers 200 with the documented message', async () => {
    const res = await api('DELETE', '/' + ITEM(1), { headers: as(JOHN) });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { message: 'Product deleted successfully' });
  });

  it('really removes the product', async () => {
    await api('DELETE', '/' + ITEM(1), { headers: as(JOHN) });
    const res = await api('GET', '/' + ITEM(1));
    assert.equal(res.status, 404);
  });

  it('does not touch the other products', async () => {
    const res = await api('DELETE', '/' + ITEM(3), { headers: as(SARAH) });
    assert.equal(res.status, 200);
    for (const n of [1, 2, 4, 5, 6]) {
      const other = await api('GET', '/' + ITEM(n));
      assert.equal(other.status, 200, 'seed item ' + n + ' must still exist');
    }
    assert.equal((await api('GET', '/' + ITEM(3))).status, 404);
  });

  it('rejects users that are not the owner with 403 and keeps the product', async () => {
    const res = await api('DELETE', '/' + ITEM(1), { headers: as(SARAH) });
    assert.equal(res.status, 403);
    assert.equal(res.body.message, 'Not authorized to delete this product');
    assert.equal((await api('GET', '/' + ITEM(1))).status, 200);
  });

  it('answers 404 for an unknown id', async () => {
    const res = await api('DELETE', '/' + ITEM(9), { headers: as(JOHN) });
    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Product not found');
  });

  it('answers 400 for an invalid id', async () => {
    const res = await api('DELETE', '/not-an-id', { headers: as(JOHN) });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid product ID');
  });

  it('answers 401 without authentication', async () => {
    const res = await api('DELETE', '/' + ITEM(1));
    assert.equal(res.status, 401);
  });

  it('answers 404 when the product was already deleted', async () => {
    await api('DELETE', '/' + ITEM(2), { headers: as(JOHN) });
    const again = await api('DELETE', '/' + ITEM(2), { headers: as(JOHN) });
    assert.equal(again.status, 404);
  });
});
