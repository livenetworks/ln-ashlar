import test from 'node:test';
import assert from 'node:assert/strict';

import {
	cleanNumericString,
	formatNumber,
	getSeparators,
	parseNumber
} from '../components/ln-core/number.js';

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
	assert.ok(/\s/.test(fr.groupSep) || fr.groupSep === '\u202F' || fr.groupSep === '\u00A0' || fr.groupSep === ' ');
});

test('cleanNumericString standardizes numeric strings across various locale inputs', () => {
	// en-US inputs
	assert.equal(cleanNumericString('1,234,567.89', ',', '.'), '1234567.89');
	assert.equal(cleanNumericString('$1,234.50', ',', '.'), '1234.50');

	// mk-MK / de-DE inputs
	assert.equal(cleanNumericString('1.234.567,89', '.', ','), '1234567.89');
	assert.equal(cleanNumericString('€1.234,50', '.', ','), '1234.50');

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
	assert.equal(parseNumber('-500.25', 'en-US'), -500.25);

	// Invalid / edge cases return NaN
	assert.ok(isNaN(parseNumber('', 'en-US')));
	assert.ok(isNaN(parseNumber('-', 'en-US')));
	assert.ok(isNaN(parseNumber('abc', 'en-US')));
	assert.ok(isNaN(parseNumber(null, 'en-US')));
});

test('formatNumber formats numbers with locale options, limits, and fraction control', () => {
	assert.equal(formatNumber(1234.5, 'en-US'), '1,234.5');
	assert.equal(formatNumber(1234.5, 'mk-MK'), '1.234,5');

	// maxDecimals option
	assert.equal(formatNumber(1234.5678, 'en-US', { maxDecimals: 2 }), '1,234.57');
	assert.equal(formatNumber(1234.5678, 'en-US', { maxDecimals: 0 }), '1,235');

	// userDecimals option
	assert.equal(formatNumber(12, 'en-US', { userDecimals: 2 }), '12.00');

	// Invalid values
	assert.equal(formatNumber(NaN, 'en-US'), '');
	assert.equal(formatNumber(null, 'en-US'), '');
});
