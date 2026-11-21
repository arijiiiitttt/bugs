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

const api = (method, path, opts) => call(server.base, method, '/api/events' + path, opts);
const valid = () => ({ name: 'My First Event', agenda: 'abcdefghij'.repeat(30), type: 'Conference' });

describe('POST /api/events', () => {
  it('creates a event and answers 201 with the documented response', async () => {
    const payload = { name: 'Hello World', agenda: 'Some body text', teaser: 'My own summary', type: 'Workshop', tags: ['a', 'b'], capacity: 7 };
    const res = await api('POST', '', { headers: as(JOHN), body: payload });
    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Event created successfully');
    const item = res.body.event;
    assert.ok(item, 'the response must contain "event"');
    assert.match(item._id, /^[0-9a-f]{24}$/i);
    assert.equal(item.name, 'Hello World');
    assert.equal(item.agenda, 'Some body text');
    assert.equal(item.teaser, 'My own summary');
    assert.equal(item.type, 'Workshop');
    assert.deepEqual(item.tags, ['a', 'b']);
    assert.equal(item.capacity, 7);
    assert.equal(item.public, true);
    assert.ok(!Number.isNaN(Date.parse(item.createdAt)), 'createdAt must be an ISO date');
    assert.ok(!Number.isNaN(Date.parse(item.updatedAt)), 'updatedAt must be an ISO date');
  });

  it('populates organizer with the public profile of the authenticated user', async () => {
    const res = await api('POST', '', { headers: as(SARAH), body: valid() });
    assert.equal(res.status, 201);
    const owner = res.body.event.organizer;
    assert.equal(typeof owner, 'object', 'organizer must be a populated object');
    assert.deepEqual(Object.keys(owner).sort(), ['_id', 'bio', 'email', 'name']);
    assert.deepEqual(owner, SARAH_PROFILE);
  });

  it('uses the first 140 characters of agenda as teaser when it is not provided', async () => {
    const text = 'abcdefghij'.repeat(30);
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), agenda: text } });
    assert.equal(res.status, 201);
    assert.equal(res.body.event.teaser, text.slice(0, 140));
  });

  it('defaults tags to [] and capacity to 50', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.event.tags, []);
    assert.equal(res.body.event.capacity, 50);
  });

  it('always sets public to true, whatever the client sends', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), public: false } });
    assert.equal(res.status, 201);
    assert.equal(res.body.event.public, true);
  });

  it('saves the event so that it can be fetched afterwards', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(created.status, 201);
    const fetched = await api('GET', '/' + created.body.event._id);
    assert.equal(fetched.status, 200);
    assert.equal(fetched.body.event.name, 'My First Event');
  });

  it('appears first in the public list after creation', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    const list = await api('GET', '');
    assert.equal(list.body.events[0]._id, created.body.event._id);
  });

  it('gives every event its own _id', async () => {
    const a = await api('POST', '', { headers: as(JOHN), body: valid() });
    const b = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.notEqual(a.body.event._id, b.body.event._id);
  });

  it('trims the name', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), name: '   Padded   ' } });
    assert.equal(res.status, 201);
    assert.equal(res.body.event.name, 'Padded');
  });

  for (const field of ['name', 'agenda', 'type']) {
    it('rejects a missing ' + field + ' with 400', async () => {
      const body = valid();
      delete body[field];
      const res = await api('POST', '', { headers: as(JOHN), body });
      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'name, agenda and type are required');
    });
  }

  it('rejects a whitespace-only name with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), name: '    ' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'name, agenda and type are required');
  });

  it('rejects an unknown type with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), type: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid type');
  });

  it('rejects a capacity that is not a non-negative number with 400', async () => {
    for (const bad of ['lots', -5]) {
      const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), capacity: bad } });
      assert.equal(res.status, 400, 'value ' + JSON.stringify(bad));
      assert.equal(res.body.message, 'capacity must be a non-negative number');
    }
  });

  it('rejects tags that is not an array of strings with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), tags: 'not-an-array' } });
    assert.equal(res.status, 400);
  });

  it('never lets the client choose the organizer', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), organizer: SARAH } });
    assert.equal(res.status, 201);
    assert.equal(res.body.event.organizer._id, JOHN);
  });

  it('requires authentication', async () => {
    const res = await api('POST', '', { body: valid() });
    assert.equal(res.status, 401);
  });
});
