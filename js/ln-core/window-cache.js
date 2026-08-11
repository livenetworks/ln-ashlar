// ─── Windowed Sparse Cache ─────────────────────────────────
//
// DOM-agnostic sliding-window data engine for server-side virtualization.
// Owns a sparse cache keyed by logical index, logical/grand totals, request
// dedup, a stale-guard via queryGen, LRU eviction to a bounded cap, and a
// debounced fetch trigger. Transport-agnostic: the consumer supplies
// requestPage() (kick a fetch — any transport) and onChange() (cache mutated,
// re-render). Render clients pull rows via get()/has() and read logicalTotal
// for spacer geometry; they hold no cache of their own. Shared by the ln-table
// and ln-list windowed paths; a future ln-data-store windowed mode plugs in by
// making requestPage resolve getAll({offset,limit}) then call ingest().

export function createWindowCache(config) {
	config = config || {};
	let windowSize = config.windowSize > 0 ? config.windowSize : 1000;
	let pageSize = config.pageSize > 0 ? config.pageSize : 200;
	let threshold = config.threshold != null ? config.threshold : 25;
	let fetchDebounce = config.fetchDebounce != null ? config.fetchDebounce : 120;
	const requestPage = typeof config.requestPage === 'function' ? config.requestPage : function () {};
	const onChange = typeof config.onChange === 'function' ? config.onChange : function () {};
	const onSwap = typeof config.onSwap === 'function' ? config.onSwap : function () {};

	const map = new Map();       // logicalIndex → record
	const touch = new Map();     // logicalIndex → seq (LRU stamp)
	const inflight = new Set();  // offsets currently requested (dedup)
	let logicalTotal = 0;
	let grandTotal = 0;
	let queryGen = 0;
	let query = { sort: null, filters: {}, search: '' };
	let debounceId = null;
	let seq = 0;
	let lastRangeStart = 0;       // last ensure() visible range — revalidate() re-targets here, not page 0
	let lastRangeEnd = 0;
	let pendingSwapOrigin = null; // 'invalidate' | 'revalidate' | null — consumed by the new generation's first ingest()

	function stamp(i) { touch.set(i, ++seq); }

	function hasActiveQuery() {
		return !!(query && (query.search || (query.filters && Object.keys(query.filters).length)));
	}

	function evict() {
		if (map.size <= windowSize) return;
		// LRU: drop least-recently touched/requested rows first
		const keys = Array.from(map.keys()).sort(function (a, b) {
			return (touch.get(a) || 0) - (touch.get(b) || 0);
		});
		let i = 0;
		while (map.size > windowSize && i < keys.length) {
			map.delete(keys[i]);
			touch.delete(keys[i]);
			i++;
		}
	}

	function fire(offset, limit) {
		inflight.add(offset);
		requestPage(query, offset, limit);
	}

	return {
		get: function (i) { return map.get(i); },
		has: function (i) { return map.has(i); },
		peek: function () { return map.size ? map.values().next().value : undefined; },

		get logicalTotal() { return logicalTotal; },
		get grandTotal() { return grandTotal; },
		get queryGen() { return queryGen; },
		get size() { return map.size; },

		// Render client hands its visible logical range; stamps in-range resident
		// rows as freshly used, then checks if any page in range (padded by threshold)
		// is missing from cache and needs to be fetched (page-aligned).
		ensure: function (startRow, endRow) {
			clearTimeout(debounceId);
			lastRangeStart = startRow;
			lastRangeEnd = endRow;
			for (let i = startRow; i < endRow; i++) {
				if (map.has(i)) stamp(i);
			}
			if (logicalTotal <= 0) return;

			const checkStart = Math.max(0, startRow - threshold);
			const checkEnd = Math.min(logicalTotal, endRow + threshold);

			const firstPage = Math.floor(checkStart / pageSize);
			const lastPage = Math.floor(Math.max(0, checkEnd - 1) / pageSize);

			let targetPageOffset = -1;
			let targetPageLimit = pageSize;

			for (let p = firstPage; p <= lastPage; p++) {
				const pOffset = p * pageSize;
				const pLimit = Math.min(pageSize, logicalTotal - pOffset);

				let hasMissing = false;
				for (let i = pOffset; i < pOffset + pLimit; i++) {
					if (!map.has(i)) {
						hasMissing = true;
						break;
					}
				}

				if (hasMissing && !inflight.has(pOffset)) {
					targetPageOffset = pOffset;
					targetPageLimit = pLimit;
					break;
				}
			}

			if (targetPageOffset === -1) return;

			debounceId = setTimeout(function () {
				fire(targetPageOffset, targetPageLimit);
			}, fetchDebounce);
		},

		// Splice a fetched page. Stale (superseded-query) responses are dropped.
		// Out-of-order pages splice at their own offset, so order is irrelevant.
		ingest: function (detail) {
			detail = detail || {};
			if (detail.queryGen != null && detail.queryGen !== queryGen) return;

			// First response of a new generation: drop the stale rows now, at the
			// swap moment, not at invalidate()/revalidate() time — stale-while-revalidate.
			if (pendingSwapOrigin) {
				map.clear();
				touch.clear();
				onSwap(pendingSwapOrigin);
				pendingSwapOrigin = null;
			}

			grandTotal = detail.total != null ? detail.total : grandTotal;
			logicalTotal = detail.filtered != null
				? detail.filtered
				: (detail.data ? detail.data.length : logicalTotal);

			const offset = detail.offset || 0;
			const rows = detail.data || [];
			for (let i = 0; i < rows.length; i++) {
				map.set(offset + i, rows[i]);
				stamp(offset + i);
			}
			inflight.delete(offset);
			evict();
			onChange();
		},

		// First load: fetch page 0 at the current generation (no bump).
		requestInitial: function (q) {
			if (q) query = q;
			fire(0, pageSize);
		},

		// Query change: new generation, stale rows stay visible until the first
		// response of the new generation lands in ingest() — no blanking, no
		// placeholder flash (ln-table--loading is the refresh affordance).
		invalidate: function (q) {
			queryGen++;
			inflight.clear();
			clearTimeout(debounceId);
			if (q) query = q;
			pendingSwapOrigin = 'invalidate';
			fire(0, pageSize);
		},

		// Post-mutation refresh of a windowed view: same stale-while-revalidate
		// swap as invalidate(), but re-requests the page at the CURRENT scroll
		// position instead of jumping back to page 0.
		revalidate: function () {
			queryGen++;
			inflight.clear();
			clearTimeout(debounceId);
			pendingSwapOrigin = 'revalidate';
			const offset = Math.max(0, Math.floor(lastRangeStart / pageSize) * pageSize);
			const limit = logicalTotal > 0 ? Math.min(pageSize, Math.max(1, logicalTotal - offset)) : pageSize;
			fire(offset, limit);
		},

		// Failed page fetch: release the offset so the next ensure() (scroll,
		// filter, resize) can re-request it. No onChange(), no auto-retry.
		release: function (offset) {
			inflight.delete(offset);
		},

		destroy: function () {
			clearTimeout(debounceId);
			map.clear();
			touch.clear();
			inflight.clear();
		},

		configure: function (partial) {
			partial = partial || {};
			let geometryChanged = false;
			if (partial.windowSize != null && partial.windowSize > 0 && partial.windowSize !== windowSize) {
				const shrank = partial.windowSize < windowSize;
				windowSize = partial.windowSize;
				if (shrank) evict();
				geometryChanged = true;
			}
			if (partial.pageSize != null && partial.pageSize > 0) pageSize = partial.pageSize;
			if (partial.threshold != null && partial.threshold >= 0) threshold = partial.threshold;
			if (partial.fetchDebounce != null && partial.fetchDebounce >= 0) fetchDebounce = partial.fetchDebounce;
			if (geometryChanged) onChange();
		},

		setGrandTotal: function (n) {
			if (n == null || isNaN(n) || n < 0) return;
			grandTotal = n;
			if (!hasActiveQuery()) logicalTotal = n;
			onChange();
		}
	};
}
