// ─── Windowed Store Position Index ────────────────────────────
//
// In-memory sliding-window index mapping logical positions to record IDs
// for server-side virtualization. Holds logical/grand totals, request dedup,
// stale-guard queryGen, and LRU eviction. Used by ln-data-store.

export function createWindowIndex(config) {
	config = config || {};
	let windowSize = config.windowSize > 0 ? config.windowSize : 1000;
	let pageSize = config.pageSize > 0 ? config.pageSize : 200;
	let fetchDebounce = config.fetchDebounce != null ? config.fetchDebounce : 120;
	const requestPage = typeof config.requestPage === 'function' ? config.requestPage : function () {};

	const map = new Map();       // logicalIndex → id
	const touch = new Map();     // logicalIndex → seq (LRU stamp)
	const inflight = new Set();  // offsets currently requested (dedup)
	let logicalTotal = 0;
	let grandTotal = 0;
	let queryGen = 0;
	let debounceId = null;
	let seq = 0;

	function stamp(i) {
		touch.set(i, ++seq);
	}

	function evict() {
		if (map.size <= windowSize) return;
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

	function fire(offset, limit, query) {
		inflight.add(offset);
		requestPage(offset, limit, query);
	}

	return {
		get logicalTotal() { return logicalTotal; },
		set logicalTotal(val) { logicalTotal = val; },
		get grandTotal() { return grandTotal; },
		set grandTotal(val) { grandTotal = val; },
		get queryGen() { return queryGen; },
		set queryGen(val) { queryGen = val; },
		get size() { return map.size; },

		getId: function (i) {
			if (map.has(i)) {
				stamp(i);
				return map.get(i);
			}
			return undefined;
		},

		// The caller asks for an exact range it already decided it needs — the
		// index is an id resolver, not a scroll surface. Prefetch padding is the
		// view's job (it owns the viewport); padding here would fetch a page
		// nobody asked for on top of every page the view asks for.
		ensure: function (startRow, endRow, query) {
			if (logicalTotal <= 0) {
				// Initial page fetch trigger
				if (!inflight.has(0)) {
					clearTimeout(debounceId);
					debounceId = setTimeout(function () {
						fire(0, pageSize, query);
					}, fetchDebounce);
				}
				return;
			}

			const checkStart = Math.max(0, startRow);
			const checkEnd = Math.min(logicalTotal, endRow);

			const firstPage = Math.floor(checkStart / pageSize);
			const lastPage = Math.floor(Math.max(0, checkEnd - 1) / pageSize);

			let targetPageOffset = -1;

			for (let p = firstPage; p <= lastPage; p++) {
				const pOffset = p * pageSize;
				// Bounds the missing-row scan only. The request itself always asks
				// for a full page — logicalTotal may be a stale carry-over from the
				// previous query, and clamping the limit by it short-fetches the
				// page, forcing a second request for the same offset.
				const pLimit = Math.min(pageSize, logicalTotal - pOffset);

				let hasMissing = false;
				const pageCheckStart = Math.max(pOffset, checkStart);
				const pageCheckEnd = Math.min(pOffset + pLimit, checkEnd);
				for (let i = pageCheckStart; i < pageCheckEnd; i++) {
					if (!map.has(i)) {
						hasMissing = true;
						break;
					}
				}

				if (hasMissing && !inflight.has(pOffset)) {
					targetPageOffset = pOffset;
					break;
				}
			}

			if (targetPageOffset === -1) return;

			clearTimeout(debounceId);
			debounceId = setTimeout(function () {
				fire(targetPageOffset, pageSize, query);
			}, fetchDebounce);
		},

		ingest: function (offset, ids, total, filtered, qGen) {
			if (qGen != null && qGen !== queryGen) return;

			grandTotal = total != null ? total : grandTotal;
			logicalTotal = filtered != null ? filtered : logicalTotal;

			for (let i = 0; i < ids.length; i++) {
				map.set(offset + i, ids[i]);
				stamp(offset + i);
			}
			inflight.delete(offset);
			evict();
		},

		// Query change: new generation, positions dropped. The totals are kept
		// as the stale-while-revalidate carry-over the view renders against
		// until the new generation's first page lands in ingest() — same
		// contract as createWindowCache.invalidate().
		reset: function () {
			queryGen++;
			map.clear();
			touch.clear();
			inflight.clear();
			clearTimeout(debounceId);
		},

		clear: function () {
			map.clear();
			touch.clear();
			inflight.clear();
			clearTimeout(debounceId);
		},

		configure: function (partial) {
			partial = partial || {};
			if (partial.windowSize != null && partial.windowSize > 0 && partial.windowSize !== windowSize) {
				const shrank = partial.windowSize < windowSize;
				windowSize = partial.windowSize;
				if (shrank) evict();
			}
			if (partial.pageSize != null && partial.pageSize > 0) pageSize = partial.pageSize;
			if (partial.fetchDebounce != null && partial.fetchDebounce >= 0) fetchDebounce = partial.fetchDebounce;
		}
	};
}
