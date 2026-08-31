import test from 'node:test';
import assert from 'node:assert/strict';

import {
	calculateProgress,
	compareValues,
	detectValueType,
	isEditableTarget,
	isTargetDisabled,
	isUsableTarget,
	shouldIgnoreClick
} from '../components/ln-core/index.js';

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

test('isEditableTarget identifies form controls and contenteditable surfaces', () => {
	assert.equal(isEditableTarget(null), false);
	assert.equal(isEditableTarget({ tagName: 'INPUT' }), true);
	assert.equal(isEditableTarget({ tagName: 'TEXTAREA' }), true);
	assert.equal(isEditableTarget({ tagName: 'SELECT' }), true);
	assert.equal(isEditableTarget({ tagName: 'DIV', isContentEditable: true }), true);
	assert.equal(isEditableTarget({ tagName: 'DIV', isContentEditable: false, closest: () => null }), false);

	const nestedInInput = {
		closest: (selector) => selector.includes('input') ? {} : null
	};
	assert.equal(isEditableTarget(nestedInInput), true);
});

test('detectValueType determines numeric vs string column comparison types', () => {
	assert.equal(detectValueType([]), 'string');
	assert.equal(detectValueType([10, 20, 30]), 'number');
	assert.equal(detectValueType(['10', '20.5', '300']), 'number');
	assert.equal(detectValueType(['10', 'abc', '300']), 'string');
	assert.equal(detectValueType(['', null, '15', undefined]), 'number');
});

test('compareValues performs type-sensitive comparisons', () => {
	assert.equal(compareValues('10', '2', 'number'), 8);
	assert.equal(compareValues('2', '10', 'number'), -8);
	assert.equal(compareValues('10', '10', 'number'), 0);

	assert.equal(compareValues('apple', 'banana', 'string'), -1);
	assert.equal(compareValues('banana', 'apple', 'string'), 1);
	assert.equal(compareValues('apple', 'apple', 'string'), 0);
});

test('calculateProgress computes accurate percentages and clamps properly', () => {
	// Standard 50 / 100 -> 50%
	const p1 = calculateProgress(50, 100);
	assert.equal(p1.percentage, 50);
	assert.equal(p1.clampedValue, 50);
	assert.equal(p1.max, 100);

	// Custom max: 25 / 50 -> 50%
	const p2 = calculateProgress(25, 50);
	assert.equal(p2.percentage, 50);

	// Overflow: 150 / 100 -> 100% clamped
	const p3 = calculateProgress(150, 100);
	assert.equal(p3.percentage, 100);
	assert.equal(p3.clampedValue, 100);

	// Underflow: -20 / 100 -> 0% clamped
	const p4 = calculateProgress(-20, 100);
	assert.equal(p4.percentage, 0);
	assert.equal(p4.clampedValue, 0);

	// Custom min range: min 50, val 75, max 100 -> 50%
	const p5 = calculateProgress(75, 100, 50);
	assert.equal(p5.percentage, 50);
	assert.equal(p5.clampedValue, 75);
});

