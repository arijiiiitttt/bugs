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

const api = (method, path, opts) => call(server.base, method, '/api/courses' + path, opts);
const valid = () => ({ title: 'My First Course', syllabus: 'abcdefghij'.repeat(30), level: 'Beginner' });

describe('PUT /api/courses/:id', () => {
  it('updates the provided fields and answers 200', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Renamed', durationHours: 99, topics: ['x'] } });
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Course updated successfully');
    assert.equal(res.body.course._id, ITEM(1));
    assert.equal(res.body.course.title, 'Renamed');
    assert.equal(res.body.course.durationHours, 99);
    assert.deepEqual(res.body.course.topics, ['x']);
  });

  it('keeps the fields that are not in the request (partial update)', async () => {
    const before = (await api('GET', '/' + ITEM(1))).body.course;
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Only the title changes' } });
    assert.equal(res.status, 200);
    const item = res.body.course;
    assert.equal(item.title, 'Only the title changes');
    assert.equal(item.syllabus, before.syllabus);
    assert.equal(item.blurb, before.blurb);
    assert.equal(item.level, before.level);
    assert.deepEqual(item.topics, before.topics);
    assert.equal(item.durationHours, before.durationHours);
  });

  it('persists the change', async () => {
    await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Persisted title' } });
    const res = await api('GET', '/' + ITEM(1));
    assert.equal(res.body.course.title, 'Persisted title');
  });

  it('returns instructor as the populated public profile', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Again' } });
    assert.deepEqual(res.body.course.instructor, JOHN_PROFILE);
  });

  it('can switch enrolling off', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { enrolling: false } });
    assert.equal(res.status, 200);
    assert.equal(res.body.course.enrolling, false);
  });

  it('rejects users that are not the owner with 403 and leaves the course untouched', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(SARAH), body: { title: 'Hacked' } });
    assert.equal(res.status, 403);
    assert.equal(res.body.message, 'Not authorized to update this course');
    const after = await api('GET', '/' + ITEM(1));
    assert.equal(after.body.course.title, 'Alpha Primer');
  });

  it('answers 404 for an unknown id', async () => {
    const res = await api('PUT', '/' + ITEM(9), { headers: as(JOHN), body: { title: 'x' } });
    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Course not found');
  });

  it('answers 400 for an invalid id', async () => {
    const res = await api('PUT', '/not-an-id', { headers: as(JOHN), body: { title: 'x' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid course ID');
  });

  it('answers 401 without authentication', async () => {
    const res = await api('PUT', '/' + ITEM(1), { body: { title: 'x' } });
    assert.equal(res.status, 401);
  });

  it('rejects an unknown level with 400', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { level: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid level');
  });

  it('bumps updatedAt and keeps createdAt', async () => {
    const before = (await api('GET', '/' + ITEM(1))).body.course;
    await sleep(5);
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { title: 'Later' } });
    const item = res.body.course;
    assert.equal(item.createdAt, before.createdAt);
    assert.ok(Date.parse(item.updatedAt) > Date.parse(before.updatedAt), 'updatedAt must change');
  });

  it('does not allow changing the instructor', async () => {
    const res = await api('PUT', '/' + ITEM(1), { headers: as(JOHN), body: { instructor: SARAH, title: 'Mine still' } });
    assert.equal(res.status, 200);
    assert.equal(res.body.course.instructor._id, JOHN);
    const after = await api('GET', '/' + ITEM(1));
    assert.equal(after.body.course.instructor._id, JOHN);
  });
});
