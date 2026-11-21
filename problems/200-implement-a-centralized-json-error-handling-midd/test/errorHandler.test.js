import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { startServer, call, sleep } from '../../../lib/testkit.js';
import { errorHandler } from '../src/errorHandler.js';

function appWith(routeError) {
  const app = express();
  app.use(express.json());
  app.get('/fail', (req, res, next) => next(routeError));
  app.post('/json', (req, res) => res.json(req.body));
  app.use(errorHandler);
  return startServer(app);
}

test('uses err.status and exposes the message of client errors', async () => {
  const server = await appWith(Object.assign(new Error('Post not found'), { status: 404 }));
  try {
    const res = await call(server.base, 'GET', '/fail');
    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { message: 'Post not found' });
  } finally { await server.close(); }
});

test('supports err.statusCode', async () => {
  const server = await appWith(Object.assign(new Error('Bad data'), { statusCode: 422 }));
  try {
    const res = await call(server.base, 'GET', '/fail');
    assert.equal(res.status, 422);
    assert.deepEqual(res.body, { message: 'Bad data' });
  } finally { await server.close(); }
});

test('hides the message of unexpected errors', async () => {
  const server = await appWith(new Error('connect ECONNREFUSED db:5432 password=hunter2'));
  try {
    const res = await call(server.base, 'GET', '/fail');
    assert.equal(res.status, 500);
    assert.deepEqual(res.body, { message: 'Internal Server Error' });
  } finally { await server.close(); }
});

test('5xx errors with a status never leak their message either', async () => {
  const server = await appWith(Object.assign(new Error('secret upstream detail'), { status: 502 }));
  try {
    const res = await call(server.base, 'GET', '/fail');
    assert.equal(res.status, 502);
    assert.deepEqual(res.body, { message: 'Internal Server Error' });
  } finally { await server.close(); }
});

test('ignores statuses outside 400-599', async () => {
  for (const status of [200, 302, 'oops', 99, 700]) {
    const server = await appWith(Object.assign(new Error('weird'), { status }));
    try {
      const res = await call(server.base, 'GET', '/fail');
      assert.equal(res.status, 500, String(status));
    } finally { await server.close(); }
  }
});

test('malformed JSON bodies become 400 "Invalid JSON"', async () => {
  const server = await appWith(new Error('unused'));
  try {
    const res = await call(server.base, 'POST', '/json', { raw: '{"a": ' });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { message: 'Invalid JSON' });
  } finally { await server.close(); }
});

test('delegates to next(err) when headers were already sent', () => {
  let delegated;
  const err = new Error('late');
  errorHandler(err, {}, { headersSent: true }, (e) => { delegated = e; });
  assert.equal(delegated, err);
});
