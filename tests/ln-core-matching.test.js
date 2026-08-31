import test from 'node:test';
import assert from 'node:assert/strict';

import {
	collapseSearchParts,
	matchesFilterValues,
	matchesSearchTokens,
	normalizeSearchTerm,
	parseSearchFields,
	tokenizeSearchQuery
} from '../components/ln-core/matching.js';

test('normalizeSearchTerm trims and lowercases search input', () => {
	assert.equal(normalizeSearchTerm('  Hello WORLD  '), 'hello world');
	assert.equal(normalizeSearchTerm(''), '');
	assert.equal(normalizeSearchTerm(null), '');
	assert.equal(normalizeSearchTerm(undefined), '');
	assert.equal(normalizeSearchTerm(123), '123');
});

test('tokenizeSearchQuery splits queries by whitespace into distinct tokens', () => {
	assert.deepEqual(tokenizeSearchQuery(''), []);
	assert.deepEqual(tokenizeSearchQuery(null), []);
	assert.deepEqual(tokenizeSearchQuery('   '), []);
	assert.deepEqual(tokenizeSearchQuery('alice'), ['alice']);
	assert.deepEqual(tokenizeSearchQuery('alice   smith   developer'), ['alice', 'smith', 'developer']);
	assert.deepEqual(tokenizeSearchQuery('  John   DOE  '), ['john', 'doe']);
});

test('parseSearchFields parses and cleans comma-separated field lists', () => {
	assert.equal(parseSearchFields(null), null);
	assert.equal(parseSearchFields(undefined), null);
	assert.equal(parseSearchFields(''), null);
	assert.equal(parseSearchFields('   ,  ,  '), null);
	assert.deepEqual(parseSearchFields('name, email, role'), ['name', 'email', 'role']);
	assert.deepEqual(parseSearchFields(' title , description '), ['title', 'description']);
});

test('matchesSearchTokens performs case-insensitive AND matching across tokens', () => {
	assert.equal(matchesSearchTokens('Alice Smith Developer', []), true);
	assert.equal(matchesSearchTokens('Alice Smith Developer', ['alice']), true);
	assert.equal(matchesSearchTokens('Alice Smith Developer', ['alice', 'developer']), true);
	assert.equal(matchesSearchTokens('Alice Smith Developer', ['alice', 'manager']), false);
	assert.equal(matchesSearchTokens('', ['alice']), false);
	assert.equal(matchesSearchTokens(null, ['alice']), false);
});

test('collapseSearchParts joins parts with single spaces and collapses whitespace', () => {
	assert.equal(collapseSearchParts([]), '');
	assert.equal(collapseSearchParts(null), '');
	assert.equal(collapseSearchParts(['John', '  Doe  ', 'Engineer']), 'john doe engineer');
	assert.equal(collapseSearchParts(['First\n', '\tSecond', ' Third ']), 'first second third');
});

test('matchesFilterValues evaluates value against filter array using case-insensitive OR logic', () => {
	assert.equal(matchesFilterValues('active', []), true);
	assert.equal(matchesFilterValues('active', ['active']), true);
	assert.equal(matchesFilterValues('ACTIVE', ['active']), true);
	assert.equal(matchesFilterValues('active', ['pending', 'active']), true);
	assert.equal(matchesFilterValues('archived', ['pending', 'active']), false);
	assert.equal(matchesFilterValues(null, ['active']), false);
	assert.equal(matchesFilterValues(undefined, ['active']), false);
});
