import test from 'node:test';
import assert from 'node:assert/strict';

import {
	browserAlreadyHandles,
	composeExternalShortcut,
	eventToShortcut,
	inferKeyAction,
	isEditableEventTarget,
	normalizeShortcut,
	parseShortcutList,
	shortcutMatches
} from '../js/ln-key/src/key-model.js';

test('shortcut normalization is case-insensitive and uses deterministic modifier order', () => {
	assert.equal(normalizeShortcut('shift + ctrl + s'), 'Ctrl+Shift+S');
	assert.equal(normalizeShortcut('COMMAND+k'), 'Meta+K');
	assert.equal(normalizeShortcut('esc'), 'Escape');
	assert.equal(normalizeShortcut('Ctrl'), '');
});

test('shortcut lists accept comma or whitespace separators and remove duplicates', () => {
	assert.deepEqual(
		parseShortcutList('Ctrl+K, Meta+K  ctrl+k Enter,Space'),
		['Ctrl+K', 'Meta+K', 'Enter', 'Space']
	);
});

test('external shortcut maps compose parent modifiers with item text', () => {
	assert.equal(composeExternalShortcut('Ctrl', 'S'), 'Ctrl+S');
	assert.equal(composeExternalShortcut('Ctrl + Shift', 'p'), 'Ctrl+Shift+P');
	assert.equal(composeExternalShortcut('', 'Escape'), 'Escape');
	assert.equal(composeExternalShortcut('Ctrl Alt', 'S'), '');
	assert.equal(composeExternalShortcut('Ctrl', 'S Save'), '');
});

test('keyboard events normalize to exact shortcut combinations', () => {
	const event = { key: 's', ctrlKey: true, altKey: false, shiftKey: true, metaKey: false };
	assert.equal(eventToShortcut(event), 'Ctrl+Shift+S');
	assert.equal(shortcutMatches('shift+ctrl+s', event), true);
	assert.equal(shortcutMatches('ctrl+s', event), false);
	assert.equal(eventToShortcut({ key: 'Control', ctrlKey: true }), '');
});

test('key action inference follows native DOM semantics', () => {
	const element = (tagName, attributes = {}) => ({
		tagName,
		hasAttribute: name => Object.prototype.hasOwnProperty.call(attributes, name),
		getAttribute: name => attributes[name]
	});

	assert.equal(inferKeyAction(element('BUTTON')), 'click');
	assert.equal(inferKeyAction(element('A', { href: '/search' })), 'click');
	assert.equal(inferKeyAction(element('A')), null);
	assert.equal(inferKeyAction(element('INPUT')), 'focus');
	assert.equal(inferKeyAction(element('TEXTAREA')), 'focus');
	assert.equal(inferKeyAction(element('SELECT')), 'focus');
	assert.equal(inferKeyAction(element('DIV', { contenteditable: '' })), 'focus');
	assert.equal(inferKeyAction(element('DIV')), null);
});

test('editable event target detection protects nested editing surfaces', () => {
	assert.equal(isEditableEventTarget({ closest: selector => selector.includes('input') ? {} : null }), true);
	assert.equal(isEditableEventTarget({ closest: () => null }), false);
});

test('native focused button and link activation is left to the browser', () => {
	const button = { tagName: 'BUTTON' };
	const link = { tagName: 'A', hasAttribute: name => name === 'href' };

	assert.equal(browserAlreadyHandles({ target: button }, button, 'click', 'Enter'), true);
	assert.equal(browserAlreadyHandles({ target: button }, button, 'click', 'Space'), true);
	assert.equal(browserAlreadyHandles({ target: link }, link, 'click', 'Enter'), true);
	assert.equal(browserAlreadyHandles({ target: button, ctrlKey: true }, button, 'click', 'Ctrl+Enter'), false);
	assert.equal(browserAlreadyHandles({ target: {} }, button, 'click', 'Enter'), false);
});
