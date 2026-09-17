import { compareValues } from '../../ln-core/compare.js';

export const SORT_DIRECTIONS = ['none', 'asc', 'desc'];

/**
 * Normalizes a sort direction string to 'asc', 'desc', or 'none'.
 * @param {unknown} value
 * @returns {'asc' | 'desc' | 'none'}
 */
export function normalizeSortDirection(value) {
	const str = String(value || '').trim().toLowerCase();
	if (str === 'asc' || str === 'ascending') return 'asc';
	if (str === 'desc' || str === 'descending') return 'desc';
	return 'none';
}

/**
 * Returns the ARIA sort attribute value corresponding to the direction.
 * @param {unknown} direction
 * @returns {'ascending' | 'descending' | 'none'}
 */
export function getAriaSortValue(direction) {
	const normalized = normalizeSortDirection(direction);
	if (normalized === 'asc') return 'ascending';
	if (normalized === 'desc') return 'descending';
	return 'none';
}

/**
 * Determines whether two sort targets represent the identical sort key.
 * @param {{ field?: string|null, column?: number|string|null }} a
 * @param {{ field?: string|null, column?: number|string|null }} b
 * @returns {boolean}
 */
export function isSameSortTarget(a, b) {
	if (!a || !b) return false;
	if (a.field !== null && a.field !== undefined && b.field !== null && b.field !== undefined) {
		return a.field === b.field;
	}
	if (a.column !== null && a.column !== undefined && b.column !== null && b.column !== undefined) {
		return String(a.column) === String(b.column);
	}
	return false;
}

/**
 * Creates a sort comparator function for sorting an array of records/items.
 * @param {'asc' | 'desc' | 'none'} direction
 * @param {'number' | 'string'} valueType
 * @param {Intl.Collator|null} [collator]
 * @param {(item: any) => any} [getValueFn]
 * @returns {(a: any, b: any) => number}
 */
export function createSortComparator(direction, valueType, collator, getValueFn) {
	const normalized = normalizeSortDirection(direction);
	if (normalized === 'none') return () => 0;

	const multiplier = normalized === 'desc' ? -1 : 1;
	const getter = typeof getValueFn === 'function' ? getValueFn : (item) => item;

	return function (a, b) {
		const valA = getter(a);
		const valB = getter(b);
		return compareValues(valA, valB, valueType, collator) * multiplier;
	};
}

/**
 * Determines whether a DOM element should be excluded from sorting (e.g. empty-state, hidden rows, templates).
 * @param {Element|unknown} el
 * @returns {boolean}
 */
export function isExcludedSortItem(el) {
	if (!el || typeof el !== 'object' || el.nodeType !== 1) return true;
	if (el.tagName === 'TEMPLATE') return true;
	if (typeof el.hasAttribute === 'function') {
		if (el.hasAttribute('data-ln-sort-exclude') || el.hasAttribute('hidden')) return true;
	}
	if (el.classList && el.classList.contains('hidden')) return true;
	if (el.style && el.style.display === 'none') return true;
	if (typeof el.matches === 'function') {
		if (el.matches('.empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]')) {
			return true;
		}
	}
	return false;
}

/**
 * Resolves the list of sortable DOM items from a target element.
 * For tables without explicit selector, automatically targets the tbody rows.
 * @param {Element|unknown} target
 * @param {string|null} [itemsSelector]
 * @returns {Element[]}
 */
export function resolveSortItems(target, itemsSelector) {
	if (!target || typeof target !== 'object' || target.nodeType !== 1) return [];
	const selector = itemsSelector
		|| (typeof target.getAttribute === 'function' ? target.getAttribute('data-ln-sort-items') : null)
		|| null;
	if (selector && typeof target.querySelectorAll === 'function') {
		return Array.from(target.querySelectorAll(selector));
	}
	if (target.tagName === 'TABLE') {
		const tbody = target.tBodies && target.tBodies.length
			? target.tBodies[0]
			: (typeof target.querySelector === 'function' ? target.querySelector('tbody') : null);
		if (tbody) {
			return Array.from(tbody.children || []);
		}
		if (typeof target.querySelectorAll === 'function') {
			return Array.from(target.querySelectorAll('tbody tr, tr'));
		}
	}
	return Array.from(target.children || []);
}

