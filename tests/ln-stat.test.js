import test from 'node:test';
import assert from 'node:assert/strict';

import {
	formatStatValue,
	parseStatFilter
} from '../components/ln-stat/src/stat-model.js';

test('parseStatFilter parses field:value correctly', () => {
	assert.deepEqual(parseStatFilter('status:active'), { status: ['active'] });
	assert.deepEqual(parseStatFilter('  department : Engineering '), { department: ['Engineering'] });
	assert.equal(parseStatFilter('invalid-format'), null);
	assert.equal(parseStatFilter(':missing-field'), null);
	assert.equal(parseStatFilter(null), null);
	assert.equal(parseStatFilter(''), null);
});

test('formatStatValue formats strings and numbers safely', () => {
	assert.equal(formatStatValue(1250), '1250');
	assert.equal(formatStatValue('42'), '42');
	assert.equal(formatStatValue(null), '');
	assert.equal(formatStatValue(undefined), '');
});
