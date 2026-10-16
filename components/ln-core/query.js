// ─── Query String codec (URL search params as reactive state) ──
//
// Allows components (ln-search, ln-filter, ln-sort) to bind to URL search
// parameters (?search=foo&status=active&sort=amount.desc) in SPAs without
// polluting or colliding with the URL hash fragment (#modal, #tab).
//
// Write mechanism: `history.replaceState` (does not reload the page or pollute history).
// Read mechanism: `URLSearchParams` on window.location.search.
// Navigation: Reacts to `popstate` events on browser Back/Forward navigation.

function _stripSearch(str) {
	return (str || '').replace(/^\?/, '');
}

export function queryParse(searchStr) {
	const raw = (searchStr === undefined)
		? (typeof window !== 'undefined' ? window.location.search : '')
		: searchStr;
	const map = {};
	const s = _stripSearch(raw);
	if (!s) return map;
	const params = new URLSearchParams(s);
	for (const [key, val] of params.entries()) {
		map[key] = val;
	}
	return map;
}

export function queryGet(key) {
	if (!key || typeof window === 'undefined') return null;
	const params = new URLSearchParams(window.location.search);
	return params.has(key) ? params.get(key) : null;
}

export function querySet(key, value) {
	if (!key || typeof window === 'undefined') return;
	const url = new URL(window.location.href);

	if (value === null || value === undefined || value === '') {
		url.searchParams.delete(key);
	} else {
		url.searchParams.set(key, String(value));
	}

	if (url.search === window.location.search) return;

	const nextUrl = url.pathname + url.search + url.hash;
	window.history.replaceState(window.history.state, '', nextUrl);
}

export function resolveQueryParam(el, defaultSuffix) {
	if (!el || !el.hasAttribute('data-ln-query')) return null;
	const explicit = el.getAttribute('data-ln-query');
	if (explicit && explicit.trim() !== '') return explicit.trim();
	const targetId = el.getAttribute('data-ln-sort')
		|| el.getAttribute('data-ln-search-for')
		|| el.getAttribute('data-ln-search')
		|| el.getAttribute('data-ln-filter')
		|| el.id;
	if (targetId) {
		return defaultSuffix ? (targetId + '_' + defaultSuffix) : targetId;
	}
	return defaultSuffix || null;
}

export function querySortEncode(fieldOrColumn, direction) {
	if (!direction || direction === 'none' || fieldOrColumn === null || fieldOrColumn === undefined) return null;
	return String(fieldOrColumn) + '.' + direction;
}

export function querySortDecode(val, queryParams) {
	if (val && typeof val === 'string') {
		if (val.endsWith('.asc')) {
			return { fieldOrColumn: val.slice(0, -4), direction: 'asc' };
		}
		if (val.endsWith('.desc')) {
			return { fieldOrColumn: val.slice(0, -5), direction: 'desc' };
		}
	}
	if (queryParams && typeof queryParams === 'object') {
		const field = queryParams.sort_field || queryParams.sort_by;
		if (field) {
			const dir = (queryParams.sort_dir && String(queryParams.sort_dir).toLowerCase() === 'desc') ? 'desc' : 'asc';
			return { fieldOrColumn: field, direction: dir };
		}
	}
	return null;
}

export function queryFilterEncode(values) {
	if (!Array.isArray(values) || values.length === 0) return null;
	return values.map(encodeURIComponent).join(',');
}

export function queryFilterDecode(val) {
	if (!val || typeof val !== 'string') return [];
	return val.split(',').map(function (v) {
		try { return decodeURIComponent(v.trim()); }
		catch (e) { return v.trim(); }
	}).filter(Boolean);
}

if (typeof window !== 'undefined') {
	window.lnCore = window.lnCore || {};
	window.lnCore.queryParse = queryParse;
	window.lnCore.queryGet = queryGet;
	window.lnCore.querySet = querySet;
	window.lnCore.resolveQueryParam = resolveQueryParam;
	window.lnCore.querySortEncode = querySortEncode;
	window.lnCore.querySortDecode = querySortDecode;
	window.lnCore.queryFilterEncode = queryFilterEncode;
	window.lnCore.queryFilterDecode = queryFilterDecode;
}
