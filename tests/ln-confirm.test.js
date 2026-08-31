import test from 'node:test';
import assert from 'node:assert/strict';

import {
	DEFAULT_CONFIRM_TIMEOUT,
	isTwoElementMode,
	parseConfirmTimeout,
	resolveConfirmText,
	shouldIgnoreConfirmClick
} from '../components/ln-confirm/src/confirm-model.js';

test('parseConfirmTimeout returns parsed number or DEFAULT_CONFIRM_TIMEOUT', () => {
	assert.equal(parseConfirmTimeout('5'), 5);
	assert.equal(parseConfirmTimeout('2.5'), 2.5);
	assert.equal(parseConfirmTimeout('0'), DEFAULT_CONFIRM_TIMEOUT);
	assert.equal(parseConfirmTimeout('-3'), DEFAULT_CONFIRM_TIMEOUT);
	assert.equal(parseConfirmTimeout('invalid'), DEFAULT_CONFIRM_TIMEOUT);
	assert.equal(parseConfirmTimeout(null), DEFAULT_CONFIRM_TIMEOUT);
	assert.equal(parseConfirmTimeout(undefined), DEFAULT_CONFIRM_TIMEOUT);
});

test('resolveConfirmText resolves custom text or fallback', () => {
	assert.equal(resolveConfirmText('Are you sure?'), 'Are you sure?');
	assert.equal(resolveConfirmText(''), 'Confirm?');
	assert.equal(resolveConfirmText(null), 'Confirm?');
	assert.equal(resolveConfirmText(undefined), 'Confirm?');
	assert.equal(resolveConfirmText('   '), 'Confirm?');
});

test('isTwoElementMode accurately detects idle/active element presence', () => {
	assert.equal(isTwoElementMode(true, false), true);
	assert.equal(isTwoElementMode(false, true), true);
	assert.equal(isTwoElementMode(true, true), true);
	assert.equal(isTwoElementMode(false, false), false);
	assert.equal(isTwoElementMode(null, null), false);
});

test('shouldIgnoreConfirmClick detects modifiers and non-primary buttons', () => {
	assert.equal(shouldIgnoreConfirmClick({ button: 0 }), false);
	assert.equal(shouldIgnoreConfirmClick(null), true);
	assert.equal(shouldIgnoreConfirmClick({ button: 0, ctrlKey: true }), true);
	assert.equal(shouldIgnoreConfirmClick({ button: 0, metaKey: true }), true);
	assert.equal(shouldIgnoreConfirmClick({ button: 0, shiftKey: true }), true);
	assert.equal(shouldIgnoreConfirmClick({ button: 0, altKey: true }), true);
	assert.equal(shouldIgnoreConfirmClick({ button: 1 }), true);
	assert.equal(shouldIgnoreConfirmClick({ button: 2 }), true);
});
