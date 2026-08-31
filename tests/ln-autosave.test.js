import test from 'node:test';
import assert from 'node:assert/strict';

import {
	buildAutosaveKey,
	parseAutosaveDebounce
} from '../components/ln-autosave/src/autosave-model.js';

test('buildAutosaveKey generates consistent path-scoped storage keys', () => {
	assert.equal(buildAutosaveKey('/admin/settings', 'profile-form'), 'ln-autosave:/admin/settings:profile-form');
	assert.equal(buildAutosaveKey('', 'my-form'), 'ln-autosave::my-form');
	assert.equal(buildAutosaveKey('/users/edit', ''), null);
	assert.equal(buildAutosaveKey('/users/edit', null), null);
});

test('parseAutosaveDebounce handles empty, numeric, and invalid debounce inputs', () => {
	assert.equal(parseAutosaveDebounce(null), 0);
	assert.equal(parseAutosaveDebounce(undefined), 0);
	assert.equal(parseAutosaveDebounce(''), 1000);
	assert.equal(parseAutosaveDebounce('500'), 500);
	assert.equal(parseAutosaveDebounce('0'), 0);
	assert.equal(parseAutosaveDebounce('invalid'), 1000);
	assert.equal(parseAutosaveDebounce('-100'), 1000);
});
