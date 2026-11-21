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

describe('GET /api/events', () => {
  it('returns only events whose public is true', async () => {
    const res = await api('GET', '');
    assert.equal(res.status, 200);
    assert.equal(res.body.events.length, 5);
    assert.ok(res.body.events.every((i) => i.public === true));
    assert.ok(!ids(res.body.events).includes(ITEM(5)));
  });

  it('sorts the newest first', async () => {
    const res = await api('GET', '');
    assert.deepEqual(ids(res.body.events), [6, 4, 3, 2, 1].map(ITEM));
  });

  it('populates the organizer', async () => {
    const res = await api('GET', '');
    assert.deepEqual(res.body.events[0].organizer, SARAH_PROFILE);
  });

  it('returns pagination metadata', async () => {
    const res = await api('GET', '');
    assert.equal(res.body.page, 1);
    assert.equal(res.body.limit, 10);
    assert.equal(res.body.total, 5);
    assert.equal(res.body.totalPages, 1);
  });

  it('filters by type', async () => {
    const a = await api('GET', '?type=Conference');
    assert.deepEqual(ids(a.body.events), [6, 3, 1].map(ITEM));
    assert.equal(a.body.total, 3);
    const b = await api('GET', '?type=Workshop');
    assert.deepEqual(ids(b.body.events), [ITEM(2)]);
    const c = await api('GET', '?type=Nothing');
    assert.deepEqual(c.body.events, []);
    assert.equal(c.body.total, 0);
    assert.equal(c.body.totalPages, 0);
  });

  it('searches name case-insensitively with ?q=', async () => {
    assert.deepEqual(ids((await api('GET', '?q=gamma')).body.events), [ITEM(3)]);
    assert.deepEqual(ids((await api('GET', '?q=ZETA')).body.events), [ITEM(6)]);
    assert.deepEqual((await api('GET', '?q=nothing-matches')).body.events, []);
  });

  it('paginates with ?page and ?limit', async () => {
    const p1 = await api('GET', '?limit=2&page=1');
    assert.deepEqual(ids(p1.body.events), [6, 4].map(ITEM));
    assert.equal(p1.body.page, 1);
    assert.equal(p1.body.limit, 2);
    assert.equal(p1.body.total, 5);
    assert.equal(p1.body.totalPages, 3);
    const p2 = await api('GET', '?limit=2&page=2');
    assert.deepEqual(ids(p2.body.events), [3, 2].map(ITEM));
    const p3 = await api('GET', '?limit=2&page=3');
    assert.deepEqual(ids(p3.body.events), [ITEM(1)]);
    const p4 = await api('GET', '?limit=2&page=4');
    assert.deepEqual(p4.body.events, []);
  });

  it('caps the page size at 50', async () => {
    const res = await api('GET', '?limit=1000');
    assert.equal(res.status, 200);
    assert.equal(res.body.limit, 50);
  });

  it('rejects invalid pagination values with 400', async () => {
    for (const q of ['page=0', 'page=abc', 'limit=0', 'limit=-5', 'limit=2.5']) {
      const res = await api('GET', '?' + q);
      assert.equal(res.status, 400, q);
      assert.equal(res.body.message, 'Invalid pagination parameters');
    }
  });

  it('combines filter and pagination', async () => {
    const res = await api('GET', '?type=Conference&limit=2');
    assert.deepEqual(ids(res.body.events), [6, 3].map(ITEM));
    assert.equal(res.body.total, 3);
    assert.equal(res.body.totalPages, 2);
    const res2 = await api('GET', '?type=Conference&limit=2&page=2');
    assert.deepEqual(ids(res2.body.events), [ITEM(1)]);
  });
});
