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
