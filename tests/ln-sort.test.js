import test from 'node:test';
import assert from 'node:assert/strict';

import {
	createSortComparator,
	getAriaSortValue,
	isSameSortTarget,
	normalizeSortDirection,
	resolveSortItems
} from '../components/ln-sort/src/sort-model.js';

test('normalizeSortDirection standardizes sort directions', () => {
	assert.equal(normalizeSortDirection('asc'), 'asc');
	assert.equal(normalizeSortDirection('ASC'), 'asc');
	assert.equal(normalizeSortDirection('ascending'), 'asc');
	assert.equal(normalizeSortDirection('desc'), 'desc');
	assert.equal(normalizeSortDirection('DESC'), 'desc');
	assert.equal(normalizeSortDirection('descending'), 'desc');
	assert.equal(normalizeSortDirection('none'), 'none');
	assert.equal(normalizeSortDirection(''), 'none');
	assert.equal(normalizeSortDirection(null), 'none');
	assert.equal(normalizeSortDirection(undefined), 'none');
});

test('getAriaSortValue maps sort direction to standard ARIA values', () => {
	assert.equal(getAriaSortValue('asc'), 'ascending');
	assert.equal(getAriaSortValue('desc'), 'descending');
	assert.equal(getAriaSortValue('none'), 'none');
	assert.equal(getAriaSortValue(''), 'none');
});

test('isSameSortTarget compares sort targets accurately', () => {
	assert.equal(isSameSortTarget({ field: 'name' }, { field: 'name' }), true);
	assert.equal(isSameSortTarget({ field: 'name' }, { field: 'age' }), false);
	assert.equal(isSameSortTarget({ column: 1 }, { column: 1 }), true);
	assert.equal(isSameSortTarget({ column: 1 }, { column: '1' }), true);
	assert.equal(isSameSortTarget({ column: 1 }, { column: 2 }), false);
	assert.equal(isSameSortTarget(null, { field: 'name' }), false);
});

test('createSortComparator sorts items accurately in ascending and descending order', () => {
	const items = [
		{ name: 'Charlie', age: 30 },
		{ name: 'Alice', age: 25 },
		{ name: 'Bob', age: 35 }
	];

	// Sort by age ASC
	const ageAscComparator = createSortComparator('asc', 'number', null, item => item.age);
	const sortedAgeAsc = items.slice().sort(ageAscComparator);
	assert.deepEqual(sortedAgeAsc.map(i => i.age), [25, 30, 35]);

	// Sort by age DESC
	const ageDescComparator = createSortComparator('desc', 'number', null, item => item.age);
	const sortedAgeDesc = items.slice().sort(ageDescComparator);
	assert.deepEqual(sortedAgeDesc.map(i => i.age), [35, 30, 25]);

	// Sort by name ASC
	const nameAscComparator = createSortComparator('asc', 'string', null, item => item.name);
	const sortedNameAsc = items.slice().sort(nameAscComparator);
	assert.deepEqual(sortedNameAsc.map(i => i.name), ['Alice', 'Bob', 'Charlie']);

	// Natural sort with collator ({ numeric: true })
	const mixedItems = [{ val: 'item 10' }, { val: 'item 2' }, { val: 'item 1' }];
	const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
	const naturalComparator = createSortComparator('asc', 'string', collator, item => item.val);
	const sortedNatural = mixedItems.slice().sort(naturalComparator);
	assert.deepEqual(sortedNatural.map(i => i.val), ['item 1', 'item 2', 'item 10']);
});

test('isExcludedSortItem detects non-data, hidden, and empty-state elements', async () => {
	const { isExcludedSortItem } = await import('../components/ln-sort/src/sort-model.js');

	// Invalid / non-element
	assert.equal(isExcludedSortItem(null), true);
	assert.equal(isExcludedSortItem(undefined), true);
	assert.equal(isExcludedSortItem('string'), true);
	assert.equal(isExcludedSortItem({ nodeType: 3 }), true); // Text node

	// Template
	assert.equal(isExcludedSortItem({ nodeType: 1, tagName: 'TEMPLATE' }), true);

	// Hidden attribute or class
	assert.equal(isExcludedSortItem({
		nodeType: 1,
		tagName: 'TR',
		hasAttribute: (a) => a === 'hidden'
	}), true);

	assert.equal(isExcludedSortItem({
		nodeType: 1,
		tagName: 'TR',
		classList: { contains: (c) => c === 'hidden' }
	}), true);

	assert.equal(isExcludedSortItem({
		nodeType: 1,
		tagName: 'TR',
		style: { display: 'none' }
	}), true);

	// data-ln-sort-exclude
	assert.equal(isExcludedSortItem({
		nodeType: 1,
		tagName: 'TR',
		hasAttribute: (a) => a === 'data-ln-sort-exclude'
	}), true);

	// Empty state selectors
	assert.equal(isExcludedSortItem({
		nodeType: 1,
		tagName: 'TR',
		matches: (s) => s.includes('.empty-state')
	}), true);

	assert.equal(isExcludedSortItem({
		nodeType: 1,
		tagName: 'TR',
		matches: (s) => s.includes('.ln-table__empty')
	}), true);

	assert.equal(isExcludedSortItem({
		nodeType: 1,
		tagName: 'TR',
		matches: (s) => s.includes('[data-ln-empty]')
	}), true);

	// Regular data item
	assert.equal(isExcludedSortItem({
		nodeType: 1,
		tagName: 'TR',
		hasAttribute: () => false,
		classList: { contains: () => false },
		style: { display: '' },
		matches: () => false
	}), false);
});

test('resolveSortItems resolves correct items for tables and containers', () => {
	// 1. Target is TABLE with tbody
	const row1 = { nodeType: 1, tagName: 'TR' };
	const row2 = { nodeType: 1, tagName: 'TR' };
	const tbody = { nodeType: 1, tagName: 'TBODY', children: [row1, row2] };
	const table = {
		nodeType: 1,
		tagName: 'TABLE',
		tBodies: [tbody],
		getAttribute: () => null
	};
	assert.deepEqual(resolveSortItems(table), [row1, row2]);

	// 2. Target has explicit itemsSelector
	const itemA = { nodeType: 1, tagName: 'LI' };
	const containerWithSelector = {
		nodeType: 1,
		tagName: 'DIV',
		getAttribute: () => null,
		querySelectorAll: (s) => s === '.my-item' ? [itemA] : []
	};
	assert.deepEqual(resolveSortItems(containerWithSelector, '.my-item'), [itemA]);

	// 3. Target has data-ln-sort-items attribute
	const containerWithAttr = {
		nodeType: 1,
		tagName: 'DIV',
		getAttribute: (a) => a === 'data-ln-sort-items' ? '.attr-item' : null,
		querySelectorAll: (s) => s === '.attr-item' ? [itemA] : []
	};
	assert.deepEqual(resolveSortItems(containerWithAttr), [itemA]);

	// 4. Target is generic container (e.g. UL)
	const li1 = { nodeType: 1, tagName: 'LI' };
	const li2 = { nodeType: 1, tagName: 'LI' };
	const ul = {
		nodeType: 1,
		tagName: 'UL',
		children: [li1, li2],
		getAttribute: () => null
	};
	assert.deepEqual(resolveSortItems(ul), [li1, li2]);

	// 5. Invalid target
	assert.deepEqual(resolveSortItems(null), []);
	assert.deepEqual(resolveSortItems(undefined), []);
});

