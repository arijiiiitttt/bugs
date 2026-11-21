import { test } from 'node:test';
import assert from 'node:assert/strict';
import { render } from '../src/template.js';

test('simple substitution with optional whitespace', () => {
  assert.equal(render('Hi {{name}} and {{  other }}!', { name: 'Ann', other: 'Bob' }), 'Hi Ann and Bob!');
});
test('nested paths', () => {
  assert.equal(render('{{ user.address.city }}', { user: { address: { city: 'Oslo' } } }), 'Oslo');
});
test('missing, null and undefined render empty', () => {
  assert.equal(render('[{{a}}][{{b.c}}][{{n}}]', { n: null }), '[][][]');
  assert.equal(render('[{{a.b.c}}]', { a: null }), '[]');
});
test('zero and false render as text', () => {
  assert.equal(render('{{n}}/{{f}}', { n: 0, f: false }), '0/false');
});
test('double braces escape HTML', () => {
  assert.equal(render('{{x}}', { x: '<a href="x">Tom & \'Jerry\'</a>' }),
    '&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;');
});
test('triple braces do not escape', () => {
  assert.equal(render('{{{x}}}', { x: '<b>bold</b>' }), '<b>bold</b>');
});
test('substituted values are not re-processed', () => {
  assert.equal(render('{{a}}', { a: '{{b}}', b: 'NO' }), '{{b}}');
});
test('text without tags is untouched', () => {
  assert.equal(render('plain { text } {x}', {}), 'plain { text } {x}');
});
