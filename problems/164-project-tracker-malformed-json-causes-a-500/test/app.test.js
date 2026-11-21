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

const api = (method, path, opts) => call(server.base, method, '/api/tasks' + path, opts);
const valid = () => ({ title: 'My First Task', details: 'abcdefghij'.repeat(30), priority: 'low' });

describe('application level behaviour', () => {
  it('GET /health answers { status: "ok" }', async () => {
    const res = await call(server.base, 'GET', '/health');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok' });
  });

  it('answers 400 { message: "Invalid JSON" } for a malformed JSON body', async () => {
    const res = await api('POST', '', { headers: as(JOHN), raw: '{"title": "oops' });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { message: 'Invalid JSON' });
  });

  it('answers a JSON 404 for unknown routes', async () => {
    const res = await call(server.base, 'GET', '/api/does-not-exist');
    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { message: 'Route not found' });
  });

  it('turns model validation errors into 400 responses', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), priority: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid priority');
  });
});
