import test from 'node:test';
import assert from 'node:assert/strict';

import {
	isFieldValid,
	resolveActiveErrorKeys
} from '../components/ln-validate/src/validate-model.js';

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
