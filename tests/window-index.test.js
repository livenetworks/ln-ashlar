import test from 'node:test';
import assert from 'node:assert/strict';
import { createWindowIndex } from '../js/ln-data-store/src/window-index.js';

test('createWindowIndex ensure() on empty index requests offset 0 once and deduplicates requests', async (t) => {
	let requests = [];
	const index = createWindowIndex({
		windowSize: 10,
		pageSize: 2,
		threshold: 0,
		fetchDebounce: 0,
		requestPage: (offset, limit, query) => {
			requests.push({ offset, limit, query });
		}
	});

	index.ensure(0, 2, { query: 'test' });
	
	// Wait to bypass the setTimeout debounce
	await new Promise(resolve => setTimeout(resolve, 5));
	assert.equal(requests.length, 1);
	assert.deepEqual(requests[0], { offset: 0, limit: 2, query: { query: 'test' } });

	// Trigger second ensure (before ingest or clearing inflight)
	index.ensure(0, 2, { query: 'test' });
	await new Promise(resolve => setTimeout(resolve, 5));
	assert.equal(requests.length, 1); // should still be 1 (deduplicated because offset 0 is in-flight)
});

test('createWindowIndex ingest() drops older queryGen and accepts matching queryGen', () => {
	const index = createWindowIndex({
		windowSize: 10,
		pageSize: 2,
		threshold: 0,
		fetchDebounce: 0,
		requestPage: () => {}
	});

	index.queryGen = 5;

	// Ingest with older queryGen
	index.ingest(0, ['a', 'b'], 10, 10, 4);
	assert.equal(index.getId(0), undefined); // dropped

	// Ingest with matching queryGen
	index.ingest(0, ['a', 'b'], 10, 10, 5);
	assert.equal(index.getId(0), 'a'); // landed
	assert.equal(index.getId(1), 'b'); // landed
});

test('createWindowIndex reset() bumps queryGen and drops in-flight responses', () => {
	const index = createWindowIndex({
		windowSize: 10,
		pageSize: 2,
		threshold: 0,
		fetchDebounce: 0,
		requestPage: () => {}
	});

	const initialGen = index.queryGen; // 0
	index.reset();
	const newGen = index.queryGen; // 1
	assert.equal(newGen, initialGen + 1);

	// Ingest with gen from before reset
	index.ingest(0, ['x', 'y'], 10, 10, initialGen);
	assert.equal(index.getId(0), undefined); // dropped
});

test('createWindowIndex ingest() records at offset without compaction/shifting', () => {
	const index = createWindowIndex({
		windowSize: 1000,
		pageSize: 100,
		threshold: 0,
		fetchDebounce: 0,
		requestPage: () => {}
	});

	index.ingest(200, ['record200', 'record201'], 1000, 1000, index.queryGen);
	assert.equal(index.getId(200), 'record200');
	assert.equal(index.getId(201), 'record201');
	assert.equal(index.getId(0), undefined);
	assert.equal(index.getId(199), undefined);
	assert.equal(index.getId(202), undefined);
	assert.equal(index.getId(400), undefined); // no shifting, position 400 remains undefined
});
