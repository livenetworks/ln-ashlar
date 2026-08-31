import { compareValues, detectValueType } from '../../ln-core/compare.js';
import { matchesFilterValues, matchesSearchTokens, tokenizeSearchQuery } from '../../ln-core/matching.js';

/**
 * Sorts an array of record objects by field and direction using pure core comparison.
 * @param {Array<Record<string, any>>} records
 * @param {{ field?: string, direction?: string } | null} [sort]
 * @param {Intl.Collator} [collator]
 * @returns {Array<Record<string, any>>}
 */
export function sortRecords(records, sort, collator) {
	if (!Array.isArray(records) || !sort || !sort.field) return records;
	const { field, direction } = sort;
	const desc = direction === 'desc';

	// Lock the value type once for the entire sort operation (per Doctrinal / compare.js rules)
	const sampleValues = records.map(r => (r ? r[field] : undefined));
	const valueType = detectValueType(sampleValues);

	return [...records].sort((a, b) => {
		const va = a ? a[field] : undefined;
		const vb = b ? b[field] : undefined;

		const result = compareValues(va, vb, valueType, collator);
		return desc ? -result : result;
	});
}

/**
 * Filters an array of records against a dictionary of active filter arrays.
 * Reuses matchesFilterValues from ln-core/matching (AND across fields, OR within field).
 * @param {Array<Record<string, any>>} records
 * @param {Record<string, Array<any>>} filters
 * @returns {Array<Record<string, any>>}
 */
export function filterRecords(records, filters) {
	if (!Array.isArray(records) || !filters || typeof filters !== 'object') return records;

	const keys = Object.keys(filters).filter(k => Array.isArray(filters[k]) && filters[k].length > 0);
	if (!keys.length) return records;

	return records.filter(record => {
		if (!record) return false;
		return keys.every(field => matchesFilterValues(record[field], filters[field]));
	});
}

/**
 * Searches records across specified fields using ln-core/matching tokenization and matching.
 * @param {Array<Record<string, any>>} records
 * @param {string} query
 * @param {string[]} searchFields
 * @returns {Array<Record<string, any>>}
 */
export function searchRecords(records, query, searchFields) {
	if (!Array.isArray(records) || !query || !searchFields || !searchFields.length) return records;

	const tokens = tokenizeSearchQuery(query);
	if (!tokens.length) return records;

	return records.filter(record => {
		if (!record) return false;
		return tokens.every(token =>
			searchFields.some(field => {
				const val = record[field];
				return val != null && matchesSearchTokens(String(val), [token]);
			})
		);
	});
}

/**
 * Computes aggregates (count, sum, avg) on a specific field across records.
 * @param {Array<Record<string, any>>} records
 * @param {string} field
 * @param {'count' | 'sum' | 'avg'} fn
 * @returns {number}
 */
export function aggregateRecords(records, field, fn) {
	if (!Array.isArray(records) || !records.length) return 0;
	if (fn === 'count') return records.length;

	const numbers = records
		.map(r => (r && r[field] != null ? parseFloat(r[field]) : NaN))
		.filter(v => Number.isFinite(v));

	const sum = numbers.reduce((a, b) => a + b, 0);

	if (fn === 'sum') return sum;
	if (fn === 'avg') return numbers.length ? sum / numbers.length : 0;
	return 0;
}

/**
 * Executes full in-memory query evaluation: filter -> search -> sort -> slice.
 * @param {Array<Record<string, any>>} records
 * @param {{ filters?: Record<string, any[]>, search?: string, sort?: { field?: string, direction?: string }, offset?: number, limit?: number }} [options={}]
 * @param {string[]} [searchFields=[]]
 * @param {Intl.Collator} [collator]
 * @returns {{ records: Array<Record<string, any>>, total: number, filtered: number }}
 */
export function queryRecords(records, options = {}, searchFields = [], collator) {
	if (!Array.isArray(records)) {
		return { records: [], total: 0, filtered: 0 };
	}

	const total = records.length;
	let result = records;

	if (options.filters) {
		result = filterRecords(result, options.filters);
	}
	if (options.search) {
		result = searchRecords(result, options.search, searchFields);
	}

	const filtered = result.length;

	if (options.sort) {
		result = sortRecords(result, options.sort, collator);
	}

	if (options.offset || options.limit) {
		const offset = options.offset || 0;
		const limit = options.limit || result.length;
		result = result.slice(offset, offset + limit);
	}

	return { records: result, total, filtered };
}

/**
 * Decorates records with computed fields (pure, no console side-effects).
 * @param {Array<Record<string, any>>} records
 * @param {Record<string, (record: any) => any>} [computed]
 * @returns {Array<Record<string, any>>}
 */
export function decorateRecords(records, computed) {
	if (!Array.isArray(records) || !computed || typeof computed !== 'object') return records;

	return records.map(record => {
		if (!record) return null;
		const copy = { ...record };
		for (const [fieldName, fn] of Object.entries(computed)) {
			if (typeof fn === 'function') {
				try {
					copy[fieldName] = fn(record);
				} catch (_) {
					copy[fieldName] = undefined;
				}
			}
		}
		return copy;
	});
}
