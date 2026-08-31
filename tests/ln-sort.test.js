import test from 'node:test';
import assert from 'node:assert/strict';

import {
	createSortComparator,
	getAriaSortValue,
	isSameSortTarget,
	normalizeSortDirection
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
});
