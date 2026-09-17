import test from 'node:test';
import assert from 'node:assert/strict';

import { attrStr, attrInt, attrBool, attrList, defineAttrs, attrSpec, attrEffects } from '../components/ln-core/attrs.js';

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

test('attrSpec maps prop-bearing entries to defineAttrs triples', () => {
	const table = {
		'data-ln-x-window': { prop: '_w', read: attrInt, fallback: 1000 },
		'data-ln-x-tag': { prop: 'tag', read: attrStr }
	};
	assert.deepEqual(attrSpec(table), {
		_w: [attrInt, 'data-ln-x-window', 1000],
		tag: [attrStr, 'data-ln-x-tag', undefined]
	});
});

test('attrSpec skips entries with no prop', () => {
	const fn = () => {};
	const table = {
		'data-ln-action': { effect: fn },
		'data-ln-empty': {}
	};
	assert.deepEqual(attrSpec(table), {});
});

test('attrSpec output drives defineAttrs end-to-end', () => {
	const backing = { 'data-ln-count': '42' };
	const el = fakeEl(backing);
	const table = {
		'data-ln-count': { prop: 'count', read: attrInt, fallback: 0 }
	};
	const instance = {};
	defineAttrs(instance, el, attrSpec(table));

	assert.equal(instance.count, 42);
	backing['data-ln-count'] = '99';
	assert.equal(instance.count, 99);
});

test('attrEffects collects effect entries', () => {
	const fn1 = () => {};
	const fn2 = () => {};
	const table = {
		'data-ln-a': { prop: 'a', read: attrStr, effect: fn1 },
		'data-ln-b': { effect: fn2 },
		'data-ln-c': { prop: 'c', read: attrInt }
	};
	assert.deepEqual(attrEffects(table), {
		'data-ln-a': fn1,
		'data-ln-b': fn2
	});
});

test('attrEffects returns null when the table declares no reactions', () => {
	const table = {
		'data-ln-a': { prop: 'a', read: attrStr },
		'data-ln-b': { prop: 'b', read: attrInt, fallback: 10 }
	};
	assert.equal(attrEffects(table), null);
	assert.equal(attrEffects({}), null);
});

