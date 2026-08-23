// ─── Windowed Store Position Index ────────────────────────────
//
// In-memory sliding-window index mapping logical positions to record IDs
// for server-side virtualization. Holds logical/grand totals, request dedup,
// stale-guard queryGen, and LRU eviction using JS Map insertion order.

export function createWindowIndex(config = {}) {
	let windowSize = config.windowSize > 0 ? config.windowSize : 1000;
	let pageSize = config.pageSize > 0 ? config.pageSize : 200;
	let fetchDebounce = config.fetchDebounce != null ? config.fetchDebounce : 120;
	const requestPage = typeof config.requestPage === 'function' ? config.requestPage : () => {};

	const map = new Map();       // logicalIndex → id (LRU by insertion order)
	const inflight = new Set();  // offsets currently requested
	let logicalTotal = 0, grandTotal = 0, queryGen = 0, hasLoaded = false, debounceId = null;

	function touch(i, id) {
		map.delete(i);
		map.set(i, id);
	}

	function evict() {
		while (map.size > windowSize) {
			map.delete(map.keys().next().value);
		}
	}

	function fire(offset, query) {
		inflight.add(offset);
		clearTimeout(debounceId);
		debounceId = setTimeout(() => requestPage(offset, pageSize, query), fetchDebounce);
	}

	return {
		get logicalTotal() { return logicalTotal; },
		set logicalTotal(val) { logicalTotal = val; },
		get grandTotal() { return grandTotal; },
		set grandTotal(val) { grandTotal = val; },
		get queryGen() { return queryGen; },
		set queryGen(val) { queryGen = val; },
		get size() { return map.size; },

		getId: i => {
			if (!map.has(i)) return undefined;
			const id = map.get(i);
			touch(i, id);
			return id;
		},

		ensure: (startRow, endRow, query) => {
			if (!hasLoaded && !inflight.has(0)) return fire(0, query);
			if (logicalTotal <= 0) return;

			const start = Math.max(0, startRow);
			const end = Math.min(logicalTotal, endRow);

			for (let i = start; i < end; i++) {
				if (!map.has(i)) {
					const pageOffset = Math.floor(i / pageSize) * pageSize;
					if (!inflight.has(pageOffset)) return fire(pageOffset, query);
				}
			}
		},

		ingest: (offset, ids, total, filtered, qGen) => {
			if (qGen != null && qGen !== queryGen) return;
			hasLoaded = true;
			if (total != null) grandTotal = total;
			if (filtered != null) logicalTotal = filtered;

			for (let i = 0; i < ids.length; i++) {
				touch(offset + i, ids[i]);
			}
			inflight.delete(offset);
			evict();
		},

		reset: function () {
			queryGen++;
			this.clear();
		},

		clear: () => {
			hasLoaded = false;
			map.clear();
			inflight.clear();
			clearTimeout(debounceId);
		},

		configure: (partial = {}) => {
			if (partial.windowSize > 0 && partial.windowSize !== windowSize) {
				windowSize = partial.windowSize;
				evict();
			}
			if (partial.pageSize > 0) pageSize = partial.pageSize;
			if (partial.fetchDebounce >= 0) fetchDebounce = partial.fetchDebounce;
		}
	};
}
