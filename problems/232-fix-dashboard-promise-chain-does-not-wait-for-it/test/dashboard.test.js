import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadDashboard } from '../src/dashboard.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function makeApi(calls, { failPosts = false } = {}) {
  return {
    async getUser() { calls.push('user'); await sleep(2); return { id: 7, name: 'Ada' }; },
    async getPosts(id) {
      calls.push('posts:' + id);
      await sleep(10);
      if (failPosts) throw new Error('posts down');
      return ['p1', 'p2'];
    },
    async getNotifications(id) { calls.push('notifications:' + id); await sleep(5); return [1, 2, 3]; },
  };
}

test('resolves with the complete dashboard', async () => {
  const calls = [];
  const dash = await loadDashboard(makeApi(calls));
  assert.deepEqual(dash, { user: { id: 7, name: 'Ada' }, posts: ['p1', 'p2'], notifications: [1, 2, 3] });
  assert.deepEqual(calls, ['user', 'posts:7', 'notifications:7']);
});

test('rejects when a step fails', async () => {
  const calls = [];
  await assert.rejects(loadDashboard(makeApi(calls, { failPosts: true })), /posts down/);
  assert.ok(!calls.includes('notifications:7'), 'must not continue after a failure');
});
