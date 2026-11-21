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

describe('PUT /api/events/:id', () => {
  it('updates the provided fields and answers 200', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { name: 'Renamed', capacity: 99, tags: ['x'] } });
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Event updated successfully');
    assert.equal(res.body.event._id, ITEM(1));
    assert.equal(res.body.event.name, 'Renamed');
    assert.equal(res.body.event.capacity, 99);
    assert.deepEqual(res.body.event.tags, ['x']);
  });

  it('keeps the fields that are not in the request (partial update)', async () => {
    const before = (await api('GET', '/' + ITEM(1))).body.event;
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { name: 'Only the title changes' } });
    assert.equal(res.status, 200);
    const item = res.body.event;
    assert.equal(item.name, 'Only the title changes');
    assert.equal(item.agenda, before.agenda);
    assert.equal(item.teaser, before.teaser);
    assert.equal(item.type, before.type);
    assert.deepEqual(item.tags, before.tags);
    assert.equal(item.capacity, before.capacity);
  });

  it('persists the change', async () => {
    await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { name: 'Persisted title' } });
    const res = await api('GET', '/' + ITEM(1));
    assert.equal(res.body.event.name, 'Persisted title');
  });

  it('returns organizer as the populated public profile', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { name: 'Again' } });
    assert.deepEqual(res.body.event.organizer, JOHN_PROFILE);
  });

  it('can switch public off', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { public: false } });
    assert.equal(res.status, 200);
    assert.equal(res.body.event.public, false);
  });

  it('rejects users that are not the owner with 403 and leaves the event untouched', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(SARAH), body: { name: 'Hacked' } });
    assert.equal(res.status, 403);
    assert.equal(res.body.message, 'Not authorized to update this event');
    const after = await api('GET', '/' + ITEM(1));
    assert.equal(after.body.event.name, 'Alpha Primer');
  });

  it('answers 404 for an unknown id', async () => {
    const res = await api('PUT', '/' + ITEM(9), { headers: as(JOHN), body: { name: 'x' } });
    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Event not found');
  });

  it('answers 400 for an invalid id', async () => {
    const res = await api('PUT', '/not-an-id', { headers: as(JOHN), body: { name: 'x' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid event ID');
  });

  it('answers 401 without authentication', async () => {
    const res = await api('PUT', '/' + ITEM(1), { body: { name: 'x' } });
    assert.equal(res.status, 401);
  });

  it('rejects an unknown type with 400', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { type: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid type');
  });

  it('bumps updatedAt and keeps createdAt', async () => {
    const before = (await api('GET', '/' + ITEM(1))).body.event;
    await sleep(5);
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { name: 'Later' } });
    const item = res.body.event;
    assert.equal(item.createdAt, before.createdAt);
    assert.ok(Date.parse(item.updatedAt) > Date.parse(before.updatedAt), 'updatedAt must change');
  });

  it('does not allow changing the organizer', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { organizer: SARAH, name: 'Mine still' } });
    assert.equal(res.status, 200);
    assert.equal(res.body.event.organizer._id, JOHN);
    const after = await api('GET', '/' + ITEM(1));
    assert.equal(after.body.event.organizer._id, JOHN);
  });
});
