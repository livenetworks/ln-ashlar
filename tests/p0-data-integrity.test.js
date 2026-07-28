import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import {
	claimQueueHeads,
	remapQueueEntries
} from '../js/ln-api-queue/src/queue-storage.js';
import {
	normalizeDataQuery,
	selectDataSource
} from '../js/ln-data-coordinator/src/data-read-policy.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');

function entry(overrides) {
	return Object.assign({
		entryId: 'entry-1',
		scope: 'documents',
		chainKey: 'record-1',
		seq: 1,
		op: 'update',
		targetId: 'record-1',
		status: 'pending',
		attempts: 0,
		nextAttemptAt: 0,
		leaseOwner: null,
		leaseUntil: 0,
		meta: { id: 'record-1', action: '/documents/record-1' }
	}, overrides || {});
}

test('loaded cache is selected for normal reads', () => {
	const store = { isLoaded: true };
	assert.equal(selectDataSource(store, {}, false), 'store');
});

test('empty local-only store remains a valid read source', () => {
	const store = { isLoaded: false, isInitialized: true };
	assert.equal(selectDataSource(store, null, false), 'store');
});

test('unloaded and windowed connector reads route remote', () => {
	assert.equal(selectDataSource({ isLoaded: false }, {}, false), 'remote');
	assert.equal(selectDataSource({ isLoaded: true }, {}, true), 'remote');
});

test('query normalization is detail-null safe', () => {
	assert.deepEqual(normalizeDataQuery(null), {
		sort: undefined,
		filters: undefined,
		search: undefined,
		offset: undefined,
		limit: undefined,
		queryGen: undefined
	});
});

test('failed head blocks newer entries in the same chain', () => {
	const failedHead = entry({ entryId: 'failed', seq: 1, status: 'failed' });
	const newer = entry({ entryId: 'newer', seq: 2, status: 'pending' });

	const result = claimQueueHeads([newer, failedHead], 'worker-a', 1000, 100);
	assert.deepEqual(result.entries, []);
});

test('different chains claim independently while preserving one head per chain', () => {
	const first = entry({ entryId: 'a1', chainKey: 'a', seq: 1 });
	const second = entry({ entryId: 'a2', chainKey: 'a', seq: 2 });
	const other = entry({ entryId: 'b1', chainKey: 'b', seq: 3 });

	const result = claimQueueHeads([second, other, first], 'worker-a', 1000, 100);
	assert.deepEqual(result.entries.map(item => item.entryId).sort(), ['a1', 'b1']);
	assert.equal(second.status, 'pending');
});

test('active lease prevents a duplicate claim and expired lease is recoverable', () => {
	const leased = entry({
		status: 'inflight',
		leaseOwner: 'worker-a',
		leaseUntil: 500
	});

	const active = claimQueueHeads([leased], 'worker-b', 1000, 100);
	assert.deepEqual(active.entries, []);
	assert.deepEqual(active.wakeups, [{ chainKey: 'record-1', at: 500 }]);

	const recovered = claimQueueHeads([leased], 'worker-b', 1000, 501);
	assert.equal(recovered.entries.length, 1);
	assert.equal(recovered.entries[0].leaseOwner, 'worker-b');
	assert.equal(recovered.entries[0].leaseUntil, 1501);
});

test('create resolution atomically removes create and remaps queued siblings', () => {
	const create = entry({
		entryId: 'create-1',
		chainKey: '_temp_1',
		targetId: null,
		op: 'create',
		seq: 1,
		meta: { tempId: '_temp_1', action: '/documents' }
	});
	const update = entry({
		entryId: 'update-1',
		chainKey: '_temp_1',
		targetId: '_temp_1',
		seq: 2,
		meta: { id: '_temp_1', action: '/documents/_temp_1' }
	});

	const result = remapQueueEntries([create, update], 'create-1', '_temp_1', '42', 100);
	assert.deepEqual(result.deleted, ['create-1']);
	assert.equal(result.changed.length, 1);
	assert.equal(update.chainKey, '42');
	assert.equal(update.targetId, '42');
	assert.equal(update.meta.id, '42');
	assert.equal(update.meta.action, '/documents/42');
});

test('queue implementation keeps sequence allocation and enqueue in one transaction', async () => {
	const source = await readFile(resolve(repoRoot, 'js/ln-api-queue/src/queue-storage.js'), 'utf8');
	assert.match(source, /transaction\(\[META,\s*OUTBOX\],\s*'readwrite'\)/);
	assert.doesNotMatch(source, /get\('seq'\)[\s\S]*transaction\(META,\s*'readwrite'\)/);
});

test('coordinator loaded-cache path uses the resolved store binding', async () => {
	const source = await readFile(resolve(repoRoot, 'js/ln-data-coordinator/src/ln-data-coordinator.js'), 'utf8');
	assert.match(source, /const store = children\.store;/);
	assert.match(source, /return store\.getAll\(query\)/);
	assert.doesNotMatch(source, /if \(children\.store && children\.store\.isLoaded\)\s*\{\s*store\.getAll/);
});
