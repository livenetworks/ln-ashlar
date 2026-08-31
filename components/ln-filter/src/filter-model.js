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
 * Evaluates whether a cell or attribute value matches any of the filter's values (OR logic).
 * @param {unknown} value
 * @param {string[]} filterValues
 * @returns {boolean}
 */
export function matchesFilterValues(value, filterValues) {
	if (!filterValues || filterValues.length === 0) return true;
	if (value === null || value === undefined) return false;

	const lowerVal = String(value).trim().toLowerCase();
	for (let i = 0; i < filterValues.length; i++) {
		if (String(filterValues[i]).trim().toLowerCase() === lowerVal) {
			return true;
		}
	}
	return false;
}

/**
 * Evaluates a row across multiple active column filters (AND across columns, OR within column).
 * @param {Record<number, string>} cellValuesByCol Index-to-text mapping of row cells
 * @param {Record<string, { col: number, values: string[] }>} filters Active column filter map
 * @returns {boolean}
 */
export function evaluateRowFilters(cellValuesByCol, filters) {
	if (!filters || typeof filters !== 'object') return true;
	const keys = Object.keys(filters);
	if (keys.length === 0) return true;

	for (let i = 0; i < keys.length; i++) {
		const filter = filters[keys[i]];
		const cellText = cellValuesByCol[filter.col] || '';
		if (!matchesFilterValues(cellText, filter.values)) {
			return false; // AND across columns: fail fast
		}
	}
	return true;
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
