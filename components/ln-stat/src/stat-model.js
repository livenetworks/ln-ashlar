/**
 * Parses raw "field:value" filter string into a structured filter dictionary.
 * @param {unknown} raw
 * @returns {Record<string, string[]>|null}
 */
export function parseStatFilter(raw) {
	if (!raw || typeof raw !== 'string') return null;
	const colonIdx = raw.indexOf(':');
	if (colonIdx === -1) return null;

	const field = raw.slice(0, colonIdx).trim();
	const val = raw.slice(colonIdx + 1).trim();
	if (!field) return null;

	const filters = {};
	filters[field] = [val];
	return filters;
}

/**
 * Formats a stat numeric value or fallback string.
 * @param {unknown} value
 * @returns {string}
 */
export function formatStatValue(value) {
	if (value === null || value === undefined) return '';
	return String(value);
}
