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

/**
 * Determines whether a click event should be ignored for component activation.
 * @param {Object} [event] 
 * @returns {boolean}
 */
export function shouldIgnoreClick(event) {
	if (!event) return true;
	if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return true;
	if (typeof event.button === 'number' && event.button !== 0) return true;
	return false;
}

/**
 * Checks if a target element is disabled, aria-disabled, or inside an inert container.
 * @param {Object} [target] 
 * @returns {boolean}
 */
export function isTargetDisabled(target) {
	if (!target) return true;
	if (target.disabled || (typeof target.getAttribute === 'function' && target.getAttribute('aria-disabled') === 'true')) {
		return true;
	}
	if (typeof target.closest === 'function' && target.closest('[inert]')) {
		return true;
	}
	return false;
}
