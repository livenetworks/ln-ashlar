import test from 'node:test';
import assert from 'node:assert/strict';

import {
	calculateSelectionState,
	calculateVirtualWindow,
	toggleRowSelection,
	toggleSelectAll
} from '../components/ln-table/src/table-model.js';

test('calculateVirtualWindow computes start/end indices and padding heights', () => {
	// Zero count / zero height
	assert.deepEqual(
		calculateVirtualWindow(0, 400, 0, 0),
		{ start: 0, end: 0, topPadding: 0, bottomPadding: 0 }
	);

	// 1000 rows, 40px row height, viewport 400px (10 visible rows), scrolled to top
	const top = calculateVirtualWindow(0, 400, 40, 1000, 5);
	assert.equal(top.start, 0);
	assert.equal(top.end, 15); // 10 visible + 5 buffer
	assert.equal(top.topPadding, 0);
	assert.equal(top.bottomPadding, (1000 - 15) * 40);

	// Scrolled to 2000px (row 50)
	const middle = calculateVirtualWindow(2000, 400, 40, 1000, 5);
	assert.equal(middle.start, 45); // 50 - 5 buffer
	assert.equal(middle.end, 65); // 50 + 10 + 5 buffer
	assert.equal(middle.topPadding, 45 * 40);
	assert.equal(middle.bottomPadding, (1000 - 65) * 40);
});

test('calculateSelectionState evaluates indeterminate and all-selected states', () => {
	const allIds = [1, 2, 3, 4, 5];

	// None selected
	assert.deepEqual(calculateSelectionState(allIds, new Set()), {
		totalCount: 5,
		selectedCount: 0,
		isAllSelected: false,
		isIndeterminate: false
	});

	// Partial selection (indeterminate)
	assert.deepEqual(calculateSelectionState(allIds, new Set([1, 3])), {
		totalCount: 5,
		selectedCount: 2,
		isAllSelected: false,
		isIndeterminate: true
	});

	// All selected
	assert.deepEqual(calculateSelectionState(allIds, new Set([1, 2, 3, 4, 5])), {
		totalCount: 5,
		selectedCount: 5,
		isAllSelected: true,
		isIndeterminate: false
	});
});

test('toggleRowSelection and toggleSelectAll manage selection sets immutably', () => {
	let set = new Set([1, 2]);

	set = toggleRowSelection(set, 3);
	assert.equal(set.has(3), true);

	set = toggleRowSelection(set, 2);
	assert.equal(set.has(2), false);

	const allIds = [1, 2, 3, 4];
	const allSelected = toggleSelectAll(set, allIds, true);
	assert.equal(allSelected.size, 4);

	const cleared = toggleSelectAll(allSelected, allIds, false);
	assert.equal(cleared.size, 0);
});
