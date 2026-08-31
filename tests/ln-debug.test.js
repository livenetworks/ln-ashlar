import test from 'node:test';
import assert from 'node:assert/strict';

import {
	levenshtein,
	findClosestAttribute,
	verifyIdReferences,
	verifyStoreReferences,
	verifyStoreUniqueness,
	verifyAttributeSpelling,
	verifyDOM
} from '../components/ln-debug/src/debug-verifier.js';

// Simple lightweight mock DOM node builder for tests in Node environment
function createMockElement(tagName, attrs = {}, children = []) {
	const attributes = Object.entries(attrs).map(([name, value]) => ({ name, value }));
	const el = {
		tagName: tagName.toUpperCase(),
		attributes: attributes,
		getAttribute: (name) => {
			const found = attributes.find(a => a.name === name);
			return found ? found.value : null;
		},
		hasAttribute: (name) => attributes.some(a => a.name === name),
		children: [],
		querySelectorAll: (selector) => {
			const results = [];
			function walk(node) {
				for (const child of node.children) {
					if (matchesSelector(child, selector)) {
						results.push(child);
					}
					walk(child);
				}
			}
			walk(el);
			return results;
		}
	};

	for (const child of children) {
		el.children.push(child);
	}

	return el;
}

function createMockDocument(rootElement) {
	const doc = {
		nodeType: 9,
		documentElement: rootElement,
		body: rootElement,
		ownerDocument: null,
		getElementById: (id) => {
			let found = null;
			function walk(node) {
				if (node.getAttribute && node.getAttribute('id') === id) {
					found = node;
					return;
				}
				for (const child of node.children || []) {
					walk(child);
					if (found) return;
				}
			}
			walk(rootElement);
			return found;
		},
		querySelector: (selector) => {
			if (matchesSelector(rootElement, selector)) return rootElement;
			const list = rootElement.querySelectorAll(selector);
			return list.length ? list[0] : null;
		},
		querySelectorAll: (selector) => {
			const list = rootElement.querySelectorAll(selector);
			if (matchesSelector(rootElement, selector)) {
				list.unshift(rootElement);
			}
			return list;
		}
	};
	doc.ownerDocument = doc;
	return doc;
}

function matchesSelector(el, selector) {
	if (!el || !el.getAttribute) return false;

	const parts = selector.split(',').map(s => s.trim());
	for (const part of parts) {
		if (matchesSingleSelector(el, part)) return true;
	}
	return false;
}

