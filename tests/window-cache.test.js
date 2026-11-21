import test from 'node:test';
import assert from 'node:assert/strict';

import { createWindowCache } from '../components/ln-core/window-cache.js';

test('createWindowCache requests initial page, ingests records, and drops stale queryGen responses', () => {
	const requests = [];
	let changeCount = 0;

	const cache = createWindowCache({
		windowSize: 10,
		pageSize: 5,
		threshold: 2,
		fetchDebounce: 0,
		requestPage(query, offset, limit) {
			requests.push({ query, offset, limit, queryGen: cache.queryGen });
		},
		onChange() {
			changeCount++;
		}
	});

	cache.requestInitial({ sort: null, filters: {}, search: '' });
	assert.equal(requests.length, 1);
	assert.equal(requests[0].offset, 0);
	assert.equal(requests[0].limit, 5);
	assert.equal(requests[0].queryGen, 0);

	// Stale generation is ignored
	const rejectedStale = cache.ingest({
		data: [{ id: 99 }],
		offset: 0,
		total: 20,
		filtered: 20,
		queryGen: 999
	});
	assert.equal(rejectedStale, false);
	assert.equal(cache.size, 0);

	// Matching generation is ingested
	const accepted = cache.ingest({
		data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
		offset: 0,
		total: 20,
		filtered: 15,
		queryGen: 0
	});
	assert.equal(accepted, true);
	assert.equal(cache.size, 5);
	assert.equal(cache.grandTotal, 20);
	assert.equal(cache.logicalTotal, 15);
	assert.deepEqual(cache.get(0), { id: 1 });
	assert.deepEqual(cache.get(4), { id: 5 });
	assert.equal(cache.has(5), false);
	assert.equal(changeCount, 1);
});

test('createWindowCache implements stale-while-revalidate on invalidate and LRU eviction over windowSize', () => {
	const requests = [];
	const cache = createWindowCache({
		windowSize: 4,
		pageSize: 2,
		threshold: 0,
		fetchDebounce: 0,
		requestPage(query, offset, limit) {
			requests.push({ query, offset, limit, queryGen: cache.queryGen });
		}
	});

	cache.requestInitial({ sort: null, filters: {}, search: '' });
	cache.ingest({
		data: [{ id: 1 }, { id: 2 }],
		offset: 0,
		total: 10,
		filtered: 10,
		queryGen: 0
	});
	cache.ingest({
		data: [{ id: 3 }, { id: 4 }],
		offset: 2,
		total: 10,
		filtered: 10,
		queryGen: 0
	});
	assert.equal(cache.size, 4);

	// Touch rows 0 and 1 via ensure(0, 2) so rows 2 and 3 become least-recently-used
	cache.ensure(0, 2);

	// Ingesting page at offset 4 exceeds windowSize (4) -> evicts indices 2 and 3
	cache.ingest({
		data: [{ id: 5 }, { id: 6 }],
		offset: 4,
		total: 10,
		filtered: 10,
		queryGen: 0
	});
	assert.equal(cache.size, 4);
	assert.equal(cache.has(0), true);
	assert.equal(cache.has(1), true);
	assert.equal(cache.has(2), false);
	assert.equal(cache.has(3), false);
	assert.equal(cache.has(4), true);
	assert.equal(cache.has(5), true);

	// Invalidate bumps queryGen and keeps old rows visible until first new response arrives
	cache.invalidate({ sort: null, filters: {}, search: 'new' });
	assert.equal(cache.queryGen, 1);
	assert.equal(cache.has(0), true); // Still resident during stale-while-revalidate

	cache.ingest({
		data: [{ id: 101 }, { id: 102 }],
		offset: 0,
		total: 10,
		filtered: 2,
		queryGen: 1
	});
	assert.equal(cache.size, 2);
	assert.deepEqual(cache.get(0), { id: 101 });
	assert.equal(cache.has(4), false); // Stale rows cleared on swap
});
