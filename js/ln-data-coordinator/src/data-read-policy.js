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

export function selectDataSource(store, connector, isWindowed) {
	const storeUnavailable = !store || !!store.initializationError;
	if (connector && (isWindowed || storeUnavailable || !store.isLoaded)) return 'remote';
	if (store && !store.initializationError) return 'store';
	return 'none';
}
