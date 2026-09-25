import test from 'node:test';
import assert from 'node:assert/strict';

import {
	hasInitialValue,
	isFieldValid,
	resolveActiveErrorKeys
} from '../components/ln-validate/src/validate-model.js';

test('hasInitialValue reads checked for checkboxes and radios, value for everything else', () => {
	// A radio or checkbox always has a value — it must not count as filled.
	assert.equal(hasInitialValue({ type: 'radio', value: '7', checked: false }), false);
	assert.equal(hasInitialValue({ type: 'radio', value: '7', checked: true }), true);
	assert.equal(hasInitialValue({ type: 'checkbox', value: 'on', checked: false }), false);
	assert.equal(hasInitialValue({ type: 'checkbox', value: 'on', checked: true }), true);

	assert.equal(hasInitialValue({ type: 'text', value: '' }), false);
	assert.equal(hasInitialValue({ type: 'text', value: '   ' }), false);
	assert.equal(hasInitialValue({ type: 'text', value: 'x' }), true);
	assert.equal(hasInitialValue({ type: 'select-one', value: '' }), false);
	assert.equal(hasInitialValue({ type: 'select-one', value: '3' }), true);
});

test('isFieldValid evaluates overall validity based on validity state and custom errors', () => {
	assert.equal(isFieldValid({ valid: true }, 0), true);
	assert.equal(isFieldValid({ valid: true }, 1), false);
	assert.equal(isFieldValid({ valid: false }, 0), false);
	assert.equal(isFieldValid({ valid: false }, 2), false);
	assert.equal(isFieldValid(null, 0), true);
	assert.equal(isFieldValid(null, 1), false);
});

test('resolveActiveErrorKeys aggregates native and custom error keys accurately', () => {
	const validity = {
		valueMissing: true,
		typeMismatch: false,
		tooShort: false,
		patternMismatch: true
	};

	const custom = new Set(['duplicateEmail', 'serverRejected']);
	const errors = resolveActiveErrorKeys(validity, custom);

	assert.deepEqual(errors, ['required', 'patternMismatch', 'duplicateEmail', 'serverRejected']);

	// No errors
	assert.deepEqual(resolveActiveErrorKeys({ valid: true }, new Set()), []);
});
