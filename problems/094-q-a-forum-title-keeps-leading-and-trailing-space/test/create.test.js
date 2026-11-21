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

const api = (method, path, opts) => call(server.base, method, '/api/questions' + path, opts);
const valid = () => ({ title: 'My First Question', body: 'abcdefghij'.repeat(30), topic: 'JavaScript' });

describe('POST /api/questions', () => {
  it('creates a question and answers 201 with the documented response', async () => {
    const payload = { title: 'Hello World', body: 'Some body text', preview: 'My own summary', topic: 'Databases', tags: ['a', 'b'], votes: 7 };
    const res = await api('POST', '', { headers: as(JOHN), body: payload });
    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Question created successfully');
    const item = res.body.question;
    assert.ok(item, 'the response must contain "question"');
    assert.match(item._id, /^[0-9a-f]{24}$/i);
    assert.equal(item.title, 'Hello World');
    assert.equal(item.body, 'Some body text');
    assert.equal(item.preview, 'My own summary');
    assert.equal(item.topic, 'Databases');
    assert.deepEqual(item.tags, ['a', 'b']);
    assert.equal(item.votes, 7);
    assert.equal(item.open, true);
    assert.ok(!Number.isNaN(Date.parse(item.createdAt)), 'createdAt must be an ISO date');
    assert.ok(!Number.isNaN(Date.parse(item.updatedAt)), 'updatedAt must be an ISO date');
  });

  it('populates asker with the public profile of the authenticated user', async () => {
    const res = await api('POST', '', { headers: as(SARAH), body: valid() });
    assert.equal(res.status, 201);
    const owner = res.body.question.asker;
    assert.equal(typeof owner, 'object', 'asker must be a populated object');
    assert.deepEqual(Object.keys(owner).sort(), ['_id', 'bio', 'email', 'name']);
    assert.deepEqual(owner, SARAH_PROFILE);
  });

  it('uses the first 100 characters of body as preview when it is not provided', async () => {
    const text = 'abcdefghij'.repeat(30);
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), body: text } });
    assert.equal(res.status, 201);
    assert.equal(res.body.question.preview, text.slice(0, 100));
  });

  it('defaults tags to [] and votes to 0', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.question.tags, []);
    assert.equal(res.body.question.votes, 0);
  });

  it('always sets open to true, whatever the client sends', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), open: false } });
    assert.equal(res.status, 201);
    assert.equal(res.body.question.open, true);
  });

  it('saves the question so that it can be fetched afterwards', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(created.status, 201);
    const fetched = await api('GET', '/' + created.body.question._id);
    assert.equal(fetched.status, 200);
    assert.equal(fetched.body.question.title, 'My First Question');
  });

  it('appears first in the public list after creation', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    const list = await api('GET', '');
    assert.equal(list.body.questions[0]._id, created.body.question._id);
  });

  it('gives every question its own _id', async () => {
    const a = await api('POST', '', { headers: as(JOHN), body: valid() });
    const b = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.notEqual(a.body.question._id, b.body.question._id);
  });

  it('trims the title', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), title: '   Padded   ' } });
    assert.equal(res.status, 201);
    assert.equal(res.body.question.title, 'Padded');
  });

  for (const field of ['title', 'body', 'topic']) {
    it('rejects a missing ' + field + ' with 400', async () => {
      const body = valid();
      delete body[field];
      const res = await api('POST', '', { headers: as(JOHN), body });
      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'title, body and topic are required');
    });
  }

  it('rejects a whitespace-only title with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), title: '    ' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'title, body and topic are required');
  });

  it('rejects an unknown topic with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), topic: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid topic');
  });

  it('rejects a votes that is not a non-negative number with 400', async () => {
    for (const bad of ['lots', -5]) {
      const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), votes: bad } });
      assert.equal(res.status, 400, 'value ' + JSON.stringify(bad));
      assert.equal(res.body.message, 'votes must be a non-negative number');
    }
  });

  it('rejects tags that is not an array of strings with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), tags: 'not-an-array' } });
    assert.equal(res.status, 400);
  });

  it('never lets the client choose the asker', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), asker: SARAH } });
    assert.equal(res.status, 201);
    assert.equal(res.body.question.asker._id, JOHN);
  });

  it('requires authentication', async () => {
    const res = await api('POST', '', { body: valid() });
    assert.equal(res.status, 401);
  });
});
