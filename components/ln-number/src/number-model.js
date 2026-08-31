// ─── Formatter & Separators Cache ──────────────────────────────
const _formatterCache = {};

/**
 * Extract group and decimal separators dynamically from Intl.NumberFormat.
 * Supports standard commas, dots, and unicode narrow no-break space (U+202F) for fr-FR.
 *
 * @param {string} locale BCP 47 locale tag (e.g. 'en-US', 'mk-MK', 'fr-FR')
 * @returns {{ groupSep: string, decimalSep: string, fmt: Intl.NumberFormat }}
 */
export function getSeparators(locale) {
	const key = locale || 'default';
	if (!_formatterCache[key]) {
		const fmt = new Intl.NumberFormat(locale, { useGrouping: true });
		const parts = fmt.formatToParts(1234.5);
		let groupSep = '';
		let decimalSep = '.';
		for (let i = 0; i < parts.length; i++) {
			if (parts[i].type === 'group') groupSep = parts[i].value;
			if (parts[i].type === 'decimal') decimalSep = parts[i].value;
		}
		_formatterCache[key] = { groupSep, decimalSep, fmt };
	}
	return _formatterCache[key];
}

/**
 * Clean a numeric string by removing group separators, unicode spaces,
 * and normalizing the decimal separator to a period ('.').
 *
 * @param {string} raw Raw user input or string representation
 * @param {string} groupSep Group (thousands) separator
 * @param {string} decimalSep Decimal separator
 * @returns {string} Standardized numeric string (e.g. "1234.56" or "-10")
 */
export function cleanNumericString(raw, groupSep, decimalSep) {
	if (raw == null || typeof raw !== 'string') return '';
	let str = raw.trim();
	if (str === '') return '';

	// Remove common currency symbols
	str = str.replace(/[$€£¥]/g, '');

	// Remove group separators if present
	if (groupSep) {
		str = str.split(groupSep).join('');
	}

	// Remove all Unicode whitespace characters (covers space, U+00A0, U+202F, etc.)
	str = str.replace(/\s/g, '');

	// Normalize decimal separator to '.'
	if (decimalSep && decimalSep !== '.') {
		str = str.replace(decimalSep, '.');
	}

	// Strip any remaining characters except digits, minus, and dot
	str = str.replace(/[^\d.-]/g, '');

	return str;
}

/**
 * Parse a raw string to a Number according to locale rules.
 * Returns NaN if input is empty, invalid, or just '-'.
 *
 * @param {string|number} raw Input value
 * @param {string} [locale] BCP 47 locale tag
 * @returns {number} Parsed float number or NaN
 */
export function parseNumber(raw, locale) {
	if (typeof raw === 'number') return isNaN(raw) ? NaN : raw;
	if (raw == null || typeof raw !== 'string') return NaN;
	const trimmed = raw.trim();
	if (trimmed === '' || trimmed === '-') return NaN;

	const { groupSep, decimalSep } = getSeparators(locale);
	const cleaned = cleanNumericString(trimmed, groupSep, decimalSep);
	if (cleaned === '' || cleaned === '-' || cleaned === '.') return NaN;

	const num = parseFloat(cleaned);
	return isNaN(num) ? NaN : num;
}

/**
 * Format a numeric value according to locale and decimal options.
 *
 * @param {number} num Number to format
 * @param {string} locale BCP 47 locale tag
 * @param {Object} [options] Formatting options
 * @param {number|null} [options.maxDecimals] Maximum fraction digits limit
 * @param {number} [options.userDecimals] Exact fraction digits to preserve during typing
 * @returns {string} Formatted number string
 */
export function formatNumber(num, locale, options = {}) {
	if (typeof num !== 'number' || isNaN(num)) return '';

	const loc = locale || 'default';
	const maxDecimals = options.maxDecimals != null ? parseInt(options.maxDecimals, 10) : null;
	const userDecimals = options.userDecimals != null ? options.userDecimals : null;

	if (maxDecimals !== null) {
		const cacheKey = loc + '|max:' + maxDecimals;
		if (!_formatterCache[cacheKey]) {
			_formatterCache[cacheKey] = new Intl.NumberFormat(locale, {
				useGrouping: true,
				minimumFractionDigits: 0,
				maximumFractionDigits: maxDecimals
			});
		}
		return _formatterCache[cacheKey].format(num);
	}

	if (userDecimals !== null && userDecimals > 0) {
		const cacheKey = loc + '|exact:' + userDecimals;
		if (!_formatterCache[cacheKey]) {
			_formatterCache[cacheKey] = new Intl.NumberFormat(locale, {
				useGrouping: true,
				minimumFractionDigits: userDecimals,
				maximumFractionDigits: userDecimals
			});
		}
		return _formatterCache[cacheKey].format(num);
	}

	return getSeparators(locale).fmt.format(num);
}

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
