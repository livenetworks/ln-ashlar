import { VALID_ATTRIBUTES } from './generated-attributes.js';
import { pendingCount, queueBoot } from '../../ln-core/index.js';

/**
 * Calculates Levenshtein distance between two strings.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function levenshtein(a, b) {
	if (a === b) return 0;
	if (!a.length) return b.length;
	if (!b.length) return a.length;

	const matrix = [];
	for (let i = 0; i <= b.length; i++) matrix[i] = [i];
	for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1,
					matrix[i][j - 1] + 1,
					matrix[i - 1][j] + 1
				);
			}
		}
	}
	return matrix[b.length][a.length];
}

/**
 * Finds the closest valid attribute from the validSet for a given attribute name.
 * @param {string} attrName
 * @param {Set<string>} validSet
 * @returns {string|null}
 */
export function findClosestAttribute(attrName, validSet = VALID_ATTRIBUTES) {
	if (validSet.has(attrName)) return null;

	let bestMatch = null;
	let minDistance = Infinity;

	for (const valid of validSet) {
		const dist = levenshtein(attrName, valid);
		if (dist < minDistance) {
			minDistance = dist;
			bestMatch = valid;
		}
	}

	const maxAllowedDist = Math.max(3, Math.floor(attrName.length * 0.4));
	if (minDistance <= maxAllowedDist) {
		return bestMatch;
	}
	return null;
}

/**
 * Escapes CSS selector identifiers safely.
 * @param {string} str
 * @returns {string}
 */
function escapeSelector(str) {
	if (typeof CSS !== 'undefined' && CSS.escape) {
		return CSS.escape(str);
	}
	return str.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
}

/**
 * Verifies that all data-ln-*-for attributes resolve to an existing element ID in the document.
 * @param {HTMLElement|Document} root
 * @returns {Array<{ type: string, element: Element, attribute: string, targetId: string, message: string }>}
 */
export function verifyIdReferences(root = document) {
	const doc = root.ownerDocument || root;
	const scope = root.nodeType === 9 ? root.body || root.documentElement : root;
	if (!scope) return [];

	const issues = [];
	const elements = [scope, ...scope.querySelectorAll('*')];

	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		if (!el.attributes) continue;

		for (let j = 0; j < el.attributes.length; j++) {
			const attr = el.attributes[j];
			if (attr.name.startsWith('data-ln-') && attr.name.endsWith('-for')) {
				const targetId = (attr.value || '').trim();
				if (!targetId) {
					issues.push({
						type: 'id-empty',
						element: el,
						attribute: attr.name,
						targetId: '',
						message: `[ln-debug] Empty ID reference in <${el.tagName.toLowerCase()} ${attr.name}="">.`
					});
					continue;
				}

				const targetEl = doc.getElementById(targetId) || doc.querySelector('#' + escapeSelector(targetId));
				if (!targetEl) {
					issues.push({
						type: 'id-unresolved',
						element: el,
						attribute: attr.name,
						targetId: targetId,
						message: `[ln-debug] Unresolved ID reference: <${el.tagName.toLowerCase()} ${attr.name}="${targetId}"> targets "#${targetId}", but no element with id="${targetId}" exists in the document.`
					});
				}
			}
		}
	}

	return issues;
}

/**
 * Verifies that all data-ln-*-source / data-ln-*-store attributes resolve to a declared data store.
 * @param {HTMLElement|Document} root
 * @returns {Array<{ type: string, element: Element, attribute: string, storeName: string, message: string }>}
 */
export function verifyStoreReferences(root = document) {
	const doc = root.ownerDocument || root;
	const scope = root.nodeType === 9 ? root.body || root.documentElement : root;
	if (!scope) return [];

	const issues = [];
	const elements = [scope, ...scope.querySelectorAll('*')];

	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		if (!el.attributes) continue;

		for (let j = 0; j < el.attributes.length; j++) {
			const attr = el.attributes[j];
			const isSource = attr.name.startsWith('data-ln-') &&
				(attr.name.endsWith('-source') || attr.name.endsWith('-store')) &&
				attr.name !== 'data-ln-data-store';

			if (isSource) {
				const storeName = (attr.value || '').trim();
				if (!storeName) {
					issues.push({
						type: 'store-empty',
						element: el,
						attribute: attr.name,
						storeName: '',
						message: `[ln-debug] Empty store reference in <${el.tagName.toLowerCase()} ${attr.name}="">.`
					});
					continue;
				}

				const escaped = escapeSelector(storeName);
				const storeEl = doc.querySelector(`[data-ln-data-store="${escaped}"], [data-ln-store="${escaped}"]`);
				const isGlobalRegistered = typeof window !== 'undefined' &&
					window.lnDataStore && typeof window.lnDataStore.getStore === 'function' &&
					window.lnDataStore.getStore(storeName);

				if (!storeEl && !isGlobalRegistered) {
					issues.push({
						type: 'store-unresolved',
						element: el,
						attribute: attr.name,
						storeName: storeName,
						message: `[ln-debug] Unresolved store reference: <${el.tagName.toLowerCase()} ${attr.name}="${storeName}"> targets store "${storeName}", but no [data-ln-data-store="${storeName}"] exists in the document.`
					});
				}
			}
		}
	}

	return issues;
}

