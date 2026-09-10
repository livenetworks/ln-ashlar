import test from 'node:test';
import assert from 'node:assert/strict';

import { attrStr, attrInt, attrBool, attrList, defineAttrs } from '../components/ln-core/attrs.js';

const fakeEl = (attrs) => ({
	getAttribute: name => (name in attrs ? attrs[name] : null),
	hasAttribute: name => name in attrs
});

test('attrStr returns fallback when absent, raw string when present', () => {
	const el = fakeEl({ foo: 'bar' });
	assert.equal(attrStr(el, 'missing', 'fallback'), 'fallback');
	assert.equal(attrStr(el, 'foo', 'fallback'), 'bar');
});

test('attrInt handles absent, zero, unparsable, and valid values', () => {
	const el = fakeEl({ zero: '0', num: '250', bad: 'abc' });
	assert.equal(attrInt(el, 'missing', 1000), 1000);
	assert.equal(attrInt(el, 'zero', 1000), 0);
	assert.equal(attrInt(el, 'bad', 1000), 1000);
	assert.equal(attrInt(el, 'num', 1000), 250);
});

test('attrBool detects presence, including empty-string attributes', () => {
	const el = fakeEl({ present: '', valued: 'x' });
	assert.equal(attrBool(el, 'present'), true);
	assert.equal(attrBool(el, 'valued'), true);
	assert.equal(attrBool(el, 'missing'), false);
});

test('attrList splits, trims, and drops empties; absent returns empty array', () => {
	const el = fakeEl({ list: 'a, b ,,c' });
	assert.deepEqual(attrList(el, 'missing'), []);
	assert.deepEqual(attrList(el, 'list'), ['a', 'b', 'c']);
});

test('defineAttrs returns a live value that re-reads the DOM on every access', () => {
	const backing = { name: 'first' };
	const el = fakeEl(backing);
	const instance = {};
	defineAttrs(instance, el, {
		name: [attrStr, 'name', 'fallback']
	});

	assert.equal(instance.name, 'first');
	backing.name = 'second';
	assert.equal(instance.name, 'second');
});

test('defineAttrs properties are getter-only — assignment throws', () => {
	const el = fakeEl({ name: 'first' });
	const instance = {};
	defineAttrs(instance, el, {
		name: [attrStr, 'name', 'fallback']
	});

	assert.throws(() => { instance.name = 'nope'; }, TypeError);
});
