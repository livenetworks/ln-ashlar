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
	const windowSize = config.windowSize > 0 ? config.windowSize : 1000;
	const pageSize = config.pageSize > 0 ? config.pageSize : 200;
	const threshold = config.threshold != null ? config.threshold : 25;
	const fetchDebounce = config.fetchDebounce != null ? config.fetchDebounce : 120;
	const requestPage = typeof config.requestPage === 'function' ? config.requestPage : function () {};
	const onChange = typeof config.onChange === 'function' ? config.onChange : function () {};

	const map = new Map();       // logicalIndex → record
	const touch = new Map();     // logicalIndex → seq (LRU stamp)
	const inflight = new Set();  // offsets currently requested (dedup)
	let logicalTotal = 0;
	let grandTotal = 0;
	let queryGen = 0;
	let query = { sort: null, filters: {}, search: '' };
	let debounceId = null;
	let seq = 0;

	function stamp(i) { touch.set(i, ++seq); }

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

			clearTimeout(debounceId);
			debounceId = setTimeout(function () {
				fire(targetPageOffset, targetPageLimit);
			}, fetchDebounce);
		},

		// Splice a fetched page. Stale (superseded-query) responses are dropped.
		// Out-of-order pages splice at their own offset, so order is irrelevant.
		ingest: function (detail) {
			detail = detail || {};
			if (detail.queryGen != null && detail.queryGen !== queryGen) return;

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

		// Query change: new generation, drop everything, refetch page 0, then
		// notify for an immediate all-placeholder repaint at the stale height.
		invalidate: function (q) {
			queryGen++;
			map.clear();
			touch.clear();
			inflight.clear();
			clearTimeout(debounceId);
			if (q) query = q;
			fire(0, pageSize);
			onChange();
		},

		destroy: function () {
			clearTimeout(debounceId);
			map.clear();
			touch.clear();
			inflight.clear();
		}
	};
}
