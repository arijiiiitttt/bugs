import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TinyEmitter } from '../src/emitter.js';

test('calls listeners in registration order with the arguments and this', () => {
  const e = new TinyEmitter();
  const calls = [];
  e.on('x', function (a, b) { calls.push(['first', a, b, this === e]); });
  e.on('x', (a) => calls.push(['second', a]));
  assert.equal(e.emit('x', 1, 2), true);
  assert.deepEqual(calls, [['first', 1, 2, true], ['second', 1]]);
});

test('emit returns false when nobody listens', () => {
  assert.equal(new TinyEmitter().emit('nothing'), false);
});

test('on/once/off are chainable', () => {
  const e = new TinyEmitter();
  const f = () => {};
  assert.equal(e.on('a', f), e);
  assert.equal(e.once('a', f), e);
  assert.equal(e.off('a', f), e);
  assert.equal(e.off('unknown', f), e);
});

test('once listeners run only once', () => {
  const e = new TinyEmitter();
  let n = 0;
  e.once('x', () => n++);
  e.emit('x');
  e.emit('x');
  assert.equal(n, 1);
  assert.equal(e.listenerCount('x'), 0);
});

test('off removes the most recently added registration of fn', () => {
  const e = new TinyEmitter();
  const f = () => {};
  e.on('x', f);
  e.on('x', f);
  e.off('x', f);
  assert.equal(e.listenerCount('x'), 1);
  e.off('x', f);
  assert.equal(e.listenerCount('x'), 0);
});

test('off can remove a once listener by its original function', () => {
  const e = new TinyEmitter();
  let n = 0;
  const f = () => n++;
  e.once('x', f);
  e.off('x', f);
  e.emit('x');
  assert.equal(n, 0);
});

test('emit works on a snapshot of the listeners', () => {
  const e = new TinyEmitter();
  const calls = [];
  const second = () => calls.push('second');
  e.on('x', () => {
    calls.push('first');
    e.on('x', () => calls.push('late'));
    e.off('x', second);
  });
  e.on('x', second);
  e.emit('x');
  assert.deepEqual(calls, ['first', 'second']);
  assert.equal(e.listenerCount('x'), 2);
});

test('emitting error without a listener throws', () => {
  const e = new TinyEmitter();
  const err = new Error('boom');
  assert.throws(() => e.emit('error', err), (x) => x === err);
  assert.throws(() => e.emit('error', 'text'), { message: 'Unhandled error.' });
});

test('emitting error with a listener does not throw', () => {
  const e = new TinyEmitter();
  let got;
  e.on('error', (err) => { got = err; });
  assert.equal(e.emit('error', new Error('handled')), true);
  assert.equal(got.message, 'handled');
});