/**
 * Verifies that all declared data store names are unique in the document.
 * @param {HTMLElement|Document} root
 * @returns {Array<{ type: string, storeName: string, elements: Element[], message: string }>}
 */
export function verifyStoreUniqueness(root = document) {
	const doc = root.ownerDocument || root;
	const scope = root.nodeType === 9 ? root.body || root.documentElement : root;
	if (!scope) return [];

	const issues = [];
	const storeElements = Array.from(scope.querySelectorAll('[data-ln-data-store]'));
	if (scope.hasAttribute && scope.hasAttribute('data-ln-data-store')) {
		storeElements.unshift(scope);
	}

	const storeMap = new Map();
	for (let i = 0; i < storeElements.length; i++) {
		const el = storeElements[i];
		const name = (el.getAttribute('data-ln-data-store') || '').trim();
		if (!name) continue;

		if (!storeMap.has(name)) {
			storeMap.set(name, []);
		}
		storeMap.get(name).push(el);
	}

	for (const [name, elements] of storeMap.entries()) {
		if (elements.length > 1) {
			issues.push({
				type: 'store-duplicate',
				storeName: name,
				elements: elements,
				message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${name}". Store names must be unique across the document.`
			});
		}
	}

	return issues;
}

/**
 * Verifies attribute spelling against the generated VALID_ATTRIBUTES manifest.
 * @param {HTMLElement|Document} root
 * @param {Set<string>} validSet
 * @returns {Array<{ type: string, element: Element, attribute: string, suggestion: string|null, message: string }>}
 */
export function verifyAttributeSpelling(root = document, validSet = VALID_ATTRIBUTES) {
	const scope = root.nodeType === 9 ? root.body || root.documentElement : root;
	if (!scope) return [];

	const issues = [];
	const elements = [scope, ...scope.querySelectorAll('*')];

	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		if (!el.attributes) continue;

		for (let j = 0; j < el.attributes.length; j++) {
			const attr = el.attributes[j];
			if (attr.name.startsWith('data-ln-')) {
				if (!validSet.has(attr.name)) {
					const suggestion = findClosestAttribute(attr.name, validSet);
					const suggestionMsg = suggestion ? ` Did you mean "${suggestion}"?` : '';
					issues.push({
						type: 'attribute-unknown',
						element: el,
						attribute: attr.name,
						suggestion: suggestion,
						message: `[ln-debug] Unknown attribute "${attr.name}" on <${el.tagName.toLowerCase()}>.${suggestionMsg}`
					});
				}
			}
		}
	}

	return issues;
}

/**
 * Performs a complete contract verification scan of the DOM.
 * @param {HTMLElement|Document} root
 * @param {object} options
 * @param {boolean} [options.silent=false]
 * @param {Set<string>} [options.validAttributes]
 * @returns {{ idIssues: Array, storeIssues: Array, uniquenessIssues: Array, spellingIssues: Array, total: number }}
 */
export function verifyDOM(root = (typeof document !== 'undefined' ? document : null), options = {}) {
	if (!root) {
		return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
	}

	const validSet = options.validAttributes || VALID_ATTRIBUTES;
	const idIssues = verifyIdReferences(root);
	const storeIssues = verifyStoreReferences(root);
	const uniquenessIssues = verifyStoreUniqueness(root);
	const spellingIssues = verifyAttributeSpelling(root, validSet);

	const allIssues = [
		...idIssues,
		...storeIssues,
		...uniquenessIssues,
		...spellingIssues
	];

	if (!options.silent) {
		for (let i = 0; i < allIssues.length; i++) {
			console.warn(allIssues[i].message);
		}
	}

	return {
		idIssues,
		storeIssues,
		uniquenessIssues,
		spellingIssues,
		total: allIssues.length
	};
}

let _debounceTimer = null;

/**
 * Schedules a verification scan taking lifecycle holds and DOM settling into account.
 * @param {HTMLElement|Document} root
 * @param {number} [delay=50]
 * @param {function} [callback]
 */
export function scheduleVerification(root = (typeof document !== 'undefined' ? document : null), delay = 50, callback = null) {
	if (!root) return;

	if (_debounceTimer) {
		clearTimeout(_debounceTimer);
		_debounceTimer = null;
	}

	function run() {
		_debounceTimer = setTimeout(() => {
			_debounceTimer = null;
			const report = verifyDOM(root);
			if (callback) callback(report);
		}, delay);
	}

	if (pendingCount() > 0) {
		queueBoot(run);
	} else {
		run();
	}
}
