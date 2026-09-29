/**
 * Build a URL from segments, stripping duplicate slashes.
 */
export function buildUrl(...segments) {
	return segments
		.filter(x => x !== undefined && x !== null && x !== '')
		.map((part, index) => {
			if (index === 0) return part.replace(/\/+$/, '');
			return part.replace(/^\/+/, '').replace(/\/+$/, '');
		})
		.filter(Boolean)
		.join('/');
}

/**
 * Compile standard JSON request headers.
 */
export function getHeaders(customHeaders, auth) {
	return Object.assign({
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	}, customHeaders, auth ? { 'Authorization': auth } : null);
}

/**
 * Safely parse headers from JSON string.
 */
export function parseHeaders(str, componentName = 'ln-core') {
	try { return str ? JSON.parse(str) : {}; }
	catch (e) { return console.error(`[${componentName}] Invalid headers JSON:`, e), {}; }
}

// ─── Domain Data Mapper Registry ───────────────────────────
const _dataMappers = {};

export function registerDataMapper(name, mapper) {
	_dataMappers[name] = mapper;
}

export function getDataMapper(name) {
	return _dataMappers[name] || { ingress: r => r, egress: r => r };
}

if (typeof window !== 'undefined') {
	window.lnCore = window.lnCore || {};
	window.lnCore.registerDataMapper = registerDataMapper;
	window.lnCore.getDataMapper = getDataMapper;
}
