import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveProgressMax } from '../components/ln-progress/src/progress-model.js';

test('resolveProgressMax resolves max with parent precedence and fallbacks', () => {
	assert.equal(resolveProgressMax('100', '250'), 250);
	assert.equal(resolveProgressMax('50', null), 50);
	assert.equal(resolveProgressMax(null, null), 100);
	assert.equal(resolveProgressMax('-10', '0', 200), 200);
});
