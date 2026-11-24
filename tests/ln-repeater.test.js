import test from 'node:test';
import assert from 'node:assert/strict';

import {
	hasIndexToken,
	applyIndexTokens,
	normalizeBounds,
	canAdd,
	canRemove,
	detectNextIndex,
	parseItemsPayload,
	extractLeafFieldName,
	replaceLeadingIndex
} from '../components/ln-repeater/src/repeater-model.js';

test('hasIndexToken detects {index} and {index1} placeholders', () => {
	assert.equal(hasIndexToken('options[{index}][label]'), true);
	assert.equal(hasIndexToken('Option {index1}'), true);
	assert.equal(hasIndexToken('options[]'), false);
	assert.equal(hasIndexToken(''), false);
	assert.equal(hasIndexToken(null), false);
});

test('applyIndexTokens replaces 0-based {index} and 1-based {index1}', () => {
	assert.equal(applyIndexTokens('options[{index}][label]', 0), 'options[0][label]');
	assert.equal(applyIndexTokens('options[{index}][label]', 3), 'options[3][label]');
	assert.equal(applyIndexTokens('Option {index1} (#{index})', 0), 'Option 1 (#0)');
	assert.equal(applyIndexTokens('Option {index1}', 4), 'Option 5');
	assert.equal(applyIndexTokens('plain', 2), 'plain');
	assert.equal(applyIndexTokens('items[{index}]', -5), 'items[0]');
	assert.equal(applyIndexTokens(null, 1), '');
});

test('normalizeBounds clamps min/max cleanly and keeps max >= min', () => {
	assert.deepEqual(normalizeBounds(0, Infinity), { min: 0, max: Infinity });
	assert.deepEqual(normalizeBounds(1, 10), { min: 1, max: 10 });
	assert.deepEqual(normalizeBounds(-3, 5), { min: 0, max: 5 });
	assert.deepEqual(normalizeBounds(5, 2), { min: 5, max: 5 });
	assert.deepEqual(normalizeBounds(NaN, NaN), { min: 0, max: Infinity });
	assert.deepEqual(normalizeBounds(1, 0), { min: 1, max: Infinity });
});

test('canAdd and canRemove enforce row count boundaries', () => {
	assert.equal(canAdd(0, 3), true);
	assert.equal(canAdd(2, 3), true);
	assert.equal(canAdd(3, 3), false);
	assert.equal(canAdd(100, Infinity), true);

	assert.equal(canRemove(1, 1), false);
	assert.equal(canRemove(2, 1), true);
	assert.equal(canRemove(1, 0), true);
	assert.equal(canRemove(0, 0), false);
});

test('detectNextIndex computes next safe monotonic index from SSR names', () => {
	assert.equal(detectNextIndex(['options[0][label]', 'options[1][label]'], 2), 2);
	// Sparse SSR indices (e.g. row 1 was previously deleted server-side)
	assert.equal(detectNextIndex(['options[0][label]', 'options[4][label]'], 2), 5);
	// Unindexed array names fall back to existing row count
	assert.equal(detectNextIndex(['options[]', 'options[]'], 2), 2);
	assert.equal(detectNextIndex([], 0), 0);
	assert.equal(detectNextIndex(null, 3), 3);
});

test('parseItemsPayload parses arrays and JSON array strings safely', () => {
	assert.deepEqual(parseItemsPayload(['a', 'b']), ['a', 'b']);
	assert.deepEqual(parseItemsPayload('[{"label":"Red"},{"label":"Blue"}]'), [{ label: 'Red' }, { label: 'Blue' }]);
	assert.equal(parseItemsPayload('{"not":"an-array"}'), null);
	assert.equal(parseItemsPayload('invalid-json'), null);
	assert.equal(parseItemsPayload(''), null);
	assert.equal(parseItemsPayload(null), null);
});

test('extractLeafFieldName resolves leaf keys from bracketed and flat input names', () => {
	assert.equal(extractLeafFieldName('options[0][label]'), 'label');
	assert.equal(extractLeafFieldName('sacks[2][weight]'), 'weight');
	assert.equal(extractLeafFieldName('sacks[2][meta][code]'), 'code');
	assert.equal(extractLeafFieldName('options[]'), 'options');
	assert.equal(extractLeafFieldName('options[0]'), 'options');
	assert.equal(extractLeafFieldName('weight'), 'weight');
	assert.equal(extractLeafFieldName(''), '');
	assert.equal(extractLeafFieldName(null), '');
});

test('replaceLeadingIndex updates first matching bracketed index segment', () => {
	assert.equal(
		replaceLeadingIndex('options[2][trans][sq][label]', 2, 1),
		'options[1][trans][sq][label]'
	);
	assert.equal(
		replaceLeadingIndex('options[2]', 2, 0),
		'options[0]'
	);
	assert.equal(
		replaceLeadingIndex('options[2][label]', 2, 2),
		'options[2][label]'
	);
	assert.equal(
		replaceLeadingIndex('options[]', 2, 0),
		'options[]'
	);
});
