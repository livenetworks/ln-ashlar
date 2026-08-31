/**
 * Normalizes a search query string for matching.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeSearchTerm(value) {
	return String(value || '').trim().toLowerCase();
}

/**
 * Splits query string into individual tokens for AND-based substring matching.
 * @param {unknown} term
 * @returns {string[]}
 */
export function tokenizeSearchQuery(term) {
	const normalized = normalizeSearchTerm(term);
	if (!normalized) return [];
	return normalized.split(/\s+/).filter(Boolean);
}

/**
 * Parses comma-separated field selectors forwarded to consumers.
 * @param {unknown} rawFields
 * @returns {string[]|null}
 */
export function parseSearchFields(rawFields) {
	if (rawFields === null || rawFields === undefined) return null;
	const fields = String(rawFields)
		.split(',')
		.map(f => f.trim())
		.filter(Boolean);
	return fields.length ? fields : null;
}

/**
 * Checks if text contains all tokens (AND-matching, order-independent).
 * @param {string} text
 * @param {string[]} tokens
 * @returns {boolean}
 */
export function matchesSearchTokens(text, tokens) {
	if (!tokens || tokens.length === 0) return true;
	if (!text) return false;
	const lower = String(text).toLowerCase();
	for (let i = 0; i < tokens.length; i++) {
		if (lower.indexOf(tokens[i]) === -1) return false;
	}
	return true;
}

/**
 * Collapses collected text parts into normalized search index text.
 * @param {string[]} parts
 * @returns {string}
 */
export function collapseSearchParts(parts) {
	if (!parts || parts.length === 0) return '';
	return parts.join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
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
