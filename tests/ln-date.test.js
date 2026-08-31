import test from 'node:test';
import assert from 'node:assert/strict';

import {
	formatCustomDate,
	formatDateValue,
	getIntlDateOptions,
	parseTypedDate
} from '../components/ln-date/src/date-model.js';

test('getIntlDateOptions resolves keyword formats and returns null for custom patterns', () => {
	assert.deepEqual(getIntlDateOptions('short'), { dateStyle: 'short' });
	assert.deepEqual(getIntlDateOptions('medium'), { dateStyle: 'medium' });
	assert.deepEqual(getIntlDateOptions('long'), { dateStyle: 'long' });
	assert.deepEqual(getIntlDateOptions('short datetime'), { dateStyle: 'short', timeStyle: 'short' });
	assert.deepEqual(getIntlDateOptions('long datetime'), { dateStyle: 'long', timeStyle: 'short' });
	assert.deepEqual(getIntlDateOptions(''), { dateStyle: 'medium' });
	assert.equal(getIntlDateOptions('dd.MM.yyyy'), null);
	assert.equal(getIntlDateOptions('yyyy-MM-dd HH:mm'), null);
});

test('parseTypedDate parses dots, slashes, and dashes with 2-digit/4-digit years', () => {
	// DD.MM.YYYY
	const d1 = parseTypedDate('25.07.2026');
	assert.ok(d1 instanceof Date);
	assert.equal(d1.getFullYear(), 2026);
	assert.equal(d1.getMonth(), 6);
	assert.equal(d1.getDate(), 25);

	// MM/DD/YYYY
	const d2 = parseTypedDate('07/25/2026');
	assert.ok(d2 instanceof Date);
	assert.equal(d2.getFullYear(), 2026);
	assert.equal(d2.getMonth(), 6);
	assert.equal(d2.getDate(), 25);

	// YYYY-MM-DD
	const d3 = parseTypedDate('2026-07-25');
	assert.ok(d3 instanceof Date);
	assert.equal(d3.getFullYear(), 2026);
	assert.equal(d3.getMonth(), 6);
	assert.equal(d3.getDate(), 25);

	// 2-digit year (26 -> 2026)
	const d4 = parseTypedDate('25.07.26');
	assert.ok(d4 instanceof Date);
	assert.equal(d4.getFullYear(), 2026);

	// Invalid dates (e.g. Feb 31)
	assert.equal(parseTypedDate('31.02.2026'), null);
	assert.equal(parseTypedDate('abc'), null);
	assert.equal(parseTypedDate(''), null);
});

test('formatCustomDate replaces custom date pattern tokens', () => {
	const d = new Date(2026, 6, 5, 14, 5); // 2026-07-05 14:05

	assert.equal(formatCustomDate(d, 'dd.MM.yyyy'), '05.07.2026');
	assert.equal(formatCustomDate(d, 'd.M.yy'), '5.7.26');
	assert.equal(formatCustomDate(d, 'yyyy-MM-dd HH:mm'), '2026-07-05 14:05');

	// Fallback dictionary support
	const fallback = {
		monthsLong: ['Јануари', 'Февруари', 'Март', 'Април', 'Мај', 'Јуни', 'Јули', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'],
		monthsShort: ['Јан', 'Фев', 'Мар', 'Апр', 'Мај', 'Јун', 'Јул', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек']
	};
	const formattedWithFallback = formatCustomDate(d, 'dd MMMM yyyy', 'mk-MK', fallback);
	assert.ok(formattedWithFallback.includes('2026'));
	assert.ok(formattedWithFallback.includes('05'));
});

test('formatDateValue formats keywords and custom patterns safely', () => {
	const d = new Date(2026, 6, 25);
	const formatted = formatDateValue(d, 'dd.MM.yyyy', 'en-US');
	assert.equal(formatted, '25.07.2026');

	assert.equal(formatDateValue(null), '');
	assert.equal(formatDateValue(new Date(NaN)), '');
});
