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
	// A store told to leave queries to the server can still serve a windowed read:
	// those rows are the server's own answer, held by position. Without a window a
	// local query is the only thing it could do, which is exactly what it was told
	// not to do — so the read goes remote.
	const declinesRead = !!(store && store.noLocalQuery && !store.windowed);
	if (connector && (storeUnavailable || !store.canServe || declinesRead)) return 'remote';
	if (store && !store.initializationError) return 'store';
	return 'none';
}

export function composeQuery(viewQuery, storeQuery) {
	const q = Object.assign({}, viewQuery);
	if (storeQuery) {
		q.filters = storeQuery.filters;
		q.search  = storeQuery.search;
		q.sort    = storeQuery.sort;
	}
	return q;
}
