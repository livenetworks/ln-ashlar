import test from 'node:test';
import assert from 'node:assert/strict';

import {
	formatDateToISO,
	parseDateInput
} from '../components/ln-core/date.js';

test('parseDateInput parses ISO strings, timestamps, and Date objects', () => {
	const d1 = parseDateInput('2026-07-25');
	assert.ok(d1 instanceof Date);
	assert.equal(d1.getFullYear(), 2026);
	assert.equal(d1.getMonth(), 6); // 0-indexed July
	assert.equal(d1.getDate(), 25);

	// Seconds timestamp (< 1e11)
	const d2 = parseDateInput(1784937600);
	assert.ok(d2 instanceof Date);

	// Milliseconds timestamp (>= 1e11)
	const d3 = parseDateInput(1784937600000);
	assert.ok(d3 instanceof Date);

	// Date object
	const d4 = parseDateInput(new Date(2026, 6, 25));
	assert.ok(d4 instanceof Date);
	assert.equal(d4.getFullYear(), 2026);

	// Invalid inputs
	assert.equal(parseDateInput(null), null);
	assert.equal(parseDateInput(''), null);
	assert.equal(parseDateInput(undefined), null);
	assert.equal(parseDateInput('invalid-date'), null);
	assert.equal(parseDateInput(new Date(NaN)), null);
});

test('formatDateToISO formats Date objects to YYYY-MM-DD', () => {
	const d = new Date(2026, 6, 25);
	assert.equal(formatDateToISO(d), '2026-07-25');
	assert.equal(formatDateToISO(null), '');
	assert.equal(formatDateToISO(undefined), '');
	assert.equal(formatDateToISO(new Date(NaN)), '');
});
