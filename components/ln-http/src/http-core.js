// ═══════════════════════════════════════════════════════════════
// http-core.js — Pure helpers for ln-http transport supervisor
// ═══════════════════════════════════════════════════════════════

/**
 * Accept string | URL | Request | any → return string URL.
 * @param {string|URL|Request|*} resource
 * @returns {string}
 */
export function extractUrl(resource) {
	if (typeof resource === 'string') return resource;
	if (resource && typeof resource === 'object') {
		if (typeof resource.href === 'string') return resource.href;
		if (typeof resource.url === 'string') return resource.url;
	}
	return String(resource || '');
}

/**
 * Extract HTTP method from options or Request, default 'GET', uppercased.
 * @param {*} resource
 * @param {Object} [options]
 * @returns {string}
 */
export function extractMethod(resource, options) {
	if (options && options.method) return String(options.method).toUpperCase();
	if (resource && typeof resource === 'object' && resource.method) {
		return String(resource.method).toUpperCase();
	}
	return 'GET';
}

/**
 * Build deduplication cache key: "METHOD URL".
 * @param {string} url
 * @param {string} method
 * @returns {string}
 */
export function buildHttpKey(url, method) {
	return (method || 'GET') + ' ' + (url || '');
}

/**
 * Checks if the HTTP method is eligible for transparent deduplication (GET, HEAD).
 * @param {string} method
 * @returns {boolean}
 */
export function isIdempotentMethod(method) {
	const m = (method || '').toUpperCase();
	return m === 'GET' || m === 'HEAD';
}
