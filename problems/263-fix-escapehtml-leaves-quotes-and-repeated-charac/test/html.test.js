import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, commentHtml } from '../src/html.js';

test('escapes every occurrence of the five special characters', () => {
  assert.equal(escapeHtml('<b><b>'), '&lt;b&gt;&lt;b&gt;');
  assert.equal(escapeHtml('a & b & c'), 'a &amp; b &amp; c');
  assert.equal(escapeHtml('"x" \'y\''), '&quot;x&quot; &#39;y&#39;');
});
test('does not double escape its own output', () => {
  assert.equal(escapeHtml('&lt;'), '&amp;lt;');
});
test('null, undefined and non-strings', () => {
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
  assert.equal(escapeHtml(42), '42');
  assert.equal(escapeHtml(0), '0');
});
test('commentHtml escapes text and attribute values', () => {
  assert.equal(commentHtml('bob', 'hi'), '<p class="comment" title="bob">hi</p>');
  const html = commentHtml('" onmouseover="alert(1)', '<script>x</script>');
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('" onmouseover'));
  assert.equal(html, '<p class="comment" title="&quot; onmouseover=&quot;alert(1)">&lt;script&gt;x&lt;/script&gt;</p>');
});
test('commentHtml survives a missing text', () => {
  assert.equal(commentHtml('amy'), '<p class="comment" title="amy"></p>');
});
