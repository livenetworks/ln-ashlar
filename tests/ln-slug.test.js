import test from 'node:test';
import assert from 'node:assert/strict';

import { generateSlug } from '../components/ln-slug/src/slug-model.js';

test('generateSlug converts strings to clean URL-safe slugs', () => {
	assert.equal(generateSlug('Hello World!'), 'hello-world');
	assert.equal(generateSlug('  Multiple   Spaces & Special # Characters  '), 'multiple-spaces-special-characters');
	assert.equal(generateSlug('Crème Brûlée & Café'), 'creme-brulee-cafe');
	assert.equal(generateSlug('Already-Clean-Slug'), 'already-clean-slug');
	assert.equal(generateSlug('---Leading---and---Trailing---'), 'leading-and-trailing');
});

test('generateSlug supports custom separators', () => {
	assert.equal(generateSlug('Hello World', '_'), 'hello_world');
	assert.equal(generateSlug('Category / Product Name', '_'), 'category_product_name');
});

test('generateSlug handles null, undefined, and empty inputs gracefully', () => {
	assert.equal(generateSlug(null), '');
	assert.equal(generateSlug(undefined), '');
	assert.equal(generateSlug(''), '');
});
