import test from 'node:test';
import assert from 'node:assert/strict';

import {
	calculateRelativeTime,
	parseDateInput,
	resolveDateFormatOptions
} from '../components/ln-time/src/time-model.js';

test('parseDateInput parses Unix seconds, ms, and ISO date strings accurately', () => {
	// Unix seconds (1700000000)
	const d1 = parseDateInput(1700000000);
	assert.equal(d1.getTime(), 1700000000000);

	// Milliseconds
	const d2 = parseDateInput(1700000000000);
	assert.equal(d2.getTime(), 1700000000000);

	// ISO String
	const d3 = parseDateInput('2026-08-31T12:00:00Z');
	assert.equal(d3.toISOString(), '2026-08-31T12:00:00.000Z');

	// Invalid
	assert.equal(parseDateInput('invalid-date'), null);
	assert.equal(parseDateInput(null), null);
	assert.equal(parseDateInput(''), null);
});

test('calculateRelativeTime returns appropriate unit and diff values', () => {
	const now = new Date('2026-08-31T12:00:00Z');

	// 5 seconds ago -> 0 seconds (just now)
	const t1 = calculateRelativeTime(new Date('2026-08-31T11:59:55Z'), now);
	assert.deepEqual(t1, { value: 0, unit: 'second', isOlderThanMonth: false });

	// 30 seconds ago
	const t2 = calculateRelativeTime(new Date('2026-08-31T11:59:30Z'), now);
	assert.equal(t2.unit, 'second');
	assert.equal(t2.value, -30);

	// 15 minutes ago
	const t3 = calculateRelativeTime(new Date('2026-08-31T11:45:00Z'), now);
	assert.equal(t3.unit, 'minute');
	assert.equal(t3.value, -15);

	// 3 hours ago
	const t4 = calculateRelativeTime(new Date('2026-08-31T09:00:00Z'), now);
	assert.equal(t4.unit, 'hour');
	assert.equal(t4.value, -3);

	// 4 days ago
	const t5 = calculateRelativeTime(new Date('2026-08-27T12:00:00Z'), now);
	assert.equal(t5.unit, 'day');
	assert.equal(t5.value, -4);

	// 2 weeks ago
	const t6 = calculateRelativeTime(new Date('2026-08-17T12:00:00Z'), now);
	assert.equal(t6.unit, 'week');
	assert.equal(t6.value, -2);

	// 45 days ago -> isOlderThanMonth: true
	const t7 = calculateRelativeTime(new Date('2026-07-15T12:00:00Z'), now);
	assert.equal(t7.isOlderThanMonth, true);
});

test('resolveDateFormatOptions resolves options by mode and year difference', () => {
	const now = new Date('2026-08-31T12:00:00Z');
	const sameYear = new Date('2026-05-15T12:00:00Z');
	const differentYear = new Date('2025-05-15T12:00:00Z');

	assert.deepEqual(resolveDateFormatOptions('full', sameYear, now), {
		dateStyle: 'long',
		timeStyle: 'short'
	});

	assert.deepEqual(resolveDateFormatOptions('date', sameYear, now), {
		dateStyle: 'medium'
	});

	assert.deepEqual(resolveDateFormatOptions('time', sameYear, now), {
		timeStyle: 'short'
	});

	// Short mode same year: no year
	assert.deepEqual(resolveDateFormatOptions('short', sameYear, now), {
		month: 'short',
		day: 'numeric'
	});

	// Short mode different year: includes year
	assert.deepEqual(resolveDateFormatOptions('short', differentYear, now), {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
});
