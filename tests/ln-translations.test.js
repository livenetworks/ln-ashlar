import test from 'node:test';
import assert from 'node:assert/strict';

import {
	LANG_FLAG_OVERRIDES,
	buildFieldName,
	parseFieldName,
	formatPlaceholder,
	formatRemoveLabel,
	parseLocales,
	resolveLanguageName,
	filterAvailableLocales,
	getCountryForLanguage
} from '../components/ln-translations/src/translations-model.js';

test('buildFieldName generates deterministic simple and nested translation names', () => {
	assert.equal(buildFieldName('title', 'en'), 'trans[en][title]');
	assert.equal(buildFieldName('scope', 'sq'), 'trans[sq][scope]');
	assert.equal(buildFieldName('title', 'en', 'items[1]'), 'items[1][trans][en][title]');
	assert.equal(buildFieldName('description', 'de', 'company[profile]'), 'company[profile][trans][de][description]');
	assert.equal(buildFieldName('', 'en'), '');
	assert.equal(buildFieldName('title', ''), '');
});

test('parseFieldName parses simple and prefixed translation names', () => {
	assert.deepEqual(parseFieldName('trans[en][title]'), {
		prefix: '',
		lang: 'en',
		field: 'title'
	});

	assert.deepEqual(parseFieldName('items[1][trans][sq][title]'), {
		prefix: 'items[1]',
		lang: 'sq',
		field: 'title'
	});

	assert.deepEqual(parseFieldName('company[profile][trans][de][description]'), {
		prefix: 'company[profile]',
		lang: 'de',
		field: 'description'
	});

	assert.equal(parseFieldName('plain_field_name'), null);
	assert.equal(parseFieldName(''), null);
	assert.equal(parseFieldName(null), null);
	assert.equal(parseFieldName(undefined), null);
});

test('formatPlaceholder formats placeholder pattern with language name', () => {
	assert.equal(formatPlaceholder('{lang} translation', 'English'), 'English translation');
	assert.equal(formatPlaceholder('{lang} translation', 'Shqip'), 'Shqip translation');
	assert.equal(formatPlaceholder('Enter {lang} here', 'German'), 'Enter German here');
	assert.equal(formatPlaceholder(null, 'French'), 'French translation');
	assert.equal(formatPlaceholder('{lang} translation', ''), ' translation');
});

test('formatRemoveLabel formats remove label pattern with language name', () => {
	assert.equal(formatRemoveLabel('Remove {lang}', 'English'), 'Remove English');
	assert.equal(formatRemoveLabel('Delete {lang} translation', 'Shqip'), 'Delete Shqip translation');
	assert.equal(formatRemoveLabel(null, 'German'), 'Remove German');
	assert.equal(formatRemoveLabel('Remove {lang}', ''), 'Remove ');
});

test('parseLocales safely parses JSON and falls back to empty object', () => {
	const custom = parseLocales('{"en":"English","de":"Deutsch"}');
	assert.deepEqual(custom, { en: 'English', de: 'Deutsch' });

	const fromObj = parseLocales({ en: 'English', it: 'Italiano' });
	assert.deepEqual(fromObj, { en: 'English', it: 'Italiano' });

	const invalid = parseLocales('malformed-json');
	assert.deepEqual(invalid, {});

	const nullInput = parseLocales(null);
	assert.deepEqual(nullInput, {});

	const arrayInput = parseLocales(['en', 'sq']);
	assert.deepEqual(arrayInput, {});

	const withFallback = parseLocales(null, { mk: 'Македонски' });
	assert.deepEqual(withFallback, { mk: 'Македонски' });
});

test('resolveLanguageName resolves display name from dictionary, Intl, or fallback', () => {
	const locales = { en: 'English', sq: 'Shqip' };
	assert.equal(resolveLanguageName('en', locales), 'English');
	assert.equal(resolveLanguageName('sq', locales), 'Shqip');

	// Fallback to Intl if code is in Intl (like 'de', 'fr')
	const deName = resolveLanguageName('de', locales, 'en');
	assert.ok(deName === 'German' || deName === 'DE');

	// Fallback to code if unknown code
	assert.equal(resolveLanguageName('xx', locales), 'xx');
	assert.equal(resolveLanguageName('', locales), '');
});

test('filterAvailableLocales excludes currently active languages and default language', () => {
	const locales = { en: 'English', sq: 'Shqip', sr: 'Srpski', de: 'Deutsch' };
	const active = new Set(['sq']);
	const available = filterAvailableLocales(locales, active, 'en');
	assert.deepEqual(available, [
		['sr', 'Srpski'],
		['de', 'Deutsch']
	]);

	// Pre-rendered server translation scenario (e.g. Serbian pre-rendered)
	const serverPreRendered = new Set(['sr']);
	const afterHydration = filterAvailableLocales(locales, serverPreRendered, 'en');
	assert.deepEqual(afterHydration, [
		['sq', 'Shqip'],
		['de', 'Deutsch']
	]);

	const allActive = filterAvailableLocales(locales, new Set(['sq', 'sr', 'de']), 'en');
	assert.deepEqual(allActive, []);

	const noneActive = filterAvailableLocales(locales, new Set(), 'en');
	assert.deepEqual(noneActive, [
		['sq', 'Shqip'],
		['sr', 'Srpski'],
		['de', 'Deutsch']
	]);
});

test('getCountryForLanguage maps ISO 639-1 to ISO 3166-1 flag codes', () => {
	assert.equal(getCountryForLanguage('en'), 'gb');
	assert.equal(getCountryForLanguage('sq'), 'al');
	assert.equal(getCountryForLanguage('sr'), 'rs');
	assert.equal(getCountryForLanguage('ja'), 'jp');
	assert.equal(getCountryForLanguage('mk'), 'mk');
	assert.equal(getCountryForLanguage('de'), 'de');
	assert.equal(getCountryForLanguage(''), '');
});
