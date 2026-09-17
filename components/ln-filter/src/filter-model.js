import { matchesFilterValues } from '../../ln-core/matching.js';

/**
 * Checks whether two arrays of strings differ in length or content.
 * @param {Array} a
 * @param {Array} b
 * @returns {boolean}
 */
export function arraysDiffer(a, b) {
	if (!Array.isArray(a) || !Array.isArray(b)) return a !== b;
	if (a.length !== b.length) return true;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return true;
	}
	return false;
}

/**
 * Evaluates a row across multiple active column filters (AND across columns, OR within column).
 * @param {Record<number, string>} cellValuesByCol Index-to-text mapping of row cells
 * @param {Record<string, { col: number|null, values: string[], attr?: string }>} filters Active column filter map
 * @param {Element} [row] Optional row element for data-attribute matching fallback
 * @returns {boolean}
 */
export function evaluateRowFilters(cellValuesByCol, filters, row) {
	if (!filters || typeof filters !== 'object') return true;
	const keys = Object.keys(filters);
	if (keys.length === 0) return true;

	for (let i = 0; i < keys.length; i++) {
		const filter = filters[keys[i]];
		let cellText = '';
		if (filter.col !== null && filter.col !== undefined) {
			cellText = cellValuesByCol[filter.col] || '';
		} else if (filter.attr && row && typeof row.getAttribute === 'function') {
			cellText = row.getAttribute(filter.attr) || '';
		}
		if (!matchesFilterValues(cellText, filter.values)) {
			return false; // AND across columns: fail fast
		}
	}
	return true;
}

/**
 * Resolves the 0-based column index of a table associated with a filter.
 * Inspects explicit index, filterDom placement, popover trigger button in <th>,
 * and table header cells matching the filter key.
 *
 * @param {HTMLTableElement} table Target table
 * @param {HTMLElement} filterDom Filter root element (<ul data-ln-filter>)
 * @param {string|null} key Active filter key (e.g. 'category', 'status')
 * @param {number|null} explicitCol Explicitly provided colIndex, if any
 * @returns {number|null} 0-based column index, or null if unresolvable
 */
export function resolveColumnIndex(table, filterDom, key, explicitCol) {
	if (explicitCol !== null && explicitCol !== undefined && !isNaN(explicitCol)) {
		return parseInt(explicitCol, 10);
	}

	if (filterDom && typeof filterDom.getAttribute === 'function') {
		const colAttr = filterDom.getAttribute('data-ln-filter-col');
		if (colAttr !== null && !isNaN(parseInt(colAttr, 10))) {
			return parseInt(colAttr, 10);
		}

		if (typeof filterDom.closest === 'function') {
			const th = filterDom.closest('th');
			if (th && typeof th.cellIndex === 'number') {
				return th.cellIndex;
			}

			const popover = filterDom.closest('[data-ln-popover], [id]');
			if (popover && popover.id) {
				const rootDoc = table && table.ownerDocument ? table.ownerDocument : (filterDom.ownerDocument || (typeof document !== 'undefined' ? document : null));
				if (rootDoc && typeof rootDoc.querySelector === 'function') {
					const trigger = rootDoc.querySelector('[data-ln-popover-for="' + popover.id + '"]');
					if (trigger && typeof trigger.closest === 'function') {
						const triggerTh = trigger.closest('th');
						if (triggerTh && typeof triggerTh.cellIndex === 'number') {
							return triggerTh.cellIndex;
						}
					}
				}
			}
		}
	}

	if (table && key && typeof table.querySelectorAll === 'function') {
		const ths = table.querySelectorAll('thead th, tr:first-child th');
		const keyLower = String(key).trim().toLowerCase();

		// First pass: match data-ln-* attributes on <th>
		for (let i = 0; i < ths.length; i++) {
			const th = ths[i];
			const attrVal = th.getAttribute('data-ln-table-filter-col') ||
			                th.getAttribute('data-ln-filter-col') ||
			                th.getAttribute('data-ln-filter-key') ||
			                th.getAttribute('data-ln-table-col') ||
			                th.getAttribute('data-ln-col') ||
			                th.getAttribute('data-ln-field');
			if (attrVal && attrVal.trim().toLowerCase() === keyLower) {
				return typeof th.cellIndex === 'number' ? th.cellIndex : i;
			}
		}

		// Second pass: match popover trigger inside <th>
		if (filterDom) {
			const popover = filterDom.closest ? filterDom.closest('[data-ln-popover], [id]') : null;
			const popoverId = (popover && popover.id) || (filterDom.id || null);
			if (popoverId) {
				for (let i = 0; i < ths.length; i++) {
					const th = ths[i];
					if (typeof th.querySelector === 'function' && th.querySelector('[data-ln-popover-for="' + popoverId + '"]')) {
						return typeof th.cellIndex === 'number' ? th.cellIndex : i;
					}
				}
			}
		}

		// Third pass: match header text (direct text content)
		for (let i = 0; i < ths.length; i++) {
			const th = ths[i];
			const childNodes = Array.from(th.childNodes || []);
			const textNodes = childNodes.filter(n => n.nodeType === 3);
			const label = (textNodes.length > 0
				? textNodes.map(n => n.textContent.trim()).join(' ')
				: (th.textContent || '')
			).trim().toLowerCase();

			if (label && label === keyLower) {
				return typeof th.cellIndex === 'number' ? th.cellIndex : i;
			}
		}
	}

	return null;
}

/**
 * Derives the active key and values from a list of input descriptors.
 * @param {Array<{ key: string, value: string, checked: boolean, isReset: boolean }>} descriptors
 * @returns {{ key: string|null, values: string[] }}
 */
export function deriveActiveFilters(descriptors) {
	if (!Array.isArray(descriptors)) return { key: null, values: [] };

	let key = null;
	const values = [];

	for (let i = 0; i < descriptors.length; i++) {
		const item = descriptors[i];
		if (!key && item.key) key = item.key;
		if (item.checked && !item.isReset && item.value) {
			values.push(item.value);
		}
	}

	return { key, values };
}

/**
 * Encodes an array of active filter values into a comma-joined,
 * percent-encoded string for persistence in a state attribute.
 * @param {string[]} values
 * @returns {string|null}
 */
export function encodeFilterValues(values) {
	if (!Array.isArray(values) || values.length === 0) return null;
	return values.map(encodeURIComponent).join(',');
}

/**
 * Decodes a comma-joined, percent-encoded filter-values string back
 * into an array.
 * @param {string|null} raw
 * @returns {string[]}
 */
export function decodeFilterValues(raw) {
	if (!raw) return [];
	return raw.split(',').map(function (v) {
		try { return decodeURIComponent(v); }
		catch (e) { return v; }
	}).filter(Boolean);
}
