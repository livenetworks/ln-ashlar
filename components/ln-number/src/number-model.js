/**
 * Re-map the cursor position in the formatted string based on digits
 * that were present before the cursor prior to formatting.
 *
 * @param {string} formattedStr Formatted string to place cursor into
 * @param {number} digitsBeforeCursor Count of digits preceding the cursor in the unformatted input
 * @returns {number} Index in formattedStr where cursor should be positioned
 */
export function calculateCursorPosition(formattedStr, digitsBeforeCursor) {
	if (!formattedStr) return 0;
	if (digitsBeforeCursor <= 0) {
		// If input starts with a negative sign or empty, position at first position
		return formattedStr.startsWith('-') ? 1 : 0;
	}

	let targetDigits = digitsBeforeCursor;
	let newPos = 0;

	for (let i = 0; i < formattedStr.length && targetDigits > 0; i++) {
		newPos = i + 1;
		if (/[0-9]/.test(formattedStr[i])) {
			targetDigits--;
		}
	}

	if (targetDigits > 0) {
		newPos = formattedStr.length;
	}

	return newPos;
}
