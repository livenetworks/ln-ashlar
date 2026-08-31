import test from 'node:test';
import assert from 'node:assert/strict';

import {
	browserAlreadyHandles,
	composeExternalShortcut,
	eventToShortcut,
	inferKeyAction,
	normalizeShortcut,
	parseShortcutList
} from '../components/ln-key/src/key-model.js';

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

test('browser handles native enter on buttons and links', () => {
	const element = (tagName, attributes = {}) => ({
		tagName,
		hasAttribute: name => Object.prototype.hasOwnProperty.call(attributes, name),
		getAttribute: name => attributes[name]
	});
	const btn = element('BUTTON');
	assert.equal(browserAlreadyHandles({ key: 'Enter', target: btn }, btn, 'click', 'Enter'), true);

	const link = element('A', { href: '/test' });
	assert.equal(browserAlreadyHandles({ key: 'Enter', target: link }, link, 'click', 'Enter'), true);

	assert.equal(browserAlreadyHandles({ key: ' ', target: btn }, btn, 'click', 'Space'), true);
	assert.equal(browserAlreadyHandles({ key: 'k', target: btn }, btn, 'click', 'K'), false);
});
