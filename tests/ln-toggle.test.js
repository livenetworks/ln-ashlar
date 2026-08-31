import test from 'node:test';
import assert from 'node:assert/strict';

import {
	getNextToggleState,
	normalizeToggleState
} from '../components/ln-toggle/src/toggle-model.js';

import {
	isTargetDisabled,
	shouldIgnoreClick
} from '../components/ln-core/helpers.js';

test('normalizeToggleState returns open only for open, close for anything else', () => {
	assert.equal(normalizeToggleState('open'), 'open');
	assert.equal(normalizeToggleState('close'), 'close');
	assert.equal(normalizeToggleState(''), 'close');
	assert.equal(normalizeToggleState(null), 'close');
	assert.equal(normalizeToggleState(undefined), 'close');
	assert.equal(normalizeToggleState('invalid'), 'close');
});

test('getNextToggleState computes correct target state per action', () => {
	assert.equal(getNextToggleState('close', 'open'), 'open');
	assert.equal(getNextToggleState('open', 'open'), 'open');

	assert.equal(getNextToggleState('open', 'close'), 'close');
	assert.equal(getNextToggleState('close', 'close'), 'close');

	assert.equal(getNextToggleState('close', 'toggle'), 'open');
	assert.equal(getNextToggleState('open', 'toggle'), 'close');
	assert.equal(getNextToggleState('close'), 'open');
	assert.equal(getNextToggleState('open'), 'close');
});

test('shouldIgnoreClick detects modified clicks and non-primary mouse buttons', () => {
	assert.equal(shouldIgnoreClick({ button: 0 }), false);
	assert.equal(shouldIgnoreClick(null), true);
	assert.equal(shouldIgnoreClick({ button: 0, ctrlKey: true }), true);
	assert.equal(shouldIgnoreClick({ button: 0, metaKey: true }), true);
	assert.equal(shouldIgnoreClick({ button: 0, shiftKey: true }), true);
	assert.equal(shouldIgnoreClick({ button: 0, altKey: true }), true);
	assert.equal(shouldIgnoreClick({ button: 1 }), true); // Middle click
	assert.equal(shouldIgnoreClick({ button: 2 }), true); // Right click
});

test('isTargetDisabled detects disabled elements and inert containers', () => {
	assert.equal(isTargetDisabled(null), true);
	assert.equal(isTargetDisabled({ disabled: true }), true);

	const ariaDisabledElement = {
		getAttribute: (name) => name === 'aria-disabled' ? 'true' : null
	};
	assert.equal(isTargetDisabled(ariaDisabledElement), true);

	const inertElement = {
		closest: (selector) => selector === '[inert]' ? {} : null
	};
	assert.equal(isTargetDisabled(inertElement), true);

	const normalElement = {
		disabled: false,
		getAttribute: () => null,
		closest: () => null
	};
	assert.equal(isTargetDisabled(normalElement), false);
});
