export const DEFAULT_CONFIRM_TIMEOUT = 3;

/**
 * Parses the timeout duration in seconds from the attribute value.
 * @param {unknown} value
 * @returns {number}
 */
export function parseConfirmTimeout(value) {
	const val = parseFloat(String(value));
	return (isNaN(val) || val <= 0) ? DEFAULT_CONFIRM_TIMEOUT : val;
}

/**
 * Resolves the confirmation label text with fallback.
 * @param {unknown} value
 * @returns {string}
 */
export function resolveConfirmText(value) {
	const raw = String(value || '').trim();
	return raw || 'Confirm?';
}

/**
 * Detects whether the button uses two-element mode.
 * @param {boolean} hasIdle
 * @param {boolean} hasActive
 * @returns {boolean}
 */
export function isTwoElementMode(hasIdle, hasActive) {
	return Boolean(hasIdle || hasActive);
}

/**
 * Determines whether a click event should be ignored.
 * @param {Object} [event]
 * @returns {boolean}
 */
export function shouldIgnoreConfirmClick(event) {
	if (!event) return true;
	if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return true;
	if (typeof event.button === 'number' && event.button !== 0) return true;
	return false;
}
