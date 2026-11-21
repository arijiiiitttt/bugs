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

describe('POST /api/products', () => {
  it('creates a product and answers 201 with the documented response', async () => {
    const payload = { name: 'Hello World', description: 'Some body text', summary: 'My own summary', department: 'Books', tags: ['a', 'b'], stock: 7 };
    const res = await api('POST', '', { headers: as(JOHN), body: payload });
    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Product created successfully');
    const item = res.body.product;
    assert.ok(item, 'the response must contain "product"');
    assert.match(item._id, /^[0-9a-f]{24}$/i);
    assert.equal(item.name, 'Hello World');
    assert.equal(item.description, 'Some body text');
    assert.equal(item.summary, 'My own summary');
    assert.equal(item.department, 'Books');
    assert.deepEqual(item.tags, ['a', 'b']);
    assert.equal(item.stock, 7);
    assert.equal(item.active, true);
    assert.ok(!Number.isNaN(Date.parse(item.createdAt)), 'createdAt must be an ISO date');
    assert.ok(!Number.isNaN(Date.parse(item.updatedAt)), 'updatedAt must be an ISO date');
  });

  it('populates seller with the public profile of the authenticated user', async () => {
    const res = await api('POST', '', { headers: as(SARAH), body: valid() });
    assert.equal(res.status, 201);
    const owner = res.body.product.seller;
    assert.equal(typeof owner, 'object', 'seller must be a populated object');
    assert.deepEqual(Object.keys(owner).sort(), ['_id', 'bio', 'email', 'name']);
    assert.deepEqual(owner, SARAH_PROFILE);
  });

  it('uses the first 100 characters of description as summary when it is not provided', async () => {
    const text = 'abcdefghij'.repeat(30);
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), description: text } });
    assert.equal(res.status, 201);
    assert.equal(res.body.product.summary, text.slice(0, 100));
  });

  it('defaults tags to [] and stock to 0', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.product.tags, []);
    assert.equal(res.body.product.stock, 0);
  });

  it('always sets active to true, whatever the client sends', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), active: false } });
    assert.equal(res.status, 201);
    assert.equal(res.body.product.active, true);
  });

  it('saves the product so that it can be fetched afterwards', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(created.status, 201);
    const fetched = await api('GET', '/' + created.body.product._id);
    assert.equal(fetched.status, 200);
    assert.equal(fetched.body.product.name, 'My First Product');
  });

  it('appears first in the public list after creation', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    const list = await api('GET', '');
    assert.equal(list.body.products[0]._id, created.body.product._id);
  });

  it('gives every product its own _id', async () => {
    const a = await api('POST', '', { headers: as(JOHN), body: valid() });
    const b = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.notEqual(a.body.product._id, b.body.product._id);
  });

  it('trims the name', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), name: '   Padded   ' } });
    assert.equal(res.status, 201);
    assert.equal(res.body.product.name, 'Padded');
  });

  for (const field of ['name', 'description', 'department']) {
    it('rejects a missing ' + field + ' with 400', async () => {
      const body = valid();
      delete body[field];
      const res = await api('POST', '', { headers: as(JOHN), body });
      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'name, description and department are required');
    });
  }

  it('rejects a whitespace-only name with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), name: '    ' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'name, description and department are required');
  });

  it('rejects an unknown department with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), department: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid department');
  });

  it('rejects a stock that is not a non-negative number with 400', async () => {
    for (const bad of ['lots', -5]) {
      const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), stock: bad } });
      assert.equal(res.status, 400, 'value ' + JSON.stringify(bad));
      assert.equal(res.body.message, 'stock must be a non-negative number');
    }
  });

  it('rejects tags that is not an array of strings with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), tags: 'not-an-array' } });
    assert.equal(res.status, 400);
  });

  it('never lets the client choose the seller', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), seller: SARAH } });
    assert.equal(res.status, 201);
    assert.equal(res.body.product.seller._id, JOHN);
  });

  it('requires authentication', async () => {
    const res = await api('POST', '', { body: valid() });
    assert.equal(res.status, 401);
  });
});
