import test from 'node:test';
import assert from 'node:assert/strict';

import {
	queryParse,
	queryGet,
	querySet,
	resolveQueryParam,
	querySortEncode,
	querySortDecode,
	queryFilterEncode,
	queryFilterDecode
} from '../components/ln-core/query.js';

test('queryParse parses query strings into key-value map', () => {
	assert.deepEqual(queryParse('?search=john&status=active'), { search: 'john', status: 'active' });
	assert.deepEqual(queryParse('search=john&status=active'), { search: 'john', status: 'active' });
	assert.deepEqual(queryParse(''), {});
	assert.deepEqual(queryParse(null), {});
});

test('resolveQueryParam resolves explicit and target fallback parameters', () => {
	const elExplicit = {
		hasAttribute: (attr) => attr === 'data-ln-query',
		getAttribute: (attr) => (attr === 'data-ln-query' ? 'custom_q' : null)
	};
	assert.equal(resolveQueryParam(elExplicit, 'search'), 'custom_q');

	const elTargetFallback = {
		hasAttribute: (attr) => attr === 'data-ln-query',
		getAttribute: (attr) => {
			if (attr === 'data-ln-query') return '';
			if (attr === 'data-ln-sort') return 'deductions';
			return null;
		}
	};
	assert.equal(resolveQueryParam(elTargetFallback, 'sort'), 'deductions_sort');

	const elNoQuery = {
		hasAttribute: () => false,
		getAttribute: () => null
	};
	assert.equal(resolveQueryParam(elNoQuery, 'search'), null);
});

test('querySortEncode encodes field and direction with dot notation', () => {
	assert.equal(querySortEncode('amount', 'desc'), 'amount.desc');
	assert.equal(querySortEncode('user_name', 'asc'), 'user_name.asc');
	assert.equal(querySortEncode('amount', 'none'), null);
	assert.equal(querySortEncode(null, 'asc'), null);
});

test('querySortDecode accurately parses single dot query and separate sort_field/sort_dir params', () => {
	assert.deepEqual(querySortDecode('amount.desc'), { fieldOrColumn: 'amount', direction: 'desc' });
	assert.deepEqual(querySortDecode('user_name.asc'), { fieldOrColumn: 'user_name', direction: 'asc' });

	// Backend compatibility with sort_field and sort_dir
	assert.deepEqual(querySortDecode(null, { sort_field: 'amount', sort_dir: 'desc' }), { fieldOrColumn: 'amount', direction: 'desc' });
	assert.deepEqual(querySortDecode(null, { sort_by: 'created_at', sort_dir: 'asc' }), { fieldOrColumn: 'created_at', direction: 'asc' });

	assert.equal(querySortDecode(''), null);
	assert.equal(querySortDecode(null), null);
});

test('queryFilterEncode and queryFilterDecode serialize comma-separated filter values', () => {
	const encoded = queryFilterEncode(['0', '1']);
	assert.equal(encoded, '0,1');

	const decoded = queryFilterDecode('0,1');
	assert.deepEqual(decoded, ['0', '1']);

	assert.equal(queryFilterEncode([]), null);
	assert.deepEqual(queryFilterDecode(''), []);
	assert.deepEqual(queryFilterDecode(null), []);
});
