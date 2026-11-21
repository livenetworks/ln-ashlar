import test from 'node:test';
import assert from 'node:assert/strict';

import {
	normalizeDataQuery,
	selectDataSource,
	composeQuery
} from '../components/ln-data-coordinator/src/data-read-policy.js';
import { MutationReceipts } from '../components/ln-data-coordinator/src/mutation-receipts.js';

test('normalizeDataQuery extracts canonical query fields from detail payload', () => {
	assert.deepEqual(normalizeDataQuery(null), {
		sort: undefined,
		filters: undefined,
		search: undefined,
		offset: undefined,
		limit: undefined,
		queryGen: undefined
	});

	const detail = {
		table: 'docs',
		sort: { field: 'title', direction: 'asc' },
		filters: { status: ['Approved'] },
		search: 'policy',
		offset: 200,
		limit: 200,
		queryGen: 3
	};

	assert.deepEqual(normalizeDataQuery(detail), {
		sort: { field: 'title', direction: 'asc' },
		filters: { status: ['Approved'] },
		search: 'policy',
		offset: 200,
		limit: 200,
		queryGen: 3
	});
});

test('selectDataSource selects remote, store, or none according to topology and readiness', () => {
	const connector = {};

	// Transport-only topology (no store)
	assert.equal(selectDataSource(null, connector), 'remote');

	// Store with initialization error falls back to remote connector
	assert.equal(selectDataSource({ initializationError: new Error('IDB failed'), canServe: true }, connector), 'remote');

	// Store not yet ready to serve reads falls back to remote connector
	assert.equal(selectDataSource({ initializationError: null, canServe: false }, connector), 'remote');

	// Store with noLocalQuery opts out of local reads and routes to remote connector
	assert.equal(selectDataSource({ initializationError: null, canServe: true, noLocalQuery: true }, connector), 'remote');

	// Ready local store serves reads locally
	assert.equal(selectDataSource({ initializationError: null, canServe: true, noLocalQuery: false }, connector), 'store');

	// Local-only topology (store without connector)
	assert.equal(selectDataSource({ initializationError: null, canServe: false }, null), 'store');

	// Neither available
	assert.equal(selectDataSource(null, null), 'none');
});

test('composeQuery merges view pagination/query with coordinator query without wiping view sort/search when coordinator query is empty', () => {
	const viewQuery = {
		offset: 400,
		limit: 200,
		queryGen: 2,
		sort: { field: 'updated_at', direction: 'desc' },
		search: 'report',
		filters: { department: ['IT'] }
	};
	const emptyCoordQuery = {
		sort: null,
		search: '',
		filters: {}
	};

	// View-level sort/search/filters survive when coordinator attributes are empty
	assert.deepEqual(composeQuery(viewQuery, emptyCoordQuery), {
		offset: 400,
		limit: 200,
		queryGen: 2,
		sort: { field: 'updated_at', direction: 'desc' },
		search: 'report',
		filters: { department: ['IT'] }
	});

	// Coordinator query attributes override/merge with view query when present
	const activeCoordQuery = {
		sort: { field: 'title', direction: 'asc' },
		search: 'security',
		filters: { status: ['Approved'] }
	};
	assert.deepEqual(composeQuery(viewQuery, activeCoordQuery), {
		offset: 400,
		limit: 200,
		queryGen: 2,
		sort: { field: 'title', direction: 'asc' },
		search: 'security',
		filters: { department: ['IT'], status: ['Approved'] }
	});
});

test('MutationReceipts correlates wait, resolve, reject, and close lifecycle', async () => {
	const receipts = new MutationReceipts();

	// Resolve matching requestId
	const p1 = receipts.wait('req-1');
	assert.equal(receipts.resolve({ requestId: 'unknown' }), false);
	assert.equal(receipts.resolve({ requestId: 'req-1', record: { id: 10 } }), true);
	const res1 = await p1;
	assert.deepEqual(res1, { requestId: 'req-1', record: { id: 10 } });

	// Reject matching requestId
	const p2 = receipts.wait('req-2');
	assert.equal(receipts.reject({ requestId: 'req-2', error: new Error('Write conflict') }), true);
	await assert.rejects(p2, /Write conflict/);

	// Close rejects all remaining pending receipts
	const p3 = receipts.wait('req-3');
	receipts.close(new Error('Coordinator destroyed'));
	await assert.rejects(p3, /Coordinator destroyed/);
});
