import test from 'node:test';
import assert from 'node:assert/strict';

import {
	hashSortEncode,
	hashSortDecode,
	hashFilterEncode,
	hashFilterDecode,
	resolveHashNamespace
} from '../js/ln-core/hash.js';

test('hashSortEncode encodes field and direction with dot separator', () => {
	assert.equal(hashSortEncode('price', 'asc'), 'price.asc');
	assert.equal(hashSortEncode('created-at', 'desc'), 'created-at.desc');
	assert.equal(hashSortEncode('billing-address-zip', 'asc'), 'billing-address-zip.asc');
	assert.equal(hashSortEncode(2, 'desc'), '2.desc');
	assert.equal(hashSortEncode('name', 'none'), null);
	assert.equal(hashSortEncode(null, 'asc'), null);
});

test('hashSortDecode accurately parses field and direction without hyphen collisions', () => {
	assert.deepEqual(hashSortDecode('price.asc'), { fieldOrColumn: 'price', direction: 'asc' });
	assert.deepEqual(hashSortDecode('created-at.desc'), { fieldOrColumn: 'created-at', direction: 'desc' });
	assert.deepEqual(hashSortDecode('order-items-total.asc'), { fieldOrColumn: 'order-items-total', direction: 'asc' });
	assert.deepEqual(hashSortDecode('0.asc'), { fieldOrColumn: '0', direction: 'asc' });
	assert.equal(hashSortDecode('invalid'), null);
	assert.equal(hashSortDecode(''), null);
	assert.equal(hashSortDecode(null), null);
});

test('hashFilterEncode and hashFilterDecode serialize filter keys and values', () => {
	const encoded = hashFilterEncode('status', ['active', 'pending']);
	assert.equal(encoded, 'status:active,pending');

	const decoded = hashFilterDecode('status:active,pending');
	assert.deepEqual(decoded, { key: 'status', values: ['active', 'pending'] });

	assert.equal(hashFilterEncode('status', []), null);
	assert.equal(hashFilterDecode(''), null);
	assert.equal(hashFilterDecode('invalid'), null);
});

test('resolveHashNamespace resolves explicit and fallback namespaces', () => {
	const elExplicit = {
		hasAttribute: (attr) => attr === 'data-ln-hash',
		getAttribute: (attr) => (attr === 'data-ln-hash' ? 'custom-q' : null)
	};
	assert.equal(resolveHashNamespace(elExplicit, 'search'), 'custom-q');

	const elTargetFallback = {
		hasAttribute: (attr) => attr === 'data-ln-hash',
		getAttribute: (attr) => {
			if (attr === 'data-ln-hash') return '';
			if (attr === 'data-ln-sort') return 'users-table';
			return null;
		}
	};
	assert.equal(resolveHashNamespace(elTargetFallback, 'sort'), 'users-table-sort');

	const elNoHash = {
		hasAttribute: (attr) => false,
		getAttribute: (attr) => null
	};
	assert.equal(resolveHashNamespace(elNoHash, 'sort'), null);
});
