import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateCursorPosition } from '../components/ln-number/src/number-model.js';

test('calculateCursorPosition maps cursor across formatting insertions', () => {
	// User types '4' after '123' -> '1234' becomes '1,234'
	// 4 digits were before cursor, formatted is '1,234' -> cursor should be at index 5 (end)
	assert.equal(calculateCursorPosition('1,234', 4), 5);

	// User types '2' in '1,|345' with 2 digits before cursor ('1','2') -> '1,234' -> cursor after '2' (index 3)
	assert.equal(calculateCursorPosition('1,234', 2), 3);

	// User has 1 digit before cursor in '1,234' -> cursor after '1' (index 1)
	assert.equal(calculateCursorPosition('1,234', 1), 1);

	// 0 digits before cursor
	assert.equal(calculateCursorPosition('1,234', 0), 0);
	assert.equal(calculateCursorPosition('-1,234', 0), 1);
});
