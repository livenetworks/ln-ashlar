import test from 'node:test';
import assert from 'node:assert/strict';

import {
	arraysDiffer,
	deriveActiveFilters,
	evaluateRowFilters
} from '../components/ln-filter/src/filter-model.js';

test('arraysDiffer checks equality and differences between arrays', () => {
	assert.equal(arraysDiffer(['a', 'b'], ['a', 'b']), false);
	assert.equal(arraysDiffer([], []), false);
	assert.equal(arraysDiffer(['a'], ['a', 'b']), true);
	assert.equal(arraysDiffer(['a', 'c'], ['a', 'b']), true);
	assert.equal(arraysDiffer(null, ['a']), true);
});

test('evaluateRowFilters evaluates AND across columns and OR within columns', () => {
	const filters = {
		status: { col: 1, values: ['active', 'pending'] },
		role: { col: 2, values: ['admin'] }
	};

	// Row 1: status="active", role="admin" -> Match
	assert.equal(evaluateRowFilters({ 1: 'Active', 2: 'Admin' }, filters), true);

	// Row 2: status="pending", role="admin" -> Match
	assert.equal(evaluateRowFilters({ 1: 'pending', 2: 'Admin' }, filters), true);

	// Row 3: status="archived", role="admin" -> Fails status
	assert.equal(evaluateRowFilters({ 1: 'archived', 2: 'Admin' }, filters), false);

	// Row 4: status="active", role="member" -> Fails role
	assert.equal(evaluateRowFilters({ 1: 'active', 2: 'Member' }, filters), false);

	// Empty filters -> Match
	assert.equal(evaluateRowFilters({ 1: 'anything' }, {}), true);
});

test('deriveActiveFilters extracts active key and checked non-reset values', () => {
	const descriptors = [
		{ key: 'status', value: '', checked: false, isReset: true },
		{ key: 'status', value: 'active', checked: true, isReset: false },
		{ key: 'status', value: 'pending', checked: true, isReset: false },
		{ key: 'status', value: 'archived', checked: false, isReset: false }
	];

	const result = deriveActiveFilters(descriptors);
	assert.equal(result.key, 'status');
	assert.deepEqual(result.values, ['active', 'pending']);

	// All reset / unchecked
	const resetDescriptors = [
		{ key: 'status', value: '', checked: true, isReset: true }
	];
	const resetResult = deriveActiveFilters(resetDescriptors);
	assert.deepEqual(resetResult.values, []);
});
