export function normalizeDataQuery(detail) {
	detail = detail || {};
	return {
		sort: detail.sort,
		filters: detail.filters,
		search: detail.search,
		offset: detail.offset,
		limit: detail.limit,
		queryGen: detail.queryGen
	};
}

export function selectDataSource(store, connector) {
	const storeUnavailable = !store || !!store.initializationError;
	// A store told to leave queries to the server declines the read — the read goes remote.
	const declinesRead = !!(store && store.noLocalQuery);
	if (connector && (storeUnavailable || !store.canServe || declinesRead)) return 'remote';
	if (store && !store.initializationError) return 'store';
	return 'none';
}

export function composeQuery(viewQuery, coordQuery) {
	const v = viewQuery || {};
	const c = coordQuery || {};
	const vf = (v.filters && typeof v.filters === 'object') ? v.filters : {};
	const cf = (c.filters && typeof c.filters === 'object') ? c.filters : {};
	return {
		offset: v.offset,
		limit: v.limit,
		queryGen: v.queryGen,
		filters: Object.assign({}, vf, cf),
		search: c.search || v.search || '',
		sort: c.sort || v.sort || null
	};
}
