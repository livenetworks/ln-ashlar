import test from 'node:test';
import assert from 'node:assert/strict';

import {
	deriveKeyFromTrigger,
	determineTabsMode,
	resolveActiveTabKey
} from '../components/ln-tabs/src/tabs-model.js';

test('deriveKeyFromTrigger extracts keys from attributes and anchor hashes', () => {
	// Explicit attribute
	assert.equal(deriveKeyFromTrigger('profile', 'BUTTON', null), 'profile');

	// Anchor simple hash
	assert.equal(deriveKeyFromTrigger(null, 'A', '#billing'), 'billing');

	// Namespaced anchor hash
	assert.equal(deriveKeyFromTrigger(null, 'A', '#main:dashboard&sub:analytics', 'sub'), 'analytics');
	assert.equal(deriveKeyFromTrigger(null, 'A', '#main:dashboard&sub:analytics', 'main'), 'dashboard');

	// Button without explicit attr
	assert.equal(deriveKeyFromTrigger('', 'BUTTON', null), '');
});

test('determineTabsMode detects hash mode and configuration warnings', () => {
	// All anchors with valid nsKey -> hash enabled
	const allAnchors = [{ tagName: 'A', href: '#tab1' }, { tagName: 'A', href: '#tab2' }];
	assert.deepEqual(determineTabsMode(allAnchors, 'my-tabs'), {
		hashEnabled: true,
		warning: null
	});

	// All anchors missing nsKey -> missing-namespace warning
	assert.deepEqual(determineTabsMode(allAnchors, ''), {
		hashEnabled: false,
		warning: 'missing-namespace'
	});

	// Mixed anchors and buttons -> mixed warning
	const mixed = [{ tagName: 'A', href: '#tab1' }, { tagName: 'BUTTON', href: null }];
	assert.deepEqual(determineTabsMode(mixed, 'my-tabs'), {
		hashEnabled: false,
		warning: 'mixed'
	});

	// Buttons only -> hash disabled, no warning
	const buttons = [{ tagName: 'BUTTON', href: null }, { tagName: 'BUTTON', href: null }];
	assert.deepEqual(determineTabsMode(buttons, 'my-tabs'), {
		hashEnabled: false,
		warning: null
	});
});

test('resolveActiveTabKey resolves against valid keys with fallback', () => {
	const validKeys = ['general', 'security', 'notifications'];

	assert.equal(resolveActiveTabKey('security', validKeys, 'general'), 'security');
	assert.equal(resolveActiveTabKey('unknown', validKeys, 'general'), 'general');
	assert.equal(resolveActiveTabKey('', validKeys, 'general'), 'general');
	assert.equal(resolveActiveTabKey('SECURITY', validKeys, 'general'), 'security');
	assert.equal(resolveActiveTabKey(null, validKeys, 'general'), 'general');
	assert.equal(resolveActiveTabKey(undefined, validKeys, 'general'), 'general');
});

test('tab panel visibility model ensures boolean hidden and aria-hidden contract', () => {
	const activeKey = 'security';
	const validPanels = ['general', 'security', 'notifications'];

	const panelStates = validPanels.map(k => {
		const show = (k === activeKey);
		return {
			key: k,
			hidden: !show,
			classListHidden: !show,
			ariaHidden: show ? 'false' : 'true'
		};
	});

	assert.deepEqual(panelStates, [
		{ key: 'general', hidden: true, classListHidden: true, ariaHidden: 'true' },
		{ key: 'security', hidden: false, classListHidden: false, ariaHidden: 'false' },
		{ key: 'notifications', hidden: true, classListHidden: true, ariaHidden: 'true' }
	]);
});