function matchesSingleSelector(el, selector) {
	if (selector === '*') return true;
	if (selector.startsWith('#')) {
		return el.getAttribute('id') === selector.slice(1);
	}
	if (selector.startsWith('[') && selector.endsWith(']')) {
		const inner = selector.slice(1, -1);
		if (inner.includes('=')) {
			const eqIdx = inner.indexOf('=');
			const name = inner.slice(0, eqIdx).trim();
			const rawVal = inner.slice(eqIdx + 1).trim();
			const val = rawVal.replace(/^["']|["']$/g, '');
			return el.getAttribute(name) === val;
		}
		return el.hasAttribute(inner);
	}
	return false;
}

// ─── Unit Tests ─────────────────────────────────────────────────────────────

test('levenshtein calculates exact edit distance between strings', () => {
	assert.equal(levenshtein('kitten', 'sitting'), 3);
	assert.equal(levenshtein('', 'abc'), 3);
	assert.equal(levenshtein('abc', 'abc'), 0);
	assert.equal(levenshtein('data-ln-table-sorce', 'data-ln-table-source'), 1);
});

test('findClosestAttribute finds closest matching attribute from valid manifest', () => {
	const validSet = new Set([
		'data-ln-table',
		'data-ln-table-source',
		'data-ln-toggle',
		'data-ln-toggle-for',
		'data-ln-modal',
		'data-ln-modal-for'
	]);

	assert.equal(findClosestAttribute('data-ln-table-sorce', validSet), 'data-ln-table-source');
	assert.equal(findClosestAttribute('data-ln-toggl-for', validSet), 'data-ln-toggle-for');
	assert.equal(findClosestAttribute('data-ln-table', validSet), null); // exact match returns null (no typo)
	assert.equal(findClosestAttribute('data-completely-unrelated', validSet), null); // exceeds threshold
});

test('verifyIdReferences checks data-ln-*-for attributes against document IDs', () => {
	const targetMenu = createMockElement('div', { id: 'main-menu' });
	const validToggle = createMockElement('button', { 'data-ln-toggle-for': 'main-menu' });
	const brokenToggle = createMockElement('button', { 'data-ln-toggle-for': 'sidebar-nonexistent' });
	const emptyToggle = createMockElement('button', { 'data-ln-toggle-for': '' });

	const root = createMockElement('body', {}, [targetMenu, validToggle, brokenToggle, emptyToggle]);
	const doc = createMockDocument(root);

	const issues = verifyIdReferences(doc);
	assert.equal(issues.length, 2);

	assert.equal(issues[0].type, 'id-unresolved');
	assert.equal(issues[0].targetId, 'sidebar-nonexistent');

	assert.equal(issues[1].type, 'id-empty');
});

test('verifyStoreReferences checks data-ln-*-source attributes against declared data stores', () => {
	const userStore = createMockElement('div', { 'data-ln-data-store': 'users' });
	const validTable = createMockElement('table', { 'data-ln-table-source': 'users' });
	const brokenList = createMockElement('ul', { 'data-ln-list-source': 'orders-missing' });
	const emptyChart = createMockElement('div', { 'data-ln-chart-source': '' });

	const root = createMockElement('body', {}, [userStore, validTable, brokenList, emptyChart]);
	const doc = createMockDocument(root);

	const issues = verifyStoreReferences(doc);
	assert.equal(issues.length, 2);

	assert.equal(issues[0].type, 'store-unresolved');
	assert.equal(issues[0].storeName, 'orders-missing');

	assert.equal(issues[1].type, 'store-empty');
});

test('verifyStoreUniqueness flags duplicate data-ln-data-store declarations', () => {
	const store1 = createMockElement('div', { 'data-ln-data-store': 'users' });
	const store2 = createMockElement('div', { 'data-ln-data-store': 'users' });
	const store3 = createMockElement('div', { 'data-ln-data-store': 'products' });

	const root = createMockElement('body', {}, [store1, store2, store3]);
	const doc = createMockDocument(root);

	const issues = verifyStoreUniqueness(doc);
	assert.equal(issues.length, 1);
	assert.equal(issues[0].type, 'store-duplicate');
	assert.equal(issues[0].storeName, 'users');
	assert.equal(issues[0].elements.length, 2);
});

test('verifyAttributeSpelling detects misspelled data-ln-* attributes', () => {
	const validSet = new Set(['data-ln-table', 'data-ln-table-source', 'data-ln-toggle']);
	const validEl = createMockElement('table', { 'data-ln-table': '', 'data-ln-table-source': 'users' });
	const typoEl = createMockElement('div', { 'data-ln-table-sorce': 'users' });

	const root = createMockElement('body', {}, [validEl, typoEl]);
	const doc = createMockDocument(root);

	const issues = verifyAttributeSpelling(doc, validSet);
	assert.equal(issues.length, 1);
	assert.equal(issues[0].type, 'attribute-unknown');
	assert.equal(issues[0].attribute, 'data-ln-table-sorce');
	assert.equal(issues[0].suggestion, 'data-ln-table-source');
});

test('verifyDOM returns a clean report on valid DOM markup with zero issues', () => {
	const target = createMockElement('div', { id: 'modal-view' });
	const button = createMockElement('button', { 'data-ln-modal-for': 'modal-view' });
	const store = createMockElement('div', { 'data-ln-data-store': 'users' });
	const table = createMockElement('table', { 'data-ln-table': '', 'data-ln-table-source': 'users' });

	const root = createMockElement('body', {}, [target, button, store, table]);
	const doc = createMockDocument(root);

	const report = verifyDOM(doc, { silent: true });
	assert.equal(report.total, 0);
	assert.equal(report.idIssues.length, 0);
	assert.equal(report.storeIssues.length, 0);
	assert.equal(report.uniquenessIssues.length, 0);
	assert.equal(report.spellingIssues.length, 0);
});
