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
	if (connector && (isWindowed || !store || !store.isLoaded)) return 'remote';
	if (store) return 'store';
	return 'none';
}
