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

describe('POST /api/tasks', () => {
  it('creates a task and answers 201 with the documented response', async () => {
    const payload = { title: 'Hello World', details: 'Some body text', summary: 'My own summary', priority: 'medium', labels: ['a', 'b'], estimateHours: 7 };
    const res = await api('POST', '', { headers: as(JOHN), body: payload });
    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Task created successfully');
    const item = res.body.task;
    assert.ok(item, 'the response must contain "task"');
    assert.match(item._id, /^[0-9a-f]{24}$/i);
    assert.equal(item.title, 'Hello World');
    assert.equal(item.details, 'Some body text');
    assert.equal(item.summary, 'My own summary');
    assert.equal(item.priority, 'medium');
    assert.deepEqual(item.labels, ['a', 'b']);
    assert.equal(item.estimateHours, 7);
    assert.equal(item.open, true);
    assert.ok(!Number.isNaN(Date.parse(item.createdAt)), 'createdAt must be an ISO date');
    assert.ok(!Number.isNaN(Date.parse(item.updatedAt)), 'updatedAt must be an ISO date');
  });

  it('populates assignee with the public profile of the authenticated user', async () => {
    const res = await api('POST', '', { headers: as(SARAH), body: valid() });
    assert.equal(res.status, 201);
    const owner = res.body.task.assignee;
    assert.equal(typeof owner, 'object', 'assignee must be a populated object');
    assert.deepEqual(Object.keys(owner).sort(), ['_id', 'bio', 'email', 'name']);
    assert.deepEqual(owner, SARAH_PROFILE);
  });

  it('uses the first 80 characters of details as summary when it is not provided', async () => {
    const text = 'abcdefghij'.repeat(30);
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), details: text } });
    assert.equal(res.status, 201);
    assert.equal(res.body.task.summary, text.slice(0, 80));
  });

  it('defaults labels to [] and estimateHours to 1', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.task.labels, []);
    assert.equal(res.body.task.estimateHours, 1);
  });

  it('always sets open to true, whatever the client sends', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), open: false } });
    assert.equal(res.status, 201);
    assert.equal(res.body.task.open, true);
  });

  it('saves the task so that it can be fetched afterwards', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(created.status, 201);
    const fetched = await api('GET', '/' + created.body.task._id);
    assert.equal(fetched.status, 200);
    assert.equal(fetched.body.task.title, 'My First Task');
  });

  it('appears first in the public list after creation', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    const list = await api('GET', '');
    assert.equal(list.body.tasks[0]._id, created.body.task._id);
  });

  it('gives every task its own _id', async () => {
    const a = await api('POST', '', { headers: as(JOHN), body: valid() });
    const b = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.notEqual(a.body.task._id, b.body.task._id);
  });

  it('trims the title', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), title: '   Padded   ' } });
    assert.equal(res.status, 201);
    assert.equal(res.body.task.title, 'Padded');
  });

  for (const field of ['title', 'details', 'priority']) {
    it('rejects a missing ' + field + ' with 400', async () => {
      const body = valid();
      delete body[field];
      const res = await api('POST', '', { headers: as(JOHN), body });
      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'title, details and priority are required');
    });
  }

  it('rejects a whitespace-only title with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), title: '    ' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'title, details and priority are required');
  });

  it('rejects an unknown priority with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), priority: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid priority');
  });

  it('rejects a estimateHours that is not a non-negative number with 400', async () => {
    for (const bad of ['lots', -5]) {
      const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), estimateHours: bad } });
      assert.equal(res.status, 400, 'value ' + JSON.stringify(bad));
      assert.equal(res.body.message, 'estimateHours must be a non-negative number');
    }
  });

  it('rejects labels that is not an array of strings with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), labels: 'not-an-array' } });
    assert.equal(res.status, 400);
  });

  it('never lets the client choose the assignee', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), assignee: SARAH } });
    assert.equal(res.status, 201);
    assert.equal(res.body.task.assignee._id, JOHN);
  });

  it('requires authentication', async () => {
    const res = await api('POST', '', { body: valid() });
    assert.equal(res.status, 401);
  });
});
