// ═══════════════════════════════════════════════════════════════
// connector-core.js — Pure helpers for ln-api-connector
// ═══════════════════════════════════════════════════════════════

export const DEFAULT_PARAM_KEYS = {
	offset: 'offset',
	limit: 'limit',
	search: 'search',
	sortField: 'sort_field',
	sortDir: 'sort_dir'
};

/**
 * Joins path segments into a single URL without double slashes.
 * @param {...(string|number|null|undefined)} parts
 * @returns {string}
 */
export function joinUrl(...parts) {
	return parts
		.filter(part => part != null && part !== '')
		.map((part, index) => {
			const str = String(part);
			if (index === 0) return str.replace(/\/+$/, '');
			return str.replace(/^\/+/, '').replace(/\/+$/, '');
		})
		.filter(Boolean)
		.join('/');
}

/**
 * Builds standard URLSearchParams query string from structured query parameters.
 * @param {Object} [queryParams]
 * @param {Object} [paramKeys]
 * @returns {string} Query string without leading '?'
 */
export function buildQueryParams(queryParams, paramKeys) {
	if (!queryParams || typeof queryParams !== 'object') return '';
	const keys = Object.assign({}, DEFAULT_PARAM_KEYS, paramKeys || {});
	const searchParams = new URLSearchParams();

	if (queryParams.search) {
		searchParams.append(keys.search, queryParams.search);
	}
	if (queryParams.offset != null) {
		searchParams.append(keys.offset, queryParams.offset);
	}
	if (queryParams.limit != null) {
		searchParams.append(keys.limit, queryParams.limit);
	}
	if (queryParams.sort && queryParams.sort.field && queryParams.sort.direction) {
		searchParams.append(keys.sortField, queryParams.sort.field);
		searchParams.append(keys.sortDir, queryParams.sort.direction);
	}
	if (queryParams.filters && typeof queryParams.filters === 'object') {
		Object.keys(queryParams.filters).forEach(key => {
			const vals = queryParams.filters[key];
			if (Array.isArray(vals) && vals.length > 0) {
				searchParams.append(key, vals.join(','));
			}
		});
	}

	return searchParams.toString();
}

/**
 * Resolves the final target URL with optional query string.
 * @param {string} baseUrl
 * @param {string} path
 * @param {string} [qs]
 * @returns {string}
 */
export function buildQueryUrl(baseUrl, path, qs) {
	let url = joinUrl(baseUrl, path);
	if (qs) {
		url += (url.indexOf('?') !== -1 ? '&' : '?') + qs;
	}
	return url;
}

/**
 * Unwraps API response envelope { content, message } if present.
 * @param {*} body
 * @returns {{ record: *, message: (string|null) }}
 */
export function unwrapEnvelope(body) {
	const record = (body && body.content !== undefined) ? body.content : body;
	const message = (body && body.message) ? body.message : null;
	return { record, message };
}
