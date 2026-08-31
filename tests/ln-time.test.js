import test from 'node:test';
import assert from 'node:assert/strict';

import {
	calculateRelativeTime,
	resolveDateFormatOptions
} from '../components/ln-time/src/time-model.js';

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

	// 2 months ago -> olderThanMonth is true
	const t7 = calculateRelativeTime(new Date('2026-06-15T12:00:00Z'), now);
	assert.equal(t7.unit, 'month');
	assert.equal(t7.isOlderThanMonth, true);

	// Null target date
	assert.deepEqual(calculateRelativeTime(null, now), { value: 0, unit: 'second', isOlderThanMonth: false });
});

test('resolveDateFormatOptions resolves options by mode and year difference', () => {
	const now = new Date(2026, 7, 31);
	const sameYearDate = new Date(2026, 5, 15);
	const diffYearDate = new Date(2025, 5, 15);

	// full mode
	assert.deepEqual(resolveDateFormatOptions('full', sameYearDate, now), {
		dateStyle: 'long',
		timeStyle: 'short'
	});

	// date mode
	assert.deepEqual(resolveDateFormatOptions('date', sameYearDate, now), {
		dateStyle: 'medium'
	});

	// time mode
	assert.deepEqual(resolveDateFormatOptions('time', sameYearDate, now), {
		timeStyle: 'short'
	});

	// short mode (same year omits year)
	assert.deepEqual(resolveDateFormatOptions('short', sameYearDate, now), {
		month: 'short',
		day: 'numeric'
	});

	// short mode (different year includes year)
	assert.deepEqual(resolveDateFormatOptions('short', diffYearDate, now), {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
});
