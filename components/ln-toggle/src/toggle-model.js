/**
 * Normalizes a toggle state attribute or string value to 'open' or 'close'.
 * @param {unknown} value 
 * @returns {'open' | 'close'}
 */
export function normalizeToggleState(value) {
	return value === 'open' ? 'open' : 'close';
}

/**
 * Calculates the next toggle state given current state and requested action.
 * @param {unknown} currentState 
 * @param {string} [action] 'open' | 'close' | 'toggle' (default)
 * @returns {'open' | 'close'}
 */
export function getNextToggleState(currentState, action) {
	const current = normalizeToggleState(currentState);
	if (action === 'open') return 'open';
	if (action === 'close') return 'close';
	return current === 'open' ? 'close' : 'open';
}
