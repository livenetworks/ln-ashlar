import test from 'node:test';
import assert from 'node:assert/strict';

import {
	getSeparators,
	cleanNumericString,
	parseNumber,
	formatNumber,
	calculateCursorPosition
} from '../components/ln-number/src/number-model.js';

test('getSeparators extracts correct group and decimal separators across locales', () => {
	const en = getSeparators('en-US');
	assert.equal(en.groupSep, ',');
	assert.equal(en.decimalSep, '.');

	const mk = getSeparators('mk-MK');
	assert.equal(mk.groupSep, '.');
	assert.equal(mk.decimalSep, ',');

	const de = getSeparators('de-DE');
	assert.equal(de.groupSep, '.');
	assert.equal(de.decimalSep, ',');

	const fr = getSeparators('fr-FR');
	assert.equal(fr.decimalSep, ',');
	// fr-FR uses narrow no-break space (\u202F) or standard space in full-icu
	assert.ok(/\s/.test(fr.groupSep) || fr.groupSep === '\u202F' || fr.groupSep === '\u00A0' || fr.groupSep === ' ');
});

test('cleanNumericString standardizes numeric strings across various locale inputs', () => {
	// en-US inputs
	assert.equal(cleanNumericString('1,234,567.89', ',', '.'), '1234567.89');
	assert.equal(cleanNumericString('$1,234.50', ',', '.'), '1234.50');

	// mk-MK / de-DE inputs
	assert.equal(cleanNumericString('1.234.567,89', '.', ','), '1234567.89');
	assert.equal(cleanNumericString('€1.234,50', '.', ','), '1234.50');

	// fr-FR input with \u202F
	assert.equal(cleanNumericString('1\u202F234\u202F567,89', '\u202F', ','), '1234567.89');

	// Negative values
	assert.equal(cleanNumericString('-1,234.50', ',', '.'), '-1234.50');
	assert.equal(cleanNumericString('-', ',', '.'), '-');
	assert.equal(cleanNumericString('', ',', '.'), '');
	assert.equal(cleanNumericString(null, ',', '.'), '');
});

test('parseNumber parses strings and numbers accurately with locale sensitivity', () => {
	assert.equal(parseNumber(1234.56, 'en-US'), 1234.56);
	assert.equal(parseNumber('1,234.56', 'en-US'), 1234.56);
	assert.equal(parseNumber('1.234,56', 'mk-MK'), 1234.56);
	assert.equal(parseNumber('1\u202F234,56', 'fr-FR'), 1234.56);
	assert.equal(parseNumber('-500.25', 'en-US'), -500.25);

	// Invalid / edge cases return NaN
	assert.ok(isNaN(parseNumber('', 'en-US')));
	assert.ok(isNaN(parseNumber('-', 'en-US')));
	assert.ok(isNaN(parseNumber('abc', 'en-US')));
	assert.ok(isNaN(parseNumber(null, 'en-US')));
	assert.ok(isNaN(parseNumber(undefined, 'en-US')));
	assert.ok(isNaN(parseNumber(NaN, 'en-US')));
});

test('formatNumber formats values according to locale and decimal constraints', () => {
	// en-US formatting
	assert.equal(formatNumber(1234, 'en-US'), '1,234');
	assert.equal(formatNumber(1234.5, 'en-US'), '1,234.5');
	assert.equal(formatNumber(1234567.89, 'en-US'), '1,234,567.89');

	// mk-MK formatting
	assert.equal(formatNumber(1234, 'mk-MK'), '1.234');
	assert.equal(formatNumber(1234.5, 'mk-MK'), '1.234,5');
	assert.equal(formatNumber(1234567.89, 'mk-MK'), '1.234.567,89');

	// maxDecimals option
	assert.equal(formatNumber(1234.5678, 'en-US', { maxDecimals: 2 }), '1,234.57');
	assert.equal(formatNumber(1234, 'en-US', { maxDecimals: 2 }), '1,234');

	// userDecimals option (preserves exact fractional digits while typing)
	assert.equal(formatNumber(1234.5, 'en-US', { userDecimals: 2 }), '1,234.50');
	assert.equal(formatNumber(1234.5, 'mk-MK', { userDecimals: 3 }), '1.234,500');

	// Invalid input returns empty string
	assert.equal(formatNumber(NaN, 'en-US'), '');
	assert.equal(formatNumber(null, 'en-US'), '');
});

test('calculateCursorPosition maps cursor across formatting insertions', () => {
	// User types '4' after '123' -> '1234' becomes '1,234'
	// 4 digits were before cursor, formatted is '1,234' -> cursor should be at index 5 (end)
	assert.equal(calculateCursorPosition('1,234', 4), 5);

	// User types '2' in '1,|345' with 2 digits before cursor ('1','2') -> '1,234' -> cursor after '2' (index 3)
	assert.equal(calculateCursorPosition('1,234', 2), 3);

	// User has 1 digit before cursor in '1,234' -> cursor after '1' (index 1)
	assert.equal(calculateCursorPosition('1,234', 1), 1);

	// 0 digits before cursor
	assert.equal(calculateCursorPosition('1,234', 0), 0);
	assert.equal(calculateCursorPosition('-1,234', 0), 1);
});
