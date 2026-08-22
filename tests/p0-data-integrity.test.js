import test from 'node:test';
import assert from 'node:assert/strict';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';

import {
	claimQueueHeads,
	remapQueueEntries,
	QueueStorage
} from '../components/ln-api-queue/src/queue-storage.js';
import {
	normalizeDataQuery,
	selectDataSource
} from '../components/ln-data-coordinator/src/data-read-policy.js';
import { MutationReceipts } from '../components/ln-data-coordinator/src/mutation-receipts.js';

let databaseSequence = 0;

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

function createQueueStorage(options) {
	options = options || {};
	let uuidSequence = 0;
	return new QueueStorage({
		indexedDB,
		IDBKeyRange,
		dbName: `ln-p0-test-${process.pid}-${++databaseSequence}`,
		now: options.now || (() => 1000),
		uuid: options.uuid || (() => `entry-${++uuidSequence}`)
	});
}

async function usingQueueStorage(options, operation) {
	const storage = createQueueStorage(options);
	try {
		return await operation(storage);
	} finally {
		await storage.deleteDatabase();
	}
}

test('loaded cache is selected for normal reads', () => {
	const store = { isLoaded: true };
	assert.equal(selectDataSource(store, {}), 'store');
});

test('empty local-only store remains a valid read source', () => {
	const store = { isLoaded: false, isInitialized: true };
	assert.equal(selectDataSource(store, null), 'store');
});

test('unloaded connector reads route remote', () => {
	assert.equal(selectDataSource({ isLoaded: false }, {}), 'remote');
});

test('store initialization failure routes remote when possible', () => {
	const store = { isLoaded: false, initializationError: new Error('IndexedDB failed') };
	assert.equal(selectDataSource(store, {}, false), 'remote');
	assert.equal(selectDataSource(store, null, false), 'none');
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

test('QueueStorage allocates unique per-scope sequences during concurrent enqueue', async () => {
	await usingQueueStorage({}, async storage => {
		const writes = Array.from({ length: 20 }, (_, index) => storage.enqueue('documents', {
			chainKey: `record-${index}`,
			op: 'update',
			targetId: `record-${index}`,
			payload: { index }
		}));

		const entries = await Promise.all(writes);
		assert.deepEqual(
			entries.map(item => item.seq).sort((a, b) => a - b),
			Array.from({ length: 20 }, (_, index) => index + 1)
		);
		assert.equal(new Set(entries.map(item => item.seq)).size, 20);
	});
});

test('QueueStorage claimReady persists one leased head per chain', async () => {
	let now = 1000;
	await usingQueueStorage({ now: () => now }, async storage => {
		await storage.enqueue('documents', { chainKey: 'a', op: 'update', targetId: 'a' });
		await storage.enqueue('documents', { chainKey: 'a', op: 'delete', targetId: 'a' });
		await storage.enqueue('documents', { chainKey: 'b', op: 'update', targetId: 'b' });

		const first = await storage.claimReady('documents', 'worker-a', 500);
		assert.deepEqual(first.entries.map(item => item.chainKey).sort(), ['a', 'b']);

		now = 1200;
		const overlapping = await storage.claimReady('documents', 'worker-b', 500);
		assert.deepEqual(overlapping.entries, []);
		assert.deepEqual(overlapping.wakeups.map(item => item.at), [1500, 1500]);
	});
});

test('QueueStorage resolveCreate atomically deletes create and remaps siblings', async () => {
	await usingQueueStorage({}, async storage => {
		const create = await storage.enqueue('documents', {
			chainKey: '_temp_1',
			op: 'create',
			targetId: null,
			meta: { tempId: '_temp_1', action: '/documents' }
		});
		await storage.enqueue('documents', {
			chainKey: '_temp_1',
			op: 'update',
			targetId: '_temp_1',
			meta: { id: '_temp_1', action: '/documents/_temp_1' }
		});

		await storage.resolveCreate('documents', create.entryId, '_temp_1', '42');
		const remaining = await storage.allForScope('documents');

		assert.equal(remaining.length, 1);
		assert.equal(remaining[0].chainKey, '42');
		assert.equal(remaining[0].targetId, '42');
		assert.equal(remaining[0].meta.id, '42');
		assert.equal(remaining[0].meta.action, '/documents/42');
	});
});

test('mutation receipts settle only the matching request', async () => {
	const receipts = new MutationReceipts();
	const pending = receipts.wait('request-a');

	assert.equal(receipts.resolve({ requestId: 'request-b' }), false);
	assert.equal(receipts.resolve({ requestId: 'request-a', record: { id: 42 } }), true);
	assert.deepEqual(await pending, { requestId: 'request-a', record: { id: 42 } });
});

test('mutation receipts propagate the store error without a timeout', async () => {
	const receipts = new MutationReceipts();
	const pending = receipts.wait('request-a');
	const error = new Error('write failed');

	assert.equal(receipts.reject({ requestId: 'request-a', error }), true);
	await assert.rejects(pending, error);
});

test('closing mutation receipts rejects every outstanding request', async () => {
	const receipts = new MutationReceipts();
	const first = receipts.wait('request-a');
	const second = receipts.wait('request-b');
	const error = new Error('coordinator destroyed');

	receipts.close(error);
	await assert.rejects(first, error);
	await assert.rejects(second, error);
});
