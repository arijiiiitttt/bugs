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

describe('POST /api/courses', () => {
  it('creates a course and answers 201 with the documented response', async () => {
    const payload = { title: 'Hello World', syllabus: 'Some body text', blurb: 'My own summary', level: 'Intermediate', topics: ['a', 'b'], durationHours: 7 };
    const res = await api('POST', '', { headers: as(JOHN), body: payload });
    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Course created successfully');
    const item = res.body.course;
    assert.ok(item, 'the response must contain "course"');
    assert.match(item._id, /^[0-9a-f]{24}$/i);
    assert.equal(item.title, 'Hello World');
    assert.equal(item.syllabus, 'Some body text');
    assert.equal(item.blurb, 'My own summary');
    assert.equal(item.level, 'Intermediate');
    assert.deepEqual(item.topics, ['a', 'b']);
    assert.equal(item.durationHours, 7);
    assert.equal(item.enrolling, true);
    assert.ok(!Number.isNaN(Date.parse(item.createdAt)), 'createdAt must be an ISO date');
    assert.ok(!Number.isNaN(Date.parse(item.updatedAt)), 'updatedAt must be an ISO date');
  });

  it('populates instructor with the public profile of the authenticated user', async () => {
    const res = await api('POST', '', { headers: as(SARAH), body: valid() });
    assert.equal(res.status, 201);
    const owner = res.body.course.instructor;
    assert.equal(typeof owner, 'object', 'instructor must be a populated object');
    assert.deepEqual(Object.keys(owner).sort(), ['_id', 'bio', 'email', 'name']);
    assert.deepEqual(owner, SARAH_PROFILE);
  });

  it('uses the first 120 characters of syllabus as blurb when it is not provided', async () => {
    const text = 'abcdefghij'.repeat(30);
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), syllabus: text } });
    assert.equal(res.status, 201);
    assert.equal(res.body.course.blurb, text.slice(0, 120));
  });

  it('defaults topics to [] and durationHours to 10', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.course.topics, []);
    assert.equal(res.body.course.durationHours, 10);
  });

  it('always sets enrolling to true, whatever the client sends', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), enrolling: false } });
    assert.equal(res.status, 201);
    assert.equal(res.body.course.enrolling, true);
  });

  it('saves the course so that it can be fetched afterwards', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.equal(created.status, 201);
    const fetched = await api('GET', '/' + created.body.course._id);
    assert.equal(fetched.status, 200);
    assert.equal(fetched.body.course.title, 'My First Course');
  });

  it('appears first in the public list after creation', async () => {
    const created = await api('POST', '', { headers: as(JOHN), body: valid() });
    const list = await api('GET', '');
    assert.equal(list.body.courses[0]._id, created.body.course._id);
  });

  it('gives every course its own _id', async () => {
    const a = await api('POST', '', { headers: as(JOHN), body: valid() });
    const b = await api('POST', '', { headers: as(JOHN), body: valid() });
    assert.notEqual(a.body.course._id, b.body.course._id);
  });

  it('trims the title', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), title: '   Padded   ' } });
    assert.equal(res.status, 201);
    assert.equal(res.body.course.title, 'Padded');
  });

  for (const field of ['title', 'syllabus', 'level']) {
    it('rejects a missing ' + field + ' with 400', async () => {
      const body = valid();
      delete body[field];
      const res = await api('POST', '', { headers: as(JOHN), body });
      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'title, syllabus and level are required');
    });
  }

  it('rejects a whitespace-only title with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), title: '    ' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'title, syllabus and level are required');
  });

  it('rejects an unknown level with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), level: 'Banana' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Invalid level');
  });

  it('rejects a durationHours that is not a non-negative number with 400', async () => {
    for (const bad of ['lots', -5]) {
      const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), durationHours: bad } });
      assert.equal(res.status, 400, 'value ' + JSON.stringify(bad));
      assert.equal(res.body.message, 'durationHours must be a non-negative number');
    }
  });

  it('rejects topics that is not an array of strings with 400', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), topics: 'not-an-array' } });
    assert.equal(res.status, 400);
  });

  it('never lets the client choose the instructor', async () => {
    const res = await api('POST', '', { headers: as(JOHN), body: { ...valid(), instructor: SARAH } });
    assert.equal(res.status, 201);
    assert.equal(res.body.course.instructor._id, JOHN);
  });

  it('requires authentication', async () => {
    const res = await api('POST', '', { body: valid() });
    assert.equal(res.status, 401);
  });
});
