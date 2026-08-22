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
	if (connector && (storeUnavailable || !store.isLoaded)) return 'remote';
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
