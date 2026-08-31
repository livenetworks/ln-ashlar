import test from 'node:test';
import assert from 'node:assert/strict';

import {
	aggregateRecords,
	decorateRecords,
	filterRecords,
	queryRecords,
	searchRecords,
	sortRecords
} from '../components/ln-data-store/src/data-store-model.js';

const SAMPLE_RECORDS = [
	{ id: 1, name: 'Alice Smith', department: 'Engineering', salary: 90000, active: true },
	{ id: 2, name: 'Bob Jones', department: 'Design', salary: 75000, active: false },
	{ id: 3, name: 'Charlie Brown', department: 'Engineering', salary: 85000, active: true },
	{ id: 4, name: 'Diana Prince', department: 'Product', salary: 95000, active: true }
];

test('sortRecords sorts records accurately with null safety', () => {
	const sortedSalaryDesc = sortRecords(SAMPLE_RECORDS, { field: 'salary', direction: 'desc' });
	assert.equal(sortedSalaryDesc[0].name, 'Diana Prince');
	assert.equal(sortedSalaryDesc[3].name, 'Bob Jones');

	const recordsWithNull = [
		{ id: 1, name: 'B' },
		{ id: 2, name: null },
		{ id: 3, name: 'A' }
	];
	const sortedNulls = sortRecords(recordsWithNull, { field: 'name', direction: 'asc' });
	assert.equal(sortedNulls[0].name, null);
	assert.equal(sortedNulls[1].name, 'A');
	assert.equal(sortedNulls[2].name, 'B');

	// Numeric sorting with negative numbers and null
	const numericRecords = [
		{ id: 1, val: 100 },
		{ id: 2, val: -500 },
		{ id: 3, val: null },
		{ id: 4, val: 0 },
		{ id: 5, val: -50 }
	];
	const sortedNumericAsc = sortRecords(numericRecords, { field: 'val', direction: 'asc' });
	// In numeric comparison, null parses to 0: -500 < -50 < (null -> 0, 0) < 100
	assert.equal(sortedNumericAsc[0].val, -500);
	assert.equal(sortedNumericAsc[1].val, -50);
	assert.equal(sortedNumericAsc[4].val, 100);
});

test('filterRecords filters records by matching active filter arrays', () => {
	const filtered = filterRecords(SAMPLE_RECORDS, { department: ['Engineering'] });
	assert.equal(filtered.length, 2);
	assert.deepEqual(filtered.map(r => r.name), ['Alice Smith', 'Charlie Brown']);

	const multiFiltered = filterRecords(SAMPLE_RECORDS, {
		department: ['Engineering', 'Product'],
		active: ['true']
	});
	assert.equal(multiFiltered.length, 3);
});

test('searchRecords matches AND tokens across multiple specified search fields', () => {
	const searchFields = ['name', 'department'];

	const results = searchRecords(SAMPLE_RECORDS, 'alice engineering', searchFields);
	assert.equal(results.length, 1);
	assert.equal(results[0].name, 'Alice Smith');

	const partial = searchRecords(SAMPLE_RECORDS, 'brown', searchFields);
	assert.equal(partial.length, 1);
	assert.equal(partial[0].name, 'Charlie Brown');
});

test('aggregateRecords computes count, sum, and avg on numeric fields', () => {
	assert.equal(aggregateRecords(SAMPLE_RECORDS, 'salary', 'count'), 4);
	assert.equal(aggregateRecords(SAMPLE_RECORDS, 'salary', 'sum'), 345000);
	assert.equal(aggregateRecords(SAMPLE_RECORDS, 'salary', 'avg'), 86250);
});

test('queryRecords orchestrates filter -> search -> sort -> slice', () => {
	const result = queryRecords(
		SAMPLE_RECORDS,
		{
			filters: { active: ['true'] },
			search: 'Engineering',
			sort: { field: 'salary', direction: 'desc' },
			offset: 0,
			limit: 1
		},
		['department']
	);

	assert.equal(result.total, 4);
	assert.equal(result.filtered, 2); // 2 active engineering records
	assert.equal(result.records.length, 1);
	assert.equal(result.records[0].name, 'Alice Smith'); // 90000 > 85000
});

test('decorateRecords adds computed fields safely', () => {
	const decorated = decorateRecords(SAMPLE_RECORDS.slice(0, 1), {
		fullNameAndRole: r => `${r.name} (${r.department})`
	});
	assert.equal(decorated[0].fullNameAndRole, 'Alice Smith (Engineering)');
});
