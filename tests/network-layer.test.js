import test from 'node:test';
import assert from 'node:assert/strict';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';

import {
	extractUrl,
	extractMethod,
	buildHttpKey,
	isIdempotentMethod
} from '../components/ln-http/src/http-core.js';

import {
	buildQueryParams,
	buildQueryUrl,
	joinUrl,
	unwrapEnvelope,
	DEFAULT_PARAM_KEYS
} from '../components/ln-api-connector/src/connector-core.js';

import {
	QueueStorage
} from '../components/ln-api-queue/src/queue-storage.js';

let dbSequence = 0;

function createTestStorage() {
	return new QueueStorage({
		indexedDB,
		IDBKeyRange,
		dbName: `ln-network-test-${process.pid}-${++dbSequence}`,
		now: () => 1000,
		uuid: () => 'uuid-1'
	});
}

// ─── ln-http / http-core Tests ───────────────────────────────

test('http-core: extractUrl handles strings, URL objects, and Request objects', () => {
	assert.equal(extractUrl('/api/documents'), '/api/documents');
	assert.equal(extractUrl(new URL('https://example.com/api/test')), 'https://example.com/api/test');
	assert.equal(extractUrl({ url: '/api/from-request' }), '/api/from-request');
	assert.equal(extractUrl(null), '');
});

test('http-core: extractMethod extracts and uppercases method with GET fallback', () => {
	assert.equal(extractMethod('/api/test', { method: 'post' }), 'POST');
	assert.equal(extractMethod({ method: 'delete' }), 'DELETE');
	assert.equal(extractMethod('/api/test', {}), 'GET');
	assert.equal(extractMethod('/api/test', null), 'GET');
});

test('http-core: buildHttpKey creates "METHOD URL" deduplication key', () => {
	assert.equal(buildHttpKey('/api/items', 'GET'), 'GET /api/items');
	assert.equal(buildHttpKey('/api/items', 'POST'), 'POST /api/items');
});

test('http-core: isIdempotentMethod correctly identifies GET and HEAD only', () => {
	assert.equal(isIdempotentMethod('GET'), true);
	assert.equal(isIdempotentMethod('get'), true);
	assert.equal(isIdempotentMethod('HEAD'), true);
	assert.equal(isIdempotentMethod('head'), true);
	assert.equal(isIdempotentMethod('POST'), false);
	assert.equal(isIdempotentMethod('PUT'), false);
	assert.equal(isIdempotentMethod('DELETE'), false);
	assert.equal(isIdempotentMethod('PATCH'), false);
});

// ─── ln-api-connector / connector-core Tests ─────────────────

test('connector-core: buildQueryParams serializes full query options', () => {
	const query = {
		search: 'ashlar',
		offset: 10,
		limit: 25,
		sort: { field: 'name', direction: 'asc' },
		filters: { status: ['active', 'pending'], role: ['admin'] }
	};
	const qs = buildQueryParams(query, DEFAULT_PARAM_KEYS);
	const params = new URLSearchParams(qs);

	assert.equal(params.get('search'), 'ashlar');
	assert.equal(params.get('offset'), '10');
	assert.equal(params.get('limit'), '25');
	assert.equal(params.get('sort_field'), 'name');
	assert.equal(params.get('sort_dir'), 'asc');
	assert.equal(params.get('status'), 'active,pending');
	assert.equal(params.get('role'), 'admin');
});

test('connector-core: buildQueryParams handles custom parameter mappings', () => {
	const customKeys = {
		offset: 'page_offset',
		limit: 'page_size',
		search: 'q',
		sortField: 'sort',
		sortDir: 'order'
	};
	const query = { search: 'alpha', offset: 0, limit: 50, sort: { field: 'date', direction: 'desc' } };
	const qs = buildQueryParams(query, customKeys);
	const params = new URLSearchParams(qs);

	assert.equal(params.get('q'), 'alpha');
	assert.equal(params.get('page_offset'), '0');
	assert.equal(params.get('page_size'), '50');
	assert.equal(params.get('sort'), 'date');
	assert.equal(params.get('order'), 'desc');
});

test('connector-core: buildQueryParams ignores undefined/null in paramKeys and preserves defaults', () => {
	const query = {
		search: 'ashlar',
		offset: 0,
		limit: 200,
		sort: { field: 'name', direction: 'asc' }
	};
	const qs = buildQueryParams(query, {
		offset: undefined,
		limit: undefined,
		search: undefined,
		sortField: undefined,
		sortDir: undefined
	});
	const params = new URLSearchParams(qs);

	assert.equal(params.get('search'), 'ashlar');
	assert.equal(params.get('offset'), '0');
	assert.equal(params.get('limit'), '200');
	assert.equal(params.get('sort_field'), 'name');
	assert.equal(params.get('sort_dir'), 'asc');
	assert.equal(params.has('undefined'), false);
});

test('connector-core: buildQueryUrl constructs target URL cleanly', () => {
	assert.equal(buildQueryUrl('/api', '/users', 'search=test'), '/api/users?search=test');
	assert.equal(buildQueryUrl('/api', '/users?active=1', 'search=test'), '/api/users?active=1&search=test');
	assert.equal(buildQueryUrl('/api', '/users', ''), '/api/users');
});

test('connector-core: unwrapEnvelope handles wrapped and raw body responses', () => {
	const wrapped = { message: 'Created successfully', content: { id: 101, name: 'Item A' } };
	assert.deepEqual(unwrapEnvelope(wrapped), {
		record: { id: 101, name: 'Item A' },
		message: 'Created successfully'
	});

	const raw = { id: 102, name: 'Item B' };
	assert.deepEqual(unwrapEnvelope(raw), {
		record: { id: 102, name: 'Item B' },
		message: null
	});

	assert.deepEqual(unwrapEnvelope(null), {
		record: null,
		message: null
	});
});

test('connector-core: joinUrl joins paths without duplicate slashes', () => {
	assert.equal(joinUrl('/api/', '/v1/', 'users/'), '/api/v1/users');
	assert.equal(joinUrl('https://api.example.com/', '/documents', '42'), 'https://api.example.com/documents/42');
	assert.equal(joinUrl('', 'users'), 'users');
});

// ─── ln-api-queue Storage Pause & Resume Tests ───────────────

test('queue-storage: pause state can be set with reason, read, and cleared per scope', async () => {
	const storage = createTestStorage();
	try {
		assert.equal(await storage.getPaused('scope-a'), false);

		await storage.setPaused('scope-a', 'manual');
		assert.equal(await storage.getPaused('scope-a'), 'manual');
		assert.equal(await storage.getPaused('scope-b'), false);

		await storage.setPaused('scope-a', false);
		assert.equal(await storage.getPaused('scope-a'), false);
	} finally {
		await storage.deleteDatabase();
	}
});

test('queue-storage: nack with auth reason persists auth paused state for the scope', async () => {
	const storage = createTestStorage();
	try {
		const entry = await storage.enqueue('orders', { chainKey: 'order-1', op: 'create' });
		assert.equal(await storage.getPaused('orders'), false);

		const result = await storage.nack('orders', entry.entryId, 'auth');
		assert.equal(result.status, 'auth');
		assert.equal(await storage.getPaused('orders'), 'auth');
	} finally {
		await storage.deleteDatabase();
	}
});
