import test from 'node:test';
import assert from 'node:assert/strict';

import {
	arraysDiffer,
	deriveActiveFilters,
	evaluateRowFilters,
	resolveColumnIndex
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

test('resolveColumnIndex resolves column index across multiple scenarios', () => {
	// Explicit column index
	assert.equal(resolveColumnIndex(null, null, 'category', 3), 3);

	// Filter DOM with data-ln-filter-col
	const mockDomWithCol = {
		getAttribute: (attr) => attr === 'data-ln-filter-col' ? '2' : null,
		closest: () => null
	};
	assert.equal(resolveColumnIndex(null, mockDomWithCol, 'category', null), 2);

	// Header matching data-ln-table-filter-col
	const mockTable = {
		querySelectorAll: (sel) => [
			{ cellIndex: 0, getAttribute: () => null, childNodes: [], textContent: '#' },
			{ cellIndex: 1, getAttribute: () => null, childNodes: [], textContent: 'Product' },
			{ cellIndex: 2, getAttribute: (attr) => attr === 'data-ln-table-filter-col' ? 'category' : null, childNodes: [], textContent: 'Category' },
			{ cellIndex: 3, getAttribute: () => null, childNodes: [], textContent: 'Price' }
		]
	};
	assert.equal(resolveColumnIndex(mockTable, null, 'category', null), 2);

	// Header matching text content
	assert.equal(resolveColumnIndex(mockTable, null, 'price', null), 3);

	// Unresolvable returns null
	assert.equal(resolveColumnIndex(mockTable, null, 'unknown', null), null);
});

test('evaluateRowFilters supports row attribute fallback', () => {
	const filters = {
		category: { col: null, values: ['electronics'], attr: 'data-category' }
	};

	const matchingRow = {
		getAttribute: (attr) => attr === 'data-category' ? 'electronics' : null
	};
	const nonMatchingRow = {
		getAttribute: (attr) => attr === 'data-category' ? 'furniture' : null
	};

	assert.equal(evaluateRowFilters({}, filters, matchingRow), true);
	assert.equal(evaluateRowFilters({}, filters, nonMatchingRow), false);
});

